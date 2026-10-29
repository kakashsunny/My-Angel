import React, { useEffect, useRef } from "react";

export type ParticleMood = "curiosity" | "warmth" | "joy" | "calm";

interface FloatingParticlesCanvasProps {
  reducedMotion?: boolean;
  theme?: "pink" | "celestial";
  mood?: ParticleMood;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  type: "petal" | "star" | "sparkle" | "heart";
  angle: number;
  angularSpeed: number;
  color: string;
}

export const FloatingParticlesCanvas: React.FC<FloatingParticlesCanvasProps> = ({
  reducedMotion = false,
  theme = "pink",
  mood = "curiosity",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Emotional pacing particle counts:
    // Warmth (reading mode): substantially reduced so text is peaceful and legible
    // Joy (finale): full celebration burst
    // Curiosity (intro/universe): gentle ambient flow
    const baseCount =
      mood === "warmth"
        ? 10
        : mood === "joy"
        ? Math.min(56, Math.floor((width * height) / 18000))
        : mood === "calm"
        ? 14
        : Math.min(36, Math.floor((width * height) / 24000));

    const particleCount = reducedMotion ? 8 : baseCount;
    const particles: Particle[] = [];

    const pinkColors = [
      "rgba(255, 182, 193, ",
      "rgba(255, 215, 225, ",
      "rgba(244, 114, 182, ",
      "rgba(251, 207, 232, ",
      "rgba(253, 224, 71, ", // gold
      "rgba(254, 240, 138, ", // warm champagne
    ];

    const celestialColors = [
      "rgba(254, 240, 138, ",
      "rgba(253, 224, 71, ",
      "rgba(244, 114, 182, ",
      "rgba(255, 255, 255, ",
      "rgba(216, 180, 254, ",
    ];

    const colors = theme === "celestial" || mood === "joy" ? celestialColors : pinkColors;

    // Speed multiplier based on emotional pacing
    const speedMult =
      reducedMotion
        ? 0.2
        : mood === "warmth"
        ? 0.25 // Reading mode: very slow and tranquil
        : mood === "calm"
        ? 0.35
        : mood === "joy"
        ? 1.3 // Finale celebration: energetic
        : 0.7; // Curiosity: pleasant ambient drift

    for (let i = 0; i < particleCount; i++) {
      const types: Particle["type"][] = ["petal", "star", "sparkle", "heart"];
      const type = types[Math.floor(Math.random() * types.length)];
      const maxAlpha =
        mood === "warmth"
          ? Math.random() * 0.15 + 0.15 // softer in reading mode
          : Math.random() * 0.4 + 0.4;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: type === "petal" ? Math.random() * 4.5 + 3.5 : Math.random() * 2.2 + 1.2,
        vx: (Math.random() - 0.5) * 0.4 * speedMult,
        vy:
          type === "petal"
            ? (Math.random() * 0.5 + 0.25) * speedMult
            : (Math.random() - 0.5) * 0.3 * speedMult,
        alpha: Math.random() * maxAlpha,
        maxAlpha,
        type,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.015 * speedMult,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const drawPetal = (
      x: number,
      y: number,
      r: number,
      angle: number,
      color: string,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = `${color}${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(r, -r, r * 1.5, r, 0, r * 2);
      ctx.bezierCurveTo(-r * 1.5, r, -r, -r, 0, 0);
      ctx.fill();
      ctx.restore();
    };

    const drawStar = (x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `${color}${alpha})`;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.lineTo(r, 0);
        ctx.lineTo(r * 0.3, r * 0.3);
      }
      ctx.fill();
      ctx.restore();
    };

    const drawHeart = (x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `${color}${alpha})`;
      ctx.beginPath();
      const d = r * 0.8;
      ctx.moveTo(0, -d * 0.3);
      ctx.bezierCurveTo(-d, -d, -d * 1.5, d * 0.5, 0, d * 1.3);
      ctx.bezierCurveTo(d * 1.5, d * 0.5, d, -d, 0, -d * 0.3);
      ctx.fill();
      ctx.restore();
    };

    const drawSparkle = (x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.fillStyle = `${color}${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.angularSpeed;

        // Wrap around boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Subtle alpha breathing
        p.alpha += (Math.random() - 0.5) * 0.015;
        if (p.alpha > p.maxAlpha) p.alpha = p.maxAlpha;
        if (p.alpha < 0.08) p.alpha = 0.08;

        if (p.type === "petal") {
          drawPetal(p.x, p.y, p.radius, p.angle, p.color, p.alpha);
        } else if (p.type === "star") {
          drawStar(p.x, p.y, p.radius, p.color, p.alpha);
        } else if (p.type === "heart") {
          drawHeart(p.x, p.y, p.radius, p.color, p.alpha);
        } else {
          drawSparkle(p.x, p.y, p.radius, p.color, p.alpha);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion, theme, mood]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
};
