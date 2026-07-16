"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Loader2, Tag, UtensilsCrossed } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { categoryName, itemName } from "@/lib/i18n/localize";
import type { Category, MenuItem } from "@/lib/db/types";

type Tab = "items" | "categories";

export function MenuAdmin({
  initialCategories,
  initialItems,
}: {
  initialCategories: Category[];
  initialItems: MenuItem[];
}) {
  const [tab, setTab] = useState<Tab>("items");
  const [categories, setCategories] = useState(initialCategories);
  const [items, setItems] = useState(initialItems);
  const [itemModal, setItemModal] = useState<MenuItem | "new" | null>(null);
  const [catModal, setCatModal] = useState<Category | "new" | null>(null);
  const { t, locale } = useLocale();

  async function refreshCategories() {
    const res = await fetch("/api/admin/categories");
    setCategories(await res.json());
  }
  async function refreshItems() {
    const res = await fetch("/api/admin/menu-items");
    setItems(await res.json());
  }

  async function deleteItem(id: string) {
    if (!confirm(t("admin.confirmDeleteDish"))) return;
    await fetch(`/api/admin/menu-items/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success(t("admin.deleted"));
  }

  async function deleteCategory(id: string) {
    if (!confirm(t("admin.confirmDeleteCategory"))) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setItems((prev) => prev.filter((i) => i.categoryId !== id));
    toast.success(t("admin.deleted"));
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <TabButton active={tab === "items"} onClick={() => setTab("items")} icon={UtensilsCrossed} label={t("admin.dishes")} />
        <TabButton active={tab === "categories"} onClick={() => setTab("categories")} icon={Tag} label={t("admin.categories")} />
      </div>

      {tab === "items" ? (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setItemModal("new")}
              className="flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
            >
              <Plus size={16} /> {t("admin.addDish")}
            </button>
          </div>
          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-stone-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left rtl:text-right text-xs text-stone-400">
                  <th className="p-4">{t("admin.dish")}</th>
                  <th className="p-4">{t("admin.category")}</th>
                  <th className="p-4">{t("admin.price")}</th>
                  <th className="p-4">{t("admin.status")}</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-stone-50 hover:bg-stone-50/50">
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                        <Image src={item.image} alt={itemName(item, locale)} fill unoptimized className="object-cover" />
                      </div>
                      <span className="font-medium text-stone-700">{itemName(item, locale)}</span>
                    </td>
                    <td className="p-4 text-stone-500">
                      {(() => {
                        const c = categories.find((c) => c.id === item.categoryId);
                        return c ? categoryName(c, locale) : "-";
                      })()}
                    </td>
                    <td className="p-4 font-semibold text-brand-dark">{item.price} MAD</td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.isAvailable ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {item.isAvailable ? t("admin.available") : t("admin.unavailable")}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setItemModal(item)} aria-label={`${t("common.edit")} ${itemName(item, locale)}`} className="text-stone-400 hover:text-brand">
                          <Pencil size={15} aria-hidden="true" />
                        </button>
                        <button onClick={() => deleteItem(item.id)} aria-label={`${t("common.delete")} ${itemName(item, locale)}`} className="text-stone-400 hover:text-red-500">
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setCatModal("new")}
              className="flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
            >
              <Plus size={16} /> {t("admin.addCategory")}
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-stone-800">{categoryName(c, locale)}</p>
                  <p className="text-xs text-stone-400">{c.nameAr}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCatModal(c)} aria-label={`${t("common.edit")} ${categoryName(c, locale)}`} className="text-stone-400 hover:text-brand">
                    <Pencil size={15} aria-hidden="true" />
                  </button>
                  <button onClick={() => deleteCategory(c.id)} aria-label={`${t("common.delete")} ${categoryName(c, locale)}`} className="text-stone-400 hover:text-red-500">
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {itemModal && (
          <ItemModal
            item={itemModal === "new" ? null : itemModal}
            categories={categories}
            onClose={() => setItemModal(null)}
            onSaved={refreshItems}
          />
        )}
        {catModal && (
          <CategoryModal
            category={catModal === "new" ? null : catModal}
            onClose={() => setCatModal(null)}
            onSaved={refreshCategories}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active ? "bg-brand text-white" : "bg-white text-stone-500 ring-1 ring-stone-200 hover:text-brand"
      }`}
    >
      <Icon size={15} /> {label}
    </button>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {children}
      </motion.div>
    </>
  );
}

