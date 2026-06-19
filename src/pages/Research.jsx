import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronDown, Calendar, User, ArrowRight } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import ScrambleText from "../components/ScrambleText";
import Tag from "../components/Tag";
import { researchProjects } from "../data/research";
import styles from "./Research.module.css";

export default function Research() {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <section className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <ScrambleText className="section-label" text="03 / research" />
          </div>
        </SectionReveal>

        <div className={styles.list}>
          {researchProjects.map((proj, i) => {
            const isOpen = expanded === proj.id;
            return (
              <SectionReveal key={proj.id} delay={i * 0.1}>
                <div data-shine className={`${styles.card} ${isOpen ? styles.cardOpen : ""}`}>
                  {/* Clickable header */}
                  <button
                    className={styles.cardHeader}
                    onClick={() => toggle(proj.id)}
                    aria-expanded={isOpen}
                  >
                    <BookOpen size={16} className={styles.headerIcon} />
                    <div className={styles.headerMeta}>
                      <h3 className={styles.title}>{proj.title}</h3>
                      <div className={styles.cardDetails}>
                        <span className={styles.cardDetail}><Calendar size={12} /> {proj.period}</span>
                        {proj.supervisor && (
                          <span className={styles.cardDetail}><User size={12} /> {proj.supervisor}</span>
                        )}
                      </div>
                    </div>
                    <ChevronDown size={16} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} />
                  </button>

                  {/* Tags — always visible */}
                  <div className={styles.tags}>
                    {proj.tags.map((t) => <Tag key={t} label={t} />)}
                  </div>

                  {/* Expandable summary */}
                  <div className={`${styles.expandWrap} ${isOpen ? styles.expandWrapOpen : ""}`}>
                    <div className={styles.expandInner}>
                      <div className={styles.summary}>
                        <p className={styles.summaryText}>{proj.abstract}</p>
                        <button
                          className={styles.readMore}
                          onClick={(e) => { e.stopPropagation(); navigate(`/research/${proj.slug}`); }}
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
