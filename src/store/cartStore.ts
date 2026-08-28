import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  specialInstructions: string;

  addItem: (product: Product, selectedFinish?: string, quantity?: number) => void;
  removeItem: (productId: string, selectedFinish: string) => void;
  updateQuantity: (productId: string, selectedFinish: string, quantity: number) => void;
  setSpecialInstructions: (note: string) => void;
  clearCart: () => void;

  getItemCount: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getFreeShippingRemaining: () => number;
  getFreeShippingProgress: () => number;
  getTotal: () => number;
}

const WHITE_GLOVE_THRESHOLD = 5000;
const STANDARD_FREIGHT_FEE = 250;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      specialInstructions: '',

      addItem: (product, selectedFinish, quantity = 1) => {
        const finish = selectedFinish || product.finish_options?.[0]?.label || 'Standard Edition';
        const finishImage = product.finish_options?.find(f => f.label === finish)?.image || product.images[0];

        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === product.id && i.selectedFinish === finish
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const currentQty = updatedItems[existingIndex].quantity;
            const newQty = Math.min(product.stock, currentQty + quantity);
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: newQty,
            };
            return { items: updatedItems };
          } else {
            const newItem: CartItem = {
              productId: product.id,
              title: product.title,
              slug: product.slug,
              price: product.price,
              quantity: Math.min(product.stock, quantity),
              selectedFinish: finish,
              selectedFinishImage: finishImage,
              category: product.category,
              maxStock: product.stock,
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (productId, selectedFinish) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.selectedFinish === selectedFinish)
          ),
        }));
      },

      updateQuantity: (productId, selectedFinish, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedFinish);
          return;
        }

        set((state) => ({
          items: state.items.map((i) => {
            if (i.productId === productId && i.selectedFinish === selectedFinish) {
              return { ...i, quantity: Math.min(i.maxStock, quantity) };
            }
            return i;
          }),
        }));
      },

      setSpecialInstructions: (specialInstructions) => set({ specialInstructions }),

      clearCart: () => set({ items: [], specialInstructions: '' }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= WHITE_GLOVE_THRESHOLD ? 0 : STANDARD_FREIGHT_FEE;
      },

      getFreeShippingRemaining: () => {
        const subtotal = get().getSubtotal();
        return Math.max(0, WHITE_GLOVE_THRESHOLD - subtotal);
      },

      getFreeShippingProgress: () => {
        const subtotal = get().getSubtotal();
        return Math.min(100, (subtotal / WHITE_GLOVE_THRESHOLD) * 100);
      },

      getTotal: () => {
        return get().getSubtotal() + get().getShippingFee();
      },
    }),
    {
      name: 'apsara-cart-storage',
    }
  )
);
