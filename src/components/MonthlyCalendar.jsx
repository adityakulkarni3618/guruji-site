"use client";

import { useState, useMemo } from "react";
import { calculatePanchang, DEFAULT_LOCATION } from "@/lib/panchang";
import PanchangCard from "./PanchangCard";

// Tithi mapping to find festival days
// Shukla Ekadashi = index 10, Krishna Ekadashi = index 25
// Krishna Chaturthi (Sankashti) = index 18
// Purnima = index 14
// Amavasya = index 29
function getAuspiciousDayInfo(date) {
  // Always calculate at 6:00 AM local time of that date (sunrise baseline)
  const calcDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0, 0);
  const p = calculatePanchang(calcDate, DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
  
  // Find tithi index
  // Re-calculate the index
  const TITHI_NAMES = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
  ];

  const tithiIndex = TITHI_NAMES.indexOf(p.tithi);
  const isShukla = p.paksha === "Shukla";
  const actualIndex = isShukla ? tithiIndex : tithiIndex + 15;

  let event = null;
  if (tithiIndex === 10) {
    event = { type: "ekadashi", label: { en: "Ekadashi", hi: "एकादशी", mr: "एकादशी" } };
  } else if (tithiIndex === 25) {
    event = { type: "ekadashi", label: { en: "Ekadashi", hi: "एकादशी", mr: "एकादशी" } };
  } else if (tithiIndex === 18) {
    event = { type: "sankashti", label: { en: "Sankashti", hi: "संकष्टी", mr: "संकष्टी" } };
  } else if (tithiIndex === 14) {
    event = { type: "purnima", label: { en: "Purnima", hi: "पूर्णिमा", mr: "पौर्णिमा" } };
  } else if (tithiIndex === 29) {
    event = { type: "amavasya", label: { en: "Amavasya", hi: "अमावास्या", mr: "अमावास्या" } };
  }

  // Format times
  function fmtTime(d) {
    if (!d) return "--:--";
    return new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return {
    dateStr: date.toISOString().slice(0, 10),
    panchangData: {
      date: date.toISOString().slice(0, 10),
      tithi: p.tithi,
      paksha: p.paksha,
      nakshatra: p.nakshatra,
      yoga: p.yoga,
      karan: p.karan,
      sunrise: fmtTime(p.sunrise),
      sunset: fmtTime(p.sunset),
      rahuKaal: `${fmtTime(p.rahuKaal.start)} – ${fmtTime(p.rahuKaal.end)}`,
      gulikaKaal: `${fmtTime(p.gulikaKaal.start)} – ${fmtTime(p.gulikaKaal.end)}`,
    },
    event,
  };
}

export default function MonthlyCalendar({ locale, dict }) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [selectedDate, setSelectedDate] = useState(today);

  // Month details
  const monthNames = {
    en: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    mr: [
      "जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून",
      "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"
    ],
    hi: [
      "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
      "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
    ]
  }[locale] || [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekdayLabels = {
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    mr: ["रवि", "सोम", "मंगळ", "बुध", "गुरू", "शुक्र", "शनी"],
    hi: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
  }[locale] || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate all calendar cells for the current month
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const cells = [];

    // Empty cells before start of month
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const info = getAuspiciousDayInfo(date);
      cells.push({
        day,
        date,
        ...info,
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  // Selected date panchang info
  const selectedPanchangInfo = useMemo(() => {
    return getAuspiciousDayInfo(selectedDate);
  }, [selectedDate]);

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8 items-start">
      {/* Calendar Grid */}
      <div className="lg:col-span-3 plaque p-5 md:p-6 rise-in">
        {/* Header navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={prevMonth}
            className="p-2 border border-ink-3 hover:border-brass rounded-full text-cream hover:text-brass transition-colors cursor-pointer"
            aria-label="Previous Month"
          >
            ◀
          </button>
          <h2 className="text-xl text-brass font-bold font-display">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 border border-ink-3 hover:border-brass rounded-full text-cream hover:text-brass transition-colors cursor-pointer"
            aria-label="Next Month"
          >
            ▶
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-cream-dim mb-2 uppercase tracking-wide">
          {weekdayLabels.map((lbl, idx) => (
            <div key={idx} className="py-2">{lbl}</div>
          ))}
        </div>

        {/* Cells grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarCells.map((cell, idx) => {
            if (!cell) {
              return <div key={`empty-${idx}`} className="aspect-square bg-transparent"></div>;
            }

            const isSelected = selectedDate.toDateString() === cell.date.toDateString();
            const isToday = new Date().toDateString() === cell.date.toDateString();

            // Event theme colors
            const eventColors = {
              ekadashi: "bg-brass/10 border-brass text-brass",
              sankashti: "bg-sindoor/10 border-sindoor text-sindoor-light",
              purnima: "bg-purple-500/10 border-purple-500/40 text-purple-300",
              amavasya: "bg-slate-500/10 border-slate-500/40 text-slate-300",
            };

            return (
              <button
                key={cell.day}
                type="button"
                onClick={() => setSelectedDate(cell.date)}
                className={`aspect-square p-1 rounded-md border flex flex-col justify-between items-center transition-all cursor-pointer select-none text-left ${
                  isSelected
                    ? "border-brass bg-brass text-ink font-semibold"
                    : isToday
                    ? "border-cream/40 bg-ink-2/80 text-cream"
                    : cell.event
                    ? `${eventColors[cell.event.type]} border`
                    : "border-ink-3 bg-ink-2/30 text-cream-dim hover:border-cream-dim/30 hover:bg-ink-2/50"
                }`}
              >
                <span className="text-xs font-semibold self-start ml-0.5 mt-0.5">{cell.day}</span>
                {cell.event && (
                  <span className={`text-[7.5px] px-1 py-0.5 rounded-full font-bold uppercase truncate max-w-full text-center tracking-wide leading-none mb-0.5 ${
                    isSelected ? "bg-ink text-brass" : "bg-transparent"
                  }`}>
                    {cell.event.label[locale] || cell.event.label.en}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Panchang Detail */}
      <div className="lg:col-span-2 flex flex-col items-center">
        <PanchangCard dict={dict} data={selectedPanchangInfo.panchangData} locale={locale} />
      </div>
    </div>
  );
}
