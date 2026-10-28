import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CartItem, Product } from '@/types';

export interface CartState {
  items: CartItem[];
  toggle: (product: Product) => void;
  remove: (itemId: string) => void;
  increment: (itemId: string) => void;
  decrement: (itemId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      toggle: (product) =>
        set((state) =>
          state.items.some((item) => item.id === product.itemId) ?
            { items: state.items.filter((item) => item.id !== product.itemId) }
          : {
              items: [
                ...state.items,
                { id: product.itemId, quantity: 1, product },
              ],
            },
        ),

      remove: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),

      increment: (itemId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ?
              { ...item, quantity: item.quantity + 1 }
            : item,
          ),
        })),

      decrement: (itemId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId && item.quantity > 1 ?
              { ...item, quantity: item.quantity - 1 }
            : item,
          ),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: 'cart' },
  ),
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotal = (state: CartState) =>
  state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
