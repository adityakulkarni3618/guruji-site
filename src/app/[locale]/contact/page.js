import { getDictionary } from "@/i18n/dictionaries";
import ContactForm from "@/components/ContactForm";
import LocationMap from "@/components/LocationMap";

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const contactItems = [
    {
      icon: (
        <svg className="w-5 h-5 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: locale === "en" ? "Address" : locale === "hi" ? "पता" : "पत्ता",
      value: "Behind Vidyavikas School, Shrinagar, Barshi Road, Latur, Maharashtra",
      href: "https://www.google.com/maps/search/?api=1&query=Sai+Shakti+Jyotish+Kendra+Latur+Maharashtra",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: locale === "en" ? "Phone" : locale === "hi" ? "फ़ोन" : "फोन",
      value: "+91 98233 24839  ·  +91 99700 26324",
      href: "tel:+919823324839",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: locale === "en" ? "Email" : locale === "hi" ? "ईमेल" : "ईमेल",
      value: "rahuljoshi031986@gmail.com",
      href: "mailto:rahuljoshi031986@gmail.com",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 004.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.16c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.12-.42-.13-.95-.31-1.64-.6-2.9-1.25-4.79-4.16-4.94-4.35-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.81 2 .88 2.15.07.15.12.32.02.51-.09.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.63-.14.26.1 1.65.78 1.94.92.28.14.47.21.54.33.07.12.07.68-.17 1.36z" />
        </svg>
      ),
      label: "WhatsApp",
      value: "+91 98233 24839",
      href: "https://wa.me/919823324839",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="text-brass font-display text-sm tracking-widest uppercase mb-3 select-none">
          ॐ श्री गणेशाय नमः
        </div>
        <h1 className="text-4xl md:text-5xl text-cream font-display mb-4">{dict.nav.contact}</h1>
        <div className="w-20 h-[1px] bg-brass/40 mx-auto mb-4" />
        <p className="text-cream-dim max-w-xl mx-auto text-base">
          {locale === "en"
            ? "Reach out for pooja bookings, kundali readings, vastu consultations, or any spiritual guidance."
            : locale === "hi"
            ? "पूजा बुकिंग, कुंडली वाचन, वास्तु परामर्श या किसी भी आध्यात्मिक मार्गदर्शन के लिए संपर्क करें।"
            : "पूजा बुकिंग, कुंडली वाचन, वास्तु सल्ला किंवा कोणत्याही आध्यात्मिक मार्गदर्शनासाठी संपर्क करा."}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left: Contact details + Map */}
        <div className="flex flex-col gap-8">
          {/* Contact cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {contactItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex items-start gap-4 bg-ink-2 border border-ink-3 hover:border-brass/50 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-brass/5"
              >
                <div className="mt-0.5 w-10 h-10 rounded-full bg-ink-3 group-hover:bg-brass/10 flex items-center justify-center shrink-0 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs text-brass font-semibold tracking-wide uppercase mb-1">{item.label}</div>
                  <div className="text-sm text-cream-dim group-hover:text-cream transition-colors leading-relaxed">{item.value}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Map */}
          <div>
            <div className="text-brass font-semibold text-sm tracking-wide uppercase mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {locale === "en" ? "Find Us" : locale === "hi" ? "हमें खोजें" : "आम्हाला शोधा"}
            </div>
            <LocationMap />
          </div>

          {/* Hours */}
          <div className="bg-ink-2 border border-ink-3 rounded-xl p-5">
            <div className="text-brass font-semibold text-sm tracking-wide uppercase mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {locale === "en" ? "Consultation Hours" : locale === "hi" ? "परामर्श समय" : "सल्लामसलत वेळ"}
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              {[
                [locale === "en" ? "Monday – Saturday" : locale === "hi" ? "सोमवार – शनिवार" : "सोमवार – शनिवार", "9:00 AM – 7:00 PM"],
                ["Sunday", locale === "en" ? "By Appointment" : locale === "hi" ? "पूर्व नियुक्ति पर" : "पूर्वनियोजित"],
              ].map(([day, time], i) => (
                <div key={i} className="contents">
                  <span className="text-cream-dim">{day}</span>
                  <span className="text-brass font-medium">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Inquiry form */}
        <div className="bg-ink-2 border border-ink-3 rounded-2xl p-7 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl text-cream font-display mb-1">
              {locale === "en" ? "Send a Message" : locale === "hi" ? "संदेश भेजें" : "संदेश पाठवा"}
            </h2>
            <p className="text-sm text-cream-dim">
              {locale === "en"
                ? "Fill the form and Guruji's team will respond within 24 hours."
                : locale === "hi"
                ? "फ़ॉर्म भरें और गुरुजी की टीम 24 घंटों में जवाब देगी।"
                : "फॉर्म भरा, गुरुजींची टीम 24 तासांत उत्तर देईल."}
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
