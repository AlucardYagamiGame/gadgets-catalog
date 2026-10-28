import { useCallback } from 'react';

import {
  NOVA_POSHTA_CITY_MIN_LENGTH,
  NOVA_POSHTA_DEBOUNCE_MS,
} from '@/constants';
import { getWarehouses, searchCities } from '@/services';

import { useAsync } from './useAsync';
import { useDebouncedValue } from './useDebouncedValue';

import type {
  NovaPoshtaCity,
  NovaPoshtaPointKind,
  NovaPoshtaWarehouse,
} from '@/types';

export const useNovaPoshtaCities = (query: string) => {
  const trimmed = query.trim();
  const debounced = useDebouncedValue(trimmed, NOVA_POSHTA_DEBOUNCE_MS);
  const isSearchable = debounced.length >= NOVA_POSHTA_CITY_MIN_LENGTH;

  const load = useCallback(
    (): Promise<NovaPoshtaCity[]> =>
      isSearchable ? searchCities(debounced) : Promise.resolve([]),
    [debounced, isSearchable],
  );

  const { data, error, isLoading } = useAsync(load, { keepPrevious: true });

  return {
    cities: isSearchable ? (data ?? []) : [],
    error: isSearchable ? error : null,
    isLoading: isSearchable && (isLoading || debounced !== trimmed),
    isSearchable: trimmed.length >= NOVA_POSHTA_CITY_MIN_LENGTH,
  };
};

export const useNovaPoshtaWarehouses = (
  cityRef: string,
  kind: NovaPoshtaPointKind | null,
) => {
  const load = useCallback(
    (): Promise<NovaPoshtaWarehouse[]> =>
      cityRef && kind ? getWarehouses(cityRef, kind) : Promise.resolve([]),
    [cityRef, kind],
  );

  const { data, error, isLoading, retry } = useAsync(load);

  return { points: data ?? [], error, isLoading, retry };
};
