import type { Locale } from "./config";
import type { BlogPost, Category, MenuItem, RestaurantSettings } from "@/lib/db/types";

export function localizedField(
  base: string,
  ar: string,
  en: string,
  locale: Locale
): string {
  if (locale === "ar") return ar || base;
  if (locale === "en") return en || base;
  return base;
}

export function categoryName(cat: Category, locale: Locale) {
  return localizedField(cat.name, cat.nameAr, cat.nameEn, locale);
}

export function itemName(item: MenuItem, locale: Locale) {
  return localizedField(item.name, item.nameAr, item.nameEn, locale);
}

export function itemDescription(item: MenuItem, locale: Locale) {
  return localizedField(item.description, item.descriptionAr, item.descriptionEn, locale);
}

export function settingsName(s: RestaurantSettings, locale: Locale) {
  return localizedField(s.name, s.nameAr, s.nameEn, locale);
}

export function settingsTagline(s: RestaurantSettings, locale: Locale) {
  return localizedField(s.tagline, s.taglineAr, s.taglineEn, locale);
}

export function settingsDescription(s: RestaurantSettings, locale: Locale) {
  return localizedField(s.description, s.descriptionAr, s.descriptionEn, locale);
}

export function postTitle(p: BlogPost, locale: Locale) {
  return localizedField(p.title, p.titleAr, p.titleEn, locale);
}

export function postExcerpt(p: BlogPost, locale: Locale) {
  return localizedField(p.excerpt, p.excerptAr, p.excerptEn, locale);
}

export function postContent(p: BlogPost, locale: Locale) {
  return localizedField(p.content, p.contentAr, p.contentEn, locale);
}
