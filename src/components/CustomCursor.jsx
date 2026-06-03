import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -200, y: -200 });
  const lerped = useRef({ x: -200, y: -200 });
  const rafId = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onEnter = (e) => {
      if (e.target.closest("a, button, [role='button'], input, textarea, select, label")) {
        setHovering(true);
      }
    };

    const onLeave = (e) => {
      if (e.target.closest("a, button, [role='button'], input, textarea, select, label")) {
        setHovering(false);
      }
    };

    const onWindowLeave = () => setVisible(false);
    const onWindowEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    document.addEventListener("mouseleave", onWindowLeave);
    document.addEventListener("mouseenter", onWindowEnter);

    const LERP_FACTOR = 0.11;

    const tick = () => {
      lerped.current.x += (mouse.current.x - lerped.current.x) * LERP_FACTOR;
      lerped.current.y += (mouse.current.y - lerped.current.y) * LERP_FACTOR;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${lerped.current.x}px, ${lerped.current.y}px)`;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      document.removeEventListener("mouseleave", onWindowLeave);
      document.removeEventListener("mouseenter", onWindowEnter);
      cancelAnimationFrame(rafId.current);
    };
  }, [visible]);

  return (
    <>
      {/* Wrapper is 0×0 at origin — translate moves it to cursor, inner centers itself */}
      <div
        ref={dotRef}
        className={styles.cursorWrap}
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div className={`${styles.beam} ${hovering ? styles.beamHover : ""}`} />
      </div>

      <div
        ref={ringRef}
        className={styles.cursorWrap}
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div className={`${styles.token} ${hovering ? styles.tokenHover : ""}`} />
      </div>
    </>
  );
}
