import { cookies } from "next/headers";
import { getCategories, getMenuItems } from "@/lib/db/repo";
import { MenuAdmin } from "@/components/admin/menu-admin";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "@/lib/i18n/config";

export default async function AdminMenuPage() {
  const categories = await getCategories();
  const items = await getMenuItems();
  const cookieStore = await cookies();
  const localeValue = cookieStore.get(COOKIE_NAME)?.value;
  const locale = isValidLocale(localeValue) ? localeValue : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-stone-800 mb-6">{dict.admin.manageMenu}</h1>
      <MenuAdmin initialCategories={categories} initialItems={items} />
    </div>
  );
}
