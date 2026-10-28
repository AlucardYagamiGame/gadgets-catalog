import type { CheckoutFormValues, DeliveryMethod } from '@/types';

export const CHECKOUT_INITIAL_VALUES: CheckoutFormValues = {
  name: '',
  phone: '',
  email: '',
  city: '',
  cityRef: '',
  address: '',
  branch: '',
  postomat: '',
  delivery: 'branch',
};

export const CHECKOUT_FIELDS = [
  { name: 'name', type: 'text', autoComplete: 'name' },
  { name: 'phone', type: 'tel', autoComplete: 'tel' },
  { name: 'email', type: 'email', autoComplete: 'email' },
  { name: 'city', type: 'text', autoComplete: 'address-level2' },
] as const;

export const DELIVERY_METHODS: DeliveryMethod[] = [
  'branch',
  'postomat',
  'courier',
];

export const CHECKOUT_RULES = {
  nameMinLength: 2,
  phonePattern: /^\+?\d{10,12}$/,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};
