"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

// zustand persist is set to skipHydration so the server-rendered HTML
// (always an empty cart) matches the client's first render exactly.
// We manually trigger rehydration from localStorage right after mount,
// which happens *after* React has hydrated — so it's a normal state
// update, not a hydration mismatch.
export function CartHydration() {
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);
  return null;
}
