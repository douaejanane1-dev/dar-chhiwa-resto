import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand">
        <UtensilsCrossed size={36} />
      </div>
      <h1 className="font-display text-4xl font-extrabold text-stone-800 dark:text-stone-100">404</h1>
      <p className="mt-2 text-stone-500 dark:text-stone-400 max-w-sm">
        Page introuvable / الصفحة غير موجودة / Page not found
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 font-semibold text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-colors"
      >
        Retour à l&apos;accueil / الرئيسية / Home
      </Link>
    </div>
  );
}
