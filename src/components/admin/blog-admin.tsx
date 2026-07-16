"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";
import { postTitle } from "@/lib/i18n/localize";
import type { BlogPost } from "@/lib/db/types";

export function BlogAdmin({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [modal, setModal] = useState<BlogPost | "new" | null>(null);
  const { t, locale } = useLocale();

  async function refresh() {
    const res = await fetch("/api/admin/blog");
    setPosts(await res.json());
  }

  async function deletePost(id: string) {
    if (!confirm(t("admin.confirmDeletePost"))) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success(t("admin.deleted"));
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModal("new")}
          className="flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
        >
          <Plus size={16} aria-hidden="true" /> {t("admin.addPost")}
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white dark:bg-surface shadow-sm ring-1 ring-stone-100 dark:ring-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 dark:border-white/10 text-left text-xs uppercase tracking-wide text-stone-400">
              <th className="p-4">{t("admin.postCover")}</th>
              <th className="p-4">{t("admin.postTitle")}</th>
              <th className="p-4">{t("admin.status")}</th>
              <th className="p-4">{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-stone-50 dark:border-white/5 last:border-0">
                <td className="p-4">
                  <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <Image src={post.coverImage} alt={postTitle(post, locale)} fill unoptimized className="object-cover" />
                  </div>
                </td>
                <td className="p-4 font-medium text-stone-700 dark:text-stone-200">{postTitle(post, locale)}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      post.published ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {post.published ? t("admin.published") : t("admin.draft")}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setModal(post)}
                      aria-label={`${t("common.edit")} ${postTitle(post, locale)}`}
                      className="text-stone-400 hover:text-brand"
                    >
                      <Pencil size={15} aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      aria-label={`${t("common.delete")} ${postTitle(post, locale)}`}
                      className="text-stone-400 hover:text-red-500"
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-stone-400">
                  {t("admin.noPosts")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {modal && (
          <PostModal
            post={modal === "new" ? null : modal}
            onClose={() => setModal(null)}
            onSaved={refresh}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PostModal({
  post,
  onClose,
  onSaved,
}: {
  post: BlogPost | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLocale();
  const [form, setForm] = useState({
    title: post?.title || "",
    titleAr: post?.titleAr || "",
    titleEn: post?.titleEn || "",
    excerpt: post?.excerpt || "",
    excerptAr: post?.excerptAr || "",
    excerptEn: post?.excerptEn || "",
    content: post?.content || "",
    contentAr: post?.contentAr || "",
    contentEn: post?.contentEn || "",
    coverImage: post?.coverImage || "",
    author: post?.author || "Dar Chhiwa",
    published: post?.published ?? false,
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
    if (res.ok) setForm((f) => ({ ...f, coverImage: data.url }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = post ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
      const method = post ? "PUT" : "POST";
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
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-surface p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-bold text-stone-800 dark:text-stone-100">
            {post ? t("admin.editPost") : t("admin.newPost")}
          </h3>
          <button onClick={onClose} aria-label={t("common.close")} className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <input
              placeholder={t("admin.titleFr")}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <input
              placeholder={t("admin.titleAr")}
              dir="rtl"
              value={form.titleAr}
              onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              className="rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <input
              placeholder={t("admin.titleEn")}
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              className="rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <textarea
              placeholder={t("admin.excerptFr")}
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <textarea
              placeholder={t("admin.excerptAr")}
              dir="rtl"
              rows={2}
              value={form.excerptAr}
              onChange={(e) => setForm({ ...form, excerptAr: e.target.value })}
              className="rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <textarea
              placeholder={t("admin.excerptEn")}
              rows={2}
              value={form.excerptEn}
              onChange={(e) => setForm({ ...form, excerptEn: e.target.value })}
              className="rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <textarea
              placeholder={t("admin.contentFr")}
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <textarea
              placeholder={t("admin.contentAr")}
              dir="rtl"
              rows={5}
              value={form.contentAr}
              onChange={(e) => setForm({ ...form, contentAr: e.target.value })}
              className="rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <textarea
              placeholder={t("admin.contentEn")}
              rows={5}
              value={form.contentEn}
              onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
              className="rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder={t("admin.author")}
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900 dark:text-stone-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700 dark:text-stone-200">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="h-4 w-4 rounded border-stone-300"
              />
              {t("admin.published")}
            </label>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-500 dark:text-stone-400">{t("admin.postCover")}</label>
            <div className="mt-1 flex items-center gap-3">
              {form.coverImage && (
                <div className="relative h-14 w-20 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
                  <Image src={form.coverImage} alt="" fill unoptimized className="object-cover" />
                </div>
              )}
              <label className="flex-1 cursor-pointer rounded-xl border border-dashed border-stone-300 dark:border-white/20 px-3 py-2 text-center text-xs text-stone-500 dark:text-stone-400 hover:border-brand">
                {uploading ? t("common.loading") : t("admin.uploadImage")}
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            aria-busy={saving}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-3 font-semibold text-white hover:bg-brand-dark transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : t("admin.savePost")}
          </button>
        </div>
      </motion.div>
    </>
  );
}
