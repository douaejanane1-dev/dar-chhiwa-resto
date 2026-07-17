/**
 * Shared FAQ copy, used both by the visual FaqSection accordion
 * and by the FAQPage JSON-LD structured data on the homepage.
 */
export const FAQ_KEYS = ["faq1", "faq2", "faq3", "faq4"] as const;

export const FAQ_CONTENT: Record<string, Record<string, { q: string; a: string }>> = {
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
