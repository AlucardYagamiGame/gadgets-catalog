export type DeliveryMethod = 'branch' | 'postomat' | 'courier';

export interface CheckoutFormValues {
  name: string;
  phone: string;
  email: string;
  city: string;
  cityRef: string;
  address: string;
  branch: string;
  postomat: string;
  delivery: DeliveryMethod;
}

export type CheckoutFieldError =
  'required' | 'name' | 'phone' | 'email' | 'city' | 'delivery';

export type CheckoutErrors = Partial<
  Record<keyof CheckoutFormValues, CheckoutFieldError>
>;
