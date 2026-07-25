"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";

const RASHIS = [
  { id: 1, nameEn: "Mesha (Aries)", nameMr: "मेष", nameHi: "मेष" },
  { id: 2, nameEn: "Vrishabha (Taurus)", nameMr: "वृषभ", nameHi: "वृषभ" },
  { id: 3, nameEn: "Mithuna (Gemini)", nameMr: "मिथुन", nameHi: "मिथुन" },
  { id: 4, nameEn: "Karka (Cancer)", nameMr: "कर्क", nameHi: "कर्क" },
  { id: 5, nameEn: "Simha (Leo)", nameMr: "सिंह", nameHi: "सिंह" },
  { id: 6, nameEn: "Kanya (Virgo)", nameMr: "कन्या", nameHi: "कन्या" },
  { id: 7, nameEn: "Tula (Libra)", nameMr: "तूळ", nameHi: "तुला" },
  { id: 8, nameEn: "Vrishchika (Scorpio)", nameMr: "वृश्चिक", nameHi: "वृश्चिक" },
  { id: 9, nameEn: "Dhanu (Sagittarius)", nameMr: "धनु", nameHi: "धनु" },
  { id: 10, nameEn: "Makara (Capricorn)", nameMr: "मकर", nameHi: "मकर" },
  { id: 11, nameEn: "Kumbha (Aquarius)", nameMr: "कुंभ", nameHi: "कुंभ" },
  { id: 12, nameEn: "Meena (Pisces)", nameMr: "मीन", nameHi: "मीन" },
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
  "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
  "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati"
];

const PLANETS = [
  { code: "Lagn", label: { en: "Asc", hi: "लग्न", mr: "लग्न" } },
  { code: "Sur", label: { en: "Su", hi: "सूर्य", mr: "सूर्य" } },
  { code: "Chan", label: { en: "Mo", hi: "चं", mr: "चं" } },
  { code: "Mang", label: { en: "Ma", hi: "मं", mr: "मं" } },
  { code: "Budh", label: { en: "Me", hi: "बु", mr: "बु" } },
  { code: "Guru", label: { en: "Ju", hi: "गु", mr: "गु" } },
  { code: "Shuk", label: { en: "Ve", hi: "शु", mr: "शु" } },
  { code: "Shani", label: { en: "Sa", hi: "श", mr: "श" } },
  { code: "Rahu", label: { en: "Ra", hi: "रा", mr: "रा" } },
  { code: "Ketu", label: { en: "Ke", hi: "के", mr: "के" } },
];

// Coordinates for text placement inside the 12 houses of a North Indian Kundali chart
const HOUSE_COORDS = {
  1: { number: { x: 200, y: 145 }, planets: { x: 200, y: 110 } },
  2: { number: { x: 145, y: 90 }, planets: { x: 120, y: 65 } },
  3: { number: { x: 90, y: 145 }, planets: { x: 60, y: 115 } },
  4: { number: { x: 145, y: 200 }, planets: { x: 110, y: 205 } },
  5: { number: { x: 90, y: 255 }, planets: { x: 60, y: 295 } },
  6: { number: { x: 145, y: 310 }, planets: { x: 120, y: 345 } },
  7: { number: { x: 200, y: 255 }, planets: { x: 200, y: 295 } },
  8: { number: { x: 255, y: 310 }, planets: { x: 280, y: 345 } },
  9: { number: { x: 310, y: 255 }, planets: { x: 340, y: 295 } },
  10: { number: { x: 255, y: 200 }, planets: { x: 290, y: 205 } },
  11: { number: { x: 310, y: 145 }, planets: { x: 340, y: 115 } },
  12: { number: { x: 255, y: 90 }, planets: { x: 280, y: 65 } },
};

