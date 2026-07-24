import { getDictionary } from "@/i18n/dictionaries";
import { getTestimonials, pickLang } from "@/lib/content";

export default async function TestimonialsPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const testimonials = await getTestimonials();

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-8">{dict.nav.testimonials}</h1>
      <div className="grid md:grid-cols-2 gap-5">
        {testimonials.map((t) => (
          <div key={t.id} className="plaque p-5 relative">
            <p className="text-cream/90 italic mb-3 relative z-10">“{pickLang(t, "text", locale)}”</p>
            <div className="text-brass text-sm font-semibold relative z-10">
              {t.customerName}
              {t.city ? `, ${t.city}` : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
