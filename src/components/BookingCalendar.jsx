"use client";

import { useState, useMemo } from "react";
import { calculatePanchang, DEFAULT_LOCATION } from "@/lib/panchang";

function getTithiShortName(date, locale) {
  const calcDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0, 0);
  const p = calculatePanchang(calcDate, DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);

  const abbreviations = {
    en: {
      Pratipada: "Prat", Dwitiya: "Dwi", Tritiya: "Tri", Chaturthi: "Chat", Panchami: "Panch",
      Shashthi: "Shash", Saptami: "Sapt", Ashtami: "Ash", Navami: "Nav", Dashami: "Dash",
      Ekadashi: "Eka", Dwadashi: "Dwa", Trayodashi: "Tray", Chaturdashi: "Chat", Purnima: "Purn",
      Amavasya: "Amav"
    },
    hi: {
      Pratipada: "प्रति", Dwitiya: "द्वि", Tritiya: "त्रि", Chaturthi: "चतु", Panchami: "पंच",
      Shashthi: "षष्ठी", Saptami: "सप्त", Ashtami: "अष्ट", Navami: "नव", Dashami: "दश",
      Ekadashi: "एका", Dwadashi: "द्वा", Trayodashi: "त्रयो", Chaturdashi: "चतु", Purnima: "पूर्णि",
      Amavasya: "अमा"
    },
    mr: {
      Pratipada: "प्रति", Dwitiya: "द्वि", Tritiya: "त्रि", Chaturthi: "चतु", Panchami: "पंच",
      Shashthi: "षष्ठी", Saptami: "सप्त", Ashtami: "अष्ट", Navami: "नव", Dashami: "दश",
      Ekadashi: "एका", Dwadashi: "द्वा", Trayodashi: "त्रयो", Chaturdashi: "चतु", Purnima: "पौर्णि",
      Amavasya: "अमा"
    }
  }[locale] || {};

  return abbreviations[p.tithi] || p.tithi.slice(0, 4);
}

