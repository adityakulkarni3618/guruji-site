import { getDictionary } from "@/i18n/dictionaries";
import { getPanchangToday } from "@/lib/getPanchangToday";
import { DEFAULT_LOCATION } from "@/lib/panchang";
import PanchangCard from "@/components/PanchangCard";

export default async function PanchangPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const panchang = await getPanchangToday();

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-2">{dict.panchang.title}</h1>
      <p className="text-cream-dim mb-8">
        {dict.panchang.location}: {DEFAULT_LOCATION.name}
      </p>

      <div className="flex justify-center">
        <PanchangCard dict={dict} data={panchang} locale={locale} />
      </div>

      <p className="text-cream-dim text-xs text-center mt-6">
        Panchang is calculated automatically each day based on precise sun & moon positions,
        and may be adjusted by Guruji when required.
      </p>
    </div>
  );
}
