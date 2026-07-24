"use client";

import { useRouter, usePathname } from "next/navigation";
import { locales } from "@/i18n/dictionaries";

const LABELS = { mr: "मराठी", hi: "हिंदी", en: "English" };

export default function LanguageSwitcher({ locale }) {
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(newLocale) {
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${newLocale}/${rest}`);
  }

  return (
    <div className="flex items-center gap-1 text-xs border border-ink-3 rounded-full p-0.5">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchTo(loc)}
          className={`px-2.5 py-1 rounded-full transition-colors ${
            loc === locale ? "bg-brass text-ink font-semibold" : "text-cream-dim hover:text-cream"
          }`}
        >
          {LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
