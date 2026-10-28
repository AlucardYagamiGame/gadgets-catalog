import { request } from './fetchClient';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && KEY);

export const supabase = {
  select: <T>(table: string, query: string) =>
    request<T>(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      apikey: KEY ?? '',
    }),
};
