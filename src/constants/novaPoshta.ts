import type { NovaPoshtaPointKind } from '@/types';

export const NOVA_POSHTA_PROXY_URL = '/api/nova-poshta';

export const NOVA_POSHTA_WAREHOUSE_TYPES: Record<NovaPoshtaPointKind, string> =
  {
    branch: '841339c7-591a-42e2-8233-7a0a00f0ed6f',
    postomat: 'f9316480-5f2d-425d-bc2c-ac7cd29decf0',
  };

export const NOVA_POSHTA_CITY_MIN_LENGTH = 2;
export const NOVA_POSHTA_CITY_LIMIT = 20;
export const NOVA_POSHTA_DEBOUNCE_MS = 300;
