import Link from "next/link";
import { cookies } from "next/headers";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, Settings, ExternalLink, Newspaper } from "lucide-react";
import { getSettings } from "@/lib/db/repo";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "@/lib/i18n/config";
import { settingsName } from "@/lib/i18n/localize";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const cookieStore = await cookies();
  const localeValue = cookieStore.get(COOKIE_NAME)?.value;
  const locale = isValidLocale(localeValue) ? localeValue : defaultLocale;
  const dict = getDictionary(locale);
  const name = settingsName(settings, locale);

  const links = [
    { href: "/admin", label: dict.admin.dashboard, icon: LayoutDashboard },
    { href: "/admin/menu", label: dict.admin.menu, icon: UtensilsCrossed },
    { href: "/admin/orders", label: dict.admin.orders, icon: ClipboardList },
    { href: "/admin/blog", label: dict.admin.blog, icon: Newspaper },
    { href: "/admin/settings", label: dict.admin.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex">
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-stone-900 text-stone-300 px-4 py-6">
        <div className="px-2 mb-8">
          <p className="font-display text-xl font-bold text-white">{name}</p>
          <p className="text-xs text-stone-500">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-stone-800 hover:text-white transition-colors"
            >
              <l.icon size={17} /> {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
        >
          <ExternalLink size={15} /> {dict.admin.viewSite}
        </Link>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between bg-stone-900 text-white px-4 py-3">
          <span className="font-display font-bold">{name} Admin</span>
        </div>
        <div className="md:hidden flex overflow-x-auto gap-2 bg-stone-900 px-3 pb-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-full bg-stone-800 text-stone-300 px-3 py-1.5 text-xs font-medium"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
