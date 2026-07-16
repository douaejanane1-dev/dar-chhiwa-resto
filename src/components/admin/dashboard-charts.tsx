"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/i18n/locale-context";

export function DashboardCharts({
  last7days,
  topItems,
}: {
  last7days: { date: string; revenue: number; orders: number }[];
  topItems: { name: string; qty: number }[];
}) {
  const { t } = useLocale();
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-100"
      >
        <h2 className="font-display font-bold text-stone-800 mb-4">{t("admin.revenueChart")}</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={last7days}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c8562d" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#c8562d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="date" fontSize={12} stroke="#a8a29e" />
            <YAxis fontSize={12} stroke="#a8a29e" />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#c8562d" fill="url(#rev)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-100"
      >
        <h2 className="font-display font-bold text-stone-800 mb-4">{t("admin.topDishes")}</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={topItems} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={90} fontSize={11} stroke="#a8a29e" />
            <Tooltip />
            <Bar dataKey="qty" fill="#e0a730" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
