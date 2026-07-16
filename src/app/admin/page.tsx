import { cookies } from "next/headers";
import { getStats } from "@/lib/db/repo";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "@/lib/i18n/config";

export default async function AdminDashboard() {
  const stats = getStats();
  const cookieStore = await cookies();
  const localeValue = cookieStore.get(COOKIE_NAME)?.value;
  const locale = isValidLocale(localeValue) ? localeValue : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-stone-800 mb-6">{dict.admin.dashboard}</h1>
      <AdminStatsGrid stats={stats} />
      <DashboardCharts last7days={stats.last7days} topItems={stats.topItems} />
    </div>
  );
}
