import { useEffect } from "react";

const PIXEL      = 4;
const GRAVITY    = 0.13;
const DECAY      = 0.016;
const MARGIN     = 100; // canvas overhang to allow scatter outside element bounds
const TARGETS    = "h1, h2, h3, h4, .section-title, .name";

function parseRgb(colorStr) {
  const m = colorStr.match(/[\d.]+/g);
  return m && m.length >= 3 ? [+m[0], +m[1], +m[2]] : [14, 14, 14];
}

function launch(el) {
  const rect = el.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return () => {};

  const cs  = window.getComputedStyle(el);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const [r, g, b] = parseRgb(cs.color);

  /* ── render text to offscreen canvas ─────────────────────────── */
  const off = document.createElement("canvas");
  off.width  = Math.ceil(rect.width  * dpr);
  off.height = Math.ceil(rect.height * dpr);
  const oCtx = off.getContext("2d");
  oCtx.scale(dpr, dpr);

  // replicate computed font as closely as possible
  oCtx.font         = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  oCtx.fillStyle    = cs.color;
  oCtx.textBaseline = "alphabetic";

  // draw text — use client rects for multi-line support
  const range = document.createRange();
  range.selectNodeContents(el);
  const lineRects = Array.from(range.getClientRects());

  if (lineRects.length > 0) {
    // render each line at its correct local offset
    // we don't have per-line text, so render full content at each line's y
    // (works perfectly for single-line headings; approximate for multi-line)
    lineRects.forEach((lr) => {
      oCtx.fillText(
        el.textContent.trim(),
        lr.left - rect.left,
        lr.bottom - rect.top - parseFloat(cs.fontSize) * 0.15,
      );
    });
  } else {
    oCtx.fillText(el.textContent.trim(), 0, parseFloat(cs.fontSize) * 0.85);
  }

  /* ── sample non-transparent pixels into particles ─────────────── */
  const imgData   = oCtx.getImageData(0, 0, off.width, off.height);
  const particles = [];
  const step      = PIXEL * dpr;

  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      const i = (y * off.width + x) * 4;
      if (imgData.data[i + 3] > 35) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 3.8;
        particles.push({
          x: x / dpr + MARGIN,
          y: y / dpr + MARGIN,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.0,
          alpha: 0.75 + Math.random() * 0.25,
        });
      }
    }
  }

  if (!particles.length) return () => {};

  /* ── overlay canvas (larger to allow scatter) ─────────────────── */
  const cvs = document.createElement("canvas");
  cvs.width  = rect.width  + MARGIN * 2;
  cvs.height = rect.height + MARGIN * 2;
  Object.assign(cvs.style, {
    position:      "fixed",
    left:          `${rect.left - MARGIN}px`,
    top:           `${rect.top  - MARGIN}px`,
    pointerEvents: "none",
    zIndex:        "9990",
  });
  document.body.appendChild(cvs);
  const ctx = cvs.getContext("2d");
  ctx.fillStyle = `rgb(${r},${g},${b})`;

  el.style.opacity    = "0";
  el.style.transition = "opacity 0.04s";

  let raf;
  const tick = () => {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    let alive = false;

    for (const p of particles) {
      if (p.alpha < 0.01) continue;
      alive = true;
      ctx.globalAlpha = p.alpha;
      // snap to pixel grid for the blocky look
      ctx.fillRect(
        Math.round(p.x / PIXEL) * PIXEL,
        Math.round(p.y / PIXEL) * PIXEL,
        PIXEL, PIXEL,
      );
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += GRAVITY;
      p.vx *= 0.97;
      p.alpha -= DECAY + Math.random() * 0.006;
    }

    ctx.globalAlpha = 1;
    if (alive) raf = requestAnimationFrame(tick);
    else cvs.remove();
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    cvs.remove();
    el.style.opacity    = "";
    el.style.transition = "";
  };
}

/* ── Component — attaches to matching elements via MutationObserver ── */
export default function PixelDisintegrate() {
  useEffect(() => {
    const cleanups  = new Map();
    const listening = new WeakSet();

    function onEnter() {
      if (!cleanups.has(this)) cleanups.set(this, launch(this));
    }
    function onLeave() {
      const c = cleanups.get(this);
      if (c) { c(); cleanups.delete(this); }
      this.style.opacity    = "";
      this.style.transition = "";
    }

    function attach(root) {
      root.querySelectorAll(TARGETS).forEach((el) => {
        if (listening.has(el)) return;
        listening.add(el);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    }

    attach(document);

    const observer = new MutationObserver(() => attach(document));
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.querySelectorAll(TARGETS).forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        const c = cleanups.get(el);
        if (c) c();
      });
    };
  }, []);

  return null;
}
