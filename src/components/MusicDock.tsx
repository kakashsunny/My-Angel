import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume1,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Crown,
} from "lucide-react";
import { AMMUVERSE_CONFIG } from "../config/ammuverseConfig";

interface MusicDockProps {
  songUrl: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenFinale: () => void;
  onResetToEnvelope: () => void;
  autoPlayTrigger?: boolean;
  onChorusActiveChange?: (isActive: boolean) => void;
}

export const MusicDock: React.FC<MusicDockProps> = ({
  songUrl,
  isMuted,
  onToggleMute,
  onOpenFinale,
  onResetToEnvelope,
  autoPlayTrigger,
  onChorusActiveChange,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isAudioAvailable, setIsAudioAvailable] = useState<boolean>(true);
  const [isMobileVolumeOpen, setIsMobileVolumeOpen] = useState<boolean>(false);
  const [isChorusActive, setIsChorusActive] = useState<boolean>(false);

  // Close mobile volume popover on tap/click outside
  useEffect(() => {
    if (!isMobileVolumeOpen) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".mobile-volume-container")) {
        setIsMobileVolumeOpen(false);
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("touchstart", handleOutsideClick);
    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isMobileVolumeOpen]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsAudioAvailable(true);
    };

    const handleTimeUpdate = () => {
      const cur = audio.currentTime || 0;
      setCurrentTime(cur);

      // Audio sync: Check if current playback position falls within any chorus
      const inChorus = AMMUVERSE_CONFIG.audioSync.chorusTimestamps.some(
        (c) => cur >= c.start && cur <= c.end
      );

      if (inChorus !== isChorusActive) {
        setIsChorusActive(inChorus);
        onChorusActiveChange?.(inChorus);
      }
    };

    const handleEnded = () => {
      // Unstoppable background music: seamlessly loop and never stop
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };

    const handleError = () => {
      setIsAudioAvailable(false);
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [songUrl, isChorusActive, onChorusActiveChange]);

  // Autoplay trigger after envelope opened by explicit user interaction
  useEffect(() => {
    if (autoPlayTrigger && audioRef.current && isAudioAvailable) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [autoPlayTrigger, isAudioAvailable]);

  // Mute sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current || !isAudioAvailable) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (isMuted && newVol > 0) {
      onToggleMute();
    }
    if (newVol === 0 && !isMuted) {
      onToggleMute();
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="h-4 w-4 text-rose-500" />;
    }
    if (volume < 0.45) {
      return <Volume1 className="h-4 w-4 text-rose-800" />;
    }
    return <Volume2 className="h-4 w-4 text-rose-800" />;
  };

  return (
    <footer
      aria-label="Ammuverse audio and experience navigation controls"
      className="safe-pb relative z-20 flex w-full max-w-4xl items-center justify-between gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 text-[#4a2835]"
    >
      <audio ref={audioRef} src={songUrl} preload="metadata" loop />

      {/* Dock Container */}
      <div
        className={`glass-panel-luxury flex w-full items-center justify-between rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2.5 shadow-lg transition-all ${
          isChorusActive ? "ring-2 ring-pink-400/80 shadow-rose-300/60" : ""
        }`}
      >
        {/* Left: Song identity & play button */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 overflow-hidden pr-1">
          <button
            onClick={togglePlay}
            disabled={!isAudioAvailable}
            aria-label={isPlaying ? "Pause Ammu's birthday song" : "Play Ammu's birthday song"}
            className={`relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
              isPlaying
                ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-400/40 scale-105"
                : "bg-pink-100 hover:bg-pink-200 text-pink-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-white" />
            ) : (
              <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current ml-0.5" />
            )}
            {isPlaying && (
              <span className="absolute -inset-1 rounded-full border border-pink-400/50 animate-ping pointer-events-none" />
            )}
          </button>

          {/* Song info, visualizer and chorus badge */}
          <div className="min-w-0 flex-1 flex flex-col justify-center overflow-hidden">
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <span className="truncate text-xs sm:text-sm font-semibold tracking-wide text-rose-900">
                <span className="xs:hidden">Princess Birthday</span>
                <span className="hidden xs:inline sm:hidden">Happy Birthday Ammu</span>
                <span className="hidden sm:inline">Happy Birthday, Princess</span>
              </span>

              {/* Animated wave bars */}
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-2.5 sm:h-3 shrink-0" aria-hidden="true">
                  <span className="w-0.5 bg-rose-500 rounded-full h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
                  <span className="w-0.5 bg-rose-400 rounded-full h-2 animate-[pulse_0.8s_ease-in-out_infinite_0.15s]" />
                  <span className="w-0.5 bg-pink-500 rounded-full h-2.5 animate-[pulse_0.5s_ease-in-out_infinite_0.3s]" />
                </div>
              )}

              {/* Chorus Glow Indicator */}
              {isChorusActive && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-rose-500/90 px-2 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider animate-pulse shrink-0">
                  <Sparkles className="h-2.5 w-2.5" />
                  Chorus
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-pink-700/80 min-w-0">
              <span className="hidden sm:inline truncate">{isAudioAvailable ? "Original Song for Ammu • " : "Soundtrack • "}</span>
              {isPlaying && duration > 0 ? (
                <span className="tabular-nums font-mono font-medium text-rose-900/80 shrink-0">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              ) : (
                <span className="tabular-nums font-mono text-[9px] sm:text-[10px] text-rose-800/80 font-medium">
                  Optional Song (Tap ▶)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Track progress bar (desktop & tablet) */}
        {isAudioAvailable && duration > 0 && (
          <div className="hidden lg:flex flex-1 items-center max-w-xs mx-4">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step="0.5"
              value={currentTime}
              onChange={handleSeek}
              aria-label="Song progress scrub"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-pink-200 accent-rose-500 transition-all hover:h-2"
            />
          </div>
        )}

        {/* Right: Controls, Volume Slider & Finale trigger */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* SLEEK MINIMALIST VOLUME CONTROL */}
          <div className="mobile-volume-container relative flex items-center sm:rounded-full sm:bg-white/70 sm:border sm:border-pink-200/90 sm:px-2 sm:py-1 sm:shadow-xs transition-all">
            {/* Mobile Floating Volume Popover: Floats neatly above the speaker button with down-arrow pointer */}
            {isMobileVolumeOpen && (
              <div className="sm:hidden absolute bottom-full -right-1 mb-2.5 z-50 flex items-center gap-2 rounded-full bg-white/95 border-2 border-pink-300 px-3 py-1.5 shadow-2xl backdrop-blur-md animate-fadeIn whitespace-nowrap">
                <button
                  type="button"
                  onClick={onToggleMute}
                  className="text-rose-800 shrink-0"
                  aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                >
                  {renderVolumeIcon()}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume level control"
                  className="h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-pink-200 accent-rose-500"
                  style={{
                    background: `linear-gradient(to right, #f43f5e 0%, #fb7185 ${
                      (isMuted ? 0 : volume) * 100
                    }%, #fbcfe8 ${(isMuted ? 0 : volume) * 100}%, #fbcfe8 100%)`,
                  }}
                />
                <span className="tabular-nums text-[10px] font-mono font-bold text-rose-950 w-7 text-right">
                  {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
                </span>
                {/* Pointer tip pointing down to volume button */}
                <span className="absolute -bottom-1 right-3.5 h-2 w-2 rotate-45 border-r-2 border-b-2 border-pink-300 bg-white" />
              </div>
            )}

            {/* Volume / Mute button */}
            <button
              onClick={() => {
                onToggleMute();
                setIsMobileVolumeOpen((prev) => !prev);
              }}
              title={isMuted ? "Unmute Ammu's song" : "Mute Ammu's song"}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70 sm:bg-transparent border border-pink-200/80 sm:border-0 text-rose-800 hover:bg-pink-100/70 transition-colors shadow-xs sm:shadow-none"
            >
              {renderVolumeIcon()}
            </button>

            {/* Desktop / Tablet Sleek Inline Slider */}
            <div className="hidden sm:flex items-center gap-1.5 overflow-hidden pl-1 sm:w-20 md:w-24">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume level control"
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-pink-200 accent-rose-500 transition-all hover:h-2"
                style={{
                  background: `linear-gradient(to right, #f43f5e 0%, #fb7185 ${
                    (isMuted ? 0 : volume) * 100
                  }%, #fbcfe8 ${(isMuted ? 0 : volume) * 100}%, #fbcfe8 100%)`,
                }}
              />
              <span className="tabular-nums text-[10px] font-mono font-medium text-rose-900 w-6 text-right select-none">
                {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
              </span>
            </div>
          </div>

          {/* Reset / Return to Envelope */}
          <button
            onClick={onResetToEnvelope}
            title="Return to Envelope Opening"
            aria-label="Return to magical envelope opening"
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/60 text-pink-700 hover:bg-pink-100/70 transition-colors border border-pink-200/60 shadow-xs"
          >
            <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </button>

          {/* Surprise Finale Trigger */}
          <button
            onClick={onOpenFinale}
            className="relative flex items-center gap-1 sm:gap-1.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-white shadow-sm hover:shadow transition-all active:scale-95 shrink-0"
            aria-label="Experience the Birthday Sky Finale"
          >
            <Crown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-100 fill-yellow-200 animate-bounce" />
            <span className="hidden sm:inline">Grand Finale</span>
            <span className="sm:hidden font-bold">Finale</span>
            <Sparkles className="hidden sm:inline h-3 w-3 text-yellow-200" />
          </button>
        </div>
      </div>
    </footer>
  );
};
