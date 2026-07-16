"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { settingsName, settingsDescription } from "@/lib/i18n/localize";
import type { RestaurantSettings } from "@/lib/db/types";

export function AboutSection({ settings }: { settings: RestaurantSettings }) {
  const { t, locale } = useLocale();
  const name = settingsName(settings, locale);
  const description = settingsDescription(settings, locale);

  const points = [t("home.point1"), t("home.point2"), t("home.point3"), t("home.point4")];

  return (
    <section id="about" className="bg-stone-50 dark:bg-surface-muted py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative h-80 md:h-[420px] rounded-3xl overflow-hidden shadow-2xl">
            <Image src={settings.coverImage} alt={name} fill unoptimized className="object-cover" />
          </div>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 rtl:-left-auto rtl:-right-6 rounded-2xl bg-white dark:bg-surface p-5 shadow-xl hidden sm:block"
          >
            <p className="font-display text-3xl font-extrabold text-brand">+8</p>
            <p className="text-xs text-stone-500">{t("home.yearsExperience")}</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="text-sm font-bold uppercase tracking-widest text-brand">
            {t("home.aboutBadge")}
          </span>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-extrabold text-stone-800 dark:text-stone-100">
            {t("home.aboutTitle")} {name}
          </h2>
          <p className="mt-5 text-stone-600 dark:text-stone-300 leading-relaxed">{description}</p>

          <div className="mt-7 grid sm:grid-cols-2 gap-3">
            {points.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200"
              >
                <CheckCircle2 size={18} className="text-accent shrink-0" />
                {p}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
