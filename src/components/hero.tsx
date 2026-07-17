"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Truck, Users, ChevronDown } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { settingsName, settingsTagline, settingsDescription } from "@/lib/i18n/localize";
import type { RestaurantSettings } from "@/lib/db/types";

export function Hero({ settings }: { settings: RestaurantSettings }) {
  const { t, locale } = useLocale();
  const name = settingsName(settings, locale);
  const tagline = settingsTagline(settings, locale);
  const description = settingsDescription(settings, locale);

  return (
    <section className="relative overflow-hidden bg-stone-950 min-h-[92vh] flex items-center">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1643019237176-8ae0859f1123?w=1920&h=1280&fit=crop&q=80&auto=format"
          alt=""
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-black/20 to-black/40" />
      </div>

      <motion.div
        className="absolute top-24 right-[8%] text-6xl select-none hidden md:block drop-shadow-2xl"
        animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        🍲
      </motion.div>
      <motion.div
        className="absolute bottom-40 right-[22%] text-5xl select-none hidden md:block drop-shadow-2xl"
        animate={{ y: [0, 16, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        🥘
      </motion.div>
      <motion.div
        className="absolute top-40 left-[6%] text-4xl select-none hidden md:block drop-shadow-2xl"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        🌶️
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 md:py-20 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md ring-1 ring-white/20"
          >
            <Star size={13} className="fill-gold text-gold" /> {t("hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white [text-wrap:balance]"
          >
            {name}
            <br />
            <span className="text-gold">{tagline}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 text-base md:text-lg text-white/85 max-w-lg"
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
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 font-semibold text-white shadow-xl shadow-brand/30 transition-transform hover:scale-105"
            >
              {t("hero.cta")}
              <ArrowRight size={18} className="rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur-sm hover:bg-white/15 transition-colors"
            >
              {t("hero.viewMenu")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-14 flex flex-wrap gap-x-8 gap-y-5 max-w-lg"
          >
            <div className="flex items-center gap-2.5 text-white/90">
              <Star size={20} className="text-gold fill-gold shrink-0" />
              <span className="text-sm font-medium">{t("hero.rating")}</span>
            </div>
            <div className="flex items-center gap-2.5 text-white/90">
              <Truck size={20} className="text-gold shrink-0" />
              <span className="text-sm font-medium">{t("hero.deliveryTime")}</span>
            </div>
            <div className="flex items-center gap-2.5 text-white/90">
              <Users size={20} className="text-gold shrink-0" />
              <span className="text-sm font-medium">{t("hero.happyCustomers")}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 text-white/70"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[11px] font-medium tracking-wide uppercase">{t("hero.scrollDown")}</span>
        <ChevronDown size={18} aria-hidden="true" />
      </motion.div>
    </section>
  );
}
