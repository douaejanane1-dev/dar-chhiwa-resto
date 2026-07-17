import { cookies } from "next/headers";
import { getCategories, getMenuItems, getSettings } from "@/lib/db/repo";
import { MenuBrowser } from "@/components/menu-browser";
import { StructuredData } from "@/components/structured-data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "@/lib/i18n/config";
import { getSiteUrl } from "@/lib/site-url";
import { itemName, itemDescription, categoryName } from "@/lib/i18n/localize";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  const base = getSiteUrl();
  const title = "Menu";
  const description = `Découvrez le menu complet de ${settings.name} : tajines, grillades, pizzas, salades et desserts marocains, livrés chez vous.`;
  return {
    title,
    description,
    alternates: { canonical: `${base}/menu` },
    openGraph: { title, description, url: `${base}/menu` },
  };
}

export default async function MenuPage() {
  const categories = getCategories();
  const items = getMenuItems();
  const settings = getSettings();
  const base = getSiteUrl();
  const cookieStore = await cookies();
  const localeValue = cookieStore.get(COOKIE_NAME)?.value;
  const locale = isValidLocale(localeValue) ? localeValue : defaultLocale;
  const dict = getDictionary(locale);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: settings.name, item: base },
      { "@type": "ListItem", position: 2, name: "Menu", item: `${base}/menu` },
    ],
  };

  const menuSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `Menu ${settings.name}`,
    inLanguage: locale,
    hasMenuSection: categories.map((cat) => ({
      "@type": "MenuSection",
      name: categoryName(cat, locale),
      hasMenuItem: items
        .filter((item) => item.categoryId === cat.id)
        .map((item) => ({
          "@type": "MenuItem",
          name: itemName(item, locale),
          description: itemDescription(item, locale),
          offers: {
            "@type": "Offer",
            price: item.price,
            priceCurrency: settings.currency || "MAD",
            availability: item.isAvailable
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
        })),
    })),
  };

  return (
    <div className="bg-background min-h-screen">
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={menuSchema} />
      <div className="bg-stone-900 py-12 text-center">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white">
          {dict.menu.title}
        </h1>
        <p className="mt-2 text-white/70 text-sm">{dict.menu.subtitle}</p>
      </div>
      <MenuBrowser categories={categories} items={items} />
    </div>
  );
}
