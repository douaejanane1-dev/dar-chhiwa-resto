"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { useLocale } from "@/lib/i18n/locale-context";

export function NewsletterSection() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    toast.success(t("home.newsletterSuccess"));
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl bg-stone-900 dark:bg-surface px-8 py-14 text-center ring-1 ring-white/10"
      >
        <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
          {t("home.newsletterTitle")}
        </h2>
        <p className="mt-3 text-white/70 max-w-md mx-auto text-sm">{t("home.newsletterText")}</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-wrap justify-center gap-3 max-w-md mx-auto">
          <label htmlFor="newsletter-email" className="sr-only">
            {t("home.newsletterPlaceholder")}
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("home.newsletterPlaceholder")}
            className="flex-1 min-w-[220px] rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-colors"
          >
            {t("home.newsletterButton")}
            <Send size={15} className="rtl:-scale-x-100" aria-hidden="true" />
          </button>
        </form>
      </motion.div>
    </section>
  );
}
