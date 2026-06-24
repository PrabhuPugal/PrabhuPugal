import SectionReveal from "../components/SectionReveal";
import ScrambleText from "../components/ScrambleText";
import { experiences } from "../data/experience";
import styles from "./Experience.module.css";

export default function Experience() {
  return (
    <section className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <ScrambleText className="section-label" text="02 / experience" />
          </div>
        </SectionReveal>

        <div className={styles.timeline}>
          {experiences.map((exp, i) => (
            <SectionReveal key={exp.id} delay={i * 0.07}>
              <div className={styles.timelineItem}>

                <div className={styles.track}>
                  <div className={styles.dot} style={{ background: exp.color, boxShadow: exp.ring ? `0 0 0 2px ${exp.ring}` : "none" }} />
                  {i < experiences.length - 1 && (() => {
                    const next = experiences[i + 1];
                    const bothEY = exp.ring && next.ring;
                    const gradient = bothEY
                      ? `linear-gradient(to bottom, ${exp.color}90, ${exp.ring}cc, ${next.color}90)`
                      : `linear-gradient(to bottom, ${exp.color}90, ${next.color}90)`;
                    return <div className={styles.line} style={{ background: gradient }} />;
                  })()}
                </div>

                <div className={styles.entry}>
                  <div className={styles.entryHead}>
                    <span className={styles.role}>{exp.role}</span>
                    {exp.current && <span className={styles.currentBadge}>Present</span>}
                    <span className={styles.period}>{exp.period}</span>
                  </div>
                  <div className={styles.entryMeta}>{exp.company} · {exp.location}</div>
                  <ul className={styles.bullets}>
                    {exp.bullets.map((b, j) => (
                      <li key={j} className={styles.bullet}>{b}</li>
                    ))}
                  </ul>
                </div>

              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
