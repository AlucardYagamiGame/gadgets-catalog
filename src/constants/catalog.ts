import type { PerPage, PerPageRows, SortBy } from '@/types';

export const SORT_VALUES: SortBy[] = ['age', 'title', 'price'];

export const PER_PAGE_ROWS: PerPageRows[] = ['1', '2', '4'];

export const DEFAULT_SORT: SortBy = 'age';
export const DEFAULT_PER_PAGE: PerPage = '16';
export const DEFAULT_PER_PAGE_ROWS: PerPageRows = '4';
export const DEFAULT_PAGE = 1;
export const LOAD_MORE_STEP = 12;
