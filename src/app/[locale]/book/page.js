import { getDictionary } from "@/i18n/dictionaries";
import { getServices, pickLang } from "@/lib/content";
import BookingForm from "@/components/BookingForm";

export default async function BookPage({ params, searchParams }) {
  const { locale } = await params;
  const { service } = await searchParams;
  const dict = getDictionary(locale);
  const services = await getServices();

  const serviceOptions = services.map((s) => ({
    slug: s.slug,
    id: s.id,
    label: pickLang(s, "name", locale),
  }));

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-2">{dict.booking.title}</h1>
      <p className="text-cream-dim mb-8">{dict.booking.subtitle}</p>
      <BookingForm dict={dict} services={serviceOptions} preselectedService={service} />
    </div>
  );
}
