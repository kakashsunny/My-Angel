import React, { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, ArrowRight, Heart } from "lucide-react";
import { AMMUVERSE_CONFIG } from "../config/ammuverseConfig";

interface CinematicIntroProps {
  onComplete: () => void;
  onStartMusic: () => void;
  isMuted: boolean;
  reducedMotion: boolean;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onComplete,
  onStartMusic,
  reducedMotion,
}) => {
  const [phase, setPhase] = useState<"ready" | "playing" | "crossfading">("ready");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cfg = AMMUVERSE_CONFIG.cinematicIntro;

  // Autoplay muted video immediately on mount so the opening scene is alive
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay may be restricted on some mobile devices until user interaction
      });
    }
  }, []);

  const handleFinish = useCallback(() => {
    if (phase === "crossfading") return;
    setPhase("crossfading");

    // Smooth 500ms crossfade into the interactive envelope
    setTimeout(() => {
      onComplete();
    }, 500);
  }, [phase, onComplete]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // If user prefers reduced motion and starts playing, gracefully finish quickly
  useEffect(() => {
    if (reducedMotion && phase === "playing") {
      handleFinish();
    }
  }, [reducedMotion, phase, handleFinish]);

  const handleEnterClick = () => {
    if (phase !== "ready") return;

    // 1. Immediately trigger the existing birthday song via audio element on this direct tap
    onStartMusic();

    // 2. Restart and play the 5-second cinematic video
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.loop = false;
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }

    setPhase("playing");

    // 3. Fallback safety timer: at 5.0 seconds, transition smoothly into the envelope
    timerRef.current = setTimeout(() => {
      handleFinish();
    }, 5100);
  };

  const handleVideoEnded = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    handleFinish();
  };

  const handleVideoError = () => {
    // If video fails to load, do NOT kick user out! The celestial background stays visible
    // and the user can still tap "ENTER YOUR LITTLE UNIVERSE ♡" to proceed.
  };

  return (
    <div
      role="region"
      aria-label="Ammuverse Cinematic Introduction"
      className={`fixed inset-0 z-50 flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden select-none bg-[#0a020d] transition-opacity duration-500 ${
        phase === "crossfading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* 1. Seamless Starlit Celestial Background Layer */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#08020a] via-[#160517] to-[#0d020e]">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* 2. Fullscreen Google Flow Cinematic Intro Video (100dvh x 100vw, object-cover) */}
      <video
        ref={videoRef}
        src={AMMUVERSE_CONFIG.assets.introVideoUrl || "/assets/ammuverse-intro.mp4"}
        muted
        autoPlay
        loop={phase === "ready"}
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        onError={handleVideoError}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center z-10"
      >
        <source src="/assets/ammuverse-intro.mp4" type="video/mp4" />
        <source src="/assets/aistudio/WhatsApp_Video_2026-10-29_at_2.46.04_PM_591553bd.mp4" type="video/mp4" />
      </video>

      {/* 3. Subtle Vignette Overlay to blend seamlessly into the envelope */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

      {/* 4. Refined Opening Screen Content (Fades out when playback starts) */}
      <div
        className={`relative z-30 flex flex-col items-center text-center px-4 max-w-lg transition-all duration-700 ${
          phase === "ready"
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {/* Celestial Tag */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-300/60 bg-black/60 px-3.5 py-1 text-xs font-semibold tracking-widest text-pink-200 shadow-sm backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
          <span>{cfg.badge}</span>
          <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
        </div>

        <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-pink-50 drop-shadow-xl">
          {cfg.headline}
        </h1>

        <p className="mt-2 font-serif-luxury text-sm sm:text-base italic text-pink-200/90 max-w-sm drop-shadow-md">
          &ldquo;{cfg.subtitle}&rdquo;
        </p>

        {/* Primary Interactive Enter Button */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={handleEnterClick}
            aria-label="Enter your little universe and start your birthday experience"
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-7 py-3 text-sm sm:text-base font-bold text-white shadow-xl shadow-rose-500/40 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/60 active:scale-95 cursor-pointer ring-2 ring-white/60"
          >
            <Heart className="h-4 w-4 fill-white text-white group-hover:scale-115 transition-transform" />
            <span>{cfg.enterButtonText}</span>
            <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
            <span className="pointer-events-none absolute -inset-1 rounded-full border border-pink-300/60 animate-ping opacity-40" />
          </button>
        </div>
      </div>

      {/* 5. Subtle Stardust Indicator while 5s video plays */}
      {phase === "playing" && (
        <div className="pointer-events-none absolute bottom-8 z-30 flex items-center gap-2 rounded-full bg-black/60 px-4 py-1.5 backdrop-blur-md border border-pink-400/40 text-xs text-pink-100 shadow-lg animate-pulse">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>A stardust wish is unfolding for you...</span>
        </div>
      )}
    </div>
  );
};
