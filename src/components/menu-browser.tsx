"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { MenuItemCard } from "./menu-item-card";
import { useLocale } from "@/lib/i18n/locale-context";
import { categoryName, itemName, itemDescription } from "@/lib/i18n/localize";
import type { Category, MenuItem } from "@/lib/db/types";

export function MenuBrowser({
  categories,
  items,
}: {
  categories: Category[];
  items: MenuItem[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const { t, locale } = useLocale();

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchCat = activeCategory === "all" || it.categoryId === activeCategory;
      const q = query.trim().toLowerCase();
      const matchQuery =
        q === "" ||
        itemName(it, locale).toLowerCase().includes(q) ||
        itemDescription(it, locale).toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [items, activeCategory, query, locale]);

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 glass border-b border-black/5">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("menu.search")}
                className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 rtl:pl-4 rtl:pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <CategoryPill
              label={t("menu.all")}
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            />
            {categories.map((c) => (
              <CategoryPill
                key={c.id}
                label={categoryName(c, locale)}
                active={activeCategory === c.id}
                onClick={() => setActiveCategory(c.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-stone-400">
            <p className="text-lg">{t("menu.noResults")}</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <MenuItemCard key={item.id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active ? "text-white" : "text-stone-600 hover:text-brand bg-stone-100"
      }`}
    >
      {active && (
        <motion.span
          layoutId="active-category-pill"
          className="absolute inset-0 rounded-full bg-brand"
          transition={{ type: "spring", duration: 0.5 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}
