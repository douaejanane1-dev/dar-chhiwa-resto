"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Banknote, Clock, CreditCard, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useLocale } from "@/lib/i18n/locale-context";
import type { RestaurantSettings } from "@/lib/db/types";

const LocationPicker = dynamic(
  () => import("./location-picker").then((m) => m.LocationPicker),
  { ssr: false, loading: () => <div className="h-72 w-full rounded-2xl shimmer" /> }
);

export function CheckoutForm({
  settings,
  defaultName,
}: {
  settings: RestaurantSettings;
  defaultName: string;
}) {
  const router = useRouter();
  const { lines, subtotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [coords, setCoords] = useState({ lat: settings.lat, lng: settings.lng });
  const { t } = useLocale();
  const [form, setForm] = useState({
    customerName: defaultName,
    customerPhone: "",
    label: "",
    details: "",
    city: settings.city,
    notes: "",
  });

  const sub = subtotal();
  const deliveryFee = sub >= settings.minOrder ? settings.deliveryFee : settings.deliveryFee + 5;
  const total = sub + deliveryFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;
    if (lines.length === 0) {
      toast.error(t("cart.empty"));
      return;
    }
    submittingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          items: lines.map((l) => ({
            menuItemId: l.menuItemId,
            name: l.name,
            price: l.price,
            qty: l.qty,
            image: l.image,
          })),
          paymentMethod,
          notes: form.notes,
          address: {
            label: form.label,
            details: form.details,
            city: form.city,
            phone: form.customerPhone,
            lat: coords.lat,
            lng: coords.lng,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || t("checkout.orderError"));
        return;
      }

      if (paymentMethod === "card") {
        const sessionRes = await fetch("/api/checkout/create-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.id }),
        });
        const sessionData = await sessionRes.json();
        if (!sessionRes.ok || !sessionData.url) {
          toast.error(sessionData.error || t("checkout.orderError"));
          // Order is already created (unpaid, COD-style fallback) — send them to confirmation.
          clear();
          router.push(`/order/${data.id}`);
          return;
        }
        toast.success(t("checkout.redirecting"));
        clear();
        window.location.href = sessionData.url;
        return;
      }

      clear();
      toast.success(t("checkout.orderSuccess"));
      router.push(`/order/${data.id}`);
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="text-center py-24 text-stone-400 dark:text-stone-500">
        <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
        {t("checkout.emptyCart")} <a href="/menu" className="text-brand font-semibold">{t("nav.menu")}</a>.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-stone-100 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
        >
          <h2 className="font-display text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">{t("checkout.yourInfo")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder={t("checkout.fullName")}
              aria-label={t("checkout.fullName")}
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder:text-stone-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <input
              required
              placeholder={t("checkout.phone")}
              aria-label={t("checkout.phone")}
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              className="rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder:text-stone-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-stone-100 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
        >
          <h2 className="font-display text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">{t("checkout.deliveryLocation")}</h2>
          <LocationPicker
            lat={coords.lat}
            lng={coords.lng}
            onChange={(lat, lng) => setCoords({ lat, lng })}
          />
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <input
              placeholder={t("checkout.label")}
              aria-label={t("checkout.label")}
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder:text-stone-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <input
              placeholder={t("checkout.city")}
              aria-label={t("checkout.city")}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder:text-stone-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <textarea
              required
              placeholder={t("checkout.addressDetails")}
              aria-label={t("checkout.addressDetails")}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              className="sm:col-span-2 rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder:text-stone-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
              rows={2}
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-stone-100 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm"
        >
          <h2 className="font-display text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">{t("checkout.paymentMethod")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <PaymentOption
              icon={Banknote}
              label={t("checkout.cod")}
              active={paymentMethod === "cod"}
              onClick={() => setPaymentMethod("cod")}
            />
            <PaymentOption
              icon={CreditCard}
              label={t("checkout.card")}
              active={paymentMethod === "card"}
              onClick={() => setPaymentMethod("card")}
            />
          </div>
          {paymentMethod === "card" && (
            <p className="mt-3 text-xs text-stone-400 dark:text-stone-500">{t("checkout.cardNote")}</p>
          )}
          <textarea
            placeholder={t("checkout.notes")}
            aria-label={t("checkout.notes")}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="mt-4 w-full rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder:text-stone-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            rows={2}
          />
        </motion.section>
      </div>

      <motion.aside
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="h-fit rounded-2xl border border-stone-100 dark:border-white/10 bg-white dark:bg-surface p-6 shadow-sm sticky top-24"
      >
        <h2 className="font-display text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">{t("checkout.orderSummary")}</h2>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1">
          {lines.map((l) => (
            <div key={l.menuItemId} className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800">
                <Image src={l.image} alt={l.name} fill unoptimized className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-700 dark:text-stone-200 truncate">{l.name}</p>
                <p className="text-xs text-stone-400 dark:text-stone-500">x{l.qty}</p>
              </div>
              <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">{l.price * l.qty} MAD</span>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2 border-t border-stone-100 dark:border-white/10 pt-4 text-sm">
          <div className="flex items-center justify-between text-xs text-stone-400 dark:text-stone-500">
            <span className="inline-flex items-center gap-1">
              <Clock size={13} aria-hidden="true" /> {t("cart.estimatedDelivery")}
            </span>
            <span className="font-semibold">~30 min</span>
          </div>
          <div className="flex justify-between text-stone-500 dark:text-stone-400">
            <span>{t("cart.subtotal")}</span>
            <span>{sub} MAD</span>
          </div>
          <div className="flex justify-between text-stone-500 dark:text-stone-400">
            <span>{t("checkout.delivery")}</span>
            <span>{deliveryFee} MAD</span>
          </div>
          <div className="flex justify-between font-display text-base font-bold text-brand-dark pt-2 border-t border-stone-100 dark:border-white/10">
            <span>{t("checkout.total")}</span>
            <span>{total} MAD</span>
          </div>
        </div>
        <button
          disabled={loading}
          aria-busy={loading}
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 font-semibold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : t("checkout.confirmOrder")}
        </button>
      </motion.aside>
    </form>
  );
}

function PaymentOption({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-3 rounded-xl border-2 p-4 text-sm font-semibold transition-colors ${
        active ? "border-brand bg-brand/5 text-brand-dark" : "border-stone-200 dark:border-white/10 text-stone-500 dark:text-stone-400 hover:border-stone-300 dark:hover:border-white/20"
      }`}
    >
      <Icon size={20} aria-hidden="true" />
      {label}
    </button>
  );
}
