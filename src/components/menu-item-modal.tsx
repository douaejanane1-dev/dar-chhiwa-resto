"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Clock, Flame, Leaf, Plus, Minus, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/lib/cart-store";
import { useLocale } from "@/lib/i18n/locale-context";
import { itemName, itemDescription } from "@/lib/i18n/localize";
import { getMenuItemRating, getMenuItemReviewCount } from "@/lib/menu-rating";
import type { MenuItem } from "@/lib/db/types";

export function MenuItemModal({
  item,
  related,
  qty,
  onQtyChange,
  onClose,
  onSelectRelated,
}: {
  item: MenuItem;
  related: MenuItem[];
  qty: number;
  onQtyChange: (qty: number) => void;
  onClose: () => void;
  onSelectRelated: (item: MenuItem) => void;
}) {
  const add = useCart((s) => s.add);
  const { t, locale } = useLocale();
  const name = itemName(item, locale);
  const description = itemDescription(item, locale);
  const rating = getMenuItemRating(item.id);
  const reviewCount = getMenuItemReviewCount(item.id);
  const isVegetarian = item.tags.includes("vegetarien");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={name}
          className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-surface shadow-2xl"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t("modal.close")}
            className="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-stone-900/90 shadow"
          >
            <X size={18} aria-hidden="true" />
          </button>

          <div className="relative h-56 sm:h-64 w-full">
            <Image src={item.image} alt={name} fill unoptimized className="object-cover" />
            {isVegetarian && (
              <span className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1 rounded-full bg-green-600 px-2.5 py-1 text-[11px] font-bold text-white shadow">
                <Leaf size={12} aria-hidden="true" /> {t("menu.vegetarian")}
              </span>
            )}
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-2xl font-extrabold text-stone-800 dark:text-stone-100">
                {name}
              </h2>
              {item.spicyLevel > 0 && (
                <div className="flex gap-0.5 mt-1.5 shrink-0" role="img" aria-label={`${item.spicyLevel}/3`}>
                  {Array.from({ length: item.spicyLevel }).map((_, i) => (
                    <Flame key={i} size={14} className="text-brand fill-brand" aria-hidden="true" />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-2 flex items-center gap-4 flex-wrap text-xs text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-1">
                <Star size={13} className="fill-gold text-gold" aria-hidden="true" />
                <span className="font-semibold text-stone-700 dark:text-stone-200">{rating}</span>
                <span>({reviewCount} {t("menu.reviews")})</span>
              </div>
              {item.prepTime ? (
                <div className="flex items-center gap-1">
                  <Clock size={13} aria-hidden="true" />
                  <span>~{item.prepTime} {t("menu.prepTime")}</span>
                </div>
              ) : null}
              {item.calories ? (
                <span>{item.calories} {t("modal.calories")}</span>
              ) : null}
            </div>

            <p className="mt-4 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {description}
            </p>

            {item.ingredients && item.ingredients.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-wide text-stone-400 dark:text-stone-500 mb-2">
                  {t("modal.ingredients")}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {item.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-1 text-[11px] text-stone-600 dark:text-stone-300"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.allergens && item.allergens.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-stone-400 dark:text-stone-500 mb-2">
                  {t("modal.allergens")}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {item.allergens.map((a) => (
                    <span
                      key={a}
                      className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 text-[11px] text-amber-700 dark:text-amber-400"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  {t("modal.quantity")}
                </span>
                <div className="flex items-center gap-2 rounded-full border border-stone-200 dark:border-white/10 px-1 py-1">
                  <button
                    type="button"
                    onClick={() => onQtyChange(Math.max(1, qty - 1))}
                    aria-label={t("cart.decrease")}
                    className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-white/10"
                  >
                    <Minus size={14} aria-hidden="true" />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold">{qty}</span>
                  <button
                    type="button"
                    onClick={() => onQtyChange(qty + 1)}
                    aria-label={t("cart.increase")}
                    className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-white/10"
                  >
                    <Plus size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <span className="font-display text-xl font-bold text-brand-dark">
                {item.price * qty} <span className="text-xs font-sans font-medium text-stone-400">MAD</span>
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              disabled={!item.isAvailable}
              onClick={() => {
                add({ menuItemId: item.id, name, price: item.price, image: item.image }, qty);
                toast.success(`${name} ${t("menu.addedToCart")}`);
                onClose();
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 font-semibold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ShoppingBag size={17} aria-hidden="true" />
              {t("menu.addToCart")}
            </motion.button>

            {related.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs font-bold uppercase tracking-wide text-stone-400 dark:text-stone-500 mb-3">
                  {t("modal.relatedDishes")}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {related.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => onSelectRelated(r)}
                      className="text-left rtl:text-right group"
                    >
                      <div className="relative h-16 w-full overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800">
                        <Image
                          src={r.image}
                          alt={itemName(r, locale)}
                          fill
                          unoptimized
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <p className="mt-1.5 text-[11px] font-medium text-stone-600 dark:text-stone-300 line-clamp-1">
                        {itemName(r, locale)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
