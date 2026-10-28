import { CHECKOUT_RULES } from '@/constants';

import type { CheckoutErrors, CheckoutFormValues } from '@/types';

const normalizePhone = (phone: string) => phone.replace(/[\s()-]/g, '');

export const validateCheckout = (
  values: CheckoutFormValues,
): CheckoutErrors => {
  const errors: CheckoutErrors = {};

  const name = values.name.trim();
  const phone = normalizePhone(values.phone);
  const email = values.email.trim();

  if (!name) {
    errors.name = 'required';
  } else if (name.length < CHECKOUT_RULES.nameMinLength) {
    errors.name = 'name';
  }

  if (!phone) {
    errors.phone = 'required';
  } else if (!CHECKOUT_RULES.phonePattern.test(phone)) {
    errors.phone = 'phone';
  }

  if (!email) {
    errors.email = 'required';
  } else if (!CHECKOUT_RULES.emailPattern.test(email)) {
    errors.email = 'email';
  }

  if (!values.city.trim()) {
    errors.city = 'required';
  } else if (!values.cityRef) {
    errors.city = 'city';
  }

  if (values.delivery === 'branch' && !values.branch.trim()) {
    errors.branch = 'delivery';
  }

  if (values.delivery === 'postomat' && !values.postomat.trim()) {
    errors.postomat = 'delivery';
  }

  if (values.delivery === 'courier' && !values.address.trim()) {
    errors.address = 'required';
  }

  return errors;
};
