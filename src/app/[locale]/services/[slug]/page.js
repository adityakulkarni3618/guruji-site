import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { getServiceBySlug, pickLang } from "@/lib/content";

export default async function ServiceDetailPage({ params }) {
  const { locale, slug } = await params;
  const dict = getDictionary(locale);
  const base = `/${locale}`;
  const service = await getServiceBySlug(slug);

  if (!service) notFound();

  const samagri = Array.isArray(service.samagri) ? service.samagri : [];

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <div className="text-xs uppercase tracking-wide text-brass mb-2">
        {dict.servicesMenu[service.category] || service.category}
      </div>
      <h1 className="text-3xl md:text-4xl text-cream mb-4">{pickLang(service, "name", locale)}</h1>

      <p className="text-cream/90 leading-relaxed mb-6">
        {pickLang(service, "description", locale) ||
          pickLang(service, "shortDesc", locale) ||
          service.shortDescEn}
      </p>

      <div className="flex flex-wrap gap-4 mb-8 text-sm text-cream-dim">
        {service.durationMinutes && (
          <span>
            {dict.common.duration}: {service.durationMinutes} {dict.common.minutes}
          </span>
        )}
        <span>{service.priceNote || (service.price ? `₹${service.price}` : dict.common.priceOnRequest)}</span>
      </div>

      {samagri.length > 0 && (
        <div className="plaque p-5 mb-8">
          <h2 className="text-brass text-lg mb-3 relative z-10">{dict.common.samagriRequired}</h2>
          <ul className="relative z-10 grid sm:grid-cols-2 gap-2 text-cream/90 text-sm list-disc list-inside">
            {samagri.map((item, i) => (
              <li key={i}>
                {item.itemEn || item.item} {item.qty ? `— ${item.qty}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href={`${base}/book?service=${service.slug}`}
        className="inline-block bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-3 rounded-md transition-colors"
      >
        {dict.nav.book}
      </Link>
    </div>
  );
}
