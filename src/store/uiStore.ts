import { create } from 'zustand';
import { Product } from '../types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface UIState {
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  authRedirectPath: string | null;
  authModalTitle?: string;

  isCartDrawerOpen: boolean;
  isQuickViewOpen: boolean;
  quickViewProduct: Product | null;
  isWishlistDrawerOpen: boolean;
  toasts: Toast[];

  openAuthModal: (mode?: 'login' | 'register', redirectPath?: string | null, title?: string) => void;
  closeAuthModal: () => void;

  openCartDrawer: () => void;
  closeCartDrawer: () => void;

  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  openWishlistDrawer: () => void;
  closeWishlistDrawer: () => void;

  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAuthModalOpen: false,
  authModalMode: 'login',
  authRedirectPath: null,
  authModalTitle: undefined,

  isCartDrawerOpen: false,
  isQuickViewOpen: false,
  quickViewProduct: null,
  isWishlistDrawerOpen: false,
  toasts: [],

  openAuthModal: (mode = 'login', redirectPath: string | null = null, title) =>
    set({
      isAuthModalOpen: true,
      authModalMode: mode,
      authRedirectPath: redirectPath,
      authModalTitle: title,
    }),

  closeAuthModal: () =>
    set({
      isAuthModalOpen: false,
      authRedirectPath: null,
      authModalTitle: undefined,
    }),

  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),

  openQuickView: (product) => set({ isQuickViewOpen: true, quickViewProduct: product }),
  closeQuickView: () => set({ isQuickViewOpen: false, quickViewProduct: null }),

  openWishlistDrawer: () => set({ isWishlistDrawerOpen: true }),
  closeWishlistDrawer: () => set({ isWishlistDrawerOpen: false }),

  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