function ItemModal({
  item,
  categories,
  onClose,
  onSaved,
}: {
  item: MenuItem | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t, locale } = useLocale();
  const [form, setForm] = useState({
    name: item?.name || "",
    nameAr: item?.nameAr || "",
    nameEn: item?.nameEn || "",
    description: item?.description || "",
    descriptionAr: item?.descriptionAr || "",
    descriptionEn: item?.descriptionEn || "",
    price: item?.price || 0,
    categoryId: item?.categoryId || categories[0]?.id || "",
    image: item?.image || "",
    isAvailable: item?.isAvailable ?? true,
    isFeatured: item?.isFeatured ?? false,
    spicyLevel: item?.spicyLevel ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (res.ok) setForm((f) => ({ ...f, image: data.url }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = item ? `/api/admin/menu-items/${item.id}` : "/api/admin/menu-items";
      const method = item ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags: [] }),
      });
      if (!res.ok) {
        toast.error(t("common.error"));
        return;
      }
      toast.success(t("admin.saved"));
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg font-bold text-stone-800">
          {item ? t("admin.editDish") : t("admin.newDish")}
        </h3>
        <button onClick={onClose} aria-label={t("common.close")} className="text-stone-400 hover:text-stone-700">
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder={t("admin.nameFr")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
          <input
            placeholder={t("admin.nameEn")}
            value={form.nameEn}
            onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>
        <input
          placeholder={t("admin.nameAr")}
          value={form.nameAr}
          onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
          className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
          dir="rtl"
        />
        <textarea
          placeholder={`${t("admin.description")} (FR)`}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
          rows={2}
        />
        <div className="grid grid-cols-2 gap-3">
          <textarea
            placeholder={`${t("admin.description")} (EN)`}
            value={form.descriptionEn}
            onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
            className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            rows={2}
          />
          <textarea
            placeholder={`${t("admin.description")} (AR)`}
            value={form.descriptionAr}
            onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
            className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            dir="rtl"
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder={`${t("admin.price")} (MAD)`}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {categoryName(c, locale)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-500">{t("admin.image")}</label>
          <div className="flex items-center gap-3 mt-1">
            {form.image && (
              <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                <Image src={form.image} alt="preview" fill unoptimized className="object-cover" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleUpload} className="text-xs" />
            {uploading && <Loader2 size={16} className="animate-spin text-brand" />}
          </div>
          <input
            placeholder={t("admin.orUseLink")}
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="mt-2 w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>

        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
            />
            {t("admin.available")}
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            />
            {t("admin.featured")}
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-2 rounded-full bg-brand py-3 font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {saving ? "..." : t("admin.save")}
        </button>
      </div>
    </Modal>
  );
}

function CategoryModal({
  category,
  onClose,
  onSaved,
}: {
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLocale();
  const [form, setForm] = useState({
    name: category?.name || "",
    nameAr: category?.nameAr || "",
    nameEn: category?.nameEn || "",
    icon: category?.icon || "utensils",
    order: category?.order || 0,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const url = category ? `/api/admin/categories/${category.id}` : "/api/admin/categories";
      const method = category ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        toast.error(t("common.error"));
        return;
      }
      toast.success(t("admin.saved"));
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg font-bold text-stone-800">
          {category ? t("admin.editCategory") : t("admin.newCategory")}
        </h3>
        <button onClick={onClose} aria-label={t("common.close")} className="text-stone-400 hover:text-stone-700">
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder={t("admin.nameFr")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
          <input
            placeholder={t("admin.nameEn")}
            value={form.nameEn}
            onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>
        <input
          placeholder={t("admin.nameAr")}
          value={form.nameAr}
          onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
          dir="rtl"
          className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
        />
        <input
          type="number"
          placeholder={t("admin.order")}
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
          className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-2 rounded-full bg-brand py-3 font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {saving ? "..." : t("admin.save")}
        </button>
      </div>
    </Modal>
  );
}
