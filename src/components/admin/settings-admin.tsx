"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useLocale } from "@/lib/i18n/locale-context";
import type { RestaurantSettings } from "@/lib/db/types";

export function SettingsAdmin({ initialSettings }: { initialSettings: RestaurantSettings }) {
  const [form, setForm] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const { t } = useLocale();

  function set<K extends keyof RestaurantSettings>(key: K, value: RestaurantSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        toast.error(t("common.error"));
        return;
      }
      toast.success(t("admin.settingsSaved"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-100 space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label={`${t("admin.restaurantName")} (FR)`} value={form.name} onChange={(v) => set("name", v)} />
        <Field label={`${t("admin.restaurantName")} (EN)`} value={form.nameEn} onChange={(v) => set("nameEn", v)} />
        <Field label={`${t("admin.restaurantName")} (AR)`} value={form.nameAr} onChange={(v) => set("nameAr", v)} dir="rtl" />
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label={`${t("admin.tagline")} (FR)`} value={form.tagline} onChange={(v) => set("tagline", v)} />
        <Field label={`${t("admin.tagline")} (EN)`} value={form.taglineEn} onChange={(v) => set("taglineEn", v)} />
        <Field label={`${t("admin.tagline")} (AR)`} value={form.taglineAr} onChange={(v) => set("taglineAr", v)} dir="rtl" />
      </div>
      <TextAreaField label={`${t("admin.description2")} (FR)`} value={form.description} onChange={(v) => set("description", v)} />
      <div className="grid sm:grid-cols-2 gap-4">
        <TextAreaField label={`${t("admin.description2")} (EN)`} value={form.descriptionEn} onChange={(v) => set("descriptionEn", v)} />
        <TextAreaField label={`${t("admin.description2")} (AR)`} value={form.descriptionAr} onChange={(v) => set("descriptionAr", v)} dir="rtl" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t("admin.phone")} value={form.phone} onChange={(v) => set("phone", v)} />
        <Field label={t("admin.email")} value={form.email} onChange={(v) => set("email", v)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t("admin.address")} value={form.address} onChange={(v) => set("address", v)} />
        <Field label={t("admin.city")} value={form.city} onChange={(v) => set("city", v)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t("admin.hours")} value={form.openingHours} onChange={(v) => set("openingHours", v)} />
        <Field label={t("admin.currency")} value={form.currency} onChange={(v) => set("currency", v)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <NumField label={t("admin.deliveryFee")} value={form.deliveryFee} onChange={(v) => set("deliveryFee", v)} />
        <NumField label={t("admin.minOrder")} value={form.minOrder} onChange={(v) => set("minOrder", v)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Instagram" value={form.instagram || ""} onChange={(v) => set("instagram", v)} />
        <Field label="Facebook" value={form.facebook || ""} onChange={(v) => set("facebook", v)} />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-60"
      >
        {saving ? "..." : t("admin.saveSettings")}
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  dir?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-stone-500">{label}</label>
      <input
        dir={dir}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
      />
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-xs font-semibold text-stone-500">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  dir?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-stone-500">{label}</label>
      <textarea
        dir={dir}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
      />
    </div>
  );
}
