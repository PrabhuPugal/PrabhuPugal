import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, Calendar, User } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import Tag from "../components/Tag";
import { researchProjects } from "../data/research";
import styles from "./Research.module.css";

export default function Research() {
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <span className="section-label">03 / research</span>
          </div>
        </SectionReveal>

        <div className={styles.list}>
          {researchProjects.map((proj, i) => (
            <SectionReveal key={proj.id} delay={i * 0.1}>
              <div className={`${styles.card} ${expanded === proj.id ? styles.cardOpen : ""}`}>
                <button
                  className={styles.cardHeader}
                  onClick={() => setExpanded(expanded === proj.id ? null : proj.id)}
                  aria-expanded={expanded === proj.id}
                >
                  <div className={styles.headerLeft}>
                    <BookOpen size={16} className={styles.headerIcon} />
                    <div className={styles.headerMeta}>
                      <h3 className={styles.title}>{proj.title}</h3>
                      <div className={styles.cardDetails}>
                        <span className={styles.cardDetail}>
                          <Calendar size={12} /> {proj.period}
                        </span>
                        {proj.supervisor && (
                          <span className={styles.cardDetail}>
                            <User size={12} /> {proj.supervisor}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={styles.chevron}>
                    {expanded === proj.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                <div className={styles.tags}>
                  {proj.tags.map((t) => <Tag key={t} label={t} />)}
                </div>

                <AnimatePresence>
                  {expanded === proj.id && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className={styles.body}
                    >
                      <p className={styles.abstract}>{proj.abstract}</p>
                      <ul className={styles.highlights}>
                        {proj.highlights.map((h, j) => (
                          <li key={j} className={styles.highlight}>{h}</li>
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
