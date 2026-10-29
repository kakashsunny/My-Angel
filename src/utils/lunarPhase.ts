/**
 * Lunar Phase Calculator & Dynamic Moon Visuals
 * Dynamically computes the exact moon phase for the current day of the year.
 */

export interface MoonPhaseData {
  phase: number; // 0.0 to 1.0
  name: string;
  illumination: number; // 0 to 100%
  stage: "new" | "waxing-crescent" | "first-quarter" | "waxing-gibbous" | "full" | "waning-gibbous" | "last-quarter" | "waning-crescent";
  dayOfYear: number;
  formattedDate: string;
  poeticMeaning: string;
}

/**
 * Calculate accurate moon phase for a given date
 * Uses astronomical synodic month cycle (29.53058867 days)
 */
export function getMoonPhase(date: Date = new Date()): MoonPhaseData {
  // Reference known new moon: Jan 11, 2024, 11:57 UTC
  const refNewMoon = new Date(Date.UTC(2024, 0, 11, 11, 57, 0));
  const diffMs = date.getTime() - refNewMoon.getTime();
  const synodicMonthMs = 29.53058867 * 24 * 60 * 60 * 1000;

  let phase = (diffMs % synodicMonthMs) / synodicMonthMs;
  if (phase < 0) phase += 1;

  // Illumination percentage (0 to 100%)
  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100);

  // Day of the year
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diffFromStart = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diffFromStart / (1000 * 60 * 60 * 24));

  let name = "";
  let stage: MoonPhaseData["stage"] = "new";
  let poeticMeaning = "";

  if (phase < 0.03 || phase >= 0.97) {
    name = "New Moon";
    stage = "new";
    poeticMeaning = "A silent sky holding infinite new beginnings for Ammu.";
  } else if (phase < 0.22) {
    name = "Waxing Crescent";
    stage = "waxing-crescent";
    poeticMeaning = "A delicate sliver of light growing brighter each evening.";
  } else if (phase < 0.28) {
    name = "First Quarter Moon";
    stage = "first-quarter";
    poeticMeaning = "Half illuminated, balanced in strength and gentle poise.";
  } else if (phase < 0.47) {
    name = "Waxing Gibbous";
    stage = "waxing-gibbous";
    poeticMeaning = "Almost complete, radiating warmth and quiet majesty.";
  } else if (phase < 0.53) {
    name = "Full Moon";
    stage = "full";
    poeticMeaning = "Basking in total celestial brilliance, mirroring Ammu's light.";
  } else if (phase < 0.72) {
    name = "Waning Gibbous";
    stage = "waning-gibbous";
    poeticMeaning = "A luminous golden orb carrying gentle gratitude.";
  } else if (phase < 0.78) {
    name = "Last Quarter Moon";
    stage = "last-quarter";
    poeticMeaning = "A poised crescent guiding quiet dreams into the night.";
  } else {
    name = "Waning Crescent";
    stage = "waning-crescent";
    poeticMeaning = "A silver ribbon in the dawn sky, whispering peaceful rest.";
  }

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return {
    phase,
    name,
    illumination,
    stage,
    dayOfYear,
    formattedDate,
    poeticMeaning,
  };
}
