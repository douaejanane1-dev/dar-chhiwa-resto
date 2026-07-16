"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ChefHat, PackageCheck, Truck, XCircle } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import type { OrderStatus } from "@/lib/db/types";

const stepKeys: { key: OrderStatus; icon: React.ElementType }[] = [
  { key: "pending", icon: CheckCircle2 },
  { key: "confirmed", icon: CheckCircle2 },
  { key: "preparing", icon: ChefHat },
  { key: "out_for_delivery", icon: Truck },
  { key: "delivered", icon: PackageCheck },
];

export function OrderStatusTracker({ status }: { status: OrderStatus }) {
  const { t } = useLocale();

  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-50 text-red-600 px-4 py-3 text-sm font-semibold">
        <XCircle size={18} /> {t("orderStatus.cancelled")}
      </div>
    );
  }

  const currentIndex = stepKeys.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center justify-between">
      {stepKeys.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <div key={step.key} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <div className="absolute top-4 right-1/2 w-full h-0.5 bg-stone-200 -z-10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: i <= currentIndex ? "100%" : 0 }}
                  transition={{ duration: 0.6 }}
                  className="h-full bg-brand"
                />
              </div>
            )}
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                done ? "bg-brand text-white" : "bg-stone-100 text-stone-400"
              } ${step.key === status ? "pulse-ring" : ""}`}
            >
              <step.icon size={15} />
            </motion.div>
            <span
              className={`mt-2 text-[11px] text-center font-medium ${
                done ? "text-brand-dark" : "text-stone-400"
              }`}
            >
              {t(`orderStatus.${step.key}`)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
