"use client";

import { useState } from "react";
import Link from "next/link";

const DIRECTIONS = [
  { id: "NW", label: { en: "North-West (Vayu)", hi: "उत्तर-पश्चिम (वायव्य)", mr: "उत्तर-पश्चिम (वायव्य)" } },
  { id: "N", label: { en: "North (Kuber)", hi: "उत्तर (कुबेर)", mr: "उत्तर (कुबेर)" } },
  { id: "NE", label: { en: "North-East (Ishan)", hi: "उत्तर-पूर्व (ईशान)", mr: "उत्तर-पूर्व (ईशान)" } },
  { id: "W", label: { en: "West (Varun)", hi: "पश्चिम (वरुण)", mr: "पश्चिम (वरुण)" } },
  { id: "C", label: { en: "Center (Brahmasthan)", hi: "मध्य (ब्रह्मस्थान)", mr: "मध्य (ब्रह्मस्थान)" } },
  { id: "E", label: { en: "East (Indra)", hi: "पूर्व (इंद्र)", mr: "पूर्व (इंद्र)" } },
  { id: "SW", label: { en: "South-West (Nairutya)", hi: "दक्षिण-पश्चिम (नैऋत्य)", mr: "दक्षिण-पश्चिम (नैऋत्य)" } },
  { id: "S", label: { en: "South (Yama)", hi: "दक्षिण (यम)", mr: "दक्षिण (यम)" } },
  { id: "SE", label: { en: "South-East (Agneya)", hi: "दक्षिण-पूर्व (आग्नेय)", mr: "दक्षिण-पूर्व (आग्नेय)" } },
];

const ROOMS = [
  { id: "temple", label: { en: "Pooja Room / Temple", hi: "पूजा घर / मंदिर", mr: "देवघर / मंदिर" } },
  { id: "kitchen", label: { en: "Kitchen", hi: "रसोई घर", mr: "स्वयंपाकघर" } },
  { id: "bedroom", label: { en: "Master Bedroom", hi: "मुख्य शयनकक्ष", mr: "मास्टर बेडरूम" } },
  { id: "bathroom", label: { en: "Toilet / Bathroom", hi: "शौचालय / स्नानगृह", mr: "शौचालय / स्नानगृह" } },
  { id: "door", label: { en: "Main Entrance", hi: "मुख्य प्रवेश द्वार", mr: "मुख्य प्रवेशद्वार" } },
];

