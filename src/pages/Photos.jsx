import { useState } from "react";
import { MapPin, Camera } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import Lightbox from "../components/Lightbox";
import { photos } from "../data/photos";
import styles from "./Photos.module.css";

export default function Photos() {
  const [selected, setSelected] = useState(null);

  return (
    <section className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <span className="section-label">06 / shot by me</span>
            <h2 className="section-title">Shot by Me</h2>
            <p className={styles.subtitle}>
              Places and moments through my lens.
            </p>
          </div>
        </SectionReveal>

        {photos.length === 0 ? (
          <SectionReveal delay={0.1}>
            <div className={styles.empty}>
              <Camera size={36} className={styles.emptyIcon} />
              <p className={styles.emptyText}>Photos coming soon.</p>
              <p className={styles.emptyHint}>
                Drop your shots in <code>public/photos/</code> and add them to <code>src/data/photos.js</code>.
              </p>
            </div>
          </SectionReveal>
        ) : (
          <div className={styles.grid}>
            {photos.map((photo, i) => (
              <SectionReveal key={photo.id} delay={(i % 3) * 0.07}>
                <button
                  className={`${styles.card} ${photo.span === "wide" ? styles.wide : ""}`}
                  onClick={() => setSelected(photo)}
                  aria-label={`View photo from ${photo.location}`}
                >
                  <div className={styles.imageWrap}>
                    <img
                      src={photo.src}
                      alt={photo.location}
                      className={styles.image}
                      loading="lazy"
                    />
                    <div className={styles.hoverOverlay} />
                  </div>

                  <div className={styles.pin}>
                    <MapPin size={11} className={styles.pinIcon} />
                    <span>{photo.location}</span>
                  </div>
                </button>
              </SectionReveal>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <Lightbox
          item={{ ...selected, city: selected.location, image: selected.src }}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
