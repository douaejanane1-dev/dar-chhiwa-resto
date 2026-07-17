"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { UserPlus, Mail, Lock, User, Phone } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const { t } = useLocale();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || t("auth.genericError"));
        return;
      }
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      toast.success(t("auth.accountCreated"));
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-extrabold text-stone-800 dark:text-stone-100">{t("auth.createAccount")}</h1>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{t("auth.createAccountSubtitle")}</p>
        </div>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Field id="register-name" icon={User} label={t("auth.fullName")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Ahmed Alami" />
          <Field id="register-email" icon={Mail} label={t("auth.email")} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="email@domain.com" />
          <Field id="register-phone" icon={Phone} label={t("auth.phoneOptional")} value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+212 6 00 00 00 00" optional />
          <Field id="register-password" icon={Lock} label={t("auth.password")} type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} placeholder="••••••••" />

          <button
            disabled={loading}
            aria-busy={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand py-3.5 font-semibold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-colors disabled:opacity-60"
          >
            <UserPlus size={17} aria-hidden="true" /> {loading ? "..." : t("auth.createAccount")}
          </button>
          <p className="text-center text-sm text-stone-500 dark:text-stone-400">
            {t("auth.haveAccount")}{" "}
            <Link href="/login" className="font-semibold text-brand hover:underline">
              {t("auth.signIn")}
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}

function Field({
  id,
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  optional = false,
}: {
  id: string;
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  optional?: boolean;
}) {
  const autoComplete =
    type === "password" ? "new-password" : type === "email" ? "email" : type === "tel" ? "tel" : "off";
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-stone-700 dark:text-stone-200">{label}</label>
      <div className="relative mt-1">
        <Icon size={16} aria-hidden="true" className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
        <input
          id={id}
          required={!optional}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-stone-200 dark:border-white/10 dark:bg-stone-900/40 dark:text-stone-100 dark:placeholder:text-stone-500 py-3 pl-10 pr-4 rtl:pl-4 rtl:pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
        />
      </div>
    </div>
  );
}
