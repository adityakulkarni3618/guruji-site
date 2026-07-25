import { getDictionary } from "@/i18n/dictionaries";
import { getDailyShlokas } from "@/lib/content";
import ShlokaCard from "@/components/ShlokaCard";

export default async function ShlokasPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const shlokas = await getDailyShlokas();

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-2 font-display">{dict.shlokas.title}</h1>
      <p className="text-cream-dim mb-10 text-sm md:text-base">{dict.shlokas.subtitle}</p>

      {shlokas.length === 0 ? (
        <p className="text-cream-dim plaque p-6 text-center">{dict.shlokas.noShlokas}</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {shlokas.map((s) => (
            <div key={s.id} className="flex justify-center w-full">
              {/* Reuse ShlokaCard for premium aesthetics, passing shloka data */}
              <ShlokaCard data={s} locale={locale} dict={dict} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
