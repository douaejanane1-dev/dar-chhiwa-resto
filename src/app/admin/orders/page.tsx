import { cookies } from "next/headers";
import { getOrders } from "@/lib/db/repo";
import { OrdersAdmin } from "@/components/admin/orders-admin";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "@/lib/i18n/config";

export default async function AdminOrdersPage() {
  const orders = getOrders();
  const cookieStore = await cookies();
  const localeValue = cookieStore.get(COOKIE_NAME)?.value;
  const locale = isValidLocale(localeValue) ? localeValue : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-stone-800 mb-6">{dict.admin.orders}</h1>
      <OrdersAdmin initialOrders={orders} />
    </div>
  );
}
