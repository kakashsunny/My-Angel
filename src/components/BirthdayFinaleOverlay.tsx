import React, { useEffect, useState } from "react";
import { Crown, Sparkles, Heart, Star, RotateCcw, ArrowLeft } from "lucide-react";
import { AMMUVERSE_CONFIG } from "../config/ammuverseConfig";
import { playMagicalChime, playAngelicHarmonic, playStarSparkle } from "../utils/soundEffects";
import confetti from "canvas-confetti";

interface BirthdayFinaleOverlayProps {
  onClose: () => void;
  isMuted: boolean;
}

export const BirthdayFinaleOverlay: React.FC<BirthdayFinaleOverlayProps> = ({
  onClose,
  isMuted,
}) => {
  // Stages:
  // 1: Wonder (Starlight ring illuminates Ammu's portrait)
  // 2: Celebration (Festive joy, bursts of confetti, celebration headline)
  // 3: Warmth (Quiet, sincere personal closing message, gentle settled starlight)
  const [stage, setStage] = useState<number>(1);
  const [litStarsCount, setLitStarsCount] = useState<number>(0);
  const cfg = AMMUVERSE_CONFIG.finale;

  const startSequence = () => {
    setStage(1);
    setLitStarsCount(0);
    playAngelicHarmonic(isMuted);

    // Stage 1: Wonder — Light up 7 stars in sequence around her portrait
    let starsLit = 0;
    const interval = setInterval(() => {
      starsLit += 1;
      setLitStarsCount(starsLit);
      playStarSparkle(isMuted);

      if (starsLit >= 7) {
        clearInterval(interval);

        // Transition to Stage 2: Celebration
        setTimeout(() => {
          setStage(2);
          playMagicalChime(1.1, isMuted);
          try {
            confetti({
              particleCount: 50,
              spread: 80,
              origin: { y: 0.45 },
              colors: ["#FBBF24", "#F472B6", "#FEF08A"],
              disableForReducedMotion: true,
            });
          } catch {
            // safe
          }

          // Transition to Stage 3: Warmth & Quiet Sincere Closing
          setTimeout(() => {
            setStage(3);
            playMagicalChime(1.2, isMuted);
          }, 3400);
        }, 600);
      }
    }, 220);
  };

  useEffect(() => {
    startSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      aria-label="Grand Birthday Finale for Ammu"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-3 sm:p-6 text-white overflow-hidden select-none animate-fadeIn transition-colors duration-1000 ${
        stage === 1
          ? "bg-[#140414]/90"
          : stage === 2
          ? "bg-gradient-to-b from-[#1b051b]/95 via-[#2b082a]/95 to-[#120313]/95"
          : "bg-gradient-to-b from-[#160416]/92 via-[#1e061e]/90 to-[#100210]/92"
      } backdrop-blur-xl`}
    >
      {/* Top Header Badge */}
      <div className="z-10 safe-pt flex w-full max-w-2xl items-center justify-between text-xs text-pink-300">
        <div className="flex items-center gap-1.5 font-medium tracking-widest uppercase text-[10px] sm:text-xs">
          <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
          <span>
            {stage === 1 && "Stage I: Wonder"}
            {stage === 2 && "Stage II: Celebration"}
            {stage === 3 && "Stage III: Quiet Warmth"}
          </span>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1 rounded-full border border-pink-400/30 bg-white/10 px-3 py-1 text-xs text-pink-200 hover:bg-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-pink-300"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>{cfg.stayButtonText}</span>
        </button>
      </div>

      {/* Main Center Stage: Preserving Gagana's Authentic Photograph */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center px-4 max-w-2xl my-auto">
        {/* Celestial Portrait Cameo with Floating Crown & Orbit Ring */}
        <div className="relative flex flex-col items-center">
          {/* Luminous Glow Halo */}
          <div
            className={`pointer-events-none absolute -inset-8 rounded-full bg-gradient-to-tr from-amber-400/30 via-pink-500/25 to-yellow-200/25 blur-2xl transition-opacity duration-1000 ${
              stage === 3 ? "opacity-60" : "opacity-90 animate-pulse-subtle"
            }`}
          />

          {/* Floating Crown above portrait */}
          <div
            className={`relative z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-lg shadow-amber-400/50 mb-1 transition-all duration-700 ${
              stage >= 1 ? "scale-100 -translate-y-2 animate-float-slow" : "scale-50 translate-y-4 opacity-0"
            }`}
          >
            <Crown className="h-6 w-6 sm:h-7 sm:w-7 text-amber-900 fill-amber-500/60 crown-glow" />
          </div>

          {/* Rose-Gold Framed Authentic Portrait Cameo */}
          <div
            className={`relative z-10 h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-rose-300/90 p-1 shadow-2xl shadow-rose-500/40 bg-gradient-to-tr from-rose-400 via-amber-200 to-pink-300 ring-4 ring-amber-300/60 transition-all duration-1000 ${
              stage >= 1 ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          >
            <div className="h-full w-full rounded-full overflow-hidden bg-pink-100">
              <img
                src={AMMUVERSE_CONFIG.assets.photoUrl}
                alt="Princess Gagana"
                className="h-full w-full object-cover object-[25%_42%]"
              />
            </div>

            {/* Glowing Heart Gem at bottom of portrait frame */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white shadow-md">
              <Heart className="h-3 w-3 fill-white" />
            </div>
          </div>

          {/* 7 Illuminating Starlight Nodes orbiting around her portrait */}
          <div className="pointer-events-none absolute -inset-8 flex items-center justify-center">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const angle = (i * 360) / 7;
              const isLit = litStarsCount > i;
              return (
                <div
                  key={i}
                  style={{
                    transform: `rotate(${angle}deg) translate(80px) rotate(-${angle}deg)`,
                  }}
                  className={`absolute h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full transition-all duration-500 ${
                    isLit
                      ? "bg-amber-300 shadow-lg shadow-amber-300 ring-2 ring-yellow-100 scale-110"
                      : "bg-white/20 scale-75 opacity-30"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* STAGE II Content: Celebration Titles */}
        <div
          className={`mt-4 sm:mt-5 transition-all duration-1000 ${
            stage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="font-serif-luxury text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-rose-300 drop-shadow-md">
            {cfg.mainTitle}
          </h1>

          <p className="mt-1 text-xs sm:text-sm md:text-base font-semibold tracking-widest text-amber-200 uppercase">
            {cfg.subtitle}
          </p>
        </div>

        {/* STAGE III Content: Quiet Warmth & Sincere Personal Message */}
        <div
          className={`mt-3 sm:mt-4 transition-all duration-1000 ${
            stage >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="rounded-2xl border border-pink-400/40 bg-pink-950/45 px-4 py-3 sm:px-7 sm:py-4 backdrop-blur-md shadow-xl text-center">
            <p className="font-serif-luxury text-base sm:text-lg md:text-xl italic text-pink-100 leading-snug">
              &ldquo;{cfg.finalSincereMessage || cfg.whisper}&rdquo;
            </p>

            <div className="mt-2.5 pt-2 border-t border-pink-400/30 flex items-center justify-center gap-1.5 text-xs sm:text-sm text-pink-200 font-script-magic text-base sm:text-lg">
              <Star className="h-3 w-3 fill-amber-300 text-amber-300 shrink-0" />
              <span className="truncate">{cfg.celebrationText}</span>
              <Star className="h-3 w-3 fill-amber-300 text-amber-300 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Dual Controls */}
      <div className="z-10 safe-pb flex items-center gap-3">
        {/* Replay */}
        <button
          onClick={startSequence}
          className="flex items-center gap-1.5 rounded-full border border-pink-300/40 bg-white/10 px-4 py-1.5 sm:py-2 text-xs font-semibold text-pink-200 hover:bg-white/20 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-pink-300"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{cfg.replayButtonText}</span>
        </button>

        {/* Stay / Return */}
        <button
          onClick={onClose}
          className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 px-5 sm:px-6 py-1.5 sm:py-2 text-xs font-bold text-white shadow-lg shadow-pink-500/40 hover:shadow-xl hover:scale-105 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-pink-300"
        >
          <span>{cfg.stayButtonText}</span>
          <Sparkles className="h-3.5 w-3.5 text-yellow-200" />
        </button>
      </div>
    </div>
  );
};
