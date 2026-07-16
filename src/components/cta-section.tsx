"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

export function CtaSection() {
  const { t } = useLocale();

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl animated-gradient px-8 py-16 text-center shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">
            {t("home.ctaTitle")}
          </h2>
          <p className="mt-3 text-white/85 max-w-lg mx-auto">{t("home.ctaText")}</p>
          <Link
            href="/menu"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-stone-900 shadow-xl transition-transform hover:scale-105"
          >
            {t("home.ctaButton")} <ArrowRight size={18} className="rtl:rotate-180" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
