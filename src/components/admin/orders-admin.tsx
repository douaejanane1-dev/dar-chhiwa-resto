"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MapPin, Phone } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import type { Order, OrderStatus } from "@/lib/db/types";

const statusFlow: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

const statusColor: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export function OrdersAdmin({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const { t, locale } = useLocale();
  const localeTag = locale === "ar" ? "ar-MA" : locale === "en" ? "en-US" : "fr-FR";

  async function updateStatus(id: string, status: OrderStatus) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error(t("common.error"));
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success(t("admin.statusUpdated"));
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        <FilterPill label={t("admin.all")} active={filter === "all"} onClick={() => setFilter("all")} />
        {statusFlow.concat("cancelled").map((s) => (
          <FilterPill key={s} label={t(`orderStatus.${s}`)} active={filter === s} onClick={() => setFilter(s)} />
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center py-16 text-stone-400">{t("admin.noOrders")}</p>
        )}
        {filtered.map((o) => (
          <motion.div
            key={o.id}
            layout
            className="rounded-2xl bg-white shadow-sm ring-1 ring-stone-100 overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === o.id ? null : o.id)}
              className="w-full flex items-center justify-between p-5 text-left rtl:text-right"
            >
              <div>
                <p className="font-semibold text-stone-800">
                  #{o.id.slice(0, 8).toUpperCase()} — {o.customerName}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  {new Date(o.createdAt).toLocaleString(localeTag)} · {o.items.length} · {o.total} MAD
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[o.status]}`}>
                {t(`orderStatus.${o.status}`)}
              </span>
            </button>

            {expanded === o.id && (
              <div className="border-t border-stone-100 p-5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-stone-600 mb-1">{t("admin.dishes")}</p>
                    {o.items.map((it) => (
                      <p key={it.menuItemId} className="text-stone-500">
                        {it.qty}x {it.name} — {it.price * it.qty} MAD
                      </p>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-stone-500">
                      <MapPin size={14} className="text-brand" />
                      {o.address.label} — {o.address.details}, {o.address.city}
                    </p>
                    <p className="flex items-center gap-2 text-stone-500">
                      <Phone size={14} className="text-brand" /> {o.customerPhone}
                    </p>
                    <p className="text-stone-500">
                      {t("admin.payment")}: {o.paymentMethod === "cod" ? t("admin.paymentCash") : t("admin.paymentCard")} ({o.paymentStatus})
                    </p>
                  </div>
                </div>

                {o.status !== "cancelled" && o.status !== "delivered" && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
                    {statusFlow.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(o.id, s)}
                        disabled={o.status === s}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                          o.status === s
                            ? "bg-brand text-white"
                            : "bg-stone-100 text-stone-600 hover:bg-brand hover:text-white"
                        }`}
                      >
                        {t(`orderStatus.${s}`)}
                      </button>
                    ))}
                    <button
                      onClick={() => updateStatus(o.id, "cancelled")}
                      className="rounded-full px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      {t("admin.cancel")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active ? "bg-brand text-white" : "bg-white text-stone-500 ring-1 ring-stone-200 hover:text-brand"
      }`}
    >
      {label}
    </button>
  );
}
