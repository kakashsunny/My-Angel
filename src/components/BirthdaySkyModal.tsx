import React, { useState } from "react";
import { X, Sparkles, RotateCcw, Moon, Star, Crown } from "lucide-react";
import { AMMUVERSE_CONFIG } from "../config/ammuverseConfig";
import { playStarSparkle, playMagicalChime } from "../utils/soundEffects";
import { DynamicMoonVisual } from "./DynamicMoonVisual";
import confetti from "canvas-confetti";

interface BirthdaySkyModalProps {
  onClose: () => void;
  isMuted: boolean;
  onAwardKeepsake?: (id: "crown" | "star" | "heart") => void;
}

interface StarNode {
  id: number;
  x: number; // percentage
  y: number; // percentage
  label: string;
}

const CROWN_STARS: StarNode[] = [
  { id: 1, x: 20, y: 72, label: "Joy" },
  { id: 2, x: 22, y: 38, label: "Laughter" },
  { id: 3, x: 38, y: 55, label: "Peace" },
  { id: 4, x: 50, y: 22, label: "Princess Ammu" }, // center apex
  { id: 5, x: 62, y: 55, label: "Dreams" },
  { id: 6, x: 78, y: 38, label: "Kindness" },
  { id: 7, x: 80, y: 72, label: "Courage" },
];

