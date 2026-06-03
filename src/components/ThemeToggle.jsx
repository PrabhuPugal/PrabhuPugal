import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/useTheme";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={styles.wrap}>
      <button
        className={`${styles.btn} ${isLight ? styles.btnLight : ""}`}
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title={isLight ? "my eyes!! (switch to dark)" : "switch to light mode"}
      >
        {isLight ? <Moon size={15} /> : <Sun size={15} />}
      </button>
      {isLight && (
        <div className={styles.memeWrap}>
          <div className={styles.bubble}>my eyes!!!</div>
          <img src="/eyes.png" alt="my eyes!!!" className={styles.meme} />
        </div>
      )}
    </div>
  );
}
