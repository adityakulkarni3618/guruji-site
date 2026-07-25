"use client";

import { useState, useRef, useEffect } from "react";

export default function AudioPlayer({ src, title = "Spiritual Aarti & Chant" }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);

  // Fallback to a serene open-source spiritual bansuri flute/mantra loop
  const audioSrc = src || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function handleLoadedMetadata() {
      setDuration(audio.duration);
    }

    function handleTimeUpdate() {
      setCurrentTime(audio.currentTime);
    }

    function handleAudioEnded() {
      setIsPlaying(false);
      setCurrentTime(0);
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleAudioEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleAudioEnded);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.log("Audio play deferred:", err));
    }
    setIsPlaying(!isPlaying);
  }

  function handleSeek(e) {
    const audio = audioRef.current;
    if (!audio) return;
    const seekTime = Number(e.target.value);
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  }

  function handleVolumeChange(e) {
    const audio = audioRef.current;
    if (!audio) return;
    const vol = Number(e.target.value);
    audio.volume = vol;
    setVolume(vol);
  }

  function formatTime(secs) {
    if (isNaN(secs)) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return (
    <div className="plaque p-4 max-w-md w-full relative overflow-hidden rise-in select-none">
      <audio ref={audioRef} src={audioSrc} loop />

      {/* Decorative accent lines */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-brass/10 via-brass/60 to-brass/10"></div>

      <div className="relative z-10 flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-sindoor hover:bg-sindoor-light text-cream flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer text-xl"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        {/* Info & Slider */}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-brass truncate mb-1">{title}</div>
          <div className="text-[10px] text-cream-dim/80 mb-2 truncate">Serene Devotional Recitation</div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-cream-dim/80 font-mono">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-ink-3 rounded-full appearance-none cursor-pointer accent-brass focus:outline-none"
            />
            <span className="text-[10px] text-cream-dim/80 font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume controls */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-brass">🔊</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={handleVolumeChange}
            className="w-12 h-1 bg-ink-3 rounded-full appearance-none cursor-pointer accent-brass focus:outline-none"
            style={{ transform: "rotate(-90deg)", margin: "14px 0" }}
          />
        </div>
      </div>
    </div>
  );
}
