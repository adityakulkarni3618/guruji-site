import { getDictionary } from "@/i18n/dictionaries";
import { getTestimonials, pickLang } from "@/lib/content";
import TestimonialSubmitForm from "@/components/TestimonialSubmitForm";

export default async function TestimonialsPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const testimonials = await getTestimonials();

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-8">{dict.nav.testimonials}</h1>
      
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Testimonials List */}
        <div className="lg:col-span-2 space-y-5">
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
          {testimonials.length === 0 && (
            <p className="text-cream-dim italic">No testimonials available yet.</p>
          )}
        </div>

        {/* Submit Form */}
        <div className="lg:col-span-1">
          <TestimonialSubmitForm dict={dict} locale={locale} />
        </div>
      </div>
    </div>
  );
}
