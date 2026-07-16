"use client";

import { motion } from "framer-motion";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "brand",
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: "brand" | "gold" | "accent";
}) {
  const colors = {
    brand: "bg-brand/10 text-brand",
    gold: "bg-gold/15 text-gold",
    accent: "bg-accent/10 text-accent",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100"
    >
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${colors[accent]}`}>
        <Icon size={19} />
      </div>
      <p className="mt-4 font-display text-2xl font-extrabold text-stone-800">{value}</p>
      <p className="text-xs text-stone-400 mt-1">{label}</p>
    </motion.div>
  );
}
