export default function PanchangCard({ dict, data, locale }) {
  const dateLabel = new Date(data.date).toLocaleDateString(
    locale === "en" ? "en-IN" : locale === "hi" ? "hi-IN" : "mr-IN",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const rows = [
    [dict.panchang.tithi, `${data.paksha ? data.paksha + " · " : ""}${data.tithi}`],
    [dict.panchang.nakshatra, data.nakshatra],
    [dict.panchang.yoga, data.yoga],
    [dict.panchang.karan, data.karan],
    [dict.panchang.sunrise, data.sunrise],
    [dict.panchang.sunset, data.sunset],
    [dict.panchang.rahuKaal, data.rahuKaal],
    [dict.panchang.gulikaKaal, data.gulikaKaal],
  ];

  return (
    <div className="plaque p-6 md:p-8 max-w-xl w-full rise-in">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-brass text-xl md:text-2xl">{dict.panchang.title}</h3>
          <span className="font-numeral text-sm text-cream-dim">{dateLabel}</span>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-ink-3 pb-1.5">
              <dt className="text-cream-dim text-sm">{label}</dt>
              <dd className="font-numeral text-sm text-cream text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
