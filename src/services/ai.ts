import { runToolCall } from './aiTools';

import type { AiComparison } from './aiCompare';
import type { Navigate } from './aiTools';

const API_URL =
  (import.meta.env.VITE_AI_API_URL as string | undefined) || '/api/ai';
const REQUEST_TIMEOUT_MS = 25_000;
const RETRY_DELAY_MS = 3000;

export type AiErrorReason =
  'config' | 'network' | 'timeout' | 'rate_limit' | 'server' | 'invalid';

export interface AiHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type AiResult =
  | {
      ok: true;
      text: string;
      actions: string[];
      comparisons: AiComparison[];
    }
  | { ok: false; reason: AiErrorReason };

interface AiResponse {
  error?: unknown;
  choices?: {
    message?: {
      content?: string | null;
      tool_calls?: { function: { name: string; arguments: string } }[];
    };
  }[];
}

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export const askAi = async (
  messages: AiHistoryMessage[],
  navigate: Navigate,
): Promise<AiResult> => {
  const body = JSON.stringify({ messages });

  const send = () =>
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

  let response: Response;

  try {
    response = await send();

    if (response.status === 429) {
      await wait(RETRY_DELAY_MS);
      response = await send();
    }
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === 'TimeoutError';

    return { ok: false, reason: isTimeout ? 'timeout' : 'network' };
  }

  if (response.status === 429) {
    return { ok: false, reason: 'rate_limit' };
  }

  if (response.status === 504) {
    return { ok: false, reason: 'timeout' };
  }

  if (response.status === 503) {
    return { ok: false, reason: 'config' };
  }

  let data: AiResponse;

  try {
    data = (await response.json()) as AiResponse;
  } catch {
    return { ok: false, reason: 'invalid' };
  }

  if (!response.ok || data.error) {
    return { ok: false, reason: 'server' };
  }

  const message = data.choices?.[0]?.message;

  if (!message) {
    return { ok: false, reason: 'invalid' };
  }

  const actions: string[] = [];
  const comparisons: AiComparison[] = [];

  for (const call of message.tool_calls ?? []) {
    try {
      const outcome = await runToolCall(call, navigate);

      if (outcome?.comparison) {
        comparisons.push(outcome.comparison);
      } else if (outcome) {
        actions.push(outcome.name);
      }
    } catch {
      continue;
    }
  }

  return { ok: true, text: message.content ?? '', actions, comparisons };
};
