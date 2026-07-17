"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, UserRound, LogOut, Sun, Moon } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/lib/cart-store";
import { useLocale } from "@/lib/i18n/locale-context";
import { useTheme } from "@/lib/theme/theme-context";
import { settingsName } from "@/lib/i18n/localize";
import { LanguageSwitcher } from "./language-switcher";
import type { RestaurantSettings } from "@/lib/db/types";

export function Navbar({ settings }: { settings: RestaurantSettings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const openCart = useCart((s) => s.open);
  const count = useCart((s) => s.count());
  const { t, locale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const name = settingsName(settings, locale);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/menu", label: t("nav.menu") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/#about", label: t("nav.about") },
    { href: "/#contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 glass border-b border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.span
              whileHover={{ rotate: -8, scale: 1.08 }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white font-display text-lg shadow-md"
            >
              {name.charAt(0)}
            </motion.span>
            <span className="font-display text-lg font-bold tracking-tight text-brand-dark">
              {name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => {
              const isActive = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href.split("#")[0]) && l.href !== "/#about" && l.href !== "/#contact";
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 rtl:after:left-auto rtl:after:right-0 after:h-[2px] after:bg-brand after:transition-all ${
                    isActive
                      ? "text-brand after:w-full"
                      : "text-stone-700 dark:text-stone-200 hover:text-brand after:w-0 hover:after:w-full"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors"
            >
              {theme === "dark" ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            </button>
            <LanguageSwitcher />

            {session?.user ? (
              <div className="hidden sm:flex items-center gap-2">
                {session.user.role === "admin" ? (
                  <Link
                    href="/admin"
                    className="text-sm font-semibold text-brand-dark hover:underline"
                  >
                    {t("nav.admin")}
                  </Link>
                ) : (
                  <Link
                    href="/account/orders"
                    className="text-sm font-semibold text-stone-700 dark:text-stone-200 hover:text-brand flex items-center gap-1"
                  >
                    <UserRound size={16} /> {session.user.name?.split(" ")[0]}
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-stone-400 hover:text-brand-dark transition-colors focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded"
                  title={t("nav.logout")}
                  aria-label={t("nav.logout")}
                >
                  <LogOut size={16} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:block text-sm font-semibold text-stone-700 dark:text-stone-200 hover:text-brand"
              >
                {t("nav.login")}
              </Link>
            )}

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={openCart}
              aria-label={`${t("nav.cart")} (${count})`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 hover:bg-brand-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
            >
              <ShoppingBag size={18} aria-hidden="true" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 rtl:-right-auto rtl:-left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-stone-900"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <button
              className="md:hidden text-stone-700 dark:text-stone-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand rounded"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
              aria-expanded={open}
              aria-controls="mobile-nav-menu"
            >
              {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-black/5 dark:border-white/10 bg-white/90 dark:bg-stone-900/95"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-brand/10"
                >
                  {l.label}
                </Link>
              ))}
              {session?.user ? (
                <>
                  <Link
                    href={session.user.role === "admin" ? "/admin" : "/account/orders"}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-brand/10"
                  >
                    {session.user.role === "admin" ? t("nav.admin") : t("nav.myOrders")}
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-left rtl:text-right rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    {t("nav.logout")}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-brand/10"
                >
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
