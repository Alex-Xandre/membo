import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  isOpen: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  isOpen: false,

  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);
      return {
        cart: existingItem
          ? state.cart.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
          : [...state.cart, { ...item, quantity: 1 }],
        // isOpen: true,
      };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) => (item.id === id ? { ...item, quantity } : item)),
    })),

  clearCart: () => set({ cart: [] }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));
