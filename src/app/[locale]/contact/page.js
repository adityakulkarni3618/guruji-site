import { getDictionary } from "@/i18n/dictionaries";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <div className="max-w-4xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="text-3xl md:text-4xl text-cream mb-6">{dict.nav.contact}</h1>
        <div className="space-y-3 text-cream/90">
          <p>Behind Vidyavikas School, Shrinagar, Barshi Road, Latur, Maharashtra</p>
          <p>
            <a href="tel:+919823324839" className="text-brass hover:underline">+91 98233 24839</a>
            {" · "}
            <a href="tel:+919970026324" className="text-brass hover:underline">+91 99700 26324</a>
          </p>
          <p>
            <a href="mailto:rahuljoshi031986@gmail.com" className="text-brass hover:underline">
              rahuljoshi031986@gmail.com
            </a>
          </p>
          <a
            href="https://wa.me/919823324839"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 bg-[#25D366] text-ink font-semibold px-5 py-2.5 rounded-md"
          >
            {dict.home.whatsappCta}
          </a>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
