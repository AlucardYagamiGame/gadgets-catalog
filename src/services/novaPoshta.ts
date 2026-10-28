import {
  NOVA_POSHTA_CITY_LIMIT,
  NOVA_POSHTA_PROXY_URL,
  NOVA_POSHTA_WAREHOUSE_TYPES,
} from '@/constants';

import { ApiError, client } from './fetchClient';

import type {
  NovaPoshtaCity,
  NovaPoshtaPointKind,
  NovaPoshtaResponse,
  NovaPoshtaWarehouse,
} from '@/types';

const citiesRequests = new Map<string, Promise<NovaPoshtaCity[]>>();
const warehousesRequests = new Map<string, Promise<NovaPoshtaWarehouse[]>>();

const call = async <T>(
  modelName: string,
  calledMethod: string,
  methodProperties: Record<string, unknown>,
): Promise<T[]> => {
  const response = await client.post<NovaPoshtaResponse<T>>(
    NOVA_POSHTA_PROXY_URL,
    { modelName, calledMethod, methodProperties },
  );

  if (!response.success) {
    throw new ApiError(
      'invalid',
      response.errors.join(' ') || 'Nova Poshta request failed.',
    );
  }

  return response.data;
};

const cached = <T>(
  store: Map<string, Promise<T>>,
  key: string,
  load: () => Promise<T>,
): Promise<T> => {
  const existing = store.get(key);

  if (existing) {
    return existing;
  }

  const request = load().catch((error) => {
    store.delete(key);
    throw error;
  });

  store.set(key, request);

  return request;
};

export const searchCities = (query: string): Promise<NovaPoshtaCity[]> =>
  cached(citiesRequests, query.toLowerCase(), () =>
    call<NovaPoshtaCity>('Address', 'getCities', {
      FindByString: query,
      Limit: NOVA_POSHTA_CITY_LIMIT,
    }),
  );

export const getWarehouses = (
  cityRef: string,
  kind: NovaPoshtaPointKind,
): Promise<NovaPoshtaWarehouse[]> =>
  cached(warehousesRequests, `${cityRef}:${kind}`, () =>
    call<NovaPoshtaWarehouse>('Address', 'getWarehouses', {
      CityRef: cityRef,
      TypeOfWarehouseRef: NOVA_POSHTA_WAREHOUSE_TYPES[kind],
    }),
  );
