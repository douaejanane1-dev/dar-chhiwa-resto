"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Flame, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/lib/cart-store";
import { useLocale } from "@/lib/i18n/locale-context";
import { itemName, itemDescription } from "@/lib/i18n/localize";
import type { MenuItem } from "@/lib/db/types";

export function MenuItemCard({ item, index = 0 }: { item: MenuItem; index?: number }) {
  const add = useCart((s) => s.add);
  const { t, locale } = useLocale();
  const name = itemName(item, locale);
  const description = itemDescription(item, locale);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface shadow-sm ring-1 ring-stone-100 dark:ring-white/10 hover:shadow-xl hover:shadow-brand/10 transition-shadow"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={item.image}
          alt={name}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {item.isFeatured && (
          <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-stone-900 shadow">
            {t("menu.featured")}
          </span>
        )}
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
