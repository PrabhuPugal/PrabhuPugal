import { useEffect, useRef } from "react";

const PIXEL_SIZE = 7;       // block size (snapped to grid)
const SCATTER_RADIUS = 32;  // radius around cursor to scatter blocks
const PER_EVENT = 7;        // pixel blocks spawned per mousemove
const DECAY_MIN = 0.010;
const DECAY_MAX = 0.024;

function getThemeRGB() {
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  return dark ? [220, 218, 214] : [14, 14, 14];
}

export default function PixelTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    let particles = [];
    let rafId;

    const onMove = (e) => {
      const [r, g, b] = getThemeRGB();
      for (let i = 0; i < PER_EVENT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist  = Math.pow(Math.random(), 0.5) * SCATTER_RADIUS;
        // Snap to pixel grid for the blocky look
        const px = Math.round((e.clientX + Math.cos(angle) * dist) / PIXEL_SIZE) * PIXEL_SIZE;
        const py = Math.round((e.clientY + Math.sin(angle) * dist) / PIXEL_SIZE) * PIXEL_SIZE;
        particles.push({
          x: px, y: py, r, g, b,
          alpha: 0.45 + Math.random() * 0.45,
          decay: DECAY_MIN + Math.random() * (DECAY_MAX - DECAY_MIN),
        });
      }
    };

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      particles = particles.filter((p) => p.alpha > 0.005);
      for (const p of particles) {
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.alpha.toFixed(3)})`;
        ctx.fillRect(p.x, p.y, PIXEL_SIZE, PIXEL_SIZE);
        p.alpha -= p.decay;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9997,
      }}
    />
  );
}
