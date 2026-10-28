import { getSearchPath } from '@/constants';
import { useLanguageStore } from '@/store';

import { findProductsForCompare } from './aiCompare';

import type { AiComparison } from './aiCompare';
import type { Language } from '@/types';

export type Navigate = (to: string) => void;

export interface ToolCall {
  function: { name: string; arguments: string };
}

export interface ToolOutcome {
  name: string;
  comparison?: AiComparison;
}

const toQueries = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (typeof value === 'string') {
    return value.split(',');
  }

  return [];
};

export const runToolCall = async (
  call: ToolCall,
  navigate: Navigate,
): Promise<ToolOutcome | null> => {
  const args = JSON.parse(call.function.arguments) as Record<string, unknown>;

  if (call.function.name === 'set_language') {
    const language = args.language;

    const next: Language | null =
      language === 'en' ? 'en'
      : language === 'ua' || language === 'uk' ? 'ua'
      : null;

    if (next) {
      useLanguageStore.setState({ language: next });

      return { name: call.function.name };
    }
  }

  if (call.function.name === 'search_products') {
    const query = typeof args.query === 'string' ? args.query.trim() : '';

    if (query) {
      navigate(getSearchPath(query));

      return { name: call.function.name };
    }
  }

  if (call.function.name === 'compare_products') {
    const queries = toQueries(args.queries);

    if (queries.length >= 2) {
      const comparison = await findProductsForCompare(
        queries,
        useLanguageStore.getState().language,
      );

      return { name: call.function.name, comparison };
    }
  }

  return null;
};
