import React, { useState } from "react";
import { Sparkles, X, Heart, Send, Check } from "lucide-react";
import { AMMUVERSE_CONFIG } from "../config/ammuverseConfig";
import { playMagicalChime, playStarSparkle } from "../utils/soundEffects";
import confetti from "canvas-confetti";

interface WishingWellModalProps {
  onClose: () => void;
  isMuted: boolean;
}

export const WishingWellModal: React.FC<WishingWellModalProps> = ({
  onClose,
  isMuted,
}) => {
  const wishesList = AMMUVERSE_CONFIG.wishingWell.wishes;
  const [currentWishIndex, setCurrentWishIndex] = useState<number>(0);
  const [isOrbGlowing, setIsOrbGlowing] = useState<boolean>(false);
  const [wishesDrawnCount, setWishesDrawnCount] = useState<number>(1);
  const [customWish, setCustomWish] = useState<string>("");
  const [wishSentNotification, setWishSentNotification] = useState<boolean>(false);

  const drawNewWish = () => {
    setIsOrbGlowing(true);
    playMagicalChime(1.15, isMuted);

    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.4 },
        colors: ["#F472B6", "#FDE047", "#FFB6C1"],
      });
    } catch {
      // safe
    }

    // Pick next or random wish different from current
    let nextIdx = Math.floor(Math.random() * wishesList.length);
    if (nextIdx === currentWishIndex) {
      nextIdx = (currentWishIndex + 1) % wishesList.length;
    }

    setTimeout(() => {
      setCurrentWishIndex(nextIdx);
      setWishesDrawnCount((c) => c + 1);
      setIsOrbGlowing(false);
    }, 300);
  };

  const handleCastCustomWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWish.trim()) return;

    playStarSparkle(isMuted);
    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#FBBF24", "#F472B6", "#FFFFFF"],
      });
    } catch {
      // safe
    }

    setWishSentNotification(true);
    setCustomWish("");
    setTimeout(() => {
      setWishSentNotification(false);
    }, 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="well-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-md overflow-hidden animate-fadeIn"
    >
      <div className="relative flex flex-col w-full max-w-xl max-h-[92dvh] rounded-3xl glass-panel-luxury p-4 sm:p-6 shadow-2xl border-2 border-pink-300/80 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Wishing Well"
          className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-rose-900 hover:bg-pink-200 transition-colors shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-1 pb-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50/90 px-3 py-0.5 text-xs font-semibold text-pink-700 mb-1">
            <Sparkles className="h-3 w-3 text-pink-500" />
            <span>Constellation III</span>
          </div>
          <h2
            id="well-title"
            className="font-serif-luxury text-2xl sm:text-3xl font-bold text-rose-950 tracking-tight"
          >
            {AMMUVERSE_CONFIG.wishingWell.title}
          </h2>
          <p className="font-serif-luxury text-xs sm:text-sm italic text-rose-800/80">
            {AMMUVERSE_CONFIG.wishingWell.subtitle}
          </p>
        </div>

        {/* Luminous Glass Orb Centerpiece */}
        <div className="flex flex-col items-center justify-center py-2">
          <button
            onClick={drawNewWish}
            aria-label="Tap the glass orb to draw an angelic wish"
            className={`group relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full transition-all duration-500 ${
              isOrbGlowing ? "scale-110 shadow-2xl shadow-pink-500/60" : "hover:scale-105"
            }`}
          >
            {/* Multi-layered glass sphere effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-100 opacity-80 blur-sm" />
            <div className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-white/80 bg-gradient-to-b from-white/90 via-pink-100/60 to-rose-200/80 p-2 shadow-inner backdrop-blur-md">
              {/* Floating inner petals & star */}
              <div className="flex flex-col items-center">
                <Sparkles className="h-8 w-8 text-rose-500 animate-pulse" />
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest mt-0.5">
                  Tap Orb
                </span>
              </div>
            </div>

            {/* Ripple rings on hover */}
            <div className="pointer-events-none absolute -inset-2 rounded-full border border-pink-400/40 group-hover:animate-ping opacity-50" />
          </button>
          <span className="text-[11px] font-medium text-pink-700/80 mt-1">
            Wish drawn #{wishesDrawnCount} (Tap orb to receive another)
          </span>
        </div>

        {/* Wish Showcase Card */}
        <div className="relative mt-2 rounded-2xl border border-pink-200 bg-white/90 p-4 sm:p-5 shadow-inner">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 mb-2">
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span className="uppercase tracking-wider font-bold">Angelic Blessing for Gagana</span>
          </div>

          <p className="font-serif-luxury text-base sm:text-xl font-medium leading-relaxed text-rose-950 italic">
            &ldquo;{wishesList[currentWishIndex]}&rdquo;
          </p>

          <div className="mt-3 flex items-center justify-between text-[11px] text-pink-700/80 border-t border-pink-100 pt-2">
            <span>May this wish light up your journey</span>
            <span className="font-script-magic text-base font-bold text-rose-700">
              Princess Ammu ♡
            </span>
          </div>
        </div>

        {/* Interactive: Cast Your Own Secret Wish into the Universe */}
        <form onSubmit={handleCastCustomWish} className="mt-3 relative">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cast your own birthday wish into the stars..."
              value={customWish}
              onChange={(e) => setCustomWish(e.target.value)}
              className="flex-1 rounded-xl border border-pink-300 bg-white/90 px-3 py-1.5 text-xs text-rose-950 placeholder:text-pink-400/80 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm"
            />
            <button
              type="submit"
              className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:shadow transition-all active:scale-95 shrink-0"
            >
              <Send className="h-3 w-3" />
              <span>Cast Wish</span>
            </button>
          </div>

          {wishSentNotification && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-0.5 text-[11px] font-medium text-white shadow-md animate-bounce">
              <Check className="h-3 w-3" />
              <span>Your wish is floating into Ammu&apos;s constellation! ✨</span>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-transform active:scale-95"
          >
            Back to Universe
          </button>
        </div>
      </div>
    </div>
  );
};
