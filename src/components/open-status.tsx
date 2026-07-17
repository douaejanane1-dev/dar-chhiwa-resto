"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-context";
import { parseOpeningHoursRange } from "@/lib/opening-hours";

export function OpenStatusBadge({ openingHours }: { openingHours: string }) {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const range = parseOpeningHoursRange(openingHours);
    if (!range) return;
    const update = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      setIsOpen(minutes >= range.startMinutes && minutes <= range.endMinutes);
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [openingHours]);

  if (isOpen === null) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isOpen ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
        aria-hidden="true"
      />
      {isOpen ? t("footer.openNow") : t("footer.closedNow")}
    </span>
  );
}
