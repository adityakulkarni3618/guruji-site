import { getDictionary } from "@/i18n/dictionaries";
import VastuChecker from "@/components/VastuChecker";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "mr";
  const dict = getDictionary(locale);
  return {
    title: `${dict.nav.vastu} — ${dict.home.heroTitle}`,
    description: dict.vastu.subtitle,
  };
}

export default async function VastuPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "mr";
  const dict = getDictionary(locale);

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-2 font-display">{dict.vastu.title}</h1>
      <p className="text-cream-dim mb-8 text-sm md:text-base">{dict.vastu.subtitle}</p>

      <VastuChecker dict={dict} locale={locale} />
    </div>
  );
}
