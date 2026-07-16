import { cookies } from "next/headers";
import { getCategories, getMenuItems } from "@/lib/db/repo";
import { MenuBrowser } from "@/components/menu-browser";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "@/lib/i18n/config";

export const metadata = { title: "Menu" };

export default async function MenuPage() {
  const categories = getCategories();
  const items = getMenuItems();
  const cookieStore = await cookies();
  const localeValue = cookieStore.get(COOKIE_NAME)?.value;
  const locale = isValidLocale(localeValue) ? localeValue : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="bg-background min-h-screen">
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
