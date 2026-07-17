/**
 * Parses a free-text opening-hours string like "Tous les jours: 11h00 - 23h30"
 * or "11:00 - 23:30" into a structured HH:MM range.
 * Shared by the live open/closed badge and the Restaurant JSON-LD schema.
 */
export function parseOpeningHoursRange(
  text: string
): { open: string; close: string; startMinutes: number; endMinutes: number } | null {
  const match = text.match(/(\d{1,2})[:h](\d{2})\s*-\s*(\d{1,2})[:h](\d{2})/);
  if (!match) return null;
  const [, sh, sm, eh, em] = match;
  const pad = (n: string) => n.padStart(2, "0");
  return {
    open: `${pad(sh)}:${sm}`,
    close: `${pad(eh)}:${em}`,
    startMinutes: parseInt(sh, 10) * 60 + parseInt(sm, 10),
    endMinutes: parseInt(eh, 10) * 60 + parseInt(em, 10),
  };
}
