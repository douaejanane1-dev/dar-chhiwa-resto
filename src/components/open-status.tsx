"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/locale-context";

function parseRange(text: string): { start: number; end: number } | null {
  const match = text.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const [, sh, sm, eh, em] = match;
  return {
    start: parseInt(sh, 10) * 60 + parseInt(sm, 10),
    end: parseInt(eh, 10) * 60 + parseInt(em, 10),
  };
}

export function OpenStatusBadge({ openingHours }: { openingHours: string }) {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const range = parseRange(openingHours);
    if (!range) return;
    const update = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      setIsOpen(minutes >= range.start && minutes <= range.end);
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
