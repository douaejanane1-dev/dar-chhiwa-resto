"use client";

import { motion } from "framer-motion";
import { MenuItemCard } from "./menu-item-card";
import { useLocale } from "@/lib/i18n/locale-context";
import type { MenuItem } from "@/lib/db/types";

export function FeaturedSection({ items }: { items: MenuItem[] }) {
  const { t } = useLocale();

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-xl mx-auto mb-12"
      >
        <span className="text-sm font-bold uppercase tracking-widest text-brand">
          {t("home.chosenBadge")}
        </span>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-extrabold text-stone-800 dark:text-stone-100">
          {t("home.featuredTitle")}
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {items.map((item, i) => (
          <MenuItemCard key={item.id} item={item} index={i} allItems={items} />
        ))}
      </div>
    </section>
  );
}
