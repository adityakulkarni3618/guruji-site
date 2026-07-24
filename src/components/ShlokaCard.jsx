"use client";

import { useState } from "react";

export default function ShlokaCard({ data, locale, dict }) {
  const [activeTab, setActiveTab] = useState(locale); // 'en' | 'hi' | 'mr'

  const translations = {
    en: data.translationEn || "Translation not available.",
    hi: data.translationHi || "अनुवाद उपलब्ध नहीं है।",
    mr: data.translationMr || "भाषांतर उपलब्ध नाही.",
  };

  const labels = {
    en: "English",
    hi: "हिंदी",
    mr: "मराठी",
  };

  const cardTitle = {
    en: "Daily Shloka",
    hi: "दैनिक श्लोक",
    mr: "दैनिक श्लोक",
  }[locale] || "Daily Shloka";

  return (
    <div className="plaque p-6 md:p-8 max-w-xl w-full text-center relative overflow-hidden rise-in">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brass/20 via-brass to-brass/20"></div>
      
      <div className="relative z-10 space-y-5">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-brass font-bold">
            {cardTitle}
          </span>
          <div className="w-16 h-[1px] bg-brass/30 mx-auto mt-2"></div>
        </div>

        <blockquote className="text-lg md:text-xl font-display text-cream font-medium leading-relaxed whitespace-pre-line italic px-4 py-2 border-l-2 border-r-2 border-brass/20">
          “{data.shloka}”
        </blockquote>

        <div className="space-y-3">
          <div className="flex justify-center gap-1.5 text-[11px]">
            {["mr", "hi", "en"].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveTab(lang)}
                className={`px-3 py-1 rounded-full border transition-all cursor-pointer ${
                  activeTab === lang
                    ? "border-brass bg-brass text-ink font-semibold"
                    : "border-ink-3 text-cream-dim hover:text-cream hover:border-cream-dim/30"
                }`}
              >
                {labels[lang]}
              </button>
            ))}
          </div>

          <p className="text-sm text-cream-dim leading-relaxed min-h-[40px] px-2 italic">
            {translations[activeTab]}
          </p>
        </div>
      </div>
    </div>
  );
}
