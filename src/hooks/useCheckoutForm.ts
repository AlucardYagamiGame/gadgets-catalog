import { useState } from 'react';

import { CHECKOUT_FIELDS, CHECKOUT_INITIAL_VALUES } from '@/constants';
import { rememberProfile, useAuthStore, useProfileStore } from '@/store';
import { validateCheckout } from '@/utils';

import type { CheckoutErrors, CheckoutFormValues } from '@/types';
import type { ChangeEvent, FormEvent } from 'react';

export const useCheckoutForm = (
  onValid: (values: CheckoutFormValues) => void,
) => {
  const user = useAuthStore((state) => state.user);
  const profile = useProfileStore((state) => state.profile);
  const [edits, setEdits] = useState<Partial<CheckoutFormValues>>({});
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const values: CheckoutFormValues = {
    ...CHECKOUT_INITIAL_VALUES,
    email: user?.email ?? '',
    name: profile?.fullName ?? '',
    phone: profile?.phone ?? '',
    city: profile?.city ?? '',
    cityRef: profile?.cityRef ?? '',
    ...edits,
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setEdits((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePhoneChange = (phone: string) => {
    setEdits((prev) => ({ ...prev, phone }));
    setErrors((prev) => ({ ...prev, phone: undefined }));
  };

  const handleCityChange = (city: string, cityRef = '') => {
    setEdits((prev) => ({ ...prev, city, cityRef, branch: '', postomat: '' }));
    setErrors((prev) => ({
      ...prev,
      city: undefined,
      branch: undefined,
      postomat: undefined,
    }));
  };

  const handleSelect = (name: 'branch' | 'postomat', value: string) => {
    setEdits((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateCheckout(values);

    setErrors(nextErrors);

    const firstInvalid = CHECKOUT_FIELDS.find(({ name }) => nextErrors[name]);

    if (firstInvalid) {
      const element = event.currentTarget.elements.namedItem(firstInvalid.name);

      if (element instanceof HTMLElement) {
        element.focus();
      }

      return;
    }

    if (user) {
      void rememberProfile({
        fullName: values.name.trim(),
        phone: values.phone.trim(),
        city: values.city.trim(),
        cityRef: values.cityRef,
      });
    }

    onValid(values);
    setIsSubmitted(true);
  };

  return {
    values,
    errors,
    isSubmitted,
    handleChange,
    handlePhoneChange,
    handleCityChange,
    handleSelect,
    handleSubmit,
  };
};
