"use client";

import { useState, useEffect } from "react";

const EXPLANATIONS = {
  en: {
    tithi: "Lunisolar day representing the phase of the Moon. Auspicious for specific rituals.",
    nakshatra: "Lunar mansion or stellar constellation the Moon is traveling through. Sets the day's energy.",
    yoga: "Mathematical combination of Sun and Moon positions. Indicates the general auspiciousness.",
    karan: "Half of a Tithi (lunar day). Guides actions and worldly tasks.",
    rahuKaal: "Inauspicious window of the day. Traditionally avoided for starting major new projects.",
    gulikaKaal: "Auspicious or neutral window. Good for starting long-term positive tasks.",
  },
  mr: {
    tithi: "चंद्राच्या कलेनुसार ठरणारा दिवस. विशिष्ट पूजा व विधींसाठी याचे महत्त्व असते.",
    nakshatra: "चंद्र ज्या नक्षत्रातून प्रवास करत आहे ती नक्षत्र स्थिती. दिवसाची ऊर्जा दर्शवते.",
    yoga: "सूर्य आणि चंद्राच्या स्थानांची बेरीज. शुभ-अशुभ काळ ओळखण्यासाठी उपयुक्त.",
    karan: "तिथीचा अर्धा भाग. ठराविक कामांसाठी याचे विशेष महत्त्व असते.",
    rahuKaal: "दिवसाचा अशुभ काळ. नवीन आणि महत्त्वाच्या कामांची सुरुवात करणे टाळावे.",
    gulikaKaal: "दिवसाचा शुभ काळ. दीर्घकालीन सकारात्मक कामांसाठी चांगला मानला जातो.",
  },
  hi: {
    tithi: "चंद्र की कला के अनुसार तय होने वाला दिन। विशिष्ट अनुष्ठानों के लिए महत्वपूर्ण है।",
    nakshatra: "चंद्रमा जिस नक्षत्र से गोचर कर रहा है। यह दिन की ऊर्जा को निर्धारित करता है।",
    yoga: "सूर्य और चंद्रमा की स्थिति का योग। सामान्य शुभता या अशुभता का संकेत देता है।",
    karan: "तिथि का आधा भाग। कर्मों और कार्यों की दिशा तय करने में सहायक है।",
    rahuKaal: "दिन का अशुभ समय। नए और महत्वपूर्ण कार्यों की शुरुआत इस समय टालनी चाहिए।",
    gulikaKaal: "दिन का शुभ या तटस्थ समय। दीर्घकालिक सकारात्मक कार्यों के लिए शुभ माना जाता है।",
  }
};

export default function PanchangCard({ dict, data, locale, isCompact = false }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isCompact) return;
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString(
          locale === "en" ? "en-IN" : locale === "hi" ? "hi-IN" : "mr-IN",
          { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }
        )
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isCompact, locale]);

  const dateLabel = new Date(data.date).toLocaleDateString(
    locale === "en" ? "en-IN" : locale === "hi" ? "hi-IN" : "mr-IN",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const weekdayLabel = new Date(data.date).toLocaleDateString(
    locale === "en" ? "en-IN" : locale === "hi" ? "hi-IN" : "mr-IN",
    { weekday: "long" }
  );

  const tithiLabel = `${data.paksha ? data.paksha + " · " : ""}${data.tithi}`;

  if (isCompact) {
    return (
      <div className="plaque p-6 max-w-sm w-full rise-in relative overflow-hidden text-center border border-brass/20">
        <div className="relative z-10 space-y-4">
          <div>
            <h3 className="text-brass text-xs font-semibold tracking-wider uppercase">
              {dict.panchang.title}
            </h3>
            <div className="w-12 h-[1px] bg-brass/30 mx-auto mt-1.5"></div>
          </div>
          
          <div className="space-y-1 select-none">
            <div className="text-cream text-lg font-semibold">{weekdayLabel}</div>
            <div className="text-cream-dim text-xs font-numeral">{dateLabel}</div>
          </div>

          {mounted && currentTime ? (
            <div className="text-brass text-2xl font-mono tracking-widest font-semibold bg-ink-2/50 py-2 px-3 rounded border border-brass/10 min-h-[44px] flex items-center justify-center select-none">
              {currentTime}
            </div>
          ) : (
            <div className="min-h-[44px]"></div>
          )}

          <div className="border-t border-ink-3 pt-3 flex justify-between items-center text-[13px]">
            <span className="text-cream-dim">{dict.panchang.tithi}:</span>
            <span className="text-cream font-medium font-numeral">{tithiLabel}</span>
          </div>
        </div>
      </div>
    );
  }

  const rows = [
    ["tithi", dict.panchang.tithi, tithiLabel],
    ["nakshatra", dict.panchang.nakshatra, data.nakshatra],
    ["yoga", dict.panchang.yoga, data.yoga],
    ["karan", dict.panchang.karan, data.karan],
    ["sunrise", dict.panchang.sunrise, data.sunrise],
    ["sunset", dict.panchang.sunset, data.sunset],
    ["rahuKaal", dict.panchang.rahuKaal, data.rahuKaal],
    ["gulikaKaal", dict.panchang.gulikaKaal, data.gulikaKaal],
  ];

  return (
    <div className="plaque p-6 md:p-8 max-w-xl w-full rise-in relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-brass text-xl md:text-2xl font-semibold">{dict.panchang.title}</h3>
          <span className="font-numeral text-sm text-cream-dim">{dateLabel}</span>
        </div>
        <dl className="space-y-2.5">
          {rows.map(([key, label, value]) => {
            const hasExpl = EXPLANATIONS[locale]?.[key];
            const isExpanded = expandedRow === key;
            return (
              <div key={key} className="border-b border-ink-3 pb-2">
                <div
                  onClick={() => hasExpl && setExpandedRow(isExpanded ? null : key)}
                  className={`flex justify-between items-center py-1 transition-colors select-none ${
                    hasExpl ? "cursor-pointer hover:text-brass" : ""
                  }`}
                >
                  <dt className="text-cream-dim text-[13px] flex items-center gap-1.5">
                    {label}
                    {hasExpl && (
                      <span className="text-[10px] text-brass/80 border border-brass/30 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center font-bold">
                        i
                      </span>
                    )}
                  </dt>
                  <dd className="font-numeral text-[13px] text-cream text-right font-medium">{value}</dd>
                </div>
                {isExpanded && hasExpl && (
                  <dd className="text-xs text-brass-light bg-ink-2/50 border border-brass/10 px-3 py-2.5 rounded mt-2.5 animate-in slide-in-from-top-1 duration-200">
                    {hasExpl}
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
