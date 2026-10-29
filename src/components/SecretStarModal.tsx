import React, { useEffect } from "react";
import { Star, X, Sparkles, Heart } from "lucide-react";
import { AMMUVERSE_CONFIG } from "../config/ammuverseConfig";
import { playMagicalChime, playStarSparkle } from "../utils/soundEffects";
import confetti from "canvas-confetti";

interface SecretStarModalProps {
  onClose: () => void;
  isMuted: boolean;
}

export const SecretStarModal: React.FC<SecretStarModalProps> = ({
  onClose,
  isMuted,
}) => {
  const cfg = AMMUVERSE_CONFIG.secretStar;

  useEffect(() => {
    playMagicalChime(1.25, isMuted);
    try {
      confetti({
        particleCount: 45,
        spread: 75,
        origin: { y: 0.4 },
        colors: ["#FBBF24", "#FDE047", "#F472B6", "#FFFFFF"],
      });
    } catch {
      // safe
    }
  }, [isMuted]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="secret-star-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/55 backdrop-blur-md overflow-hidden animate-fadeIn select-none"
    >
      <div className="relative flex flex-col w-full max-w-md rounded-3xl glass-panel-gold p-5 sm:p-7 shadow-2xl border-2 border-amber-300 text-center overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Secret Star Discovery"
          className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100/90 text-amber-950 hover:bg-amber-200 transition-colors shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Floating Glowing Star Centerpiece */}
        <div className="flex flex-col items-center justify-center pt-1 pb-3">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-100 shadow-xl shadow-amber-400/50 ring-4 ring-yellow-200/80 animate-float-gentle">
            <Star className="h-10 w-10 text-amber-900 fill-amber-500/80 animate-spin-slow" />
            <div className="absolute top-7">
              <Heart className="h-3 w-3 fill-rose-500 text-rose-500 animate-pulse" />
            </div>
            <span className="pointer-events-none absolute -inset-2 rounded-full border border-yellow-300 animate-ping opacity-60" />
          </div>

          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/60 bg-amber-100/80 px-3 py-0.5 text-xs font-bold text-amber-900">
            <Sparkles className="h-3 w-3 text-amber-600" />
            <span>The Secret Star</span>
          </div>

          <h2
            id="secret-star-title"
            className="mt-2 font-serif-luxury text-2xl sm:text-3xl font-bold text-amber-950 tracking-tight"
          >
            You Found The Hidden Wonder!
          </h2>
        </div>

        {/* Secret Message Scroll Card */}
        <div className="rounded-2xl border border-amber-300/80 bg-white/85 p-5 shadow-inner text-amber-950 font-serif-luxury text-base sm:text-lg leading-relaxed whitespace-pre-line italic">
          {cfg.message}
        </div>

        {/* Action Button */}
        <div className="mt-5 flex items-center justify-center">
          <button
            onClick={() => {
              playStarSparkle(isMuted);
              onClose();
            }}
            className="rounded-full bg-gradient-to-r from-amber-500 to-amber-700 px-6 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-transform active:scale-95"
          >
            Keep The Secret Close
          </button>
        </div>
      </div>
    </div>
  );
};
