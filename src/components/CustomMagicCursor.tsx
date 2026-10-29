import React, { useEffect, useRef } from "react";

interface SparklePoint {
  x: number;
  y: number;
  size: number;
  alpha: number;
  color: string;
}

export const CustomMagicCursor: React.FC<{ enabled?: boolean }> = ({ enabled = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    // Don't render cursor effects on touch-only devices
    if (window.matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const sparkles: SparklePoint[] = [];
    const colors = ["#F472B6", "#FDE047", "#FEF08A", "#FFB6C1", "#FFFFFF"];

    const handleMouseMove = (e: MouseEvent) => {
      // Add a couple sparkles
      for (let i = 0; i < 2; i++) {
        sparkles.push({
          x: e.clientX + (Math.random() - 0.5) * 12,
          y: e.clientY + (Math.random() - 0.5) * 12,
          size: Math.random() * 2.5 + 1,
          alpha: 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      if (sparkles.length > 35) sparkles.splice(0, sparkles.length - 35);
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.alpha -= 0.025;
        s.y += 0.4;
        s.size *= 0.96;

        if (s.alpha <= 0 || s.size < 0.2) {
          sparkles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full select-none"
      aria-hidden="true"
    />
  );
};
