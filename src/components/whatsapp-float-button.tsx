"use client";

import { MessageCircle } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

export function WhatsappFloatButton({ phone }: { phone: string }) {
  const { t } = useLocale();
  const digits = phone.replace(/[^\d]/g, "");
  const href = `https://wa.me/${digits}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("footer.orderWhatsapp")}
      title={t("footer.orderWhatsapp")}
      className="fixed bottom-5 right-5 rtl:right-auto rtl:left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <MessageCircle size={26} aria-hidden="true" />
    </a>
  );
}
