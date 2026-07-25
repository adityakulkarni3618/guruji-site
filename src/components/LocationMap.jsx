"use client";

export default function LocationMap() {
  const address = "Behind Vidyavikas School, Shrinagar, Barshi Road, Latur, Maharashtra";
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Sai+Shakti+Jyotish+Kendra+Latur+Maharashtra";
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Sai+Shakti+Jyotish+Kendra+Shrinagar+Barshi+Road+Latur+Maharashtra";

  // OpenStreetMap embed for Latur, Maharashtra (Shrinagar area)
  const osmEmbedUrl =
    "https://www.openstreetmap.org/export/embed.html?bbox=76.5580,18.4000,76.5780,18.4100&layer=mapnik&marker=18.4050,76.5680";

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-brass/20 shadow-2xl">
      {/* Map header pill */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-ink/80 backdrop-blur-sm px-4 py-2 rounded-full border border-brass/30 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span className="text-xs font-semibold text-cream tracking-wide">Sai Shakti Jyotish Kendra</span>
      </div>

      {/* Map */}
      <iframe
        src={osmEmbedUrl}
        width="100%"
        height="340"
        style={{ border: 0, display: "block", filter: "invert(90%) hue-rotate(180deg) saturate(0.8) brightness(0.85)" }}
        allowFullScreen=""
        loading="lazy"
        title="Sai Shakti Jyotish Kendra Location"
      />

      {/* Bottom action bar */}
      <div className="flex items-center gap-3 bg-ink-2 border-t border-brass/20 px-5 py-3.5">
        <div className="flex-1">
          <div className="text-xs text-brass font-semibold tracking-wide mb-0.5">📍 Our Location</div>
          <p className="text-xs text-cream-dim leading-snug">{address}</p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-sindoor hover:bg-sindoor-light text-cream text-xs font-semibold px-3.5 py-2 rounded-lg transition-all hover:scale-105 select-none"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Directions
          </a>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-ink-3 hover:bg-brass/20 border border-brass/30 text-brass text-xs font-semibold px-3.5 py-2 rounded-lg transition-all hover:scale-105 select-none"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            View Map
          </a>
        </div>
      </div>
    </div>
  );
}
