import type { AuthFormValues } from '@/types';

export const AUTH_INITIAL_VALUES: AuthFormValues = {
  email: '',
  password: '',
};

export const AUTH_RULES = {
  passwordMinLength: 6,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};
