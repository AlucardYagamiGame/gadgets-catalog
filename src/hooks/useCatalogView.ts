import { useSearchParams } from 'react-router-dom';

import { applyCatalogView, parseCatalogView } from '@/utils';

import type { PerPageRows, SortBy } from '@/types';

// Sort, page size and page live in the URL, so a shared link opens the same view.
export const useCatalogView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = parseCatalogView(searchParams);

  const setSortBy = (sortBy: SortBy) =>
    setSearchParams((prev) => applyCatalogView(prev, { sortBy, page: 1 }), {
      replace: true,
    });

  const setPerPageRows = (perPageRows: PerPageRows | 'all') =>
    setSearchParams(
      (prev) => applyCatalogView(prev, { perPageRows, page: 1 }),
      { replace: true },
    );

  const setPage = (page: number) =>
    setSearchParams((prev) => applyCatalogView(prev, { page }));

  return { ...view, setSortBy, setPerPageRows, setPage };
};
