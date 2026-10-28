import {
  fetchCart,
  fetchFavorites,
  removeCartItems,
  removeFavorites,
  saveCartItems,
  saveFavorites,
} from '@/services';

import { useAiChatStore } from './aiChatStore';
import { useCartStore } from './cartStore';
import { useFavoritesStore } from './favoritesStore';

import type { AuthUser, CartItem, Product } from '@/types';

let activeUserId: string | null = null;
let isApplying = false;
let isStarted = false;
let queue: Promise<unknown> = Promise.resolve();

const enqueue = (task: () => Promise<void>) => {
  queue = queue.then(task).catch(() => undefined);
};

const applyLocally = (apply: () => void) => {
  isApplying = true;

  try {
    apply();
  } finally {
    isApplying = false;
  }
};

const mergeCart = (local: CartItem[], remote: CartItem[]): CartItem[] => {
  const merged = new Map(remote.map((item) => [item.id, item]));

  local.forEach((item) => {
    const existing = merged.get(item.id);

    merged.set(
      item.id,
      existing ?
        { ...existing, quantity: Math.max(existing.quantity, item.quantity) }
      : item,
    );
  });

  return [...merged.values()];
};

const mergeFavorites = (local: Product[], remote: Product[]): Product[] => {
  const merged = new Map(remote.map((product) => [product.itemId, product]));

  local.forEach((product) => {
    if (!merged.has(product.itemId)) {
      merged.set(product.itemId, product);
    }
  });

  return [...merged.values()];
};

const syncCartChanges = (next: CartItem[], prev: CartItem[]) => {
  const prevQuantities = new Map(prev.map((item) => [item.id, item.quantity]));
  const nextIds = new Set(next.map((item) => item.id));

  const changed = next.filter(
    (item) => prevQuantities.get(item.id) !== item.quantity,
  );
  const removed = prev
    .filter((item) => !nextIds.has(item.id))
    .map((item) => item.id);

  if (changed.length > 0) {
    enqueue(() => saveCartItems(changed));
  }

  if (removed.length > 0) {
    enqueue(() => removeCartItems(removed));
  }
};

const syncFavoritesChanges = (next: Product[], prev: Product[]) => {
  const prevIds = new Set(prev.map((product) => product.itemId));
  const nextIds = new Set(next.map((product) => product.itemId));

  const added = next
    .filter((product) => !prevIds.has(product.itemId))
    .map((product) => product.itemId);
  const removed = prev
    .filter((product) => !nextIds.has(product.itemId))
    .map((product) => product.itemId);

  if (added.length > 0) {
    enqueue(() => saveFavorites(added));
  }

  if (removed.length > 0) {
    enqueue(() => removeFavorites(removed));
  }
};

export const startUserSync = () => {
  if (isStarted) {
    return;
  }

  isStarted = true;

  useCartStore.subscribe((state, prev) => {
    if (activeUserId && !isApplying) {
      syncCartChanges(state.items, prev.items);
    }
  });

  useFavoritesStore.subscribe((state, prev) => {
    if (activeUserId && !isApplying) {
      syncFavoritesChanges(state.items, prev.items);
    }
  });
};

export const syncUser = async (user: AuthUser | null) => {
  if (!user) {
    if (activeUserId) {
      activeUserId = null;
      applyLocally(() => {
        useCartStore.setState({ items: [] });
        useFavoritesStore.setState({ items: [] });
      });
      useAiChatStore.getState().clear();
    }

    return;
  }

  if (activeUserId === user.id) {
    return;
  }

  activeUserId = user.id;

  try {
    const [remoteCart, remoteFavorites] = await Promise.all([
      fetchCart(),
      fetchFavorites(),
    ]);

    if (activeUserId !== user.id) {
      return;
    }

    const cart = mergeCart(useCartStore.getState().items, remoteCart);
    const favorites = mergeFavorites(
      useFavoritesStore.getState().items,
      remoteFavorites,
    );

    applyLocally(() => {
      useCartStore.setState({ items: cart });
      useFavoritesStore.setState({ items: favorites });
    });

    enqueue(() => saveCartItems(cart));
    enqueue(() => saveFavorites(favorites.map((product) => product.itemId)));
  } catch {
    return;
  }
};