export default function BookingCalendar({ locale, dict, onSelect }) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");

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
  }[locale] || [];

  const weekdayLabels = {
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    mr: ["रवि", "सोम", "मंगळ", "बुध", "गुरू", "शुक्र", "शनी"],
    hi: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
  }[locale] || [];

  const slots = {
    en: [
      { id: "morning", label: "Morning (09:00 AM - 12:00 PM)", short: "Pratah Kaal" },
      { id: "afternoon", label: "Afternoon (12:00 PM - 04:00 PM)", short: "Madhyahna" },
      { id: "evening", label: "Evening (04:00 PM - 08:00 PM)", short: "Pradosh Kaal" }
    ],
    hi: [
      { id: "morning", label: "प्रातः काल (09:00 AM - 12:00 PM)", short: "प्रातः" },
      { id: "afternoon", label: "मध्याह्न काल (12:00 PM - 04:00 PM)", short: "मध्याह्न" },
      { id: "evening", label: "प्रदोष काल (04:00 PM - 08:00 PM)", short: "प्रदोष" }
    ],
    mr: [
      { id: "morning", label: "प्रातः काळ (09:00 AM - 12:00 PM)", short: "प्रातः" },
      { id: "afternoon", label: "मध्यान्ह काळ (12:00 PM - 04:00 PM)", short: "मध्यान्ह" },
      { id: "evening", label: "प्रदोष काळ (04:00 PM - 08:00 PM)", short: "प्रदोष" }
    ]
  }[locale] || [];

  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const memoToday = new Date();
    const todayStart = new Date(memoToday.getFullYear(), memoToday.getMonth(), memoToday.getDate());

    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isPast = new Date(date.getFullYear(), date.getMonth(), date.getDate()) < todayStart;
      
      // Allow bookings on all days (Sundays are no longer blocked)
      const isBooked = false;

      cells.push({
        day,
        date,
        isPast,
        isBooked,
        tithiShort: getTithiShortName(date, locale),
      });
    }

    return cells;
  }, [currentYear, currentMonth, locale]);

  function handleDateClick(cell) {
    if (cell.isPast || cell.isBooked) return;
    setSelectedDate(cell.date);
    setSelectedSlot("");
  }

  function handleSlotClick(slot) {
    setSelectedSlot(slot.id);
    const dateStr = selectedDate.toISOString().slice(0, 10);
    onSelect(dateStr, slot.label);
  }

  return (
    <div className="bg-ink-2 border border-ink-3 rounded-2xl p-5 md:p-6 shadow-xl space-y-6 max-w-lg mx-auto">
      {/* Calendar Header Navigation */}
      <div className="flex justify-between items-center pb-2 border-b border-ink-3/60">
        <button
          type="button"
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentMonth(11);
              setCurrentYear(y => y - 1);
            } else {
              setCurrentMonth(m => m - 1);
            }
          }}
          className="p-1.5 border border-ink-3 rounded-full text-cream-dim hover:text-brass hover:border-brass transition-colors cursor-pointer select-none"
        >
          ◀
        </button>
        <h3 className="text-brass font-display font-bold text-lg select-none">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          type="button"
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentMonth(0);
              setCurrentYear(y => y + 1);
            } else {
              setCurrentMonth(m => m + 1);
            }
          }}
          className="p-1.5 border border-ink-3 rounded-full text-cream-dim hover:text-brass hover:border-brass transition-colors cursor-pointer select-none"
        >
          ▶
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-brass uppercase select-none">
        {weekdayLabels.map((lbl, idx) => (
          <div key={idx} className="py-1">{lbl}</div>
        ))}
      </div>

      {/* Monthly grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarCells.map((cell, idx) => {
          if (!cell) {
            return <div key={`empty-${idx}`} className="aspect-square bg-transparent"></div>;
          }

          const isSelected = selectedDate && selectedDate.toDateString() === cell.date.toDateString();
          const isDisabled = cell.isPast || cell.isBooked;

          return (
            <button
              key={cell.day}
              type="button"
              disabled={isDisabled}
              onClick={() => handleDateClick(cell)}
              className={`aspect-square rounded-xl border flex flex-col justify-between p-2 select-none relative transition-all duration-200 ${
                isSelected
                  ? "bg-brass border-brass text-ink font-bold scale-[1.03] shadow-md shadow-brass/10"
                  : isDisabled
                  ? "bg-ink/20 border-ink-3/40 text-cream-dim/20 cursor-not-allowed"
                  : "bg-ink border-ink-3 hover:border-brass text-cream cursor-pointer"
              }`}
            >
              {/* Day number */}
              <span className="text-sm font-bold leading-none">{cell.day}</span>
              
              {/* Tithi name abbreviation */}
              {!isDisabled && (
                <span className={`text-[9px] self-end leading-none font-medium px-1 rounded-sm uppercase tracking-wide truncate max-w-full ${
                  isSelected ? "bg-ink text-brass" : "text-cream-dim/60"
                }`}>
                  {cell.tithiShort}
                </span>
              )}

              {/* Status indicators */}
              {cell.isBooked && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-sindoor rounded-full"></span>
              )}
              {!cell.isBooked && !cell.isPast && !isSelected && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Select Time Slots Section */}
      {selectedDate && (
        <div className="border-t border-ink-3/60 pt-5 animate-in fade-in duration-200 space-y-3">
          <div className="text-sm text-cream-dim flex justify-between">
            <span>
              {dict.booking.date}: <strong className="text-cream">{selectedDate.toLocaleDateString(locale === "en" ? "en-IN" : locale === "hi" ? "hi-IN" : "mr-IN", { day: "numeric", month: "long", year: "numeric" })}</strong>
            </span>
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="text-xs text-sindoor-light hover:underline cursor-pointer"
            >
              Clear Selection
            </button>
          </div>

          <div className="grid gap-2">
            {slots.map((slot) => {
              const isActive = selectedSlot === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleSlotClick(slot)}
                  className={`w-full py-2.5 px-4 rounded-xl text-left text-sm border flex justify-between items-center transition-all cursor-pointer ${
                    isActive
                      ? "bg-brass text-ink font-semibold border-brass"
                      : "bg-ink border-ink-3 text-cream-dim hover:text-cream hover:border-cream-dim/30"
                  }`}
                >
                  <span>{slot.label}</span>
                  <span className={`text-xs uppercase px-2 py-0.5 rounded-full ${
                    isActive ? "bg-ink text-brass font-bold" : "bg-ink-2 text-cream-dim"
                  }`}>
                    {slot.short}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
