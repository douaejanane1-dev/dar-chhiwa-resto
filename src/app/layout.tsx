import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { getSettings } from "@/lib/db/repo";
import { COOKIE_NAME, defaultLocale, dirForLocale, isValidLocale, type Locale } from "@/lib/i18n/config";
import { THEME_COOKIE_NAME, defaultTheme, isValidTheme, type Theme } from "@/lib/theme/config";
import { settingsName, settingsTagline, settingsDescription } from "@/lib/i18n/localize";
import { getSiteUrl } from "@/lib/site-url";
import { StructuredData } from "@/components/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  const locale = await getServerLocale();
  const name = settingsName(settings, locale);
  const tagline = settingsTagline(settings, locale);
  const description = settingsDescription(settings, locale);
  const base = getSiteUrl();
  const title = `${name} | ${tagline}`;
  const coverUrl = settings.coverImage ? `${base}${settings.coverImage}` : undefined;

  return {
    metadataBase: new URL(base),
    title: { default: title, template: `%s | ${name}` },
    description,
    keywords: ["restaurant", "livraison", "delivery", "Morocco", "Maroc", name],
    alternates: {
      canonical: base,
      languages: { fr: base, en: base, ar: base },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: base,
      siteName: name,
      images: coverUrl ? [{ url: coverUrl, width: 1200, height: 630, alt: name }] : undefined,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverUrl ? [coverUrl] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  return isValidLocale(value) ? value : defaultLocale;
}

async function getServerTheme(): Promise<Theme> {
  const cookieStore = await cookies();
  const value = cookieStore.get(THEME_COOKIE_NAME)?.value;
  return isValidTheme(value) ? value : defaultTheme;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = getSettings();
  const locale = await getServerLocale();
  const theme = await getServerTheme();
  const dir = dirForLocale(locale);
  const base = getSiteUrl();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.name,
    url: base,
    logo: `${base}${settings.logo}`,
    sameAs: [settings.instagram, settings.facebook].filter(Boolean),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.name,
    url: base,
  };

  const skipLabel = locale === "ar" ? "الانتقال إلى المحتوى" : locale === "fr" ? "Aller au contenu" : "Skip to content";

  return (
    <html
      lang={locale}
      dir={dir}
      data-scroll-behavior="smooth"
      className={`h-full antialiased${theme === "dark" ? " dark" : ""}`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a href="#main-content" className="skip-link">
          {skipLabel}
        </a>
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
        <Providers initialLocale={locale} initialTheme={theme}>
          <Navbar settings={settings} />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer settings={settings} />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
