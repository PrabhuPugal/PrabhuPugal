import { Building2, MapPin, Calendar } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import { experiences } from "../data/experience";
import styles from "./Experience.module.css";

export default function Experience() {
  return (
    <main className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <span className="section-label">02 / experience</span>
            <h2 className="section-title">Work Experience</h2>
          </div>
        </SectionReveal>

        <div className={styles.timeline}>
          {experiences.map((exp, i) => (
            <SectionReveal key={exp.id} delay={i * 0.12}>
              <div className={styles.item}>
                <div className={styles.dot}>
                  {exp.current && <div className={styles.dotPulse} />}
                </div>

                <div className={styles.card}>
                  <div className={styles.cardTop}>
                    <div className={styles.meta}>
                      <h3 className={styles.role}>{exp.role}</h3>
                      <div className={styles.details}>
                        <span className={styles.detail}>
                          <Building2 size={13} /> {exp.company}
                        </span>
                        <span className={styles.detail}>
                          <MapPin size={13} /> {exp.location}
                        </span>
                        <span className={styles.detail}>
                          <Calendar size={13} /> {exp.period}
                        </span>
                      </div>
                    </div>
                    {exp.current && (
                      <span className={styles.currentBadge}>Present</span>
                    )}
                  </div>

                  <ul className={styles.bullets}>
                    {exp.bullets.map((b, j) => (
                      <li key={j} className={styles.bullet}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </main>
  );
}
