"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

const REVIEWS = [
  { name: "Sara B.", initial: "S", color: "bg-brand", rating: 5, key: "review1" },
  { name: "Youssef E.", initial: "Y", color: "bg-gold", rating: 5, key: "review2" },
  { name: "Imane K.", initial: "I", color: "bg-green-600", rating: 4, key: "review3" },
] as const;

const TEXT: Record<string, Record<string, string>> = {
  fr: {
    review1: "Le meilleur tajine que j'ai goûté à Casablanca. Livraison rapide et encore chaud !",
    review2: "Qualité constante à chaque commande. Le service client répond toujours vite.",
    review3: "Recettes qui rappellent la cuisine de ma grand-mère. Je recommande vivement.",
  },
  ar: {
    review1: "أحسن طاجين تذوقتو فالدار البيضاء. التوصيل سريع والماكلة سخونة!",
    review2: "جودة ثابتة فكل طلبية. خدمة الزبناء كتجاوب بسرعة.",
    review3: "وصفات كتفكرني بالماكلة ديال جدتي. كنصح بيها بزاف.",
  },
  en: {
    review1: "The best tagine I've had in Casablanca. Fast delivery and still hot!",
    review2: "Consistent quality with every order. Customer service always replies fast.",
    review3: "Recipes that remind me of my grandmother's cooking. Highly recommend.",
  },
};

export function TestimonialsSection() {
  const { t, locale } = useLocale();
  const texts = TEXT[locale] ?? TEXT.fr;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-brand">
          {t("home.testimonialsBadge")}
        </span>
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-extrabold text-stone-800 dark:text-stone-100">
          {t("home.testimonialsTitle")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="relative rounded-2xl bg-white dark:bg-surface p-6 shadow-sm ring-1 ring-stone-100 dark:ring-white/10"
          >
            <Quote size={28} className="text-brand/20 dark:text-brand/30" aria-hidden="true" />
            <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {texts[r.key]}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${r.color} text-white font-display font-bold`}
                aria-hidden="true"
              >
                {r.initial}
              </span>
              <div>
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">{r.name}</p>
                <div className="flex gap-0.5" role="img" aria-label={`${r.rating}/5`}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={12}
                      aria-hidden="true"
                      className={idx < r.rating ? "fill-gold text-gold" : "text-stone-300 dark:text-stone-600"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
