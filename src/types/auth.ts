export interface AuthUser {
  id: string;
  email: string;
}

export type AuthMode = 'signin' | 'signup';

export type AuthErrorCode =
  | 'invalidCredentials'
  | 'userExists'
  | 'weakPassword'
  | 'emailNotConfirmed'
  | 'rateLimit'
  | 'network'
  | 'unknown';

export type AuthResult =
  { ok: true; needsConfirmation: boolean } | { ok: false; code: AuthErrorCode };

export interface AuthFormValues {
  email: string;
  password: string;
}

export type AuthFieldError = 'required' | 'email' | 'passwordShort';

export type AuthFormErrors = Partial<
  Record<keyof AuthFormValues, AuthFieldError>
>;
