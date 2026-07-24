"use client";

import { useState } from "react";

export default function SamagriChecklist({ samagri, dict, locale }) {
  const [checkedItems, setCheckedItems] = useState({});

  function toggle(idx) {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  }

  const pickLang = (obj, field) => {
    const key = locale === "en" ? `${field}En` : locale === "hi" ? `${field}Hi` : `${field}Mr`;
    return obj[key] || obj[`${field}En`] || obj[field] || "";
  };

  // WhatsApp share
  function shareChecklist() {
    const itemsText = samagri
      .map((item) => {
        const name = pickLang(item, "item");
        const qty = item.qty ? ` (${item.qty})` : "";
        return `• ${name}${qty}`;
      })
      .join("\n");

    const text = encodeURIComponent(
      `🛒 *Pooja Samagri Shopping List:*\n\n${itemsText}\n\nShared from: ${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div className="plaque p-5 md:p-6 mb-8 relative">
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-ink-3 pb-3">
        <h2 className="text-brass text-lg font-semibold">{dict.common.samagriRequired}</h2>
        
        <button
          type="button"
          onClick={shareChecklist}
          className="text-xs flex items-center justify-center gap-1.5 bg-ink hover:bg-ink-3 text-brass hover:text-brass-light border border-brass/30 px-3 py-1.5 rounded-full transition-colors cursor-pointer self-start sm:self-auto font-medium"
        >
          💬 Share List to WhatsApp
        </button>
      </div>

      <ul className="relative z-10 grid sm:grid-cols-2 gap-3 text-cream/90 text-sm">
        {samagri.map((item, i) => {
          const name = pickLang(item, "item");
          const isChecked = !!checkedItems[i];
          return (
            <li
              key={i}
              onClick={() => toggle(i)}
              className="flex items-center gap-3 cursor-pointer select-none py-1 hover:text-brass transition-colors"
            >
              <input
                type="checkbox"
                checked={isChecked}
                readOnly
                className="w-4.5 h-4.5 rounded border-ink-3 bg-ink-2 text-brass accent-brass focus:ring-0 cursor-pointer"
              />
              <span className={`leading-tight ${isChecked ? "line-through text-cream-dim/40" : ""}`}>
                {name} {item.qty && <span className="text-cream-dim text-xs ml-1">({item.qty})</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
