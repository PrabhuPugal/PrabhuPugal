import { useEffect } from "react";

export default function GlobalEffects() {
  useEffect(() => {
    const onMove = (e) => {
      document.querySelectorAll("[data-shine]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--shine-x", `${x}%`);
        el.style.setProperty("--shine-y", `${y}%`);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return null;
}
