import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Product } from '@/types';

export interface FavoritesState {
  items: Product[];
  toggle: (product: Product) => void;
  remove: (itemId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      items: [],

      toggle: (product) =>
        set((state) =>
          state.items.some((item) => item.itemId === product.itemId) ?
            {
              items: state.items.filter(
                (item) => item.itemId !== product.itemId,
              ),
            }
          : { items: [...state.items, product] },
        ),

      remove: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.itemId !== itemId),
        })),
    }),
    { name: 'favorites' },
  ),
);

export const selectFavoritesCount = (state: FavoritesState) =>
  state.items.length;
