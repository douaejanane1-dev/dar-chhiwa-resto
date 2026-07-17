import Link from "next/link";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { getOrdersByUser } from "@/lib/db/repo";
import { PackageSearch, ChevronRight } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "@/lib/i18n/config";

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  confirmed: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  preparing: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  out_for_delivery: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  delivered: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

export default async function AccountOrdersPage() {
  const session = await auth();
  const orders = session?.user?.id ? getOrdersByUser(session.user.id) : [];
  const cookieStore = await cookies();
  const localeValue = cookieStore.get(COOKIE_NAME)?.value;
  const locale = isValidLocale(localeValue) ? localeValue : defaultLocale;
  const dict = getDictionary(locale);
  const localeTag = locale === "ar" ? "ar-MA" : locale === "en" ? "en-US" : "fr-FR";

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="font-display text-3xl font-extrabold text-stone-800 dark:text-stone-100 mb-8">
        {dict.account.myOrders}
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-24 text-stone-400 dark:text-stone-500">
          <PackageSearch size={48} className="mx-auto mb-4 opacity-30" />
          {dict.account.noOrders}
          <div className="mt-4">
            <Link href="/menu" className="text-brand font-semibold hover:underline">
              {dict.account.browseMenu}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/order/${o.id}`}
              className="flex items-center justify-between rounded-2xl border border-stone-100 dark:border-white/10 bg-white dark:bg-surface p-5 shadow-sm hover:shadow-md hover:border-brand/30 transition-all"
            >
              <div>
                <p className="font-semibold text-stone-800 dark:text-stone-100">
                  {dict.account.orderNumber} #{o.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                  {new Date(o.createdAt).toLocaleString(localeTag)} · {o.items.length} {dict.account.dishes}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[o.status]}`}>
                  {dict.orderStatus[o.status as keyof typeof dict.orderStatus]}
                </span>
                <span className="font-display font-bold text-brand-dark">{o.total} MAD</span>
                <ChevronRight size={18} className="text-stone-300 dark:text-stone-600 rtl:rotate-180" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
