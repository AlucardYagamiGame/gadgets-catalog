const BASE_URL = `${import.meta.env.BASE_URL}api`;
const TIMEOUT_MS = 15000;

export type ApiErrorCode =
  'network' | 'timeout' | 'server' | 'invalid' | 'config';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number | null;

  constructor(
    code: ApiErrorCode,
    message: string,
    status: number | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export async function request<T>(
  url: string,
  headers?: Record<string, string>,
  init: RequestInit = {},
): Promise<T> {
  let response: Response;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers,
    });
  } catch {
    throw controller.signal.aborted ?
        new ApiError('timeout', 'The server is taking too long to respond.')
      : new ApiError('network', 'Network error.');
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new ApiError(
      'server',
      `Server error (${response.status}).`,
      response.status,
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('invalid', 'Invalid response.');
  }
}

export const client = {
  get: <T>(path: string) => request<T>(`${BASE_URL}${path}`),
  post: <T>(url: string, body: unknown) =>
    request<T>(
      url,
      { 'Content-Type': 'application/json' },
      { method: 'POST', body: JSON.stringify(body) },
    ),
};