// Vastu rules: scores and advice for room placements in each direction
const VASTU_RULES = {
  temple: {
    NE: { score: 100, labelEn: "Best placement (Ishan)", labelHi: "सर्वोत्तम स्थान (ईशान)", labelMr: "सर्वोत्तम स्थान (ईशान)", status: "excellent" },
    E: { score: 85, labelEn: "Good placement (Sun energy)", labelHi: "अच्छा स्थान", labelMr: "उत्तम स्थान", status: "good" },
    N: { score: 80, labelEn: "Good placement (Prosperity)", labelHi: "अच्छा स्थान", labelMr: "उत्तम स्थान", status: "good" },
    C: { score: 70, labelEn: "Acceptable (Brahmasthan)", labelHi: "स्वीकार्य (ब्रह्मस्थान)", labelMr: "स्वीकार्य (ब्रह्मस्थान)", status: "average" },
    NW: { score: 40, labelEn: "Mediocre. Avoid heavy idols.", labelHi: "मध्यम। भारी मूर्तियां न रखें।", labelMr: "मध्यम. जड मूर्ती ठेवू नका.", status: "average" },
    W: { score: 30, labelEn: "Avoid if possible.", labelHi: "संभव हो तो टालें।", labelMr: "शक्यतो टाळा.", status: "poor" },
    SE: { score: 10, labelEn: "Bad placement (Agni zone)", labelHi: "अशुभ (अग्नि कोण)", labelMr: "अशुभ (अग्नी कोण)", status: "poor" },
    S: { score: 10, labelEn: "Strictly avoid.", labelHi: "बिल्कुल टालें।", labelMr: "पूर्णपणे टाळा.", status: "poor" },
    SW: { score: 5, labelEn: "Very harmful placement.", labelHi: "अत्यंत हानिकारक।", labelMr: "अतिशय हानिकारक.", status: "poor" },
  },
  kitchen: {
    SE: { score: 100, labelEn: "Best placement (Agni direction)", labelHi: "सर्वोत्तम स्थान (आग्नेय)", labelMr: "सर्वोत्तम स्थान (आग्नेय)", status: "excellent" },
    NW: { score: 80, labelEn: "Good alternative placement", labelHi: "अच्छा विकल्प (वायव्य)", labelMr: "उत्तम पर्याय (वायव्य)", status: "good" },
    E: { score: 60, labelEn: "Acceptable placement", labelHi: "स्वीकार्य", labelMr: "स्वीकार्य", status: "average" },
    S: { score: 50, labelEn: "Okay, but keep stoves in SE corner", labelHi: "मध्यम", labelMr: "मध्यम", status: "average" },
    NE: { score: 5, labelEn: "Very harmful (clash of Fire & Water)", labelHi: "अत्यंत अशुभ (जल-अग्नि टकराव)", labelMr: "अत्यंत अशुभ (पाणी व अग्नी संघर्ष)", status: "poor" },
    SW: { score: 10, labelEn: "Avoid. Harms family health.", labelHi: "अशुभ। स्वास्थ्य पर बुरा असर।", labelMr: "अशुभ. आरोग्यावर वाईट परिणाम.", status: "poor" },
    N: { score: 15, labelEn: "Bad placement. Limits cash flow.", labelHi: "अशुभ। धन हानि संभव।", labelMr: "अशुभ. आर्थिक नुकसान होऊ शकते.", status: "poor" },
    W: { score: 40, labelEn: "Average placement.", labelHi: "सामान्य।", labelMr: "सामान्य.", status: "average" },
    C: { score: 10, labelEn: "Avoid (Brahmasthan should be free)", labelHi: "टालें (ब्रह्मस्थान खाली रखें)", labelMr: "टाळा (ब्रह्मस्थान रिकामे ठेवा)", status: "poor" },
  },
  bedroom: {
    SW: { score: 100, labelEn: "Best placement (Master of House)", labelHi: "सर्वोत्तम स्थान (नैऋत्य)", labelMr: "सर्वोत्तम स्थान (नैऋत्य)", status: "excellent" },
    S: { score: 85, labelEn: "Good for peace and stability", labelHi: "अच्छा स्थान", labelMr: "उत्तम स्थान", status: "good" },
    W: { score: 80, labelEn: "Good for success and stability", labelHi: "अच्छा स्थान", labelMr: "उत्तम स्थान", status: "good" },
    NW: { score: 60, labelEn: "Acceptable for children/guests", labelHi: "स्वीकार्य (बच्चों/मेहमानों के लिए)", labelMr: "स्वीकार्य (मुले/पाहुण्यांसाठी)", status: "average" },
    SE: { score: 20, labelEn: "Avoid. Causes conflicts & stress.", labelHi: "अशुभ। मानसिक तनाव हो सकता है।", labelMr: "अशुभ. मानसिक ताण आणि वाद होऊ शकतात.", status: "poor" },
    NE: { score: 10, labelEn: "Avoid. Affects health and sleep.", labelHi: "अशुभ। स्वास्थ्य प्रभावित होता है।", labelMr: "अशुभ. आरोग्यावर परिणाम होतो.", status: "poor" },
    N: { score: 40, labelEn: "Average placement.", labelHi: "सामान्य।", labelMr: "सामान्य.", status: "average" },
    E: { score: 50, labelEn: "Average. Good for students.", labelHi: "सामान्य। छात्रों के लिए ठीक।", labelMr: "सामान्य. विद्यार्थ्यांसाठी योग्य.", status: "average" },
    C: { score: 10, labelEn: "Strictly avoid center of house.", labelHi: "बिल्कुल टालें।", labelMr: "पूर्णपणे टाळा.", status: "poor" },
  },
  bathroom: {
    NW: { score: 100, labelEn: "Best placement (Elimination zone)", labelHi: "सर्वोत्तम स्थान (वायव्य)", labelMr: "सर्वोत्तम स्थान (वायव्य)", status: "excellent" },
    W: { score: 85, labelEn: "Good placement", labelHi: "अच्छा स्थान", labelMr: "उत्तम स्थान", status: "good" },
    S: { score: 70, labelEn: "Acceptable placement", labelHi: "स्वीकार्य", labelMr: "स्वीकार्य", status: "average" },
    SE: { score: 30, labelEn: "Avoid. Agni clash.", labelHi: "टालें (अग्नि कोण)", labelMr: "टाळा (अग्नी कोण)", status: "poor" },
    SW: { score: 5, labelEn: "Very bad. Drains positive energy.", labelHi: "अत्यंत अशुभ (नैऋत्य)", labelMr: "अत्यंत अशुभ (नैऋत्य)", status: "poor" },
    NE: { score: 0, labelEn: "Severe Dosha. Never build here.", labelHi: "महा वास्तु दोष (ईशान में बिल्कुल नहीं)", labelMr: "महा वास्तु दोष (ईशान कोपऱ्यात अजिबात नको)", status: "poor" },
    N: { score: 10, labelEn: "Avoid. Blocks career opportunities.", labelHi: "अशुभ। करियर में बाधा।", labelMr: "अशुभ. करिअरमध्ये अडथळे.", status: "poor" },
    E: { score: 20, labelEn: "Avoid if possible.", labelHi: "टालने का प्रयास करें।", labelMr: "टाळण्याचा प्रयत्न करा.", status: "poor" },
    C: { score: 0, labelEn: "Severe Dosha. Never in Brahmasthan.", labelHi: "महा वास्तु दोष (मध्य भाग में कभी नहीं)", labelMr: "महा वास्तु दोष (मध्यभागी कधीही नको)", status: "poor" },
  },
  door: {
    NE: { score: 100, labelEn: "Best entrance (Divine light)", labelHi: "सर्वोत्तम प्रवेशद्वार (ईशान)", labelMr: "सर्वोत्तम प्रवेशद्वार (ईशान)", status: "excellent" },
    E: { score: 95, labelEn: "Excellent entrance (Solar power)", labelHi: "उत्कृष्ट (पूर्व)", labelMr: "उत्कृष्ट (पूर्व)", status: "excellent" },
    N: { score: 90, labelEn: "Excellent entrance (Kuber zone)", labelHi: "उत्कृष्ट (उत्तर)", labelMr: "उत्कृष्ट (उत्तर)", status: "excellent" },
    NW: { score: 65, labelEn: "Acceptable entrance", labelHi: "स्वीकार्य", labelMr: "स्वीकार्य", status: "average" },
    W: { score: 60, labelEn: "Acceptable entrance", labelHi: "स्वीकार्य", labelMr: "स्वीकार्य", status: "average" },
    SE: { score: 20, labelEn: "Avoid. Prone to fire hazards/theft.", labelHi: "अशुभ। चोर-भय या विवाद।", labelMr: "अशुभ. वाद किंवा चोरीचे भय.", status: "poor" },
    S: { score: 30, labelEn: "Needs remedies (Yama gate)", labelHi: "उपाय आवश्यक (यम द्वार)", labelMr: "उपाय आवश्यक (यम द्वार)", status: "average" },
    SW: { score: 5, labelEn: "Very harmful. Causes heavy losses.", labelHi: "अत्यंत अशुभ। भारी आर्थिक संकट।", labelMr: "अत्यंत अशुभ. मोठे आर्थिक संकट.", status: "poor" },
    C: { score: 10, labelEn: "Avoid main door in absolute center.", labelHi: "टालें।", labelMr: "टाळा.", status: "poor" },
  }
};

