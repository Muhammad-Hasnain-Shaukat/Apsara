import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface WishlistState {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product) => {
        const { items } = get();
        const exists = items.some((p) => p.id === product.id);
        if (exists) {
          set({ items: items.filter((p) => p.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((p) => p.id === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'apsara-wishlist-storage',
    }
  )
);
