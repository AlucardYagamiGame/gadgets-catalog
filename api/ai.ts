import type { IncomingMessage, ServerResponse } from 'node:http';

// Serverless proxy for the AI assistant (Vercel `api/` function). The
// OpenRouter key, the model list, the system prompt and the tool definitions
// live only here, so none of them end up in the public JS bundle.

type ApiRequest = IncomingMessage & { body?: unknown };

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODELS = [
  'xingchen-agi/xing4.0-29b-a4b:free',
  'nvidia/nemotron-3.5-super-vl:free',
];
const UPSTREAM_TIMEOUT_MS = 20_000;
const MAX_MESSAGES = 8;
const MAX_TEXT_LENGTH = 500;
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

const SYSTEM_PROMPT =
  'You are the assistant of the Nice Gadgets online store. You can do exactly three things: switch the site language between English and Ukrainian (set_language), search for a product by model name (search_products) and compare two or three products of the same category (compare_products). You cannot place orders or answer other questions about the store. When asked to compare, only call compare_products with the model names: the website shows the comparison table itself, so never describe the comparison yourself. Always reply in the same language as the user, in one or two short sentences, in plain text without markdown. When the user asks for one of the three actions, call the tool. If asked what you can do, list only these three actions. If asked for anything else, say you cannot do it yet.';

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'set_language',
      description: 'Change the website interface language',
      parameters: {
        type: 'object',
        properties: {
          language: {
            type: 'string',
            enum: ['en', 'ua'],
            description: 'en for English, ua for Ukrainian',
          },
        },
        required: ['language'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_products',
      description:
        'Search the store for a product and open the search results page',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'Product model name in English as in the catalog, for example "iPhone 14 Pro". Only the model name, no extra words.',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'compare_products',
      description:
        'Compare two or three products of the same category side by side. The website shows the comparison table itself.',
      parameters: {
        type: 'object',
        properties: {
          queries: {
            type: 'array',
            items: { type: 'string' },
            minItems: 2,
            maxItems: 3,
            description:
              'Product model names in English as in the catalog, for example ["iPhone 14 Pro", "iPhone 11"]. Only model names, no extra words.',
          },
        },
        required: ['queries'],
      },
    },
  },
];

const TOOL_NAMES = TOOLS.map((tool) => tool.function.name);

// Best-effort limiter: it lives in the memory of one serverless instance, so it
// stops bursts from a single visitor but is not a global quota.
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

const getAllowedOrigins = () =>
  (process.env.AI_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

const isOriginAllowed = (req: ApiRequest, origin: string) => {
  const host = header(req, 'x-forwarded-host') ?? header(req, 'host');

  try {
    if (new URL(origin).host === host) {
      return true;
    }
  } catch {
    return false;
  }

  return getAllowedOrigins().includes(origin);
};

const parseMessages = (body: unknown): ChatMessage[] | null => {
  const source = typeof body === 'string' ? safeParse(body) : body;
  const messages = (source as { messages?: unknown } | null)?.messages;

  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES
  ) {
    return null;
  }

  const result: ChatMessage[] = [];

  for (const item of messages) {
    const { role, content } = (item ?? {}) as Partial<ChatMessage>;

    if (
      (role !== 'user' && role !== 'assistant') ||
      typeof content !== 'string' ||
      !content.trim() ||
      content.length > MAX_TEXT_LENGTH
    ) {
      return null;
    }

    result.push({ role, content });
  }

  return result[result.length - 1].role === 'user' ? result : null;
};

const safeParse = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

interface UpstreamMessage {
  content?: string | null;
  tool_calls?: { function?: { name?: unknown; arguments?: unknown } }[];
}

const sanitize = (message: UpstreamMessage) => ({
  content: typeof message.content === 'string' ? message.content : '',
  tool_calls: (message.tool_calls ?? [])
    .filter(
      (call) =>
        typeof call.function?.name === 'string' &&
        TOOL_NAMES.includes(call.function.name) &&
        typeof call.function.arguments === 'string',
    )
    .map((call) => ({
      function: {
        name: call.function?.name as string,
        arguments: call.function?.arguments as string,
      },
    })),
});

export default async function handler(req: ApiRequest, res: ServerResponse) {
  const origin = header(req, 'origin');

  if (origin) {
    if (!isOriginAllowed(req, origin)) {
      send(res, 403, { error: 'forbidden' });

      return;
    }

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();

    return;
  }

  if (req.method !== 'POST') {
    send(res, 405, { error: 'method_not_allowed' });

    return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    send(res, 503, { error: 'not_configured' });

    return;
  }

  const forwarded = header(req, 'x-forwarded-for')?.split(',')[0].trim();

  if (isRateLimited(forwarded ?? req.socket.remoteAddress ?? 'unknown')) {
    send(res, 429, { error: 'rate_limit' });

    return;
  }

  const messages = parseMessages(req.body);

  if (!messages) {
    send(res, 400, { error: 'invalid_request' });

    return;
  }

  try {
    const upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        models: MODELS,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        tools: TOOLS,
      }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (upstream.status === 429) {
      send(res, 429, { error: 'rate_limit' });

      return;
    }

    const data = (await upstream.json()) as {
      error?: unknown;
      choices?: { message?: UpstreamMessage }[];
    };
    const message = data.choices?.[0]?.message;

    if (!upstream.ok || data.error || !message) {
      send(res, 502, { error: 'upstream' });

      return;
    }

    send(res, 200, { choices: [{ message: sanitize(message) }] });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'TimeoutError';

    send(res, isTimeout ? 504 : 502, {
      error: isTimeout ? 'timeout' : 'upstream',
    });
  }
}
