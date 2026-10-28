import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '@/services';

import { useTranslation } from './useTranslation';

import type { Translations } from '@/i18n';

interface Result<T> {
  load: () => Promise<T>;
  attempt: number;
  data: T | null;
  failure: Failure | null;
}

type Failure = ApiError | Error;

const getErrorMessage = (failure: Failure, errors: Translations['errors']) => {
  if (!(failure instanceof ApiError)) {
    return errors.unknown;
  }

  if (failure.code === 'server') {
    return errors.server(failure.status ?? 0);
  }

  return errors[failure.code];
};

export const useAsync = <T>(
  load: () => Promise<T>,
  { keepPrevious = false } = {},
) => {
  const { t } = useTranslation();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result<T> | null>(null);

  useEffect(() => {
    let isActive = true;

    load()
      .then((data) => {
        if (isActive) {
          setResult({ load, attempt, data, failure: null });
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setResult({
            load,
            attempt,
            data: null,
            failure: error instanceof Error ? error : new Error(),
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [load, attempt]);

  const retry = useCallback(() => setAttempt((prev) => prev + 1), []);

  const isCurrent =
    result !== null && result.load === load && result.attempt === attempt;

  const failure = isCurrent ? result.failure : null;

  return {
    data: isCurrent || keepPrevious ? (result?.data ?? null) : null,
    error: failure && getErrorMessage(failure, t.errors),
    isLoading: !isCurrent,
    retry,
  };
};
