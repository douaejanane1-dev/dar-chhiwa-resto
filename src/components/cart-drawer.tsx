"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useLocale } from "@/lib/i18n/locale-context";

export function CartDrawer() {
  const { isOpen, close, lines, setQty, remove, subtotal } = useCart();
  const { t } = useLocale();

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
                </div>

                <div className="border-t border-stone-100 dark:border-white/10 px-5 py-4 space-y-3">
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
