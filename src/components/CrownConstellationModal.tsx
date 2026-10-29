import React, { useEffect, useState } from "react";
import { Crown, Sparkles, X, Heart, Star } from "lucide-react";
import { AMMUVERSE_CONFIG } from "../config/ammuverseConfig";
import { playMagicalChime, playStarSparkle } from "../utils/soundEffects";
import confetti from "canvas-confetti";

interface CrownConstellationModalProps {
  onClose: () => void;
  isMuted: boolean;
  onAwardKeepsake?: (id: "crown" | "star" | "heart") => void;
}

export const CrownConstellationModal: React.FC<CrownConstellationModalProps> = ({
  onClose,
  isMuted,
  onAwardKeepsake,
}) => {
  const cfg = AMMUVERSE_CONFIG.crownOfMagic;
  const [crownRisen, setCrownRisen] = useState(false);
  const [selectedWishIndex, setSelectedWishIndex] = useState<number>(0);

  useEffect(() => {
    onAwardKeepsake?.("crown");
    const timer = setTimeout(() => {
      setCrownRisen(true);
      playMagicalChime(1.1, isMuted);
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.35 },
          colors: ["#FBBF24", "#F472B6", "#FEF08A"],
          disableForReducedMotion: true,
        });
      } catch {
        // graceful
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isMuted]);

  const handleSparkleClick = () => {
    playStarSparkle(isMuted);
    try {
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.3 },
        colors: ["#FDE047", "#F472B6"],
      });
    } catch {
      // safe
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="crown-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md overflow-hidden animate-fadeIn"
    >
      <div className="relative flex flex-col w-full max-w-xl max-h-[92dvh] rounded-3xl glass-panel-gold p-4 sm:p-6 shadow-2xl border-2 border-amber-300/60 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Crown of Magic"
          className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100/80 text-amber-900 hover:bg-amber-200 transition-colors shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Floating Crown Centerpiece */}
        <div className="flex flex-col items-center text-center pt-1 pb-3">
          <div
            onClick={handleSparkleClick}
            title="Tap for golden sparkles!"
            role="button"
            tabIndex={0}
            className={`group cursor-pointer relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-amber-200 to-yellow-100 shadow-xl shadow-amber-500/30 transition-all duration-700 ${
              crownRisen
                ? "-translate-y-2 scale-105 ring-4 ring-yellow-300/80"
                : "translate-y-4 scale-90"
            }`}
          >
            <Crown className="h-12 w-12 sm:h-14 sm:w-14 text-amber-800 fill-amber-500/60 crown-glow transition-transform group-hover:scale-110" />

            {/* Embedded Pink Jewel */}
            <div className="absolute top-7 sm:top-8 h-2.5 w-2.5 rounded-full bg-rose-500 shadow-md shadow-pink-500 animate-pulse" />

            {/* Sparkle badge */}
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-md">
              <Sparkles className="h-3.5 w-3.5 text-yellow-200" />
            </span>
          </div>

          <h2
            id="crown-title"
            className="mt-3 font-serif-luxury text-2xl sm:text-3xl font-bold text-amber-950 tracking-tight"
          >
            {cfg.title}
          </h2>

          <p className="mt-1 font-serif-luxury text-sm sm:text-base italic text-amber-900/90 max-w-md px-2">
            &ldquo;{cfg.headline}&rdquo;
          </p>
        </div>

        {/* 3 Short Warm Wishes Tabs */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3">
          {cfg.wishes.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedWishIndex(index);
                playStarSparkle(isMuted);
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-semibold transition-all ${
                selectedWishIndex === index
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-[1.02]"
                  : "bg-amber-100/70 text-amber-900 hover:bg-amber-200/80"
              }`}
            >
              {index === 0 && <Heart className="h-3 w-3 fill-current" />}
              {index === 1 && <Sparkles className="h-3 w-3" />}
              {index === 2 && <Star className="h-3 w-3 fill-current" />}
              <span className="truncate">{item.category}</span>
            </button>
          ))}
        </div>

        {/* Selected Wish Showcase Card */}
        <div className="relative rounded-2xl border border-amber-300/80 bg-white/80 p-4 sm:p-5 shadow-inner">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold">
              ★
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Blessing for Princess Gagana
            </span>
          </div>
          <p className="font-serif-luxury text-base sm:text-lg leading-relaxed text-amber-950 italic">
            &ldquo;{cfg.wishes[selectedWishIndex].wish}&rdquo;
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-amber-700/80 font-medium">
            <span>Ammu&apos;s Royal Tiara Wish #{selectedWishIndex + 1}</span>
            <span className="font-script-magic text-sm font-bold text-amber-900">
              Always Shine ♡
            </span>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handleSparkleClick}
            className="flex items-center gap-1 text-xs font-semibold text-amber-900 hover:text-amber-700"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Shower Sparkles</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-full bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-transform active:scale-95"
          >
            Back to Universe
          </button>
        </div>
      </div>
    </div>
  );
};
