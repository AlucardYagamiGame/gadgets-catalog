import { useCartStore, useFavoritesStore } from '@/store';

export const useProductActions = () => {
  const cartItems = useCartStore((state) => state.items);
  const toggleCart = useCartStore((state) => state.toggle);
  const favourites = useFavoritesStore((state) => state.items);
  const toggleFavourite = useFavoritesStore((state) => state.toggle);

  return {
    isInCart: (itemId: string) => cartItems.some((item) => item.id === itemId),
    isFavourite: (itemId: string) =>
      favourites.some((item) => item.itemId === itemId),
    toggleCart,
    toggleFavourite,
  };
};
