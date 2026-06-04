import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ChevronDown, ChevronUp, Building2, MapPin, Calendar } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import { experiences } from "../data/experience";
import styles from "./Experience.module.css";

export default function Experience() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <span className="section-label">02 / experience</span>
          </div>
        </SectionReveal>

        <div className={styles.list}>
          {experiences.map((exp, i) => (
            <SectionReveal key={exp.id} delay={i * 0.08}>
              <div className={`${styles.card} ${expanded === exp.id ? styles.cardOpen : ""}`}>
                <button
                  className={styles.cardHeader}
                  onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
                  aria-expanded={expanded === exp.id}
                >
                  <div className={styles.headerLeft}>
                    <Briefcase size={16} className={styles.headerIcon} />
                    <div className={styles.headerMeta}>
                      <div className={styles.titleRow}>
                        <h3 className={styles.title}>{exp.role}</h3>
                        {exp.current && <span className={styles.currentBadge}>Present</span>}
                      </div>
                      <div className={styles.cardDetails}>
                        <span className={styles.cardDetail}>
                          <Building2 size={12} /> {exp.company}
                        </span>
                        <span className={styles.cardDetail}>
                          <MapPin size={12} /> {exp.location}
                        </span>
                        <span className={styles.cardDetail}>
                          <Calendar size={12} /> {exp.period}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={styles.chevron}>
                    {expanded === exp.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                <AnimatePresence>
                  {expanded === exp.id && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className={styles.body}
                    >
                      <ul className={styles.bullets}>
                        {exp.bullets.map((b, j) => (
                          <li key={j} className={styles.bullet}>{b}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
