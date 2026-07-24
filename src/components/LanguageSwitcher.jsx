"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { locales } from "@/i18n/dictionaries";

const LABELS = { mr: "मराठी", hi: "हिंदी", en: "English" };

export default function LanguageSwitcher({ locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function switchTo(newLocale) {
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${newLocale}/${rest}`);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center gap-1 text-xs border border-ink-3 rounded-full px-3.5 h-[32px] text-cream-dim hover:text-cream hover:border-brass bg-ink-2/30 transition-colors cursor-pointer"
        aria-label="Select Language"
      >
        <span>🌐 {LABELS[locale]}</span> <span className="text-[10px] text-cream-dim ml-0.5">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-32 bg-ink-2 border border-ink-3 rounded-md shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          {locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => switchTo(loc)}
              className="w-full text-left px-3 py-1.5 text-xs text-cream hover:text-brass hover:bg-ink-3 transition-colors flex items-center gap-2"
            >
              {LABELS[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