export default function KundaliCalculatorPage() {
  const { locale } = useParams();
  const dict = getDictionary(locale);
  const base = `/${locale}`;

  const [form, setForm] = useState({ name: "", dob: "", tob: "", pob: "" });
  const [result, setResult] = useState(null);

  function handleCalculate(e) {
    e.preventDefault();
    if (!form.dob || !form.tob) return;

    // Parse date and time
    const dateObj = new Date(`${form.dob}T${form.tob}`);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const hour = dateObj.getHours();

    // Ascendant (Lagna) sign calculation (simple baseline estimate based on time of day)
    // Lagna changes roughly every 2 hours starting at sunrise
    const sunriseOffset = (hour >= 6 ? hour - 6 : hour + 18);
    const lagnaSign = ((Math.floor(sunriseOffset / 2) + month) % 12) || 12;

    // Moon Sign (Rashi) and Nakshatra deterministic hash from Day and Month
    const rashiSign = (((day + month * 7) % 12) + 1) || 12;
    const nakshatraIndex = (day + month * 11) % 27;
    const charan = ((day + month) % 4) + 1;

    // Distribute planets across houses deterministically based on input hash
    // Each house will contain list of planet codes
    const housePlanets = { 1: ["Lagn"], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [] };
    
    // Assign 9 astronomical bodies to random but consistent houses based on DOB
    const otherPlanets = ["Sur", "Chan", "Mang", "Budh", "Guru", "Shuk", "Shani", "Rahu", "Ketu"];
    otherPlanets.forEach((planet, idx) => {
      const houseIndex = (((day + month + idx * 7) % 12) + 1);
      housePlanets[houseIndex].push(planet);
    });

    setResult({
      lagnaSign,
      rashi: RASHIS.find((r) => r.id === rashiSign),
      nakshatra: NAKSHATRAS[nakshatraIndex],
      charan,
      housePlanets,
    });
  }

  // Helper to map index to standard Zodiac names
  function getZodiacName(id) {
    const r = RASHIS.find((item) => item.id === id);
    if (!r) return "";
    return locale === "en" ? r.nameEn : locale === "hi" ? r.nameHi : r.nameMr;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="text-3xl md:text-4xl text-cream mb-2 font-display">{dict.jyotish.title}</h1>
      <p className="text-cream-dim mb-8 text-sm md:text-base">{dict.jyotish.subtitle}</p>

      <div className="grid lg:grid-cols-5 gap-10 items-start">
        {/* Form panel */}
        <div className="lg:col-span-2 plaque p-6 space-y-4">
          <form onSubmit={handleCalculate} className="space-y-4">
            <label className="block">
              <span className="block text-xs text-cream-dim mb-1">{dict.jyotish.name}</span>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input w-full"
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-xs text-cream-dim mb-1">{dict.jyotish.dob}</span>
                <input
                  required
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
                  className="input w-full"
                />
              </label>
              <label className="block">
                <span className="block text-xs text-cream-dim mb-1">{dict.jyotish.tob}</span>
                <input
                  required
                  type="time"
                  value={form.tob}
                  onChange={(e) => setForm((f) => ({ ...f, tob: e.target.value }))}
                  className="input w-full"
                />
              </label>
            </div>
            <label className="block">
              <span className="block text-xs text-cream-dim mb-1">{dict.jyotish.pob}</span>
              <input
                required
                type="text"
                placeholder="e.g. Latur, Maharashtra"
                value={form.pob}
                onChange={(e) => setForm((f) => ({ ...f, pob: e.target.value }))}
                className="input w-full"
              />
            </label>
            <button
              type="submit"
              className="w-full bg-sindoor hover:bg-sindoor-light text-cream font-semibold py-2.5 rounded transition-all cursor-pointer text-sm shadow-md"
            >
              {dict.jyotish.calculate}
            </button>
          </form>
        </div>

        {/* Results / Kundali view */}
        <div className="lg:col-span-3">
          {result ? (
            <div className="space-y-6 rise-in">
              <div className="grid sm:grid-cols-2 gap-6 bg-ink-2/30 border border-ink-3 p-5 rounded-lg">
                <div>
                  <div className="text-xs text-cream-dim mb-1">{dict.jyotish.ascendant}</div>
                  <div className="text-base text-brass font-bold">{getZodiacName(result.lagnaSign)}</div>
                </div>
                <div>
                  <div className="text-xs text-cream-dim mb-1">{dict.jyotish.rashi}</div>
                  <div className="text-base text-brass font-bold">
                    {locale === "en" ? result.rashi.nameEn : locale === "hi" ? result.rashi.nameHi : result.rashi.nameMr}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-cream-dim mb-1">{dict.jyotish.nakshatra}</div>
                  <div className="text-base text-brass font-bold">{result.nakshatra}</div>
                </div>
                <div>
                  <div className="text-xs text-cream-dim mb-1">{dict.jyotish.charan}</div>
                  <div className="text-base text-brass font-bold">{result.charan}</div>
                </div>
              </div>

              {/* Kundali Diagram */}
              <div className="flex flex-col items-center">
                <h3 className="text-cream text-lg font-bold font-display mb-4">{dict.jyotish.chartTitle}</h3>
                
                <div className="relative w-full max-w-[360px] aspect-square bg-[#221c33]/45 border-2 border-brass/30 p-2 rounded shadow-2xl">
                  {/* Ornate corner brackets */}
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-brass/55"></div>
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-brass/55"></div>
                  <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-brass/55"></div>
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-brass/55"></div>

                  <svg viewBox="0 0 400 400" className="w-full h-full stroke-brass fill-none">
                    {/* Inner Diamond Houses */}
                    <rect x="15" y="15" width="370" height="370" strokeWidth="2.5" />
                    
                    {/* Diagonals */}
                    <line x1="15" y1="15" x2="385" y2="385" strokeWidth="1.5" />
                    <line x1="385" y1="15" x2="15" y2="385" strokeWidth="1.5" />
                    
                    {/* Mid-point connecting lines (Inner diamond) */}
                    <line x1="200" y1="15" x2="385" y2="200" strokeWidth="1.5" />
                    <line x1="385" y1="200" x2="200" y2="385" strokeWidth="1.5" />
                    <line x1="200" y1="385" x2="15" y2="200" strokeWidth="1.5" />
                    <line x1="15" y1="200" x2="200" y2="15" strokeWidth="1.5" />

                    {/* Plot house numbers & planetary codes */}
                    {Object.entries(HOUSE_COORDS).map(([houseNum, coords]) => {
                      const numVal = Number(houseNum);
                      
                      // Calculate the sign number placed in this house
                      // House 1 gets ascendantSign, house 2 gets ascendantSign+1, etc.
                      const signNum = ((result.lagnaSign - 1 + (numVal - 1)) % 12) + 1;
                      
                      // Find planet labels to print
                      const currentPlanets = result.housePlanets[numVal] || [];
                      const planetStr = currentPlanets.map((planetCode) => {
                        const info = PLANETS.find((p) => p.code === planetCode);
                        return info ? (locale === "en" ? info.label.en : locale === "hi" ? info.label.hi : info.label.mr) : "";
                      }).join(", ");

                      return (
                        <g key={houseNum} className="fill-cream/90 stroke-none">
                          {/* House Sign Numbers (Golden red tint) */}
                          <text
                            x={coords.number.x}
                            y={coords.number.y}
                            textAnchor="middle"
                            className="font-semibold fill-brass-light/80 text-[13px] select-none"
                          >
                            {signNum}
                          </text>

                          {/* Planets text */}
                          {planetStr && (
                            <text
                              x={coords.planets.x}
                              y={coords.planets.y}
                              textAnchor="middle"
                              className="font-medium fill-cream text-[10px] sm:text-[11.5px]"
                            >
                              {planetStr}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Consultation Promo */}
              <div className="plaque p-6 space-y-4">
                <p className="text-sm text-cream-dim leading-relaxed">{dict.jyotish.bookPromo}</p>
                <a
                  href={`${base}/book?service=janam-kundali`}
                  className="inline-flex bg-brass hover:bg-brass-light text-ink font-bold px-6 py-2.5 rounded transition-all shadow-md text-sm select-none"
                >
                  {dict.nav.book}
                </a>
              </div>
            </div>
          ) : (
            <div className="plaque p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
              <span className="text-4xl mb-4">🔮</span>
              <p className="text-cream-dim text-sm">Please fill and submit birth details to compute your horoscope chart.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .input {
          background: var(--color-ink-2);
          border: 1px solid var(--color-ink-3);
          color: var(--color-cream);
          border-radius: 0.375rem;
          padding: 0.6rem 0.75rem;
          font-size: 0.875rem;
        }
        .input:focus {
          outline: 2px solid var(--color-brass);
          outline-offset: 1px;
        }
      `}</style>
    </div>
  );
}
