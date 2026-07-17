"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { FAQ_KEYS, FAQ_CONTENT } from "@/lib/faq-content";

export function FaqSection() {
  const { t, locale } = useLocale();
  const [openKey, setOpenKey] = useState<string | null>("faq1");
  const items = FAQ_CONTENT[locale] ?? FAQ_CONTENT.fr;

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-brand">{t("home.faqBadge")}</span>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-extrabold text-stone-800 dark:text-stone-100">
          {t("home.faqTitle")}
        </h2>
      </div>

      <div className="space-y-3">
        {FAQ_KEYS.map((key) => {
          const item = items[key];
          const isOpen = openKey === key;
          return (
            <div
              key={key}
              className="rounded-xl bg-white dark:bg-surface ring-1 ring-stone-100 dark:ring-white/10 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? null : key)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left rtl:text-right"
              >
                <span className="font-semibold text-sm text-stone-800 dark:text-stone-100">{item.q}</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={18} className="text-stone-400 shrink-0" aria-hidden="true" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
