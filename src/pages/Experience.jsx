import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, ChevronDown, Building2, MapPin, Calendar, ArrowRight } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import ScrambleText from "../components/ScrambleText";
import { experiences } from "../data/experience";
import styles from "./Experience.module.css";

export default function Experience() {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <section className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <ScrambleText className="section-label" text="02 / experience" />
          </div>
        </SectionReveal>

        <div className={styles.list}>
          {experiences.map((exp, i) => {
            const isOpen = expanded === exp.id;
            return (
              <SectionReveal key={exp.id} delay={i * 0.08}>
                <div data-shine className={`${styles.card} ${isOpen ? styles.cardOpen : ""}`}>
                  {/* Clickable header */}
                  <button
                    className={styles.cardHeader}
                    onClick={() => toggle(exp.id)}
                    aria-expanded={isOpen}
                  >
                    <Briefcase size={16} className={styles.headerIcon} />
                    <div className={styles.headerMeta}>
                      <div className={styles.titleRow}>
                        <h3 className={styles.title}>{exp.role}</h3>
                        {exp.current && <span className={styles.currentBadge}>Present</span>}
                      </div>
                      <div className={styles.cardDetails}>
                        <span className={styles.cardDetail}><Building2 size={12} /> {exp.company}</span>
                        <span className={styles.cardDetail}><MapPin size={12} /> {exp.location}</span>
                        <span className={styles.cardDetail}><Calendar size={12} /> {exp.period}</span>
                      </div>
                    </div>
                    <ChevronDown size={16} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} />
                  </button>

                  {/* Expandable summary */}
                  <div className={`${styles.expandWrap} ${isOpen ? styles.expandWrapOpen : ""}`}>
                    <div className={styles.expandInner}>
                      <div className={styles.summary}>
                        <ul className={styles.summaryList}>
                          {exp.bullets.slice(0, 2).map((b, j) => (
                            <li key={j} className={styles.summaryItem}>{b}</li>
                          ))}
                        </ul>
                        <button
                          className={styles.readMore}
                          onClick={(e) => { e.stopPropagation(); navigate(`/experience/${exp.slug}`); }}
                        >
                          Read more <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
