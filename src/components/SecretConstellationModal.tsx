import React, { useEffect } from "react";
import { Crown, Star, Heart, X, Sparkles, ArrowRight, Unlock } from "lucide-react";
import { playMagicalChime, playStarSparkle } from "../utils/soundEffects";
import confetti from "canvas-confetti";

interface SecretConstellationModalProps {
  onClose: () => void;
  onOpenFinale: () => void;
  isMuted: boolean;
  collectedKeepsakes?: Set<"crown" | "star" | "heart">;
  onUnlockAll?: () => void;
}

export const SecretConstellationModal: React.FC<SecretConstellationModalProps> = ({
  onClose,
  onOpenFinale,
  isMuted,
  collectedKeepsakes = new Set(["crown", "star", "heart"]),
  onUnlockAll,
}) => {
  const isComplete = collectedKeepsakes.size >= 3;

  const secretMessage =
    "Every little piece of magic led you here, Ammu. Happy birthday to the girl this universe was made to celebrate. ♡";

  useEffect(() => {
    playMagicalChime(1.2, isMuted);
    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.45 },
        colors: ["#FBBF24", "#F472B6", "#FEF08A", "#FFFFFF", "#E11D48"],
        disableForReducedMotion: true,
      });
    } catch {
      // safe
    }
  }, [isMuted]);

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="unified-constellation-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md overflow-hidden animate-fadeIn select-none"
    >
      <div className="relative flex flex-col w-full max-w-lg max-h-[92dvh] rounded-3xl glass-panel-gold p-4 sm:p-6 shadow-2xl border-2 border-amber-300 text-center overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Secret Constellation"
          className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100/90 text-amber-950 hover:bg-amber-200 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Tag */}
        <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-amber-400/60 bg-amber-100/90 px-3 py-0.5 text-xs font-bold text-amber-900 mb-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
          <span>The Secret Constellation Revealed</span>
        </div>

        <h2
          id="unified-constellation-title"
          className="font-serif-luxury text-xl sm:text-2xl font-bold text-amber-950 tracking-tight"
        >
          A Triad of Pure Magic
        </h2>

        <p className="font-serif-luxury text-xs text-amber-900/80 italic mt-0.5">
          Crown of Confidence • Star of Dreams • Heart of Friendship
        </p>

        {/* Unified Triad Constellation Diagram */}
        <div className="relative my-2 sm:my-3 flex items-center justify-center h-44 sm:h-48 w-full max-w-xs mx-auto">
          {/* Constellation Connecting Triangle Lines */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            <polygon
              points="160,26 65,138 255,138"
              fill={isComplete ? "rgba(254, 240, 138, 0.22)" : "rgba(254, 240, 138, 0.08)"}
              stroke="rgba(251, 191, 36, 0.85)"
              strokeWidth="2"
              strokeDasharray={isComplete ? "none" : "4 4"}
              className="animate-pulse-subtle"
            />
          </svg>

          {/* Node 1: Crown of Confidence (Top Apex) */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div
              className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full shadow-lg ring-2 ring-white transition-all duration-500 ${
                collectedKeepsakes.has("crown") || isComplete
                  ? "bg-gradient-to-tr from-amber-400 to-yellow-200 text-amber-950 shadow-amber-400/60 scale-105"
                  : "bg-stone-200 text-stone-400 opacity-60"
              }`}
            >
              <Crown className="h-5 w-5 sm:h-6 sm:w-6 fill-current text-amber-900" />
            </div>
            <span className="text-[10px] font-bold text-amber-950 mt-1 uppercase tracking-wider">
              Confidence
            </span>
          </div>

          {/* Node 2: Star of Dreams (Bottom Left) */}
          <div className="absolute bottom-1 left-4 sm:left-6 flex flex-col items-center">
            <div
              className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full shadow-lg ring-2 ring-white transition-all duration-500 ${
                collectedKeepsakes.has("star") || isComplete
                  ? "bg-gradient-to-tr from-yellow-400 to-amber-200 text-yellow-950 shadow-yellow-400/60 scale-105 animate-spin-slow"
                  : "bg-stone-200 text-stone-400 opacity-60"
              }`}
            >
              <Star className="h-5 w-5 sm:h-6 sm:w-6 fill-current text-yellow-900" />
            </div>
            <span className="text-[10px] font-bold text-amber-950 mt-1 uppercase tracking-wider">
              Dreams
            </span>
          </div>

          {/* Node 3: Heart of Friendship (Bottom Right) */}
          <div className="absolute bottom-1 right-4 sm:right-6 flex flex-col items-center">
            <div
              className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full shadow-lg ring-2 ring-white transition-all duration-500 ${
                collectedKeepsakes.has("heart") || isComplete
                  ? "bg-gradient-to-tr from-rose-500 to-pink-300 text-white shadow-rose-400/60 scale-105 animate-pulse"
                  : "bg-stone-200 text-stone-400 opacity-60"
              }`}
            >
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 fill-white text-white" />
            </div>
            <span className="text-[10px] font-bold text-amber-950 mt-1 uppercase tracking-wider">
              Friendship
            </span>
          </div>
        </div>

        {/* Revealed Secret Friendship Message */}
        <div className="rounded-2xl border border-amber-300/90 bg-white/90 p-3 sm:p-4 shadow-inner text-amber-950 font-serif-luxury text-sm sm:text-base leading-relaxed italic">
          &ldquo;{secretMessage}&rdquo;
        </div>

        {/* Accessible helper if keepsakes not yet gathered */}
        {!isComplete && onUnlockAll && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                onUnlockAll();
                playStarSparkle(isMuted);
              }}
              className="inline-flex items-center gap-1 rounded-full border border-amber-400 bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-900 hover:bg-amber-100 transition-colors"
            >
              <Unlock className="h-3 w-3 text-amber-700" />
              <span>Unlock all 3 pieces immediately</span>
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2.5 sm:gap-3">
          <button
            onClick={() => {
              playStarSparkle(isMuted);
              onClose();
            }}
            className="rounded-full border border-amber-300/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors"
          >
            Stay in Universe
          </button>

          <button
            onClick={() => {
              playMagicalChime(1.15, isMuted);
              onClose();
              onOpenFinale();
            }}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:shadow-lg transition-transform active:scale-95"
          >
            <span>Experience Grand Finale</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
