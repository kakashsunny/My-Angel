import React, { useState } from "react";
import { Sparkles, Crown, Heart, ArrowRight } from "lucide-react";
import { AMMUVERSE_CONFIG } from "../config/ammuverseConfig";
import { playMagicalChime } from "../utils/soundEffects";
import confetti from "canvas-confetti";

interface EnvelopeIntroProps {
  onOpenUniverse: () => void;
  isMuted: boolean;
  onStartAudio?: () => void;
  onReplayIntro?: () => void;
}

export const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({
  onOpenUniverse,
  isMuted,
  onStartAudio,
  onReplayIntro,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const cfg = AMMUVERSE_CONFIG.envelopeIntro;

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    // Trigger audio synchronously on user gesture so modern browsers never block autoplay
    onStartAudio?.();
    playMagicalChime(1, isMuted);

    // Delightful golden & pink confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.55 },
        colors: ["#F472B6", "#FDE047", "#FEF08A", "#FFB6C1", "#FB7185"],
        disableForReducedMotion: true,
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      onOpenUniverse();
    }, 1400);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-4 overflow-hidden select-none">
      {/* Delicate floating ambient aura */}
      <div className="pointer-events-none absolute h-[320px] w-[320px] rounded-full bg-pink-300/30 blur-3xl sm:h-[460px] sm:w-[460px]" />
      <div className="pointer-events-none absolute h-[240px] w-[240px] rounded-full bg-amber-200/25 blur-2xl" />

      {/* Header Tag */}
      <div className="z-10 mb-4 flex flex-col items-center text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-pink-300/60 bg-white/70 px-3.5 py-1 text-xs font-semibold tracking-widest text-pink-700 shadow-sm backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          <span>{cfg.badge}</span>
          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
        </div>
        <h1 className="font-serif-luxury text-3xl font-bold tracking-tight text-[#4a1525] sm:text-4xl md:text-5xl">
          A Gift For Princess Ammu
        </h1>
      </div>

      {/* The Magical Floating Envelope */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleOpen();
          }
        }}
        aria-label="Magical sealed envelope addressed to Ammu. Click to open your universe."
        className={`group relative z-10 w-full max-w-[340px] cursor-pointer sm:max-w-[400px] transition-all duration-700 ${
          isOpening
            ? "scale-110 opacity-90 -translate-y-4"
            : "hover:scale-[1.03] hover:-translate-y-1 animate-float-slow"
        }`}
      >
        {/* Envelope Body Frame */}
        <div className="relative aspect-[1.48/1] w-full rounded-2xl border-2 border-pink-200/90 bg-gradient-to-br from-[#FFF9FA] via-[#FFEBF1] to-[#FCE7F3] p-6 shadow-2xl shadow-rose-300/40">
          {/* Subtle envelope fold lines */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-35"
            viewBox="0 0 400 270"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Top flap diagonal lines */}
            <path
              d="M 12 12 L 200 135 L 388 12"
              stroke="#F472B6"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Bottom diagonal folds */}
            <path d="M 12 258 L 150 145" stroke="#F472B6" strokeWidth="1.2" />
            <path d="M 388 258 L 250 145" stroke="#F472B6" strokeWidth="1.2" />
          </svg>

          {/* Letter Peek when opening */}
          <div
            className={`absolute left-6 right-6 top-4 rounded-xl border border-pink-200/80 bg-white p-3 shadow-md transition-all duration-700 ${
              isOpening
                ? "-translate-y-12 opacity-100 scale-105"
                : "translate-y-0 opacity-40 group-hover:-translate-y-2 group-hover:opacity-75"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-pink-600 font-script-magic text-lg">
              <span>Happy Birthday Princess Gagana</span>
              <Heart className="h-4 w-4 fill-pink-400 text-pink-400" />
            </div>
          </div>

          {/* Golden Wax Seal with Crown */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div
              className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-200 p-1 shadow-lg shadow-amber-500/40 transition-transform duration-500 ${
                isOpening ? "scale-125 rotate-45 ring-4 ring-yellow-300" : "group-hover:scale-110"
              }`}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full border border-amber-600/30 bg-amber-400/90 shadow-inner">
                <Crown className="h-8 w-8 text-amber-900 fill-amber-700/60 crown-glow" />
              </div>

              {/* Glowing ring animation */}
              <div className="pointer-events-none absolute -inset-2 rounded-full border border-yellow-400/60 animate-ping opacity-60" />
            </div>
          </div>

          {/* Envelope Inscription */}
          <div className="absolute bottom-5 left-0 right-0 text-center">
            <p className="font-script-magic text-2xl font-bold tracking-wide text-rose-800 drop-shadow-sm sm:text-3xl">
              {cfg.envelopeTitle}
            </p>
            <p className="text-[11px] font-medium text-pink-600/80 mt-0.5 tracking-wider uppercase">
              Curated for Gagana
            </p>
          </div>
        </div>
      </div>

      {/* Subtitle Message */}
      <p className="z-10 mt-5 font-serif-luxury text-base italic text-rose-900/90 sm:text-lg">
        &ldquo;{cfg.subtitle}&rdquo;
      </p>

      {/* Action Buttons */}
      <div className="z-10 mt-4 flex flex-col items-center gap-2">
        <button
          onClick={handleOpen}
          disabled={isOpening}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-400/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-rose-400/60 active:scale-95 disabled:opacity-70"
        >
          <Sparkles className="h-4 w-4 text-yellow-200 group-hover:rotate-12 transition-transform" />
          <span>{isOpening ? "ENTERING YOUR UNIVERSE..." : cfg.openButtonText}</span>
          <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => {
            onStartAudio?.();
            onOpenUniverse();
          }}
          className="text-xs text-pink-700/70 hover:text-pink-900 transition-colors underline underline-offset-4"
        >
          {cfg.skipButtonText}
        </button>

        {onReplayIntro && (
          <button
            onClick={onReplayIntro}
            className="text-[11px] text-pink-600/70 hover:text-pink-950 transition-colors mt-0.5 underline underline-offset-2"
          >
            ↺ Watch Intro Video Again
          </button>
        )}
      </div>
    </div>
  );
};
