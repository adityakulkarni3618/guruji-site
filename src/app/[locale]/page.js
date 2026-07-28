export const revalidate = 60;

import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import { getPanchangToday } from "@/lib/getPanchangToday";
import { getServices, getTestimonials, pickLang, getDailyShlokaToday } from "@/lib/content";
import PanchangCard from "@/components/PanchangCard";
import ShlokaCard from "@/components/ShlokaCard";
import PosterSlider from "@/components/PosterSlider";
import NewsletterSubscription from "@/components/NewsletterSubscription";

export default async function HomePage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const base = `/${locale}`;

  const [panchang, services, testimonials, shloka] = await Promise.all([
    getPanchangToday(),
    getServices(),
    getTestimonials(),
    getDailyShlokaToday(),
  ]);

  return (
    <div>
      {/* Hero: the panchang plaque IS the thesis — this is what a devotee
          checks daily, so it earns the top of the page rather than a
          generic stock-photo hero. */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-16 grid lg:grid-cols-2 gap-10 items-center">
        <div className="rise-in">
          <p className="text-brass tracking-wide text-sm mb-3">
            ॐ श्री गजानन प्रसन्न · श्री तुळजाभवानी प्रसन्न
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-cream mb-3 md:whitespace-nowrap">{dict.home.heroTitle}</h1>
          <p className="text-cream-dim text-lg mb-8">{dict.home.heroSubtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`${base}/book`}
              className="bg-sindoor hover:bg-brass hover:text-ink text-cream font-semibold px-6 py-3 rounded-md transition-colors"
            >
              {dict.home.heroCta}
            </Link>
            <Link
              href={`${base}/panchang`}
              className="border border-brass text-brass hover:bg-brass hover:text-ink font-semibold px-6 py-3 rounded-md transition-colors"
            >
              {dict.home.panchangCta}
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end w-full">
          <PanchangCard dict={dict} data={panchang} locale={locale} isCompact={true} />
        </div>
      </section>

      {/* Profile & Service Posters Slider */}
      <section className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center w-full border-t border-ink-3">
        <div className="text-center mb-8">
          <div className="text-brass font-display text-sm tracking-widest uppercase mb-2 select-none">
            ॐ श्री गणेशाय नमः · ॐ श्री गुरुदेव दत्त
          </div>
          <h2 className="text-2xl md:text-3xl text-cream font-display">
            {locale === "en" 
              ? "Guruji's Profile & Services" 
              : locale === "hi" 
              ? "गुरुजी का परिचय एवं सेवाएं" 
              : "गुरुजींचा परिचय आणि सेवा"}
          </h2>
          <div className="w-24 h-[1px] bg-brass/40 mx-auto mt-3"></div>
        </div>
        <PosterSlider
          posters={[
            { src: "/poster1.jpg", alt: "Guruji Rahul Joshi Card" },
            { src: "/poster2.jpg", alt: "Guruji Rahul Joshi Services" },
          ]}
        />
      </section>

      {/* Shloka of the Day */}
      <section className="max-w-6xl mx-auto px-6 py-6 flex justify-center">
        <ShlokaCard data={shloka} locale={locale} dict={dict} />
      </section>

      {/* Services preview */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl text-cream">{dict.home.servicesHeading}</h2>
          <Link href={`${base}/services`} className="text-brass hover:underline text-sm">
            {dict.common.viewAll} →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.slice(0, 6).map((s) => (
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
        </div>
      </section>

      {/* Testimonials preview */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl text-cream mb-6">{dict.home.testimonialsHeading}</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {testimonials.slice(0, 4).map((t) => (
            <div key={t.id} className="plaque p-5">
              <p className="text-cream/90 italic mb-3 relative z-10">
                “{pickLang(t, "text", locale)}”
              </p>
              <div className="text-brass text-sm font-semibold relative z-10">
                {t.customerName}{t.city ? `, ${t.city}` : ""}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="border-t border-ink-3/40 pt-4">
        <NewsletterSubscription locale={locale} />
      </section>
    </div>
  );
}
