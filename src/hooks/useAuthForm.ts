import { useState } from 'react';

import { AUTH_INITIAL_VALUES } from '@/constants';
import { signIn, signUp } from '@/services';
import { validateAuth } from '@/utils';

import type {
  AuthErrorCode,
  AuthFormErrors,
  AuthFormValues,
  AuthMode,
} from '@/types';
import type { ChangeEvent, FormEvent } from 'react';

export const useAuthForm = (mode: AuthMode, onSuccess: () => void) => {
  const [values, setValues] = useState<AuthFormValues>(AUTH_INITIAL_VALUES);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [formError, setFormError] = useState<AuthErrorCode | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(
    null,
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError(null);
  };

  const reset = () => {
    setValues((prev) => ({ ...prev, password: '' }));
    setErrors({});
    setFormError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const form = event.currentTarget;
    const nextErrors = validateAuth(values, mode);

    setErrors(nextErrors);

    const firstInvalid = (['email', 'password'] as const).find(
      (name) => nextErrors[name],
    );

    if (firstInvalid) {
      const element = form.elements.namedItem(firstInvalid);

      if (element instanceof HTMLElement) {
        element.focus();
      }

      return;
    }

    const email = values.email.trim();

    setIsPending(true);
    setFormError(null);

    const result =
      mode === 'signin' ?
        await signIn(email, values.password)
      : await signUp(email, values.password);

    setIsPending(false);

    if (!result.ok) {
      setFormError(result.code);

      return;
    }

    if (result.needsConfirmation) {
      setConfirmationEmail(email);

      return;
    }

    onSuccess();
  };

  return {
    values,
    errors,
    formError,
    isPending,
    confirmationEmail,
    handleChange,
    handleSubmit,
    reset,
  };
};
