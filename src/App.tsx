/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { AMMUVERSE_CONFIG } from "./config/ammuverseConfig";
import { EnvelopeIntro } from "./components/EnvelopeIntro";
import { MagicPathChoice } from "./components/MagicPathChoice";
import { AmmuUniverse, ModalType } from "./components/AmmuUniverse";
import { MusicDock } from "./components/MusicDock";
import { CrownConstellationModal } from "./components/CrownConstellationModal";
import { MemoryGalaxyModal } from "./components/MemoryGalaxyModal";
import { WishingWellModal } from "./components/WishingWellModal";
import { SecretLetterModal } from "./components/SecretLetterModal";
import { BirthdaySkyModal } from "./components/BirthdaySkyModal";
import { ThreeLittleNotesModal } from "./components/ThreeLittleNotesModal";
import { NextAdventureModal } from "./components/NextAdventureModal";
import { SecretStarModal } from "./components/SecretStarModal";
import { SecretConstellationModal } from "./components/SecretConstellationModal";
import { BirthdayFinaleOverlay } from "./components/BirthdayFinaleOverlay";
import { FloatingParticlesCanvas } from "./components/FloatingParticlesCanvas";
import { CustomMagicCursor } from "./components/CustomMagicCursor";

export default function App() {
  const [appState, setAppState] = useState<"envelope" | "pathChoice" | "universe">("envelope");
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showFinale, setShowFinale] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isChorusActive, setIsChorusActive] = useState<boolean>(false);

  // Collectibles system (Upgrade 2)
  const [collectedKeepsakes, setCollectedKeepsakes] = useState<Set<"crown" | "star" | "heart">>(() => {
    try {
      const saved = localStorage.getItem("ammuverse_keepsakes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return new Set<"crown" | "star" | "heart">(parsed);
        }
      }
    } catch {
      // safe fallback
    }
    return new Set<"crown" | "star" | "heart">();
  });

  const awardKeepsake = useCallback((id: "crown" | "star" | "heart") => {
    setCollectedKeepsakes((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem("ammuverse_keepsakes", JSON.stringify(Array.from(next)));
      } catch {
        // safe
      }
      if (next.size === 3) {
        setTimeout(() => {
          setActiveModal("secretConstellation");
        }, 800);
      }
      return next;
    });
  }, []);

  const handleUnlockAllKeepsakes = useCallback(() => {
    const all = new Set<"crown" | "star" | "heart">(["crown", "star", "heart"]);
    setCollectedKeepsakes(all);
    try {
      localStorage.setItem("ammuverse_keepsakes", JSON.stringify(Array.from(all)));
    } catch {
      // safe
    }
  }, []);

  // Check user system preference for motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // When envelope opens -> Transition to Upgrade 1: Magic Path Choice (No audio autoplay)
  const handleEnvelopeOpened = () => {
    setAppState("pathChoice");
    setAutoPlayAudio(false);
  };

  // When a magic path is chosen
  const handleSelectPath = (path: "smile" | "surprise" | "emotional") => {
    setAppState("universe");

    if (path === "smile") {
      // Opens Crown of Magic & triggers sparkle
      setActiveModal("crown");
    } else if (path === "surprise") {
      // Picks a random constellation
      const surprises: ModalType[] = ["sky", "wishes", "memories", "adventure"];
      const randomChoice = surprises[Math.floor(Math.random() * surprises.length)];
      setActiveModal(randomChoice);
    } else if (path === "emotional") {
      // Opens the Three Little Notes
      setActiveModal("notes");
    }
  };

  const handleSkipPathChoice = () => {
    setAppState("universe");
  };

  const handleResetToEnvelope = () => {
    setActiveModal(null);
    setShowFinale(false);
    setAppState("envelope");
  };

  // Emotional Pacing Mood:
  // - "curiosity" at envelope opening
  // - "warmth" when reading personal letters/notes (decorative motion reduced)
  // - "joy" during the grand finale celebration
  // - "calm" during general universe exploration
  const emotionalMood = showFinale
    ? "joy"
    : activeModal === "letter" || activeModal === "notes"
    ? "warmth"
    : appState === "envelope"
    ? "curiosity"
    : "calm";

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden select-none bg-[#160613] text-[#4a1827]">
      {/* 1. Full-screen Dreamy Background Image */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src={AMMUVERSE_CONFIG.assets.photoUrl}
          alt="Ammu's Dreamy Princess Atmosphere"
          className={`h-full w-full object-cover object-center scale-105 filter blur-[2px] opacity-75 transition-all duration-1000 ${
            isChorusActive ? "scale-110 opacity-85" : ""
          }`}
        />

        {/* Watercolor blush & golden dream blending layers */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#ffe4ec]/85 via-[#fff1f5]/75 to-[#fce7f3]/85 mix-blend-screen" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#ffe8f0]/40 to-[#2e0926]/40" />
      </div>

      {/* 2. Floating Cherry Blossoms, Stars & Hearts Particle Canvas with Emotional Pacing */}
      <FloatingParticlesCanvas
        reducedMotion={reducedMotion}
        theme={activeModal === "sky" || showFinale ? "celestial" : "pink"}
        mood={emotionalMood}
      />

      {/* 3. Custom Desktop Stardust Cursor */}
      <CustomMagicCursor enabled={!reducedMotion} />

      {/* 4. Main Viewport Container (Zero Scrolling Guaranteed) */}
      <div className="relative z-10 flex h-full w-full flex-col justify-between overflow-hidden">
        <div className="flex-1 w-full overflow-hidden flex flex-col">
          {appState === "envelope" ? (
            <EnvelopeIntro
              onOpenUniverse={handleEnvelopeOpened}
              isMuted={isMuted}
            />
          ) : (
            <AmmuUniverse
              onOpenModal={(id) => setActiveModal(id)}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted((m) => !m)}
              onOpenFinale={() => setShowFinale(true)}
              collectedKeepsakes={collectedKeepsakes}
              isChorusActive={isChorusActive}
            />
          )}
        </div>

        {/* Bottom Audio Dock: Permanently mounted so music is unstoppable and never interrupted */}
        <div className="w-full flex justify-center">
          <MusicDock
            songUrl={AMMUVERSE_CONFIG.assets.birthdaySongUrl}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted((m) => !m)}
            onOpenFinale={() => setShowFinale(true)}
            onResetToEnvelope={handleResetToEnvelope}
            autoPlayTrigger={autoPlayAudio}
            onChorusActiveChange={(inChorus) => setIsChorusActive(inChorus)}
          />
        </div>
      </div>

      {/* Upgrade 1: The Princess Chooses Her Magic Choice Modal */}
      {appState === "pathChoice" && (
        <MagicPathChoice
          onSelectPath={handleSelectPath}
          onSkip={handleSkipPathChoice}
          isMuted={isMuted}
        />
      )}

      {/* 5. Interactive Constellation & Experience Modals (Contained within 100dvh) */}
      {activeModal === "crown" && (
        <CrownConstellationModal
          onClose={() => setActiveModal(null)}
          isMuted={isMuted}
          onAwardKeepsake={awardKeepsake}
        />
      )}

      {activeModal === "memories" && (
        <MemoryGalaxyModal
          onClose={() => setActiveModal(null)}
          isMuted={isMuted}
        />
      )}

      {activeModal === "wishes" && (
        <WishingWellModal
          onClose={() => setActiveModal(null)}
          isMuted={isMuted}
        />
      )}

      {activeModal === "notes" && (
        <ThreeLittleNotesModal
          onClose={() => setActiveModal(null)}
          isMuted={isMuted}
          onAwardKeepsake={awardKeepsake}
        />
      )}

      {activeModal === "letter" && (
        <SecretLetterModal
          onClose={() => setActiveModal(null)}
          isMuted={isMuted}
          onAwardKeepsake={awardKeepsake}
        />
      )}

      {activeModal === "adventure" && (
        <NextAdventureModal
          onClose={() => setActiveModal(null)}
          isMuted={isMuted}
        />
      )}

      {activeModal === "sky" && (
        <BirthdaySkyModal
          onClose={() => setActiveModal(null)}
          isMuted={isMuted}
          onAwardKeepsake={awardKeepsake}
        />
      )}

      {activeModal === "secretStar" && (
        <SecretStarModal
          onClose={() => setActiveModal(null)}
          isMuted={isMuted}
        />
      )}

      {activeModal === "secretConstellation" && (
        <SecretConstellationModal
          onClose={() => setActiveModal(null)}
          onOpenFinale={() => {
            setActiveModal(null);
            setShowFinale(true);
          }}
          isMuted={isMuted}
          collectedKeepsakes={collectedKeepsakes}
          onUnlockAll={handleUnlockAllKeepsakes}
        />
      )}

      {/* 6. Grand Surprise Finale Overlay */}
      {showFinale && (
        <BirthdayFinaleOverlay
          onClose={() => setShowFinale(false)}
          isMuted={isMuted}
        />
      )}
    </div>
  );
}
