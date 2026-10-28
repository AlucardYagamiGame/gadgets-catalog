import type { SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

let clientPromise: Promise<SupabaseClient | null> | null = null;

export const getSupabaseClient = (): Promise<SupabaseClient | null> => {
  if (!url || !key) {
    return Promise.resolve(null);
  }

  clientPromise ??= import('@supabase/supabase-js')
    .then(({ createClient }) =>
      createClient(url, key, {
        auth: { flowType: 'pkce', detectSessionInUrl: true },
      }),
    )
    .catch((error: unknown) => {
      clientPromise = null;

      throw error;
    });

  return clientPromise;
};
