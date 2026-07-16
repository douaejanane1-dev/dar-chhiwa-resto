"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const { t } = useLocale();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      toast.error(t("auth.invalidCredentials"));
    } else {
      toast.success(t("auth.signInSuccess"));
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-5"
    >
      <div>
        <label htmlFor="login-email" className="text-sm font-semibold text-stone-700">{t("auth.email")}</label>
        <div className="relative mt-1">
          <Mail size={16} aria-hidden="true" className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            id="login-email"
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-stone-200 py-3 pl-10 pr-4 rtl:pl-4 rtl:pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            placeholder="email@domain.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="login-password" className="text-sm font-semibold text-stone-700">{t("auth.password")}</label>
        <div className="relative mt-1">
          <Lock size={16} aria-hidden="true" className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            id="login-password"
            required
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-stone-200 py-3 pl-10 pr-4 rtl:pl-4 rtl:pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            placeholder="••••••••"
          />
        </div>
      </div>
      <button
        disabled={loading}
        aria-busy={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-3.5 font-semibold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-colors disabled:opacity-60"
      >
        <LogIn size={17} aria-hidden="true" /> {loading ? "..." : t("auth.signIn")}
      </button>
      <p className="text-center text-sm text-stone-500">
        {t("auth.noAccount")}{" "}
        <Link href="/register" className="font-semibold text-brand hover:underline">
          {t("auth.signUpNow")}
        </Link>
      </p>
      <div className="rounded-xl bg-stone-50 border border-stone-100 p-3 text-xs text-stone-500">
        <p className="font-semibold text-stone-600 mb-1">{t("auth.demoAccounts")}</p>
        Admin: admin@darchhiwa.ma / admin123
        <br />
        Client: client@darchhiwa.ma / client123
      </div>
    </motion.form>
  );
}

export default function LoginPage() {
  const { t } = useLocale();
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-extrabold text-stone-800">{t("auth.welcomeBack")}</h1>
          <p className="mt-1 text-sm text-stone-500">{t("auth.signInSubtitle")}</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
