import React, { useState } from "react";
import { X, Sparkles, Compass, Check, Heart } from "lucide-react";
import { AMMUVERSE_CONFIG } from "../config/ammuverseConfig";
import { playMagicalChime, playStarSparkle } from "../utils/soundEffects";
import confetti from "canvas-confetti";

interface NextAdventureModalProps {
  onClose: () => void;
  isMuted: boolean;
}

export const NextAdventureModal: React.FC<NextAdventureModalProps> = ({
  onClose,
  isMuted,
}) => {
  const cfg = AMMUVERSE_CONFIG.nextAdventure;
  const [selectedOption, setSelectedOption] = useState<string>(() => {
    try {
      return localStorage.getItem("ammuverse_future_idea") || "";
    } catch {
      return "";
    }
  });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSelect = (opt: string) => {
    setSelectedOption(opt);
    try {
      localStorage.setItem("ammuverse_future_idea", opt);
    } catch {
      // safe
    }
    setSavedSuccess(true);
    playMagicalChime(1.15, isMuted);
    try {
      confetti({
        particleCount: 25,
        spread: 55,
        origin: { y: 0.55 },
        colors: ["#F472B6", "#FBBF24", "#FEF08A"],
      });
    } catch {
      // safe
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="adventure-title"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-5 bg-black/45 backdrop-blur-md overflow-hidden animate-fadeIn select-none"
    >
      <div className="relative flex flex-col w-full max-w-lg rounded-3xl glass-panel-luxury p-5 sm:p-7 shadow-2xl border-2 border-pink-300/80 text-center overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Future Memory Picker"
          className="absolute right-3.5 top-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-rose-900 hover:bg-pink-200 transition-colors shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="pt-1 pb-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200 bg-pink-50/90 px-3 py-0.5 text-xs font-semibold text-pink-700 mb-1">
            <Compass className="h-3.5 w-3.5 text-rose-500 animate-spin-slow" />
            <span>Future Galaxy</span>
          </div>

          <h2
            id="adventure-title"
            className="font-serif-luxury text-2xl sm:text-3xl font-bold text-rose-950 tracking-tight"
          >
            {cfg.title}
          </h2>

          <p className="font-serif-luxury text-xs sm:text-sm italic text-rose-800/80 mt-1">
            {cfg.subtitle}
          </p>
        </div>

        {/* Options list */}
        <div className="flex flex-col gap-2.5 my-2">
          {cfg.options.map((opt, i) => {
            const isChosen = selectedOption === opt;
            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                className={`flex items-center justify-between rounded-2xl p-3.5 sm:p-4 text-left transition-all duration-300 ${
                  isChosen
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-pink-400/40 scale-[1.02]"
                    : "bg-white/80 hover:bg-white border border-pink-200/90 text-rose-950 hover:border-pink-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isChosen ? "bg-white/20 text-white" : "bg-pink-100 text-rose-700"
                    }`}
                  >
                    #{i + 1}
                  </span>
                  <span className="font-serif-luxury text-sm sm:text-base font-semibold">
                    {opt}
                  </span>
                </div>

                {isChosen && <Check className="h-4 w-4 text-white shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        {/* Saved Confirmation Banner */}
        {savedSuccess && (
          <div className="my-2 rounded-xl bg-pink-50 border border-pink-200/80 p-2 text-xs font-semibold text-rose-800 flex items-center justify-center gap-1.5 animate-fadeIn">
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            <span>{cfg.confirmationText}</span>
          </div>
        )}

        {/* Footnote */}
        <p className="text-[11px] text-rose-700/75 italic mt-2 px-2">
          {cfg.footnote}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={() => {
              playStarSparkle(isMuted);
              onClose();
            }}
            className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-transform active:scale-95"
          >
            Back to Universe
          </button>
        </div>
      </div>
    </div>
  );
};
