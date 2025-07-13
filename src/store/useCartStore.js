'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      /* ──────────────── État global ──────────────── */
      items: [],
      isCartOpen: false,
      isAddToCartPanelOpen: false,

      /* ──────────────── Actions panier ──────────────── */
      addToCart: (product, size) => {
        const price = Number(
          product.sizes?.find((s) => s.label === size)?.price || product.price
        );

        const existing = get().items.find(
          (i) => i.id === product.id && i.size === size
        );

        if (existing) {
          // Article déjà présent → on incrémente
          set({
            items: get().items.map((i) =>
              i.id === product.id && i.size === size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
            isAddToCartPanelOpen: true,
          });
        } else {
          // Nouvel article
          set({
            items: [
              ...get().items,
              {
                id: product.id,
                title: product.title,
                image: product.images?.[0] || '',
                size,
                price,
                quantity: 1,
              },
            ],
            isAddToCartPanelOpen: true,
          });
        }
      },

      removeFromCart: (id, size) =>
        set({
          items: get().items.filter((i) => !(i.id === id && i.size === size)),
        }),

      increaseQuantity: (id, size) =>
        set({
          items: get().items.map((i) =>
            i.id === id && i.size === size
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }),

      decreaseQuantity: (id, size) =>
        set({
          items: get().items.map((i) =>
            i.id === id && i.size === size && i.quantity > 1
              ? { ...i, quantity: i.quantity - 1 }
              : i
          ),
        }),

      clearCart: () => set({ items: [] }),

      /* ──────────────── Panneaux UI ──────────────── */
      openCartPanel: () => set({ isCartOpen: true }),
      closeCartPanel: () => set({ isCartOpen: false }),
      closeAddToCartPanel: () => set({ isAddToCartPanelOpen: false }),
    }),
    { name: 'muji-cart' } // clé LocalStorage
  )
);

export default useCartStore;
