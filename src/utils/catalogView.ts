import {
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE_ROWS,
  DEFAULT_SORT,
  PER_PAGE_ROWS,
  SORT_VALUES,
} from '@/constants';

import type { PerPageRows, SortBy } from '@/types';

export const SORT_PARAM = 'sort';
export const PER_PAGE_PARAM = 'perPage';
export const PAGE_PARAM = 'page';

export interface CatalogView {
  sortBy: SortBy;
  perPageRows: PerPageRows | 'all';
  page: number;
}

export const parsePage = (params: URLSearchParams) => {
  const page = Number(params.get(PAGE_PARAM));

  return Number.isInteger(page) && page >= 1 ? page : DEFAULT_PAGE;
};

export const parseCatalogView = (params: URLSearchParams): CatalogView => {
  const sort = params.get(SORT_PARAM);
  const perPage = params.get(PER_PAGE_PARAM);

  return {
    sortBy: SORT_VALUES.find((value) => value === sort) ?? DEFAULT_SORT,
    perPageRows:
      perPage === 'all' ? 'all' : (
        (PER_PAGE_ROWS.find((value) => value === perPage) ??
        DEFAULT_PER_PAGE_ROWS)
      ),
    page: parsePage(params),
  };
};

const setOrDelete = (
  params: URLSearchParams,
  key: string,
  value: string,
  defaultValue: string,
) => {
  if (value === defaultValue) {
    params.delete(key);
  } else {
    params.set(key, value);
  }
};

export const applyCatalogView = (
  params: URLSearchParams,
  changes: Partial<CatalogView>,
): URLSearchParams => {
  const next = new URLSearchParams(params);

  if (changes.sortBy !== undefined) {
    setOrDelete(next, SORT_PARAM, changes.sortBy, DEFAULT_SORT);
  }

  if (changes.perPageRows !== undefined) {
    setOrDelete(
      next,
      PER_PAGE_PARAM,
      changes.perPageRows,
      DEFAULT_PER_PAGE_ROWS,
    );
  }

  if (changes.page !== undefined) {
    setOrDelete(next, PAGE_PARAM, String(changes.page), String(DEFAULT_PAGE));
  }

  return next;
};

// The sort and page-size params survive filter changes; the page does not.
export const keepViewParams = (
  target: URLSearchParams,
  source: URLSearchParams,
): URLSearchParams => {
  [SORT_PARAM, PER_PAGE_PARAM].forEach((key) => {
    const value = source.get(key);

    if (value) {
      target.set(key, value);
    }
  });

  return target;
};
