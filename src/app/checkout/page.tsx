import { cookies } from "next/headers";
import { auth } from "@/auth";
import { getSettings } from "@/lib/db/repo";
import { CheckoutForm } from "@/components/checkout-form";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { COOKIE_NAME, defaultLocale, isValidLocale } from "@/lib/i18n/config";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const settings = getSettings();
  const session = await auth();
  const cookieStore = await cookies();
  const localeValue = cookieStore.get(COOKIE_NAME)?.value;
  const locale = isValidLocale(localeValue) ? localeValue : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="font-display text-3xl font-extrabold text-stone-800 dark:text-stone-100 mb-2">
        {dict.checkout.title}
      </h1>
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-10">{dict.checkout.subtitle}</p>
      <CheckoutForm
        settings={settings}
        defaultName={session?.user?.name || ""}
      />
    </div>
  );
}
