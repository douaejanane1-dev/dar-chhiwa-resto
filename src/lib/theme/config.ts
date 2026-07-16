export const THEME_COOKIE_NAME = "resto-theme";
export type Theme = "light" | "dark";
export const defaultTheme: Theme = "light";

export function isValidTheme(value: string | undefined): value is Theme {
  return value === "light" || value === "dark";
}
