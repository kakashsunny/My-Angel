import React from "react";
import { Smile, Sparkles, Heart, ArrowRight } from "lucide-react";
import { AMMUVERSE_CONFIG } from "../config/ammuverseConfig";
import { playMagicalChime, playStarSparkle } from "../utils/soundEffects";
import confetti from "canvas-confetti";

interface MagicPathChoiceProps {
  onSelectPath: (path: "smile" | "surprise" | "emotional") => void;
  onSkip: () => void;
  isMuted: boolean;
}

export const MagicPathChoice: React.FC<MagicPathChoiceProps> = ({
  onSelectPath,
  onSkip,
  isMuted,
}) => {
  const cfg = AMMUVERSE_CONFIG.magicPathIntro;

  const handleChoose = (pathId: "smile" | "surprise" | "emotional") => {
    playMagicalChime(pathId === "smile" ? 1.2 : pathId === "surprise" ? 1.3 : 1.0, isMuted);
    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.5 },
        colors: ["#F472B6", "#FDE047", "#FEF08A"],
      });
    } catch {
      // safe
    }
    onSelectPath(pathId);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose your magical path"
      className="fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-5 bg-black/35 backdrop-blur-md overflow-hidden animate-fadeIn select-none"
    >
      <div className="relative flex flex-col w-full max-w-lg rounded-3xl glass-panel-luxury p-5 sm:p-7 shadow-2xl border-2 border-pink-300/80 text-center overflow-hidden">
        {/* Subtle glowing halo */}
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-36 w-36 rounded-full bg-pink-400/25 blur-2xl" />

        {/* Header Tag */}
        <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50/90 px-3 py-0.5 text-xs font-semibold text-pink-700 mb-2">
          <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
          <span>The Princess Chooses</span>
        </div>

        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-rose-950">
          {cfg.headline}
        </h2>

        <p className="font-serif-luxury text-sm sm:text-base italic text-rose-800/90 mt-1 mb-5">
          &ldquo;{cfg.question}&rdquo;
        </p>

        {/* 3 Animated Choices */}
        <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
          {cfg.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleChoose(opt.id)}
              className="group relative flex items-center justify-between rounded-2xl bg-white/80 hover:bg-white border border-pink-200/90 hover:border-pink-400 p-3.5 sm:p-4 text-left shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    opt.id === "smile"
                      ? "bg-amber-100 text-amber-700 group-hover:bg-amber-200"
                      : opt.id === "surprise"
                      ? "bg-purple-100 text-purple-700 group-hover:bg-purple-200"
                      : "bg-rose-100 text-rose-700 group-hover:bg-rose-200"
                  }`}
                >
                  {opt.id === "smile" && <Smile className="h-5 w-5" />}
                  {opt.id === "surprise" && <Sparkles className="h-5 w-5" />}
                  {opt.id === "emotional" && <Heart className="h-5 w-5 fill-rose-300" />}
                </div>

                <div>
                  <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-rose-950 group-hover:text-rose-700 transition-colors">
                    {opt.label}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-rose-800/75">{opt.sublabel}</p>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 text-pink-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>

        {/* Skip option */}
        <div className="mt-5 pt-3 border-t border-pink-200/60">
          <button
            onClick={() => {
              playStarSparkle(isMuted);
              onSkip();
            }}
            className="text-xs text-rose-700/80 hover:text-rose-950 underline underline-offset-4 transition-colors font-medium"
          >
            {cfg.skipText}
          </button>
        </div>
      </div>
    </div>
  );
};
