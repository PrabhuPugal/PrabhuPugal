import { useEffect, useRef } from "react";
import styles from "./PaperDeck.module.css";

export default function PaperDeck({ sections, onSelectSection }) {
  return (
    <div className={styles.shell}>
      <div className={styles.stage}>
        {sections.map((section) => {
          const SectionComponent = section.component;
          return (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className={styles.sectionBlock}
            >
              <SectionComponent onSelectSection={onSelectSection} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
