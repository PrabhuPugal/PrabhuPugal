import styles from "./TypewriterKeyboard.module.css";

const ROW1 = ["Q","W","E","R","T","Y","U","I","O","P"];
const ROW2 = ["A","S","D","F","G","H","J","K","L"];

export default function TypewriterKeyboard({ sections, activeSectionId, onSelectSection }) {
  return (
    <div className={styles.keyboard} aria-label="Section navigation keyboard">
      {/* Decorative QWERTY rows */}
      <div className={styles.row}>
        {ROW1.map((k) => (
          <span key={k} className={styles.key} aria-hidden="true">{k}</span>
        ))}
      </div>

      <div className={styles.row}>
        {ROW2.map((k) => (
          <span key={k} className={`${styles.key} ${styles.rowOffset}`} aria-hidden="true">{k}</span>
        ))}
      </div>

      {/* Nav keys — the clickable section row */}
      <div className={styles.row}>
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`${styles.key} ${styles.navKey} ${activeSectionId === section.id ? styles.navKeyActive : ""}`}
            onClick={() => onSelectSection(section.id)}
            aria-label={`Go to ${section.label}`}
            aria-pressed={activeSectionId === section.id}
          >
            <span className={styles.navKeyLabel}>{section.label.slice(0, 3).toUpperCase()}</span>
          </button>
        ))}
      </div>

      {/* Space bar */}
      <div className={styles.spaceRow}>
        <span className={styles.spaceBar} aria-hidden="true">PRABHU PUGALENTHI</span>
      </div>
    </div>
  );
}
