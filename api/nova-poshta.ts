import type { IncomingMessage, ServerResponse } from 'node:http';

type ApiRequest = IncomingMessage & { body?: unknown };

type FieldType = 'string' | 'number';

interface MethodRule {
  modelName: string;
  calledMethod: string;
  fields: Record<string, FieldType>;
  required: string[];
}

interface UpstreamResponse {
  success?: unknown;
  data?: unknown;
  errors?: unknown;
}

const NOVA_POSHTA_URL = 'https://api.novaposhta.ua/v2.0/json/';
const UPSTREAM_TIMEOUT_MS = 10_000;
const MAX_TEXT_LENGTH = 100;
const MAX_NUMBER = 50;
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;

const RULES: MethodRule[] = [
  {
    modelName: 'Address',
    calledMethod: 'getCities',
    fields: { FindByString: 'string', Limit: 'number' },
    required: ['FindByString'],
  },
  {
    modelName: 'Address',
    calledMethod: 'getWarehouses',
    fields: { CityRef: 'string', TypeOfWarehouseRef: 'string' },
    required: ['CityRef'],
  },
];

const hits = new Map<string, number[]>();

const isRateLimited = (key: string) => {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter(
    (time) => now - time < RATE_WINDOW_MS,
  );

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 1000) {
    hits.forEach((times, id) => {
      if (times.every((time) => now - time >= RATE_WINDOW_MS)) {
        hits.delete(id);
      }
    });
  }

  return recent.length > RATE_LIMIT;
};

const send = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

const header = (req: ApiRequest, name: string) => {
  const value = req.headers[name];

  return Array.isArray(value) ? value[0] : value;
};

const isOriginAllowed = (req: ApiRequest, origin: string) => {
  const host = header(req, 'x-forwarded-host') ?? header(req, 'host');

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
};

const safeParse = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isValidValue = (type: FieldType, value: unknown) =>
  type === 'string' ?
    typeof value === 'string' && value.length <= MAX_TEXT_LENGTH
  : typeof value === 'number' &&
    Number.isInteger(value) &&
    value > 0 &&
    value <= MAX_NUMBER;

const parseProperties = (rule: MethodRule, source: unknown) => {
  if (!isRecord(source)) {
    return null;
  }

  const properties: Record<string, string | number> = {};

  for (const [field, type] of Object.entries(rule.fields)) {
    const value = source[field];

    if (value !== undefined) {
      if (!isValidValue(type, value)) {
        return null;
      }

      properties[field] = value as string | number;
    }
  }

  return rule.required.every((field) => field in properties) ?
      properties
    : null;
};

const parseRequest = (body: unknown) => {
  const source = typeof body === 'string' ? safeParse(body) : body;

  if (!isRecord(source)) {
    return null;
  }

  const rule = RULES.find(
    ({ modelName, calledMethod }) =>
      modelName === source.modelName && calledMethod === source.calledMethod,
  );
  const properties =
    rule ? parseProperties(rule, source.methodProperties) : null;

  return rule && properties ? { rule, properties } : null;
};

export default async function handler(req: ApiRequest, res: ServerResponse) {
  const origin = header(req, 'origin');

  if (origin && !isOriginAllowed(req, origin)) {
    send(res, 403, { error: 'forbidden' });

    return;
  }

  if (req.method !== 'POST') {
    send(res, 405, { error: 'method_not_allowed' });

    return;
  }

  const apiKey = process.env.NOVA_POSHTA_API_KEY;

  if (!apiKey) {
    send(res, 503, { error: 'not_configured' });

    return;
  }

  const forwarded = header(req, 'x-forwarded-for')?.split(',')[0].trim();

  if (isRateLimited(forwarded ?? req.socket.remoteAddress ?? 'unknown')) {
    send(res, 429, { error: 'rate_limit' });

    return;
  }

  const parsed = parseRequest(req.body);

  if (!parsed) {
    send(res, 400, { error: 'invalid_request' });

    return;
  }

  try {
    const upstream = await fetch(NOVA_POSHTA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        modelName: parsed.rule.modelName,
        calledMethod: parsed.rule.calledMethod,
        methodProperties: parsed.properties,
      }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (!upstream.ok) {
      send(res, 502, { error: 'upstream' });

      return;
    }

    const data = (await upstream.json()) as UpstreamResponse;

    send(res, 200, {
      success: data.success === true,
      data: Array.isArray(data.data) ? data.data : [],
      errors:
        Array.isArray(data.errors) ?
          data.errors.filter((item): item is string => typeof item === 'string')
        : [],
    });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'TimeoutError';

    send(res, isTimeout ? 504 : 502, {
      error: isTimeout ? 'timeout' : 'upstream',
    });
  }
}
