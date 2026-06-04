import { useState, useRef } from "react";
import { MapPin, Camera } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import ScrambleText from "../components/ScrambleText";
import Lightbox from "../components/Lightbox";
import USMap from "../components/USMap";
import { photos } from "../data/photos";
import styles from "./Photos.module.css";

const ROTATIONS = [-3, 2.5, -1.5, 3.5, -2, 1.5, -3, 2, -1, 3];

function TiltCard({ children, className, onClick, ariaLabel, baseRotation = 0 }) {
  const ref = useRef(null);
  const base = `perspective(900px) rotateX(0deg) rotateY(0deg) rotateZ(${baseRotation}deg) scale3d(1,1,1)`;

  const [cardStyle, setCardStyle] = useState({ transform: base });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCardStyle({
      transform: `perspective(900px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) rotateZ(${baseRotation}deg) scale3d(1.04,1.04,1.04)`,
      boxShadow: `${x * -30}px ${y * -30}px 55px rgba(0,0,0,0.25), ${x * -10}px ${y * -10}px 20px rgba(0,0,0,0.1)`,
      transition: "transform 0.08s linear",
      zIndex: 10,
    });
  };

  const handleMouseLeave = () => {
    setCardStyle({
      transform: base,
      boxShadow: "",
      transition: "transform 0.55s ease, box-shadow 0.55s ease",
    });
  };

  return (
    <button
      ref={ref}
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={cardStyle}
    >
      {children}
    </button>
  );
}

function PhotoCard({ photo, i, onClick }) {
  const orientClass = photo.orientation === "portrait" ? styles.portrait : styles.landscape;
  return (
    <TiltCard
      className={`${styles.card} ${orientClass}`}
      onClick={() => onClick(photo)}
      ariaLabel={`View photo from ${photo.location}`}
      baseRotation={ROTATIONS[i % ROTATIONS.length]}
    >
      <div className={styles.imageWrap}>
        <img
          src={photo.src}
          alt={photo.location}
          className={styles.image}
          loading="lazy"
        />
      </div>
      <div className={styles.pin} style={{ animationDelay: `${(i % 5) * 0.6}s` }}>
        <MapPin size={11} className={styles.pinIcon} />
        <span>{photo.location}</span>
      </div>
    </TiltCard>
  );
}

export default function Photos() {
  const [selected, setSelected] = useState(null);

  const featured = photos.find((p) => p.featured);
  const others      = photos.filter((p) => !p.featured);
  const centerExtras = others.slice(-2);
  const rest         = others.slice(0, -2);
  const half         = Math.ceil(rest.length / 2);
  const left         = rest.slice(0, half);
  const right        = rest.slice(half);

  return (
    <section className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <ScrambleText className="section-label" text="05 / lens" />
          </div>
        </SectionReveal>

        {photos.length === 0 ? (
          <SectionReveal delay={0.1}>
            <div className={styles.empty}>
              <Camera size={36} className={styles.emptyIcon} />
              <p className={styles.emptyText}>Photos coming soon.</p>
              <p className={styles.emptyHint}>
                Drop your shots in <code>public/photos/</code> and add them to{" "}
                <code>src/data/photos.js</code>.
              </p>
            </div>
          </SectionReveal>
        ) : (
          <SectionReveal delay={0.05}>
            <div className={styles.photoLayout}>
              {/* Left column */}
              <div className={styles.sideCol}>
                {left.map((photo, i) => (
                  <PhotoCard key={photo.id} photo={photo} i={i} onClick={setSelected} />
                ))}
              </div>

              {/* Center — featured + one extra below */}
              <div className={styles.centerCol}>
                {featured && (
                  <TiltCard
                    className={styles.featuredCard}
                    onClick={() => setSelected(featured)}
                    ariaLabel={`View featured photo from ${featured.location}`}
                  >
                    <div className={styles.featuredWrap}>
                      <img
                        src={featured.src}
                        alt={featured.location}
                        className={styles.featuredImage}
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.pin}>
                      <MapPin size={11} className={styles.pinIcon} />
                      <span>{featured.location}</span>
                    </div>
                  </TiltCard>
                )}
                {centerExtras.map((photo, i) => (
                  <PhotoCard key={photo.id} photo={photo} i={rest.length + i} onClick={setSelected} />
                ))}
              </div>

              {/* Right column */}
              <div className={styles.sideCol}>
                {right.map((photo, i) => (
                  <PhotoCard key={photo.id} photo={photo} i={i + half} onClick={setSelected} />
                ))}
              </div>
            </div>
          </SectionReveal>
        )}

        <SectionReveal delay={0.1}>
          <USMap />
        </SectionReveal>
      </div>

      {selected && (
        <Lightbox
          item={{
            ...selected,
            city: selected.location,
            image: selected.src,
            orientation: selected.orientation,
          }}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
