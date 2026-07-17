"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

const FAQ_KEYS = ["faq1", "faq2", "faq3", "faq4"] as const;

const CONTENT: Record<string, Record<string, { q: string; a: string }>> = {
  fr: {
    faq1: { q: "Quels sont vos délais de livraison ?", a: "La livraison prend en moyenne 30 minutes selon votre zone. Vous recevez une estimation précise à la commande." },
    faq2: { q: "Puis-je payer à la livraison ?", a: "Oui, vous pouvez choisir le paiement en espèces à la livraison ou payer en ligne par carte bancaire lors du checkout." },
    faq3: { q: "Proposez-vous des options végétariennes ?", a: "Oui, plusieurs plats de notre menu sont végétariens — repérez le badge vert sur les cartes du menu." },
    faq4: { q: "Comment suivre ma commande ?", a: "Une fois connecté, rendez-vous dans 'Mes commandes' pour suivre le statut de votre livraison en temps réel." },
  },
  ar: {
    faq1: { q: "شحال كيدوز التوصيل؟", a: "التوصيل كيدوز فحوالي 30 دقيقة حسب المنطقة ديالك. كتوصلك تقدير دقيق مع الطلبية." },
    faq2: { q: "واش نقدر نخلص عند التوصيل؟", a: "أه، تقدر تختار الخلاص كاش عند التوصيل ولا تخلص أونلاين بالبطاقة البنكية." },
    faq3: { q: "واش عندكم أكلات نباتية؟", a: "أه، بزاف ديال الأطباق فالمنيو ديالنا نباتية — شوف البادج الأخضر فوق الكارط." },
    faq4: { q: "كيفاش نتبع الطلبية ديالي؟", a: "من بعد ما تدخل لحسابك، دوز ل 'طلباتي' باش تتبع حالة التوصيل real-time." },
  },
  en: {
    faq1: { q: "What are your delivery times?", a: "Delivery takes about 30 minutes depending on your area. You get an accurate estimate at checkout." },
    faq2: { q: "Can I pay on delivery?", a: "Yes, you can choose cash on delivery or pay online by card during checkout." },
    faq3: { q: "Do you have vegetarian options?", a: "Yes, several dishes on our menu are vegetarian — look for the green badge on menu cards." },
    faq4: { q: "How do I track my order?", a: "Once logged in, go to 'My Orders' to track your delivery status in real time." },
  },
};

export function FaqSection() {
  const { t, locale } = useLocale();
  const [openKey, setOpenKey] = useState<string | null>("faq1");
  const items = CONTENT[locale] ?? CONTENT.fr;

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
