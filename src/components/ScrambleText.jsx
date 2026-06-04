import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#/·—";

export default function ScrambleText({ text, className, speed = 2 }) {
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef(null);
  const hasRun = useRef(false);

  const scramble = () => {
    cancelAnimationFrame(frameRef.current);
    let frame = 0;
    const total = text.length * speed;
    const run = () => {
      const revealed = Math.floor((frame / total) * text.length);
      setDisplayed(
        text.split("").map((ch, i) => {
          if (ch === " " || ch === "/" || ch === "·") return ch;
          if (i < revealed) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      frame++;
      if (frame <= total) frameRef.current = requestAnimationFrame(run);
      else setDisplayed(text);
    };
    frameRef.current = requestAnimationFrame(run);
  };

  useEffect(() => {
    if (!hasRun.current) { hasRun.current = true; scramble(); }
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <span className={className} onMouseEnter={scramble} style={{ fontVariantNumeric: "tabular-nums" }}>
      {displayed}
    </span>
  );
}
