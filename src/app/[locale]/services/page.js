import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import { getServices, pickLang } from "@/lib/content";

export default async function ServicesPage({ params, searchParams }) {
  const { locale } = await params;
  const { category } = await searchParams;
  const dict = getDictionary(locale);
  const base = `/${locale}`;
  const services = await getServices({ category });

  const categories = Object.entries(dict.servicesMenu);

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-6">{dict.nav.services}</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={`${base}/services`}
          className={`px-4 py-1.5 rounded-full text-sm border ${
            !category ? "bg-brass text-ink border-brass" : "border-ink-3 text-cream-dim hover:text-cream"
          }`}
        >
          {dict.common.viewAll}
        </Link>
        {categories.map(([key, label]) => (
          <Link
            key={key}
            href={`${base}/services?category=${key}`}
            className={`px-4 py-1.5 rounded-full text-sm border ${
              category === key ? "bg-brass text-ink border-brass" : "border-ink-3 text-cream-dim hover:text-cream"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s) => (
          <Link
            key={s.id || s.slug}
            href={`${base}/services/${s.slug}`}
            className="block bg-ink-2 border border-ink-3 hover:border-brass rounded-lg p-5 transition-colors"
          >
            <div className="text-xs uppercase tracking-wide text-brass mb-2">
              {dict.servicesMenu[s.category] || s.category}
            </div>
            <h3 className="text-lg text-cream mb-2">{pickLang(s, "name", locale)}</h3>
            <p className="text-sm text-cream-dim">{pickLang(s, "shortDesc", locale) || s.shortDescEn}</p>
          </Link>
        ))}
        {services.length === 0 && (
          <p className="text-cream-dim col-span-full">No services found in this category yet.</p>
        )}
      </div>
    </div>
  );
}
