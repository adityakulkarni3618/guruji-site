import { getDictionary } from "@/i18n/dictionaries";

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-2">{dict.nav.about}</h1>
      <p className="text-brass mb-8">{dict.home.heroSubtitle}</p>

      <div className="plaque p-6 md:p-8 mb-8">
        <div className="relative z-10 text-cream/90 space-y-4 leading-relaxed">
          <p>
            Guruji Rahul Chandrakantrao Joshi (Harangulkar) is a Ved, Jyotish, Vastu &amp;
            Ratnashastra Visharad and a devoted Shri Vidya Upasak, based in Latur, Maharashtra.
            With deep grounding in traditional Vedic scripture and years of guiding families
            through life's important decisions, Guruji offers a rare combination of ritual
            precision and personal, compassionate guidance.
          </p>
          <p>
            Guruji's practice spans birth-chart (kundali) analysis, vastu correction for homes
            and businesses, gemstone (ratna) recommendation, and the performance of poojas and
            havans for remedies, celebrations, and life milestones — including Vastu Shanti,
            Kalsarp Shanti, Saptashati Path Havan (Navchandi), Vivah, and Upanayan ceremonies.
          </p>
          <p>
            Beyond traditional Jyotish, Guruji also offers Akashic Record Reading and Reiki
            healing, bringing together classical astrology with holistic wellbeing practices
            for those seeking guidance beyond the conventional.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {[
          "Ved & Jyotish Visharad",
          "Vastu Shastra Consultant",
          "Ratnashastra (Gemology) Specialist",
          "Shri Vidya Upasak",
        ].map((cred) => (
          <div key={cred} className="border border-ink-3 rounded-md px-4 py-3 text-cream/90 text-sm">
            {cred}
          </div>
        ))}
      </div>
    </div>
  );
}
