import { getSupabaseClient } from './supabaseClient';

import type { AuthUser, AuthErrorCode, AuthResult } from '@/types';
import type { AuthError, Session } from '@supabase/supabase-js';

const ERROR_CODES: Record<string, AuthErrorCode> = {
  invalid_credentials: 'invalidCredentials',
  user_already_exists: 'userExists',
  email_exists: 'userExists',
  weak_password: 'weakPassword',
  email_not_confirmed: 'emailNotConfirmed',
  over_request_rate_limit: 'rateLimit',
  over_email_send_rate_limit: 'rateLimit',
};

const toErrorCode = (error: AuthError): AuthErrorCode => {
  const known = error.code ? ERROR_CODES[error.code] : undefined;

  if (known) {
    return known;
  }

  if (error.name === 'AuthRetryableFetchError' || error.status === 0) {
    return 'network';
  }

  return 'unknown';
};

const toAuthUser = (session: Session | null): AuthUser | null =>
  session?.user ?
    { id: session.user.id, email: session.user.email ?? '' }
  : null;

const failure = (code: AuthErrorCode): AuthResult => ({ ok: false, code });

export const signIn = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  try {
    const client = await getSupabaseClient();

    if (!client) {
      return failure('unknown');
    }

    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    return error ?
        failure(toErrorCode(error))
      : { ok: true, needsConfirmation: false };
  } catch {
    return failure('network');
  }
};

export const signUp = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  try {
    const client = await getSupabaseClient();

    if (!client) {
      return failure('unknown');
    }

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      return failure(toErrorCode(error));
    }

    if (data.user?.identities?.length === 0) {
      return failure('userExists');
    }

    return { ok: true, needsConfirmation: !data.session };
  } catch {
    return failure('network');
  }
};

export const signOut = async (): Promise<void> => {
  const client = await getSupabaseClient();

  await client?.auth.signOut({ scope: 'local' });
};

export const onAuthChange = async (
  callback: (user: AuthUser | null) => void,
): Promise<() => void> => {
  const client = await getSupabaseClient();

  if (!client) {
    return () => undefined;
  }

  const { data } = client.auth.onAuthStateChange((_event, session) =>
    callback(toAuthUser(session)),
  );

  return () => data.subscription.unsubscribe();
};
