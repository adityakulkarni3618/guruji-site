import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import { getServices, pickLang } from "@/lib/content";

export default async function ServicesPage({ params, searchParams }) {
  const { locale } = await params;
  const { category, q } = await searchParams;
  const dict = getDictionary(locale);
  const base = `/${locale}`;
  const services = await getServices({ category });

  // Filter services by text search query 'q'
  let filteredServices = services;
  if (q) {
    const queryStr = q.toLowerCase();
    filteredServices = services.filter((s) => {
      const name = pickLang(s, "name", locale).toLowerCase();
      const shortDesc = (pickLang(s, "shortDesc", locale) || s.shortDescEn || "").toLowerCase();
      const description = (pickLang(s, "description", locale) || s.descriptionEn || "").toLowerCase();
      return (
        name.includes(queryStr) ||
        shortDesc.includes(queryStr) ||
        description.includes(queryStr)
      );
    });
  }

  const categories = Object.entries(dict.servicesMenu);

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-6">{dict.nav.services}</h1>

      {/* Search Input */}
      <div className="mb-8 max-w-md">
        <form method="GET" action={`${base}/services`} className="relative flex gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder={locale === "en" ? "Search services..." : locale === "hi" ? "सेवाएं खोजें..." : "सेवा शोधा..."}
            className="flex-1 bg-ink-2 border border-ink-3 text-cream rounded-md px-4 py-2 text-sm focus:outline-none focus:border-brass"
          />
          <button
            type="submit"
            className="bg-brass hover:bg-brass/90 text-ink font-semibold px-4 py-2 rounded-md text-sm cursor-pointer transition-colors"
          >
            {locale === "en" ? "Search" : locale === "hi" ? "खोजें" : "शोधा"}
          </button>
        </form>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={`${base}/services${q ? `?q=${q}` : ""}`}
          className={`px-4 py-1.5 rounded-full text-sm border ${
            !category ? "bg-brass text-ink border-brass" : "border-ink-3 text-cream-dim hover:text-cream"
          }`}
        >
          {dict.common.viewAll}
        </Link>
        {categories.map(([key, label]) => (
          <Link
            key={key}
            href={`${base}/services?category=${key}${q ? `&q=${q}` : ""}`}
            className={`px-4 py-1.5 rounded-full text-sm border ${
              category === key ? "bg-brass text-ink border-brass" : "border-ink-3 text-cream-dim hover:text-cream"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((s) => (
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
        {filteredServices.length === 0 && (
          <p className="text-cream-dim col-span-full">No services found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}
