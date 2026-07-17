"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Flame, Plus, Clock, Leaf, Heart, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/lib/cart-store";
import { useFavorites } from "@/lib/favorites-store";
import { useLocale } from "@/lib/i18n/locale-context";
import { itemName, itemDescription } from "@/lib/i18n/localize";
import { getMenuItemRating, getMenuItemReviewCount } from "@/lib/menu-rating";
import type { MenuItem } from "@/lib/db/types";

export function MenuItemCard({ item, index = 0 }: { item: MenuItem; index?: number }) {
  const add = useCart((s) => s.add);
  const isFavorite = useFavorites((s) => s.isFavorite(item.id));
  const toggleFavorite = useFavorites((s) => s.toggle);
  const { t, locale } = useLocale();
  const name = itemName(item, locale);
  const description = itemDescription(item, locale);
  const isVegetarian = item.tags.includes("vegetarien");
  const isNew = item.tags.includes("nouveau");
  const isChefPick = item.tags.includes("chef");
  const isBestSeller = item.tags.includes("populaire");
  const rating = getMenuItemRating(item.id);
  const reviewCount = getMenuItemReviewCount(item.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface shadow-sm ring-1 ring-stone-100 dark:ring-white/10 hover:shadow-xl hover:shadow-brand/10 transition-shadow"
    >
      <div className="relative h-44 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <Image
          src={item.image}
          alt={name}
          fill
          unoptimized
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col gap-1.5 items-start rtl:items-end">
          {isChefPick && (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-stone-900 shadow">
              {t("menu.chefPick")}
            </span>
          )}
          {!isChefPick && isBestSeller && (
            <span className="rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-white shadow">
              {t("menu.bestSeller")}
            </span>
          )}
          {isNew && (
            <span className="rounded-full bg-blue-500 px-2.5 py-1 text-[11px] font-bold text-white shadow">
              {t("menu.newBadge")}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 flex flex-col gap-1.5 items-end rtl:items-start">
          <motion.button
            type="button"
            whileTap={{ scale: 0.8 }}
            onClick={() => toggleFavorite(item.id)}
            aria-label={isFavorite ? t("menu.removeFavorite") : t("menu.addFavorite")}
            aria-pressed={isFavorite}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 dark:bg-stone-900/90 shadow backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Heart
              size={14}
              aria-hidden="true"
              className={isFavorite ? "fill-brand text-brand" : "text-stone-500"}
            />
          </motion.button>
          {isVegetarian && (
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-white shadow"
              title={t("menu.vegetarian")}
              aria-label={t("menu.vegetarian")}
            >
              <Leaf size={14} aria-hidden="true" />
            </span>
          )}
        </div>

        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-semibold text-center px-2">
            {t("menu.unavailable")}
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-bold text-stone-800 dark:text-stone-100 leading-snug">
            {name}
          </h3>
          {item.spicyLevel > 0 && (
            <div
              className="flex shrink-0 gap-0.5 mt-1"
              role="img"
              aria-label={`${t("menu.spicyLevel")}: ${item.spicyLevel}/3`}
            >
              {Array.from({ length: item.spicyLevel }).map((_, i) => (
                <Flame key={i} size={12} aria-hidden="true" className="text-brand fill-brand" />
              ))}
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 line-clamp-2">{description}</p>

        <div className="mt-2 flex items-center gap-3 flex-wrap text-[11px] text-stone-400 dark:text-stone-500">
          <div className="flex items-center gap-1" role="img" aria-label={`${rating}/5`}>
            <Star size={12} className="fill-gold text-gold" aria-hidden="true" />
            <span className="font-semibold text-stone-600 dark:text-stone-300">{rating}</span>
            <span>({reviewCount} {t("menu.reviews")})</span>
          </div>
          {item.prepTime ? (
            <div className="flex items-center gap-1">
              <Clock size={12} aria-hidden="true" />
              <span>
                ~{item.prepTime} {t("menu.prepTime")}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-brand-dark">
            {item.price} <span className="text-xs font-sans font-medium text-stone-400 dark:text-stone-500">MAD</span>
          </span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            disabled={!item.isAvailable}
            aria-label={`${t("menu.addToCart")} ${name}`}
            onClick={() => {
              add({ menuItemId: item.id, name, price: item.price, image: item.image });
              toast.success(`${name} ${t("menu.addedToCart")}`);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-md shadow-brand/30 hover:bg-brand-dark disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <Plus size={16} aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
