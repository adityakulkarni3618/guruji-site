"use client";

import { useState, useEffect } from "react";

export default function PosterSlider({ posters }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % posters.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [posters.length]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % posters.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + posters.length) % posters.length);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto plaque overflow-hidden p-3 md:p-4 rise-in select-none">
      {/* Decorative Golden Top Border Accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-brass/10 via-brass to-brass/10 z-10"></div>

      {/* Main Slide Wrapper - Uses height instead of aspect-ratio to fit different image formats beautifully */}
      <div className="relative h-[280px] sm:h-[400px] md:h-[500px] w-full flex items-center justify-center bg-black/60 rounded overflow-hidden border border-ink-3">
        {posters.map((poster, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center p-4 transition-all duration-700 ease-in-out ${
              index === activeIndex
                ? "opacity-100 scale-100 translate-x-0 z-10"
                : "opacity-0 scale-95 pointer-events-none translate-x-4 z-0"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster.src}
              alt={poster.alt}
              className="max-w-full max-h-full object-contain rounded shadow-2xl border border-ink-3"
            />
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-3 left-center z-20 w-10 h-10 rounded-full bg-ink/80 hover:bg-brass hover:text-ink text-brass border border-brass/40 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 text-lg font-bold"
          aria-label="Previous Poster"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-3 right-center z-20 w-10 h-10 rounded-full bg-ink/80 hover:bg-brass hover:text-ink text-brass border border-brass/40 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 text-lg font-bold"
          aria-label="Next Poster"
        >
          ›
        </button>
      </div>

      {/* Slide Indicators / Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {posters.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
              index === activeIndex
                ? "bg-brass w-6"
                : "bg-cream-dim/20 hover:bg-cream-dim/55"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .left-center {
          top: 50%;
          transform: translateY(-50%);
        }
        .right-center {
          top: 50%;
          transform: translateY(-50%);
        }
      `}</style>
    </div>
  );
}
