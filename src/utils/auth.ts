import { AUTH_RULES } from '@/constants';

import type { AuthFormErrors, AuthFormValues, AuthMode } from '@/types';

export const validateAuth = (
  values: AuthFormValues,
  mode: AuthMode,
): AuthFormErrors => {
  const errors: AuthFormErrors = {};
  const email = values.email.trim();

  if (!email) {
    errors.email = 'required';
  } else if (!AUTH_RULES.emailPattern.test(email)) {
    errors.email = 'email';
  }

  if (!values.password) {
    errors.password = 'required';
  } else if (
    mode === 'signup' &&
    values.password.length < AUTH_RULES.passwordMinLength
  ) {
    errors.password = 'passwordShort';
  }

  return errors;
};
