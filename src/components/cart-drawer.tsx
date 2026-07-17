"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Clock, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useLocale } from "@/lib/i18n/locale-context";
import { itemName } from "@/lib/i18n/localize";
import type { MenuItem } from "@/lib/db/types";

export function CartDrawer() {
  const { isOpen, close, lines, setQty, remove, subtotal, add } = useCart();
  const { t, locale } = useLocale();
  const [suggestions, setSuggestions] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data: { items: MenuItem[] }) => {
        if (cancelled) return;
        const inCart = new Set(lines.map((l) => l.menuItemId));
        const pool = data.items.filter((i) => i.isAvailable && !inCart.has(i.id));
        setSuggestions(pool.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)).slice(0, 3));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t("cart.title")}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white dark:bg-surface shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 dark:border-white/10">
              <div className="flex items-center gap-2 font-display text-lg font-bold text-brand-dark">
                <ShoppingBag size={20} aria-hidden="true" /> {t("cart.title")}
              </div>
              <button onClick={close} aria-label={t("common.close")} className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-stone-400 p-8 text-center">
                <ShoppingBag size={48} className="opacity-30" />
                <p>{t("cart.empty")}</p>
                <Link
                  href="/menu"
                  onClick={close}
                  className="mt-2 rounded-full bg-brand px-5 py-2 text-white text-sm font-semibold hover:bg-brand-dark transition-colors"
                >
                  {t("cart.browseMenu")}
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.div
                        key={line.menuItemId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="flex gap-3 items-center rounded-xl border border-stone-100 dark:border-white/10 p-3"
                      >
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                          <Image src={line.image} alt={line.name} fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-800 dark:text-stone-100 truncate">{line.name}</p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">{line.price} MAD</p>
                          <div className="mt-1 flex items-center gap-2">
                            <button
                              onClick={() => setQty(line.menuItemId, line.qty - 1)}
                              aria-label={t("cart.decrease")}
                              className="h-6 w-6 flex items-center justify-center rounded-full bg-stone-100 hover:bg-brand hover:text-white transition-colors"
                            >
                              <Minus size={12} aria-hidden="true" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center" aria-live="polite">{line.qty}</span>
                            <button
                              onClick={() => setQty(line.menuItemId, line.qty + 1)}
                              aria-label={t("cart.increase")}
                              className="h-6 w-6 flex items-center justify-center rounded-full bg-stone-100 hover:bg-brand hover:text-white transition-colors"
                            >
                              <Plus size={12} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-sm font-bold text-brand-dark">
                            {line.price * line.qty} MAD
                          </span>
                          <button
                            onClick={() => remove(line.menuItemId)}
                            aria-label={t("cart.remove")}
                            className="text-stone-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={15} aria-hidden="true" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {suggestions.length > 0 && (
                    <div className="pt-2">
                      <h3 className="text-xs font-bold uppercase tracking-wide text-stone-400 dark:text-stone-500 mb-2">
                        {t("cart.suggestedForYou")}
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {suggestions.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => add({ menuItemId: s.id, name: itemName(s, locale), price: s.price, image: s.image })}
                            className="text-left rtl:text-right group"
                          >
                            <div className="relative h-14 w-full overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-800">
                              <Image
                                src={s.image}
                                alt={itemName(s, locale)}
                                fill
                                unoptimized
                                className="object-cover transition-transform group-hover:scale-110"
                              />
                            </div>
                            <p className="mt-1 text-[11px] font-medium text-stone-600 dark:text-stone-300 line-clamp-1">
                              {itemName(s, locale)}
                            </p>
                            <p className="text-[11px] font-bold text-brand-dark">{s.price} MAD</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-stone-100 dark:border-white/10 px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-400 dark:text-stone-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={13} aria-hidden="true" /> {t("cart.estimatedDelivery")}
                    </span>
                    <span className="font-semibold">~30 min</span>
                  </div>
                  <div className="flex justify-between text-sm text-stone-500 dark:text-stone-400">
                    <span>{t("cart.subtotal")}</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-100">{subtotal()} MAD</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="block text-center w-full rounded-full bg-brand py-3 font-semibold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-colors"
                  >
                    {t("cart.checkout")}
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
