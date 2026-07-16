"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  menuItemId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartLine, "qty">, qty?: number) => void;
  remove: (menuItemId: string) => void;
  setQty: (menuItemId: string, qty: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (item, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.menuItemId === item.menuItemId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.menuItemId === item.menuItemId ? { ...l, qty: l.qty + qty } : l
              ),
              isOpen: true,
            };
          }
          return { lines: [...state.lines, { ...item, qty }], isOpen: true };
        }),
      remove: (menuItemId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.menuItemId !== menuItemId) })),
      setQty: (menuItemId, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((l) => l.menuItemId !== menuItemId)
              : state.lines.map((l) => (l.menuItemId === menuItemId ? { ...l, qty } : l)),
        })),
      clear: () => set({ lines: [] }),
      subtotal: () => get().lines.reduce((s, l) => s + l.price * l.qty, 0),
      count: () => get().lines.reduce((s, l) => s + l.qty, 0),
    }),
    { name: "resto-cart", skipHydration: true }
  )
);