export default function VastuChecker({ dict, locale }) {
  const [layout, setLayout] = useState({}); // { room_id: direction_id }
  const [activeRoom, setActiveRoom] = useState(ROOMS[0].id);
  const [activeDirection, setActiveDirection] = useState(DIRECTIONS[0].id);

  function handleAddRoom() {
    setLayout((prev) => ({
      ...prev,
      [activeRoom]: activeDirection,
    }));
  }

  function handleClear() {
    setLayout({});
  }

  function handleCellClick(dirId) {
    setActiveDirection(dirId);
    // If double clicked or room is active, assign immediately
    setLayout((prev) => ({
      ...prev,
      [activeRoom]: dirId,
    }));
  }

  // Calculate scores
  const placedRooms = Object.entries(layout);
  let totalScore = 0;
  let scoreText = "";
  let scoreColor = "text-cream";

  if (placedRooms.length > 0) {
    const sum = placedRooms.reduce((acc, [roomId, dirId]) => {
      const rule = VASTU_RULES[roomId]?.[dirId] || { score: 30 };
      return acc + rule.score;
    }, 0);
    totalScore = Math.round(sum / placedRooms.length);

    if (totalScore >= 85) {
      scoreText = dict.vastu.excellent;
      scoreColor = "text-emerald-400";
    } else if (totalScore >= 60) {
      scoreText = dict.vastu.good;
      scoreColor = "text-brass";
    } else if (totalScore >= 40) {
      scoreText = dict.vastu.average;
      scoreColor = "text-amber-500";
    } else {
      scoreText = dict.vastu.poor;
      scoreColor = "text-sindoor-light";
    }
  }

  return (
    <div className="space-y-8 rise-in">
      <div className="grid lg:grid-cols-5 gap-10 items-start">
        {/* Interactive Grid Map */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative w-full max-w-[380px] aspect-square mx-auto bg-[#1b152b]/40 border-2 border-brass/30 p-4 rounded-2xl shadow-2xl">
            {/* Compass labels */}
            <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-brass font-bold select-none">N (उत्तर)</span>
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-brass font-bold select-none">S (दक्षिण)</span>
            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-brass font-bold select-none">W (पश्चिम)</span>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-brass font-bold select-none">E (पूर्व)</span>

            <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full pt-3 pb-3">
              {DIRECTIONS.map((dir) => {
                const isSelected = activeDirection === dir.id;
                
                // Find what rooms are placed here
                const placedHere = Object.entries(layout)
                  .filter(([_, dId]) => dId === dir.id)
                  .map(([rId]) => ROOMS.find((r) => r.id === rId));

                return (
                  <button
                    key={dir.id}
                    type="button"
                    onClick={() => handleCellClick(dir.id)}
                    className={`rounded-xl border p-2 flex flex-col justify-between items-center text-center transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-brass/10 border-brass scale-[1.02] shadow-md shadow-brass/5"
                        : "bg-ink border-ink-3 hover:border-brass/40"
                    }`}
                  >
                    <span className="text-[10px] font-bold text-brass/75 tracking-wider select-none">
                      {dir.id}
                    </span>
                    
                    <div className="flex flex-col gap-1 w-full overflow-hidden">
                      {placedHere.map((room) => {
                        const rule = VASTU_RULES[room.id]?.[dir.id] || { status: "poor" };
                        const dotColor =
                          rule.status === "excellent"
                            ? "bg-emerald-500 text-emerald-400"
                            : rule.status === "good"
                            ? "bg-teal-500 text-teal-400"
                            : rule.status === "average"
                            ? "bg-amber-500 text-amber-400"
                            : "bg-sindoor text-sindoor-light";

                        return (
                          <span
                            key={room.id}
                            className={`text-[9px] font-medium leading-tight py-0.5 px-1 rounded bg-ink-2 truncate border border-ink-3 border-l-2`}
                            style={{ borderLeftColor: rule.status === "excellent" ? "#10b981" : rule.status === "good" ? "#14b8a6" : rule.status === "average" ? "#f59e0b" : "#ef4444" }}
                            title={room.label[locale]}
                          >
                            {room.label[locale].split(" ")[0]}
                          </span>
                        );
                      })}
                    </div>
                    
                    <span className="text-[8px] text-cream-dim/40 max-w-full truncate select-none">
                      {dir.label[locale].split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="plaque p-5 space-y-4">
            <h3 className="text-brass font-display font-semibold text-base select-none">
              ⚙️ {locale === "en" ? "Configure Layout" : locale === "hi" ? "लेआउट कॉन्फ़िगर करें" : "लेआउट कॉन्फिगर करा"}
            </h3>

            {/* Room Selector */}
            <label className="block">
              <span className="block text-xs text-cream-dim mb-1">{dict.vastu.room}</span>
              <select
                value={activeRoom}
                onChange={(e) => setActiveRoom(e.target.value)}
                className="input w-full"
              >
                {ROOMS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label[locale]}
                  </option>
                ))}
              </select>
            </label>

            {/* Direction Selector */}
            <label className="block">
              <span className="block text-xs text-cream-dim mb-1">{dict.vastu.direction}</span>
              <select
                value={activeDirection}
                onChange={(e) => setActiveDirection(e.target.value)}
                className="input w-full"
              >
                {DIRECTIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label[locale]}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddRoom}
                className="flex-1 bg-sindoor hover:bg-sindoor-light text-cream font-semibold py-2.5 rounded text-xs transition-colors cursor-pointer select-none"
              >
                📍 {dict.vastu.addRoom}
              </button>
              {placedRooms.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="border border-ink-3 hover:border-sindoor-light text-cream-dim hover:text-cream px-3 py-2.5 rounded text-xs transition-colors cursor-pointer select-none"
                >
                  🗑️ {dict.vastu.clear}
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          {placedRooms.length > 0 ? (
            <div className="plaque p-5 space-y-4 border-brass/35 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <span className="text-xs text-cream-dim block uppercase tracking-wider">{dict.vastu.score}</span>
                <div className={`text-4xl font-numeral font-black ${scoreColor}`}>{totalScore}%</div>
                <div className={`text-sm font-semibold ${scoreColor}`}>{scoreText}</div>
              </div>

              {/* Recommendations list */}
              <div className="space-y-3 pt-2 border-t border-ink-3/60">
                <h4 className="text-xs font-bold text-brass uppercase tracking-wider">{dict.vastu.recommendations}</h4>
                <div className="max-h-[220px] overflow-y-auto space-y-2.5 pr-1 text-xs">
                  {placedRooms.map(([roomId, dirId]) => {
                    const room = ROOMS.find((r) => r.id === roomId);
                    const rule = VASTU_RULES[roomId]?.[dirId] || { score: 30, labelEn: "Bad placement" };
                    const text = locale === "en" ? rule.labelEn : locale === "hi" ? rule.labelHi : rule.labelMr;
                    
                    const color =
                      rule.status === "excellent"
                        ? "text-emerald-400"
                        : rule.status === "good"
                        ? "text-teal-400"
                        : rule.status === "average"
                        ? "text-amber-500"
                        : "text-sindoor-light";

                    return (
                      <div key={roomId} className="border-b border-ink-3/45 pb-2">
                        <div className="flex justify-between font-semibold mb-0.5">
                          <span className="text-cream">{room?.label[locale]}</span>
                          <span className={`${color}`}>{rule.score}/100</span>
                        </div>
                        <p className="text-cream-dim/80 text-[11px] leading-relaxed">{text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Booking Link */}
              <div className="pt-2">
                <Link
                  href={`/${locale}/book?service=vastu-shanti`}
                  className="w-full bg-brass hover:bg-brass-light text-ink text-center font-bold py-2.5 rounded block text-xs transition-all shadow-md select-none"
                >
                  💬 {locale === "en" ? "Consult Guruji for Remedies" : locale === "hi" ? "उपायों के लिए गुरुजी से परामर्श करें" : "वास्तु दोषांवरील उपायांसाठी गुरुजींशी संपर्क साधा"}
                </Link>
              </div>
            </div>
          ) : (
            <div className="plaque p-6 text-center text-cream-dim text-xs select-none">
              🧭 Place rooms (like Temple, Kitchen, Bed) in their directions to compute Vastu score and read remedies.
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
          padding: 0.55rem 0.7rem;
          font-size: 0.85rem;
        }
        .input:focus {
          outline: 2px solid var(--color-brass);
          outline-offset: 1px;
        }
      `}</style>
    </div>
  );
}
