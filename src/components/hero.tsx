"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Truck, UtensilsCrossed } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { settingsName, settingsTagline, settingsDescription } from "@/lib/i18n/localize";
import type { RestaurantSettings } from "@/lib/db/types";

export function Hero({ settings }: { settings: RestaurantSettings }) {
  const { t, locale } = useLocale();
  const name = settingsName(settings, locale);
  const tagline = settingsTagline(settings, locale);
  const description = settingsDescription(settings, locale);

  return (
    <section className="relative overflow-hidden bg-stone-950">
      <div className="absolute inset-0 animated-gradient opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_35%)]" />

      <motion.div
        className="absolute top-24 right-[8%] text-6xl select-none hidden md:block"
        animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        🍲
      </motion.div>
      <motion.div
        className="absolute bottom-28 right-[22%] text-5xl select-none hidden md:block"
        animate={{ y: [0, 16, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        🥘
      </motion.div>
      <motion.div
        className="absolute top-40 left-[10%] text-4xl select-none hidden md:block"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        🌶️
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 md:py-36">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md"
          >
            <Star size={13} className="fill-gold text-gold" /> {t("hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white"
          >
            {name}
            <br />
            <span className="text-gold">{tagline}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 text-base md:text-lg text-white/80 max-w-lg"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-stone-900 shadow-xl transition-transform hover:scale-105"
            >
              {t("hero.cta")}
              <ArrowRight size={18} className="rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
            <a
              href={`tel:${settings.phone}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              {settings.phone}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-14 grid grid-cols-3 gap-6 max-w-md"
          >
            {[
              { icon: Truck, label: t("hero.deliveryTime") },
              { icon: UtensilsCrossed, label: t("hero.familyRecipes") },
              { icon: Star, label: t("hero.happyCustomers") },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2 text-white/85">
                <f.icon size={22} className="text-gold" />
                <span className="text-[11px] leading-tight">{f.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="relative h-16 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
