"use client";

import { useState } from "react";

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
}

function GalleryImage({ src, alt }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div className="w-full aspect-video flex flex-col items-center justify-center bg-ink-2 text-cream-dim text-sm gap-2">
        <svg className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="opacity-40 text-xs">Image not available</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ""}
      className="w-full aspect-video object-cover"
      onError={() => setBroken(true)}
    />
  );
}

export default function GalleryGrid({ items }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        const embedUrl = getYouTubeEmbedUrl(item.url);
        return (
          <div key={item.id} className="rounded-lg overflow-hidden border border-ink-3 bg-ink-2/20">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={item.captionEn || "Gallery Video"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video object-cover"
              />
            ) : item.mediaType === "video" ? (
              <video src={item.url} controls className="w-full aspect-video object-cover" />
            ) : (
              <GalleryImage src={item.url} alt={item.captionEn} />
            )}
            {item.captionEn && <div className="p-2 text-sm text-cream-dim">{item.captionEn}</div>}
          </div>
        );
      })}
    </div>
  );
}
