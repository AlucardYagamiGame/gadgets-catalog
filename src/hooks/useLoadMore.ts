import { useCallback, useState } from 'react';

export const useLoadMore = (total: number, step: number, resetKey: string) => {
  const [state, setState] = useState({ key: resetKey, count: step });

  const count = state.key === resetKey ? state.count : step;

  const loadMore = useCallback(
    () => setState({ key: resetKey, count: count + step }),
    [resetKey, count, step],
  );

  return { count, hasMore: count < total, loadMore };
};
