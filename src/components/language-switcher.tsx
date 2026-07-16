"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { locales, localeNames, localeFlags } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/locale-context";

export function LanguageSwitcher({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${localeNames[locale]}`}
        className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
          variant === "dark"
            ? "text-white/85 hover:bg-white/10"
            : "text-stone-600 hover:bg-stone-100"
        }`}
      >
        <Globe size={16} aria-hidden="true" />
        <span className="hidden sm:inline">{localeFlags[locale]} {localeNames[locale]}</span>
        <span className="sm:hidden">{localeFlags[locale]}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 w-44 rounded-xl bg-white shadow-xl ring-1 ring-stone-100 overflow-hidden z-50"
          >
            {locales.map((l) => (
              <button
                key={l}
                role="option"
                aria-selected={locale === l}
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-brand/10 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{localeFlags[l]}</span> {localeNames[l]}
                </span>
                {locale === l && <Check size={14} aria-hidden="true" className="text-brand" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