export const BirthdaySkyModal: React.FC<BirthdaySkyModalProps> = ({
  onClose,
  isMuted,
  onAwardKeepsake,
}) => {
  const [litStarIds, setLitStarIds] = useState<number[]>([]);
  const cfg = AMMUVERSE_CONFIG.birthdaySky;
  const isFullyLit = litStarIds.length >= CROWN_STARS.length;

  const handleStarClick = (id: number) => {
    if (litStarIds.includes(id)) return;
    const nextLit = [...litStarIds, id];
    setLitStarIds(nextLit);

    playStarSparkle(isMuted);

    try {
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { y: 0.5 },
        colors: ["#FDE047", "#F472B6", "#FFFFFF"],
      });
    } catch {
      // safe
    }

    if (nextLit.length === CROWN_STARS.length) {
      onAwardKeepsake?.("star");
      setTimeout(() => {
        playMagicalChime(1.2, isMuted);
        try {
          confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.45 },
            colors: ["#FBBF24", "#F472B6", "#FEF08A", "#EC4899"],
          });
        } catch {
          // safe
        }
      }, 300);
    }
  };

  const handleReset = () => {
    setLitStarIds([]);
    playStarSparkle(isMuted);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sky-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md overflow-hidden animate-fadeIn"
    >
      <div className="birthday-sky-modal relative flex flex-col w-full max-w-xl max-h-[92dvh] rounded-3xl bg-gradient-to-b from-[#18081A] via-[#2D0D2E] to-[#120414] p-3.5 sm:p-6 shadow-2xl border-2 border-pink-400/50 text-white overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Birthday Sky"
          className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-pink-200 hover:bg-white/20 transition-colors shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center pt-1 pb-1">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-400/40 bg-pink-900/40 px-3 py-0.5 text-xs font-semibold text-pink-200 mb-1">
            <Moon className="h-3 w-3 text-amber-200" />
            <span>Constellation V</span>
          </div>
          <h2
            id="sky-title"
            className="font-serif-luxury text-2xl sm:text-3xl font-bold text-pink-100 tracking-tight"
          >
            {cfg.title}
          </h2>
          <p className="font-serif-luxury text-xs sm:text-sm italic text-pink-300/90">
            {isFullyLit ? "The Royal Constellation is complete!" : cfg.instructions}
          </p>
        </div>

        {/* Dedicated Centered Responsive Moon Container */}
        <div className="moon-container my-1.5 flex w-full items-center justify-center">
          <div className="inline-flex items-center justify-center rounded-full border border-pink-500/40 bg-pink-950/60 px-3.5 py-1 shadow-md backdrop-blur-md transition-all hover:border-pink-300/80">
            <DynamicMoonVisual size={32} showBadge={true} />
          </div>
        </div>

        {/* Interactive Sky Dome Canvas Area */}
        <div className="relative my-1.5 aspect-[1.5/1] w-full rounded-2xl border border-pink-500/30 bg-[#0c030f]/80 p-2 shadow-inner overflow-hidden">
          {/* Ambient background stars */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute left-[15%] top-[20%] h-1 w-1 rounded-full bg-white animate-ping" />
            <div className="absolute right-[25%] top-[15%] h-1.5 w-1.5 rounded-full bg-amber-200" />
            <div className="absolute left-[70%] bottom-[25%] h-1 w-1 rounded-full bg-pink-300 animate-pulse" />
            <div className="absolute left-[40%] top-[80%] h-1 w-1 rounded-full bg-white" />
          </div>

          {/* SVG Connecting Constellation Lines */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {/* Draw lines connecting 1->2->3->4->5->6->7 and base 7->1 */}
            <path
              d="M 20% 72% L 22% 38% L 38% 55% L 50% 22% L 62% 55% L 78% 38% L 80% 72% Z"
              fill={isFullyLit ? "rgba(244, 114, 182, 0.12)" : "transparent"}
              stroke={isFullyLit ? "rgba(253, 224, 71, 0.85)" : "rgba(244, 114, 182, 0.35)"}
              strokeWidth={isFullyLit ? "2.5" : "1.2"}
              strokeDasharray={isFullyLit ? "none" : "3 3"}
              className="transition-all duration-700"
            />
          </svg>

          {/* 7 Crown Constellation Interactive Stars */}
          {CROWN_STARS.map((star) => {
            const isLit = litStarIds.includes(star.id);
            return (
              <button
                key={star.id}
                onClick={() => handleStarClick(star.id)}
                style={{ left: `${star.x}%`, top: `${star.y}%` }}
                aria-label={`Star ${star.id}: ${star.label} (${isLit ? "Lit" : "Tap to light"})`}
                className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              >
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500 ${
                    isLit
                      ? "bg-gradient-to-tr from-amber-400 to-yellow-200 text-amber-950 scale-125 shadow-lg shadow-amber-400/80 ring-2 ring-yellow-200"
                      : "bg-white/10 text-pink-300 hover:scale-110 hover:bg-white/20 border border-pink-400/50"
                  }`}
                >
                  <Star
                    className={`h-4 w-4 ${
                      isLit ? "fill-amber-900 text-amber-950 animate-spin-slow" : "fill-transparent"
                    }`}
                  />
                  {isLit && (
                    <span className="pointer-events-none absolute -inset-1 rounded-full border border-yellow-300 animate-ping opacity-60" />
                  )}
                </div>
                <span
                  className={`mt-1 text-[9px] font-semibold tracking-wider transition-opacity ${
                    isLit ? "text-amber-200 opacity-100" : "text-pink-300/60 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {star.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress and Reveal Message */}
        <div className="mt-1 flex flex-col items-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-pink-200">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>
              Stars Illuminated: {litStarIds.length} / {CROWN_STARS.length}
            </span>
          </div>

          {/* Message once all stars are lit */}
          {isFullyLit ? (
            <div className="mt-2 w-full rounded-2xl border border-amber-300/60 bg-gradient-to-r from-amber-950/60 via-pink-950/70 to-purple-950/60 p-3 text-center shadow-lg animate-fadeIn">
              <Crown className="mx-auto h-5 w-5 text-amber-300 fill-amber-300/40 mb-1" />
              <p className="font-serif-luxury text-sm sm:text-base italic text-amber-100">
                &ldquo;{cfg.revealQuote}&rdquo;
              </p>
              <span className="mt-1 block font-script-magic text-sm text-pink-300 font-bold">
                Happy Birthday, Princess Gagana ♡
              </span>
            </div>
          ) : (
            <p className="mt-1 text-center text-[11px] text-pink-300/70 italic">
              Tap each glowing point above to awaken Princess Ammu&apos;s celestial crown
            </p>
          )}
        </div>

        {/* Footer controls */}
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-medium text-pink-300 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Sky</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-transform active:scale-95"
          >
            Back to Universe
          </button>
        </div>
      </div>
    </div>
  );
};
