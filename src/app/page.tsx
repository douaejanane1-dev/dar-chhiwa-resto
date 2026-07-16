import { getMenuItems, getSettings } from "@/lib/db/repo";
import { Hero } from "@/components/hero";
import { FeaturedSection } from "@/components/featured-section";
import { AboutSection } from "@/components/about-section";
import { CtaSection } from "@/components/cta-section";
import { StructuredData } from "@/components/structured-data";
import { getSiteUrl } from "@/lib/site-url";

export default async function Home() {
  const settings = getSettings();
  const items = getMenuItems().filter((i) => i.isFeatured && i.isAvailable);
  const base = getSiteUrl();

  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings.name,
    image: `${base}${settings.coverImage}`,
    logo: `${base}${settings.logo}`,
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
  };

  return (
    <>
      <StructuredData data={restaurantSchema} />
      <Hero settings={settings} />
      <FeaturedSection items={items} />
      <AboutSection settings={settings} />
      <CtaSection />
    </>
  );
}
