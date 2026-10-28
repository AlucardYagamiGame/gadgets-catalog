import type { Product } from './product';

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}
