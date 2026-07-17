import { getMenuItems, getSettings } from "@/lib/db/repo";
import { Hero } from "@/components/hero";
import { FeaturedSection } from "@/components/featured-section";
import { AboutSection } from "@/components/about-section";
import { CtaSection } from "@/components/cta-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FaqSection } from "@/components/faq-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { StructuredData } from "@/components/structured-data";
import { getSiteUrl } from "@/lib/site-url";
import { resolveAssetUrl } from "@/lib/resolve-url";
import { parseOpeningHoursRange } from "@/lib/opening-hours";
import { FAQ_KEYS, FAQ_CONTENT } from "@/lib/faq-content";

export default async function Home() {
  const settings = getSettings();
  const items = getMenuItems().filter((i) => i.isFeatured && i.isAvailable);
  const base = getSiteUrl();

  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings.name,
    image: resolveAssetUrl(base, settings.coverImage),
    logo: resolveAssetUrl(base, settings.logo),
    url: base,
    telephone: settings.phone,
    servesCuisine: "Moroccan",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: settings.city,
      addressCountry: "MA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: settings.lat,
      longitude: settings.lng,
    },
    servesDelivery: true,
    sameAs: [settings.instagram, settings.facebook].filter(Boolean),
    hasMenu: `${base}/menu`,
    ...(() => {
      const range = parseOpeningHoursRange(settings.openingHours);
      if (!range) return {};
      return {
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: range.open,
          closes: range.close,
        },
      };
    })(),
  };

  const faqEntries = FAQ_KEYS.map((key) => FAQ_CONTENT.fr[key]).filter(Boolean);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map((entry) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.a,
      },
    })),
  };

  return (
    <>
      <StructuredData data={restaurantSchema} />
      <StructuredData data={faqSchema} />
      <Hero settings={settings} />
      <FeaturedSection items={items} />
      <AboutSection settings={settings} />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <NewsletterSection />
    </>
  );
}
