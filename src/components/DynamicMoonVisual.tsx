import React, { useState } from "react";
import { getMoonPhase, MoonPhaseData } from "../utils/lunarPhase";
import { Sparkles } from "lucide-react";

interface DynamicMoonVisualProps {
  size?: number; // pixel diameter
  showBadge?: boolean;
}

export const DynamicMoonVisual: React.FC<DynamicMoonVisualProps> = ({
  size = 36,
  showBadge = true,
}) => {
  const [moonData] = useState<MoonPhaseData>(() => getMoonPhase());
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const p = moonData.phase;

  return (
    <div className="relative inline-flex items-center justify-center gap-2 select-none max-w-full">
      <button
        type="button"
        onClick={() => setShowTooltip((v) => !v)}
        title={`Tonight's Moon: ${moonData.name} (${moonData.illumination}% illuminated) • Day ${moonData.dayOfYear}`}
        aria-label={`Current Moon Phase: ${moonData.name}, ${moonData.illumination}% illuminated on Day ${moonData.dayOfYear} of the year`}
        className="group relative flex shrink-0 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
        style={{ width: size, height: size }}
      >
        {/* Soft Celestial Glow Aura */}
        <div
          className="pointer-events-none absolute -inset-2 rounded-full bg-amber-200/25 blur-md group-hover:bg-amber-300/40 transition-all duration-500 animate-pulse-subtle"
          style={{ width: size + 14, height: size + 14 }}
        />

        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="relative drop-shadow-md"
        >
          <defs>
            <radialGradient id="moonGlowDynamic" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffdf0" />
              <stop offset="70%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.85" />
            </radialGradient>

            <radialGradient id="darkSideDynamic" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#250d28" />
              <stop offset="100%" stopColor="#140618" />
            </radialGradient>
          </defs>

          {/* Base Dark Moon Sphere */}
          <circle cx="50" cy="50" r="46" fill="url(#darkSideDynamic)" stroke="#f472b6" strokeWidth="1" strokeOpacity="0.4" />

          {/* Subtly textured craters */}
          <circle cx="38" cy="42" r="5" fill="#18071c" opacity="0.4" />
          <circle cx="62" cy="58" r="7" fill="#18071c" opacity="0.35" />
          <circle cx="48" cy="68" r="4" fill="#18071c" opacity="0.3" />

          {/* Illuminated Moon Phase Arc */}
          {p >= 0.02 && p <= 0.98 && (
            <>
              {p < 0.5 ? (
                <path
                  d={
                    p <= 0.25
                      ? `M 50 4 A 46 46 0 0 1 50 96 A ${46 * (1 - p * 4)} 46 0 0 0 50 4 Z`
                      : `M 50 4 A 46 46 0 0 1 50 96 A ${46 * ((p - 0.25) * 4)} 46 0 0 1 50 4 Z`
                  }
                  fill="url(#moonGlowDynamic)"
                  filter="drop-shadow(0 0 4px rgba(254, 243, 199, 0.7))"
                />
              ) : (
                <path
                  d={
                    p <= 0.75
                      ? `M 50 4 A 46 46 0 0 0 50 96 A ${46 * (1 - (p - 0.5) * 4)} 46 0 0 1 50 4 Z`
                      : `M 50 4 A 46 46 0 0 0 50 96 A ${46 * ((p - 0.75) * 4)} 46 0 0 0 50 4 Z`
                  }
                  fill="url(#moonGlowDynamic)"
                  filter="drop-shadow(0 0 4px rgba(254, 243, 199, 0.7))"
                />
              )}
            </>
          )}

          {/* Full Moon */}
          {p > 0.47 && p < 0.53 && (
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="url(#moonGlowDynamic)"
              filter="drop-shadow(0 0 8px rgba(254, 243, 199, 0.9))"
            />
          )}

          {/* Subtle outer rim */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="#fef3c7" strokeWidth="1" strokeOpacity="0.6" />
        </svg>

        {/* Info indicator */}
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-amber-950 text-[8px] font-bold shadow-xs">
          ★
        </span>
      </button>

      {/* Responsive Text Label */}
      {showBadge && (
        <div className="flex flex-col text-left min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] sm:text-xs font-bold text-amber-200 tracking-wide truncate">
              {moonData.name}
            </span>
            <span className="text-[10px] text-pink-300 font-mono font-semibold">
              ({moonData.illumination}%)
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] text-pink-300/80 italic truncate">
            Day {moonData.dayOfYear} of the Year • {moonData.formattedDate}
          </span>
        </div>
      )}

      {/* Floating Detailed Moon Popover (Centered to prevent any overflow) */}
      {showTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-64 max-w-[calc(100vw-3rem)] rounded-2xl glass-panel-luxury p-3 text-left shadow-2xl border border-amber-300/90 animate-fadeIn text-rose-950">
          <div className="flex items-center justify-between border-b border-pink-200/80 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-950">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Tonight&apos;s Lunar Alignment</span>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-[10px] text-rose-600 hover:text-rose-900 font-bold px-1"
            >
              ✕
            </button>
          </div>

          <p className="text-xs font-semibold text-rose-900">
            {moonData.formattedDate} • Day {moonData.dayOfYear} of 365
          </p>

          <p className="font-serif-luxury text-xs sm:text-sm italic text-rose-950 mt-1 leading-snug">
            &ldquo;{moonData.poeticMeaning}&rdquo;
          </p>

          <div className="mt-2 pt-1.5 border-t border-pink-200/60 flex items-center justify-between text-[10px] text-rose-800">
            <span>Illumination: {moonData.illumination}%</span>
            <span className="font-script-magic text-xs font-bold text-rose-900">
              Aligned for Ammu ♡
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
