import { getDictionary } from "@/i18n/dictionaries";

async function getMuhuratDates() {
  try {
    const { db } = await import("@/db");
    const { muhuratDates } = await import("@/db/schema");
    const rows = await db.select().from(muhuratDates);
    return rows.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
  } catch {
    return [];
  }
}

const EVENT_LABELS = {
  vivah: { en: "Marriage (Vivah)", hi: "विवाह", mr: "विवाह" },
  griha_pravesh: { en: "Griha Pravesh", hi: "गृह प्रवेश", mr: "गृहप्रवेश" },
  vahan_kharedi: { en: "Vehicle Purchase", hi: "वाहन खरीद", mr: "वाहन खरेदी" },
  namkaran: { en: "Namkaran", hi: "नामकरण", mr: "नामकरण" },
  other: { en: "Other", hi: "अन्य", mr: "इतर" },
};

export default async function MuhuratPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const dates = await getMuhuratDates();

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-2">{dict.nav.muhurat}</h1>
      <p className="text-cream-dim mb-8">
        Upcoming auspicious dates as guided by Guruji. Contact for a personalized muhurat
        for your specific event.
      </p>

      {dates.length === 0 ? (
        <div className="plaque p-8 text-center relative">
          <p className="text-cream/80 relative z-10">
            No upcoming muhurat dates published yet — please check back soon, or contact
            Guruji directly for a personalized muhurat consultation.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dates.map((d) => (
            <div key={d.id} className="plaque p-5 flex items-center justify-between relative">
              <div className="relative z-10">
                <div className="text-brass text-sm mb-1">
                  {EVENT_LABELS[d.eventType]?.[locale] || d.eventType}
                </div>
                <div className="text-cream font-numeral">
                  {new Date(d.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                {d.timeWindow && <div className="text-cream-dim text-sm">{d.timeWindow}</div>}
              </div>
              {d[`note${locale === "en" ? "En" : locale === "hi" ? "Hi" : "Mr"}`] && (
                <p className="text-cream-dim text-sm max-w-xs text-right relative z-10">
                  {d[`note${locale === "en" ? "En" : locale === "hi" ? "Hi" : "Mr"}`]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
