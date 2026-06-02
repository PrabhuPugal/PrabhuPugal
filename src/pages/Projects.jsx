import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ChevronDown, ChevronUp, Calendar, ExternalLink } from "lucide-react";
import { GithubIcon } from "../components/SocialIcons";
import SectionReveal from "../components/SectionReveal";
import Tag from "../components/Tag";
import { projects } from "../data/projects";
import styles from "./Projects.module.css";

export default function Projects() {
  const [expanded, setExpanded] = useState(null);

  return (
    <main className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <span className="section-label">04 / projects</span>
            <h2 className="section-title">Projects</h2>
          </div>
        </SectionReveal>

        <div className={styles.grid}>
          {projects.map((proj, i) => (
            <SectionReveal key={proj.id} delay={i * 0.1}>
              <div className={`${styles.card} ${expanded === proj.id ? styles.cardOpen : ""}`}>
                <div className={styles.cardTop}>
                  <Cpu size={16} className={styles.icon} />
                  <div className={styles.cardMeta}>
                    <h3 className={styles.title}>{proj.title}</h3>
                    <span className={styles.period}>
                      <Calendar size={12} /> {proj.period}
                    </span>
                  </div>
                </div>

                <div className={styles.tags}>
                  {proj.tags.map((t) => <Tag key={t} label={t} />)}
                </div>

                <p className={styles.desc}>{proj.description}</p>

                <button
                  className={styles.toggleBtn}
                  onClick={() => setExpanded(expanded === proj.id ? null : proj.id)}
                >
                  {expanded === proj.id ? (
                    <><ChevronUp size={14} /> Less</>
                  ) : (
                    <><ChevronDown size={14} /> Key highlights</>
                  )}
                </button>

                <AnimatePresence>
                  {expanded === proj.id && (
                    <motion.ul
                      key="highlights"
                      className={styles.highlights}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {proj.highlights.map((h, j) => (
                        <li key={j} className={styles.highlight}>{h}</li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>

                {(proj.github || proj.live) && (
                  <div className={styles.links}>
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        <GithubIcon size={14} /> Code
                      </a>
                    )}
                    {proj.live && (
                      <a href={proj.live} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        <ExternalLink size={14} /> Live
                      </a>
                    )}
                  </div>
                )}
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </main>
  );
}
