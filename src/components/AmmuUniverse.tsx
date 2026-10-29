import React, { useState } from "react";
import {
  Crown,
  Sparkles,
  Heart,
  BookOpen,
  Moon,
  Star,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Compass,
  Bookmark,
  Check,
  Mail,
} from "lucide-react";
import { AMMUVERSE_CONFIG } from "../config/ammuverseConfig";
import { playMagicalChime, playStarSparkle } from "../utils/soundEffects";
import confetti from "canvas-confetti";

export type ModalType =
  | "crown"
  | "memories"
  | "wishes"
  | "letter"
  | "sky"
  | "notes"
  | "adventure"
  | "secretStar"
  | "secretConstellation"
  | null;

interface AmmuUniverseProps {
  onOpenModal: (id: ModalType) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenFinale: () => void;
  onResetToEnvelope?: () => void;
  collectedKeepsakes: Set<"crown" | "star" | "heart">;
  isChorusActive?: boolean;
}

export const AmmuUniverse: React.FC<AmmuUniverseProps> = ({
  onOpenModal,
  isMuted,
  onToggleMute,
  onOpenFinale,
  onResetToEnvelope,
  collectedKeepsakes,
  isChorusActive = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [portraitSparkled, setPortraitSparkled] = useState<boolean>(false);
  const [secretStarGathering, setSecretStarGathering] = useState<boolean>(false);
  const allKeepsakesCollected = collectedKeepsakes.size === 3;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePortraitTap = () => {
    setPortraitSparkled(true);
    playStarSparkle(isMuted);
    try {
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.4, x: 0.25 },
        colors: ["#F472B6", "#FDE047", "#FEF08A"],
      });
    } catch {
      // safe
    }
    setTimeout(() => setPortraitSparkled(false), 1200);
  };

  const handleSecretStarClick = () => {
    setSecretStarGathering(true);
    playMagicalChime(1.3, isMuted);
    try {
      confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.2, x: 0.8 },
        colors: ["#FBBF24", "#FDE047", "#FFFFFF"],
      });
    } catch {
      // safe
    }
    setTimeout(() => {
      setSecretStarGathering(false);
      onOpenModal("secretStar");
    }, 450);
  };

  const handleHeartClick = () => {
    playMagicalChime(1.1, isMuted);
    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.5, x: 0.5 },
        colors: ["#EC4899", "#F472B6", "#FBBF24"],
      });
    } catch {
      // safe
    }
    onOpenModal("crown");
  };

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden select-none px-3 py-1.5 sm:px-6 sm:py-2.5 text-[#4a1827]">
      {/* ================= TOP HEADER ================= */}
      <header className="safe-pt relative z-20 flex w-full items-center justify-between border-b border-pink-200/50 pb-1.5 sm:pb-2">
        {/* Brand Wordmark & Collectible Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-sm shadow-pink-400/40">
            <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-white" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-serif-luxury text-base sm:text-2xl font-black tracking-wider text-rose-950 uppercase truncate">
                AMMUVERSE
              </h1>

              {/* COLLECTIBLES CONSTELLATION INDICATOR (Upgrade 2) */}
              <button
                type="button"
                onClick={() => {
                  playStarSparkle(isMuted);
                  onOpenModal("secretConstellation");
                }}
                title={allKeepsakesCollected ? "Secret Triad Constellation Unlocked! Tap to view ✨" : "Little Pieces of Magic (Tap to view constellation status)"}
                aria-label={`Keepsakes collected: ${collectedKeepsakes.size} of 3. Tap to view the Secret Triad Constellation.`}
                className={`flex items-center gap-0.5 sm:gap-1 rounded-full border px-1.5 sm:px-2 py-0.5 shadow-xs text-xs shrink-0 cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                  allKeepsakesCollected
                    ? "border-amber-400 bg-amber-50/95 ring-2 ring-yellow-300/60"
                    : "border-pink-300/70 bg-white/80"
                }`}
              >
                {/* Crown of Confidence */}
                <span
                  title="Crown of Confidence"
                  className={`transition-all duration-300 ${
                    collectedKeepsakes.has("crown")
                      ? "text-amber-500 scale-110 drop-shadow-sm"
                      : "text-stone-300 opacity-60"
                  }`}
                >
                  <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
                </span>

                {/* Star of Dreams */}
                <span
                  title="Star of Dreams"
                  className={`transition-all duration-300 ${
                    collectedKeepsakes.has("star")
                      ? "text-yellow-500 scale-110 drop-shadow-sm"
                      : "text-stone-300 opacity-60"
                  }`}
                >
                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
                </span>

                {/* Heart of Friendship */}
                <span
                  title="Heart of Friendship"
                  className={`transition-all duration-300 ${
                    collectedKeepsakes.has("heart")
                      ? "text-rose-500 scale-110 drop-shadow-sm"
                      : "text-stone-300 opacity-60"
                  }`}
                >
                  <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
                </span>

                <span className="text-[9px] sm:text-[10px] font-mono text-rose-800 ml-0.5 font-bold">
                  {collectedKeepsakes.size}/3
                </span>
              </button>
            </div>

            <p className="font-serif-luxury text-[9px] sm:text-xs italic text-rose-800/80 -mt-0.5 truncate">
              A universe of your own • Happy Birthday Gagana
            </p>
          </div>
        </div>

        {/* Quick Utility Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* THE SECRET STAR TRIGGER (Accessible & Touch Friendly) */}
          <button
            onClick={handleSecretStarClick}
            title="Discover the Secret Star"
            aria-label="Discover the Secret Star"
            className="flex h-7 w-7 sm:h-8 sm:w-auto items-center justify-center sm:justify-start gap-1 rounded-full border border-amber-300/80 bg-amber-50/90 hover:bg-amber-100 sm:px-2.5 sm:py-1 text-xs font-semibold text-amber-900 shadow-xs transition-all active:scale-95 shrink-0"
          >
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-600 animate-pulse" />
            <span className="hidden sm:inline text-[11px]">Secret Star</span>
          </button>

          {/* Audio Chime Mute */}
          <button
            onClick={onToggleMute}
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
            aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-pink-200/80 bg-white/70 text-rose-800 hover:bg-pink-100/80 transition-colors shadow-xs shrink-0"
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-pink-200/80 bg-white/70 text-rose-800 hover:bg-pink-100/80 transition-colors shadow-xs shrink-0"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>

          {/* Re-open Envelope Opening */}
          {onResetToEnvelope && (
            <button
              onClick={onResetToEnvelope}
              title="Re-open Magical Envelope"
              aria-label="Re-open Magical Envelope"
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-pink-200/80 bg-white/70 text-rose-800 hover:bg-pink-100/80 transition-colors shadow-xs shrink-0"
            >
              <Mail className="h-3.5 w-3.5 text-rose-800" />
            </button>
          )}

          {/* Sparkle Finale Pill */}
          <button
            onClick={onOpenFinale}
            className="hidden sm:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:shadow transition-all shrink-0"
          >
            <Sparkles className="h-3 w-3 text-yellow-100" />
            <span>Grand Finale</span>
          </button>
        </div>
      </header>

      {/* Completion Toast Banner if all 3 keepsakes are collected */}
      {allKeepsakesCollected && (
        <div className="relative z-20 my-1 mx-auto w-full max-w-lg rounded-xl bg-gradient-to-r from-amber-100/95 via-rose-100/95 to-pink-100/95 border border-amber-300 p-1.5 px-3 text-center shadow-xs flex items-center justify-between gap-2 animate-fadeIn text-[11px] font-medium text-rose-950">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{AMMUVERSE_CONFIG.collectibles.completionMessage}</span>
          </div>
          <button
            onClick={() => onOpenModal("secretConstellation")}
            className="rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs shrink-0 hover:scale-105 transition-transform"
          >
            View Triad ✨
          </button>
        </div>
      )}

      {/* ================= MAIN INTERACTIVE BODY (100dvh contained) ================= */}
      <main className="relative z-10 flex flex-1 w-full items-center justify-center my-auto overflow-hidden py-1">
        {/* DESKTOP & TABLET LAYOUT (>= 1024px): 3-Zone Architecture */}
        <div className="hidden lg:grid grid-cols-12 gap-5 w-full max-w-6xl items-center h-full max-h-[76dvh]">
          {/* ZONE 1: LEFT - Ammu's Framed Portrait & Princess Tribute */}
          <div className="col-span-4 flex flex-col items-center justify-center">
            <div className="relative group">
              {/* Floating Crown above portrait */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 animate-float-slow">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-md shadow-amber-500/40">
                  <Crown className="h-6 w-6 text-amber-900 fill-amber-500/50 crown-glow" />
                </div>
              </div>

              {/* Framed Portrait pedestal */}
              <div
                onClick={handlePortraitTap}
                role="button"
                tabIndex={0}
                aria-label="Portrait of Princess Ammu. Tap for stardust sparkles."
                className={`cursor-pointer relative overflow-hidden rounded-3xl border-4 border-pink-200/90 bg-white/70 p-2 shadow-2xl shadow-rose-300/40 transition-all duration-500 ${
                  portraitSparkled ? "scale-105 ring-4 ring-pink-400" : "hover:scale-[1.02]"
                }`}
              >
                <div className="relative h-[270px] w-[200px] rounded-2xl overflow-hidden bg-pink-100">
                  <img
                    src={AMMUVERSE_CONFIG.assets.photoUrl}
                    alt="Princess Gagana"
                    className="h-full w-full object-cover object-[25%_42%] transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pink-900/40 via-transparent to-pink-300/20" />
                  <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-white/85 backdrop-blur-sm p-1.5 text-center shadow-xs">
                    <p className="font-script-magic text-lg font-bold text-rose-900 leading-none">
                      Princess Gagana
                    </p>
                    <p className="text-[9px] font-semibold tracking-wider text-rose-600 uppercase mt-0.5">
                      Our Radiant Angel
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-pedestal badge */}
            <div className="mt-2.5 flex items-center gap-1.5 rounded-full border border-pink-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-rose-800 shadow-xs">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>Tap her frame for stardust</span>
            </div>
          </div>

          {/* ZONE 2: CENTER - The Heart of Ammuverse (Main Navigation Node) */}
          <div className="col-span-4 flex flex-col items-center justify-center text-center">
            {/* The Heart Pulsing Object */}
            <div className="relative">
              {/* Outer orbital rings */}
              <div className="pointer-events-none absolute -inset-10 rounded-full border border-pink-300/40 animate-rotate-constellation" />
              <div className="pointer-events-none absolute -inset-16 rounded-full border border-dashed border-rose-300/30" />

              {/* NESTLED SECRET STAR IN THE AMMUVERSE SKY (Upgrade 4) */}
              <button
                onClick={handleSecretStarClick}
                title="A mysterious tiny twinkling star..."
                aria-label="Secret twinkling heart star"
                className={`absolute -top-12 -right-8 z-30 transition-all duration-500 ${
                  secretStarGathering
                    ? "scale-150 text-amber-300 filter drop-shadow-md"
                    : "hover:scale-125 text-pink-300 hover:text-amber-300"
                }`}
              >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm border border-pink-300/60 shadow-xs">
                  <Star className="h-4 w-4 fill-amber-300 text-amber-400 animate-pulse" />
                </div>
              </button>

              <button
                onClick={handleHeartClick}
                aria-label="Heart of Ammuverse. Tap to open royal blessings."
                className={`group relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-rose-300 p-2 shadow-2xl shadow-rose-400/60 transition-transform duration-300 hover:scale-110 active:scale-95 ${
                  isChorusActive ? "ring-4 ring-yellow-300 animate-pulse-subtle" : ""
                }`}
              >
                <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-white/80 bg-gradient-to-br from-pink-500 to-rose-600 shadow-inner">
                  <Heart className="h-12 w-12 text-white fill-white heart-glow transition-transform group-hover:scale-115" />
                </div>
                <span className="pointer-events-none absolute -inset-2 rounded-full border-2 border-pink-300/70 animate-ping opacity-50" />
              </button>
            </div>

            <div className="mt-3.5">
              <h2 className="font-serif-luxury text-xl font-bold tracking-tight text-rose-950">
                The Heart of Ammuverse
              </h2>
              <p className="font-serif-luxury text-xs italic text-rose-800/80 mt-0.5">
                Connecting all constellations &amp; friendship keepsakes
              </p>
            </div>
          </div>

          {/* ZONE 3: RIGHT - Portals Hub (7 Portals: 5 Constellations + 3 Notes + Next Adventure) */}
          <div className="col-span-4 flex flex-col justify-center space-y-1.5">
            <div className="mb-0.5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                Magical Portals
              </span>
              <span className="text-[10px] text-rose-800/70 italic">7 Wonders</span>
            </div>

            {/* Portal 1: Crown of Her Magic */}
            <button
              onClick={() => {
                playStarSparkle(isMuted);
                onOpenModal("crown");
              }}
              className="group flex items-center justify-between rounded-xl glass-panel-luxury p-2 text-left transition-all hover:scale-[1.01] hover:border-amber-300 active:scale-98"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700 shadow-xs group-hover:bg-amber-200">
                  <Crown className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-950 leading-tight">Crown of Her Magic</h4>
                  <p className="text-[9px] text-rose-700/80">3 royal blessings for dreams</p>
                </div>
              </div>
              <Sparkles className="h-3 w-3 text-amber-500 opacity-60 group-hover:opacity-100" />
            </button>

            {/* Portal 2: Our Little Memory Galaxy */}
            <button
              onClick={() => {
                playStarSparkle(isMuted);
                onOpenModal("memories");
              }}
              className="group flex items-center justify-between rounded-xl glass-panel-luxury p-2 text-left transition-all hover:scale-[1.01] hover:border-pink-400 active:scale-98"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700 shadow-xs group-hover:bg-rose-200">
                  <Star className="h-4 w-4 fill-rose-200" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-950 leading-tight">Memory Galaxy</h4>
                  <p className="text-[9px] text-rose-700/80">Handwritten memories &amp; orbit</p>
                </div>
              </div>
              <Sparkles className="h-3 w-3 text-pink-500 opacity-60 group-hover:opacity-100" />
            </button>

            {/* Portal 3: The Angel's Wishing Well */}
            <button
              onClick={() => {
                playStarSparkle(isMuted);
                onOpenModal("wishes");
              }}
              className="group flex items-center justify-between rounded-xl glass-panel-luxury p-2 text-left transition-all hover:scale-[1.01] hover:border-pink-400 active:scale-98"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-100 text-pink-700 shadow-xs group-hover:bg-pink-200">
                  <Heart className="h-4 w-4 fill-pink-200" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-950 leading-tight">Angel&apos;s Wishing Well</h4>
                  <p className="text-[9px] text-rose-700/80">Draw wishes or cast your secret star</p>
                </div>
              </div>
              <Sparkles className="h-3 w-3 text-pink-500 opacity-60 group-hover:opacity-100" />
            </button>

            {/* Portal 4: Things I Hope You Never Forget (Three Little Notes) */}
            <button
              onClick={() => {
                playStarSparkle(isMuted);
                onOpenModal("notes");
              }}
              className="group flex items-center justify-between rounded-xl glass-panel-luxury p-2 text-left transition-all hover:scale-[1.01] hover:border-rose-400 active:scale-98"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700 shadow-xs group-hover:bg-rose-200">
                  <Bookmark className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-950 leading-tight">Things Never To Forget</h4>
                  <p className="text-[9px] text-rose-700/80">Three personal truths for Ammu</p>
                </div>
              </div>
              <Sparkles className="h-3 w-3 text-rose-500 opacity-60 group-hover:opacity-100" />
            </button>

            {/* Portal 5: The Secret Letter */}
            <button
              onClick={() => {
                playStarSparkle(isMuted);
                onOpenModal("letter");
              }}
              className="group flex items-center justify-between rounded-xl glass-panel-luxury p-2 text-left transition-all hover:scale-[1.01] hover:border-amber-400 active:scale-98"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-800 shadow-xs group-hover:bg-amber-100">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-950 leading-tight">The Secret Letter</h4>
                  <p className="text-[9px] text-rose-700/80">Sealed letter with rose ribbon</p>
                </div>
              </div>
              <Sparkles className="h-3 w-3 text-amber-600 opacity-60 group-hover:opacity-100" />
            </button>

            {/* Portal 6: One More Memory Waiting to Happen (Next Adventure) */}
            <button
              onClick={() => {
                playStarSparkle(isMuted);
                onOpenModal("adventure");
              }}
              className="group flex items-center justify-between rounded-xl glass-panel-luxury p-2 text-left transition-all hover:scale-[1.01] hover:border-emerald-300 active:scale-98"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 shadow-xs group-hover:bg-emerald-100">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-950 leading-tight">Our Next Adventure</h4>
                  <p className="text-[9px] text-rose-700/80">Pick a future shared memory</p>
                </div>
              </div>
              <Sparkles className="h-3 w-3 text-emerald-600 opacity-60 group-hover:opacity-100" />
            </button>

            {/* Portal 7: The Birthday Sky */}
            <button
              onClick={() => {
                playStarSparkle(isMuted);
                onOpenModal("sky");
              }}
              className="group flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-900/85 via-pink-900/85 to-rose-900/85 p-2 text-white shadow-xs transition-all hover:scale-[1.01] active:scale-98"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-yellow-200">
                  <Moon className="h-4 w-4 fill-yellow-200/40" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">The Birthday Sky</h4>
                  <p className="text-[9px] text-pink-200">Light the 7-star crown</p>
                </div>
              </div>
              <Sparkles className="h-3 w-3 text-yellow-200" />
            </button>
          </div>
        </div>

        {/* MOBILE & TABLET COMPACT LAYOUT (< 1024px): Zero-Scroll Adaptive View */}
        <div className="flex lg:hidden flex-col items-center justify-center w-full h-full max-h-[80dvh] px-1 space-y-1.5 sm:space-y-2">
          {/* Header Row: Miniature Portrait & Greeting */}
          <div className="flex items-center justify-center gap-2.5 w-full max-w-sm">
            {/* Miniature Portrait Frame */}
            <div
              onClick={handlePortraitTap}
              role="button"
              tabIndex={0}
              aria-label="Princess Ammu Portrait"
              className="relative shrink-0 cursor-pointer rounded-2xl border-2 border-pink-300/90 bg-white p-1 shadow-md transition-transform active:scale-95"
            >
              <div className="h-16 w-14 sm:h-18 sm:w-16 rounded-xl overflow-hidden bg-pink-100">
                <img
                  src={AMMUVERSE_CONFIG.assets.photoUrl}
                  alt="Princess Gagana"
                  className="h-full w-full object-cover object-[25%_42%]"
                />
              </div>
              {/* Perfectly Aligned Unclipped Golden Crown Badge */}
              <div className="absolute -top-2 -right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 text-amber-950 shadow-md ring-2 ring-white">
                <Crown className="h-3 w-3 fill-amber-700/60" />
              </div>
            </div>

            {/* Greeting */}
            <div className="flex-1 min-w-0">
              <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-rose-600">
                To Princess Ammu ♡
              </span>
              <h2 className="font-serif-luxury text-sm sm:text-base font-bold text-rose-950 truncate">
                Happy Birthday Gagana!
              </h2>
              <p className="font-serif-luxury text-[11px] italic text-rose-800/80 truncate">
                Touch a portal below to begin
              </p>
            </div>

            {/* Mobile Secret Star Icon Button */}
            <button
              onClick={handleSecretStarClick}
              title="Secret Star"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 border border-amber-300 text-amber-700 shadow-xs active:scale-95"
            >
              <Star className="h-4 w-4 fill-amber-300" />
            </button>
          </div>

          {/* Heart of Ammuverse (Center Icon Button) */}
          <div className="relative py-0.5">
            <button
              onClick={handleHeartClick}
              aria-label="Heart of Ammuverse"
              className="relative flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-lg shadow-rose-400/50 active:scale-95 transition-transform"
            >
              <Heart className="h-6 w-6 fill-white heart-glow" />
              <span className="pointer-events-none absolute -inset-1 rounded-full border border-pink-400/60 animate-ping opacity-60" />
            </button>
          </div>

          {/* 6 Grid Portals (Contained, no-scroll) */}
          <div className="grid grid-cols-2 gap-1.5 w-full max-w-sm">
            {/* Crown */}
            <button
              onClick={() => {
                playStarSparkle(isMuted);
                onOpenModal("crown");
              }}
              className="flex items-center gap-1.5 rounded-xl glass-panel-luxury p-1.5 text-left active:scale-95"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Crown className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-rose-950 truncate">Crown Magic</span>
                <span className="block text-[8px] text-rose-700/70 truncate">Royal Wishes</span>
              </div>
            </button>

            {/* Memories */}
            <button
              onClick={() => {
                playStarSparkle(isMuted);
                onOpenModal("memories");
              }}
              className="flex items-center gap-1.5 rounded-xl glass-panel-luxury p-1.5 text-left active:scale-95"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                <Star className="h-3.5 w-3.5 fill-rose-200" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-rose-950 truncate">Memory Galaxy</span>
                <span className="block text-[8px] text-rose-700/70 truncate">Keepsakes</span>
              </div>
            </button>

            {/* Wishing Well */}
            <button
              onClick={() => {
                playStarSparkle(isMuted);
                onOpenModal("wishes");
              }}
              className="flex items-center gap-1.5 rounded-xl glass-panel-luxury p-1.5 text-left active:scale-95"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-700">
                <Heart className="h-3.5 w-3.5 fill-pink-200" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-rose-950 truncate">Wishing Well</span>
                <span className="block text-[8px] text-rose-700/70 truncate">Angelic Blessings</span>
              </div>
            </button>

            {/* Three Little Notes */}
            <button
              onClick={() => {
                playStarSparkle(isMuted);
                onOpenModal("notes");
              }}
              className="flex items-center gap-1.5 rounded-xl glass-panel-luxury p-1.5 text-left active:scale-95"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                <Bookmark className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-rose-950 truncate">Never Forget</span>
                <span className="block text-[8px] text-rose-700/70 truncate">3 Personal Truths</span>
              </div>
            </button>

            {/* Secret Letter */}
            <button
              onClick={() => {
                playStarSparkle(isMuted);
                onOpenModal("letter");
              }}
              className="flex items-center gap-1.5 rounded-xl glass-panel-luxury p-1.5 text-left active:scale-95"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-800">
                <BookOpen className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-rose-950 truncate">Secret Letter</span>
                <span className="block text-[8px] text-rose-700/70 truncate">Read Keepsake</span>
              </div>
            </button>

            {/* Next Adventure */}
            <button
              onClick={() => {
                playStarSparkle(isMuted);
                onOpenModal("adventure");
              }}
              className="flex items-center gap-1.5 rounded-xl glass-panel-luxury p-1.5 text-left active:scale-95"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Compass className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-rose-950 truncate">Next Adventure</span>
                <span className="block text-[8px] text-emerald-800/80 truncate">Future Memory</span>
              </div>
            </button>

            {/* Birthday Sky (Full width) */}
            <button
              onClick={() => {
                playStarSparkle(isMuted);
                onOpenModal("sky");
              }}
              className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-rose-900/80 p-1.5 text-white shadow-xs active:scale-95"
            >
              <Moon className="h-3.5 w-3.5 text-amber-200 fill-amber-200/50" />
              <span className="text-xs font-bold truncate">Enter Birthday Sky Constellation</span>
              <Sparkles className="h-3 w-3 text-pink-300" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
