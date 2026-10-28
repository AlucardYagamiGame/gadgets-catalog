export interface NovaPoshtaResponse<T> {
  success: boolean;
  data: T[];
  errors: string[];
}

export interface NovaPoshtaCity {
  Ref: string;
  Description: string;
  AreaDescription: string;
}

export interface NovaPoshtaWarehouse {
  Ref: string;
  Description: string;
  Number: string;
}

export type NovaPoshtaPointKind = 'branch' | 'postomat';
