"use client";

import Link from "next/link";
import { Facebook, Instagram, MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { OpenStatusBadge } from "@/components/open-status";
import { useLocale } from "@/lib/i18n/locale-context";
import { settingsName, settingsDescription } from "@/lib/i18n/localize";
import type { RestaurantSettings } from "@/lib/db/types";

export function Footer({ settings }: { settings: RestaurantSettings }) {
  const { t, locale } = useLocale();
  const name = settingsName(settings, locale);
  const description = settingsDescription(settings, locale);

  return (
    <footer id="contact" aria-label="Footer" className="bg-stone-900 text-stone-300 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-2xl font-bold text-white mb-3">{name}</h3>
          <p className="text-sm text-stone-400 leading-relaxed">{description}</p>
          <div className="flex gap-3 mt-4">
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-9 w-9 flex items-center justify-center rounded-full bg-stone-800 hover:bg-brand transition-colors"
              >
                <Facebook size={16} aria-hidden="true" />
              </a>
            )}
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-9 w-9 flex items-center justify-center rounded-full bg-stone-800 hover:bg-brand transition-colors"
              >
                <Instagram size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{t("footer.links")}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/menu" className="hover:text-brand-light transition-colors">{t("nav.menu")}</Link></li>
            <li><Link href="/blog" className="hover:text-brand-light transition-colors">{t("nav.blog")}</Link></li>
            <li><Link href="/login" className="hover:text-brand-light transition-colors">{t("footer.login")}</Link></li>
            <li><Link href="/register" className="hover:text-brand-light transition-colors">{t("footer.register")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{t("footer.contact")}</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-brand-light shrink-0" />
              <a
                href={`https://www.google.com/maps?q=${settings.lat},${settings.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-light transition-colors underline-offset-2 hover:underline"
              >
                {settings.address}, {settings.city} · {t("footer.viewMap")}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-brand-light shrink-0" />
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-brand-light transition-colors">
                {settings.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={16} className="text-brand-light shrink-0" />
              <a
                href={`https://wa.me/${settings.phone.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-light transition-colors"
              >
                {t("footer.orderWhatsapp")}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={16} className="text-brand-light shrink-0" />
              {settings.openingHours}
            </li>
            <li>
              <OpenStatusBadge openingHours={settings.openingHours} />
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">{t("footer.delivery")}</h4>
          <p className="text-sm text-stone-400">
            {t("footer.deliveryFee")}: {settings.deliveryFee} {settings.currency}
            <br />
            {t("footer.minOrder")}: {settings.minOrder} {settings.currency}
          </p>
        </div>
      </div>
      <div className="border-t border-stone-800">
        <iframe
          title="map"
          src={`https://www.google.com/maps?q=${settings.lat},${settings.lng}&output=embed`}
          className="w-full h-56 grayscale-[40%] opacity-90"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="border-t border-stone-800 py-5 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {name}. {t("footer.rights")}
      </div>
    </footer>
  );
}
