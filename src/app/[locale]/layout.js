import { notFound } from "next/navigation";
import { locales, getDictionary } from "@/i18n/dictionaries";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppButton from "@/components/WhatsAppButton";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <div lang={locale} className="min-h-screen flex flex-col">
      <SiteHeader locale={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={locale} dict={dict} />
      <WhatsAppButton locale={locale} />
    </div>
  );
}
