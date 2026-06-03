import { useEffect, useRef } from "react";
import { useTheme } from "../context/useTheme";

// ── dust physics ─────────────────────────────────────────────────────────────
const PIXEL          = 2;    // tiny particles → looks like dust, not pixels
const GRAVITY        = 0.018; // very gentle — dust almost floats
const DECAY          = 0.007; // faster fade
const WIND           = 0.3;   // consistent rightward drift
const SWEEP_FRAMES   = 48;   // faster left→right sweep

function crumble(img, imgW, imgH, imgLeft, imgTop) {
  const dpr  = Math.min(window.devicePixelRatio || 1, 2);

  // Sample image onto offscreen canvas
  const off  = document.createElement("canvas");
  off.width  = imgW * dpr;
  off.height = imgH * dpr;
  const oCtx = off.getContext("2d");
  oCtx.drawImage(img, 0, 0, off.width, off.height);

  const imgData   = oCtx.getImageData(0, 0, off.width, off.height);
  const particles = [];
  const step      = PIXEL * dpr;

  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      const i = (y * off.width + x) * 4;
      if (imgData.data[i + 3] < 30) continue;

      // Sweep: columns on the left start disintegrating first
      const normX      = x / off.width;          // 0 (left) → 1 (right)
      const startFrame = Math.floor(normX * SWEEP_FRAMES);

      // Dust drifts up-right with a little randomness
      const vx = WIND + (Math.random() - 0.3) * 0.6;
      const vy = -(0.15 + Math.random() * 0.55);  // mostly upward

      particles.push({
        x:          imgLeft + x / dpr,
        y:          imgTop  + y / dpr,
        vx,
        vy,
        r:          imgData.data[i],
        g:          imgData.data[i + 1],
        b:          imgData.data[i + 2],
        alpha:      (imgData.data[i + 3] / 255) * (0.7 + Math.random() * 0.3),
        startFrame,
        active:     false,
      });
    }
  }

  // Full-viewport canvas
  const cvs    = document.createElement("canvas");
  cvs.width    = window.innerWidth;
  cvs.height   = window.innerHeight;
  Object.assign(cvs.style, {
    position:      "fixed",
    top:           "0",
    left:          "0",
    pointerEvents: "none",
    zIndex:        "9998",
  });
  document.body.appendChild(cvs);
  const ctx = cvs.getContext("2d");

  let frame = 0;
  let raf;

  const tick = () => {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    frame++;
    let alive = false;

    for (const p of particles) {
      // Activate when sweep reaches this column
      if (frame >= p.startFrame) p.active = true;
      if (!p.active || p.alpha < 0.01) continue;

      alive = true;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = `rgb(${p.r},${p.g},${p.b})`;
      // Round to pixel grid for that soft blocky-dust look
      ctx.fillRect(
        Math.round(p.x / PIXEL) * PIXEL,
        Math.round(p.y / PIXEL) * PIXEL,
        PIXEL, PIXEL,
      );

      p.x     += p.vx;
      p.y     += p.vy;
      p.vy    += GRAVITY;
      p.vx    += (Math.random() - 0.48) * 0.05; // subtle turbulence
      p.alpha -= DECAY + Math.random() * 0.002;
    }

    ctx.globalAlpha = 1;
    if (alive || frame < SWEEP_FRAMES + 20) raf = requestAnimationFrame(tick);
    else cvs.remove();
  };
  raf = requestAnimationFrame(tick);
}

// ── Component ────────────────────────────────────────────────────────────────
export default function LightModeBlast() {
  const { theme } = useTheme();
  const prevTheme = useRef(theme);

  useEffect(() => {
    if (prevTheme.current !== "dark" || theme !== "light") {
      prevTheme.current = theme;
      return;
    }
    prevTheme.current = theme;

    const img = new Image();
    img.src   = "/eyes.gif";

    img.onload = () => {
      // Image size: big, right-side
      const IMG_W = Math.min(Math.round(window.innerWidth  * 0.38), 480);
      const IMG_H = IMG_W; // square meme
      const IMG_R = -40;   // slightly off the right edge
      const IMG_T = Math.round((window.innerHeight - IMG_H) / 2); // vertically centred

      // Overlay div — slides in from the right
      const wrap = document.createElement("div");
      Object.assign(wrap.style, {
        position:      "fixed",
        top:           `${IMG_T}px`,
        right:         `${IMG_R}px`,
        width:         `${IMG_W}px`,
        height:        `${IMG_H}px`,
        zIndex:        "9999",
        pointerEvents: "none",
        overflow:      "hidden",
        borderRadius:  "0",
        transform:     "translateX(110%)",
        opacity:       "0",
        transition:    "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease",
      });

      const imgEl       = document.createElement("img");
      imgEl.src         = "/eyes.gif";
      imgEl.crossOrigin = "anonymous";
      Object.assign(imgEl.style, { width: "100%", height: "100%", objectFit: "cover" });
      wrap.appendChild(imgEl);
      document.body.appendChild(wrap);

      // Slide in
      requestAnimationFrame(() => {
        wrap.style.transform = "translateX(0)";
        wrap.style.opacity   = "1";
      });

      // After 900ms hold → crumble to dust
      setTimeout(() => {
        const left = window.innerWidth - IMG_W - IMG_R;
        wrap.remove();
        crumble(img, IMG_W, IMG_H, left, IMG_T);
      }, 900);
    };
  }, [theme]);

  return null;
}
