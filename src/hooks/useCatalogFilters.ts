import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  buildCatalogFacets,
  countActiveFilters,
  filterProducts,
  keepViewParams,
  parseSelection,
  serializeSelection,
} from '@/utils';

import type {
  Category,
  FacetId,
  FilterSelection,
  PriceBounds,
  Product,
} from '@/types';

export const useCatalogFilters = (
  category: Category,
  products: Product[] | null,
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selection = useMemo(() => parseSelection(searchParams), [searchParams]);

  const catalog = useMemo(
    () => (products ? buildCatalogFacets(products, category, selection) : null),
    [products, category, selection],
  );

  const filtered = useMemo(
    () => (products ? filterProducts(products, selection) : []),
    [products, selection],
  );

  const update = (next: FilterSelection) =>
    setSearchParams(
      keepViewParams(
        serializeSelection(next, catalog?.price ?? null),
        searchParams,
      ),
      { replace: true },
    );

  const setPrice = (price: PriceBounds) => update({ ...selection, price });

  const toggle = (id: FacetId, value: string) => {
    const current = selection.facets[id] ?? [];
    const next =
      current.includes(value) ?
        current.filter((item) => item !== value)
      : [...current, value];

    update({ ...selection, facets: { ...selection.facets, [id]: next } });
  };

  const reset = () =>
    setSearchParams(keepViewParams(new URLSearchParams(), searchParams), {
      replace: true,
    });

  return {
    selection,
    catalog,
    filtered,
    activeCount: countActiveFilters(selection),
    signature: serializeSelection(selection, null).toString(),
    setPrice,
    toggle,
    reset,
  };
};
