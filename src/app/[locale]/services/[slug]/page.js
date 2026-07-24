import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { getServiceBySlug, pickLang } from "@/lib/content";
import SamagriChecklist from "@/components/SamagriChecklist";

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
        <SamagriChecklist samagri={samagri} dict={dict} locale={locale} />
      )}

      {service.pdfUrl && (
        <div className="mb-8 p-4 bg-ink-2 border border-ink-3 rounded-md flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-cream text-sm">📖 Study Material / Pooja PDF</h3>
            <p className="text-xs text-cream-dim mt-0.5">Read or download the PDF guide for this pooja.</p>
          </div>
          <a
            href={service.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brass hover:bg-brass-light text-ink font-semibold text-xs px-4 py-2 rounded-md transition-colors"
          >
            View PDF
          </a>
        </div>
      )}

      {pickLang(service, "aarti", locale) && (
        <div className="plaque p-6 mb-8">
          <h2 className="text-brass text-lg mb-4 relative z-10">🕉️ Aarti / Stotra / Readings</h2>
          <pre className="relative z-10 text-cream/90 text-sm whitespace-pre-wrap font-sans leading-relaxed text-center italic bg-ink/30 p-4 rounded border border-ink-3">
            {pickLang(service, "aarti", locale)}
          </pre>
        </div>
      )}

      <div className="flex gap-4">
        <Link
          href={`${base}/book?service=${service.slug}`}
          className="inline-block bg-sindoor hover:bg-sindoor-light text-cream font-semibold px-6 py-3 rounded-md transition-colors"
        >
          {dict.nav.book}
        </Link>
      </div>
    </div>
  );
}
