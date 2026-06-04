import { useState } from "react";
import { MapPin } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import ScrambleText from "../components/ScrambleText";
import Lightbox from "../components/Lightbox";
import { travelDestinations } from "../data/travel";
import styles from "./Travel.module.css";

export default function Travel() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <ScrambleText className="section-label" text="06 / travel" />
            <p className={styles.subtitle}>
              Places I've called home, visited, and wandered through.
            </p>
          </div>
        </SectionReveal>

        <div className={styles.grid}>
          {travelDestinations.map((dest, i) => (
            <SectionReveal key={dest.id} delay={(i % 3) * 0.08}>
              <button
                className={styles.card}
                onClick={() => setSelected(dest)}
                aria-label={`View ${dest.city}`}
              >
                <div className={styles.imageWrap}>
                  {dest.image ? (
                    <img
                      src={dest.image}
                      alt={dest.city}
                      className={styles.image}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.fallback}>
                      <span className={styles.emoji}>{dest.emoji}</span>
                    </div>
                  )}
                  <div className={styles.overlay}>
                    <div className={styles.overlayContent}>
                      <MapPin size={14} />
                      <span>{dest.city}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <span className={styles.cityName}>{dest.city}</span>
                  <span className={styles.countryName}>{dest.country}</span>
                </div>
              </button>
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={0.2}>
          <div className={styles.listSection}>
            <h3 className={styles.listTitle}>Destinations</h3>
            <div className={styles.placeList}>
              {travelDestinations.map((dest) => (
                <span key={dest.id} className={styles.place}>
                  <MapPin size={12} />
                  {dest.city}, {dest.country}
                </span>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>

      {selected && (
        <Lightbox item={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
