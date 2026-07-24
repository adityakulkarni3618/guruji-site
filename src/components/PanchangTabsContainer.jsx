"use client";

import { useState } from "react";
import PanchangCard from "./PanchangCard";
import MonthlyCalendar from "./MonthlyCalendar";

export default function PanchangTabsContainer({ todayPanchang, locale, dict }) {
  const [activeTab, setActiveTab] = useState("today"); // 'today' | 'month'

  const labels = {
    today: {
      en: "Today's Panchang",
      hi: "आज का पंचांग",
      mr: "आजचे पंचांग",
    }[locale] || "Today's Panchang",
    month: {
      en: "Monthly Calendar",
      hi: "मासिक कैलेंडर",
      mr: "मासिक कॅलेंडर",
    }[locale] || "Monthly Calendar",
  };

  // WhatsApp share message formatter
  function sharePanchang() {
    const text = encodeURIComponent(
      `🕉️ *${dict.panchang.title}* - ${new Date(todayPanchang.date).toLocaleDateString(locale === "en" ? "en-IN" : locale === "hi" ? "hi-IN" : "mr-IN", { day: "numeric", month: "long", year: "numeric" })}\n\n` +
      `• *${dict.panchang.tithi}*: ${todayPanchang.paksha ? todayPanchang.paksha + " · " : ""}${todayPanchang.tithi}\n` +
      `• *${dict.panchang.nakshatra}*: ${todayPanchang.nakshatra}\n` +
      `• *${dict.panchang.yoga}*: ${todayPanchang.yoga}\n` +
      `• *${dict.panchang.karan}*: ${todayPanchang.karan}\n` +
      `• *${dict.panchang.sunrise}*: ${todayPanchang.sunrise}\n` +
      `• *${dict.panchang.sunset}*: ${todayPanchang.sunset}\n` +
      `• *Rahu Kaal*: ${todayPanchang.rahuKaal}\n\n` +
      `Shared from: https://rahuljoshi.vercel.app/${locale}/panchang`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex justify-center border-b border-ink-3 pb-px">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("today")}
            className={`px-5 py-2.5 font-display text-sm font-semibold transition-all border-b-2 cursor-pointer select-none ${
              activeTab === "today"
                ? "border-brass text-brass"
                : "border-transparent text-cream-dim hover:text-cream"
            }`}
          >
            {labels.today}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("month")}
            className={`px-5 py-2.5 font-display text-sm font-semibold transition-all border-b-2 cursor-pointer select-none ${
              activeTab === "month"
                ? "border-brass text-brass"
                : "border-transparent text-cream-dim hover:text-cream"
            }`}
          >
            {labels.month}
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === "today" ? (
        <div className="flex flex-col items-center gap-6">
          <PanchangCard dict={dict} data={todayPanchang} locale={locale} />
          
          {/* Quick share button */}
          <button
            type="button"
            onClick={sharePanchang}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-black font-semibold px-6 py-2.5 rounded-full transition-colors cursor-pointer text-sm shadow-md"
          >
            💬 Share Today's Panchang on WhatsApp
          </button>
        </div>
      ) : (
        <div className="animate-in fade-in duration-200">
          <MonthlyCalendar locale={locale} dict={dict} />
        </div>
      )}
    </div>
  );
}
