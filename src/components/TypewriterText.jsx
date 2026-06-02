import { useState, useEffect, useRef } from "react";

export default function TypewriterText({
  text,
  speed = 40,
  delay = 0,
  className = "",
  showCursor = true,
  onDone = null,
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;

    const start = setTimeout(() => {
      const type = () => {
        if (indexRef.current < text.length) {
          setDisplayed(text.slice(0, indexRef.current + 1));
          indexRef.current++;
          timeoutRef.current = setTimeout(type, speed);
        } else {
          setDone(true);
          if (onDone) onDone();
        }
      };
      type();
    }, delay);

    return () => {
      clearTimeout(start);
      clearTimeout(timeoutRef.current);
    };
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && !done && <span className="cursor" />}
      {showCursor && done && <span className="cursor" />}
    </span>
  );
}
