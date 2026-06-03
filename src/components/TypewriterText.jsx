import { useEffect, useRef, useState } from "react";

export default function TypewriterText({
  text,
  speed = 40,
  delay = 0,
  className = "",
  showCursor = true,
  onDone = null,
}) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const onDoneRef = useRef(onDone);
  const timeoutRef = useRef(null);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const start = setTimeout(() => {
      setDisplayed("");
      setIsComplete(false);
      indexRef.current = 0;

      const type = () => {
        if (indexRef.current < text.length) {
          setDisplayed(text.slice(0, indexRef.current + 1));
          indexRef.current += 1;
          timeoutRef.current = setTimeout(type, speed);
          return;
        }

        setIsComplete(true);
        onDoneRef.current?.();
      };

      type();
    }, delay);

    return () => {
      clearTimeout(start);
      clearTimeout(timeoutRef.current);
    };
  }, [delay, speed, text]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && !isComplete && <span className="cursor" />}
    </span>
  );
}
