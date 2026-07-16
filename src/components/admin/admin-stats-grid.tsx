"use client";

import { ShoppingCart, Wallet, Clock, TrendingUp } from "lucide-react";
import { StatCard } from "./stat-card";
import { useLocale } from "@/lib/i18n/locale-context";

export function AdminStatsGrid({
  stats,
}: {
  stats: { todayOrders: number; todayRevenue: number; pending: number; totalOrders: number };
}) {
  const { t } = useLocale();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard label={t("admin.ordersToday")} value={stats.todayOrders} icon={ShoppingCart} accent="brand" />
      <StatCard label={t("admin.revenueToday")} value={stats.todayRevenue} icon={Wallet} accent="gold" />
      <StatCard label={t("admin.pendingOrders")} value={stats.pending} icon={Clock} accent="accent" />
      <StatCard label={t("admin.totalOrders")} value={stats.totalOrders} icon={TrendingUp} accent="brand" />
    </div>
  );
}
