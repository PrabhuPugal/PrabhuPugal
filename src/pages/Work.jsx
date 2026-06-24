import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import ScrambleText from "../components/ScrambleText";
import { researchProjects } from "../data/research";
import { projects } from "../data/projects";
import styles from "./Work.module.css";

export default function Work() {
  const navigate = useNavigate();
  return (
    <section className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <ScrambleText className="section-label" text="03 / work" />
          </div>
        </SectionReveal>

        {/* ── Research ──────────────────────────────────────── */}
        <SectionReveal>
          <div className={styles.zoneHeader}>
            <span className={styles.zoneTitle}>Research</span>
            <span className={styles.zoneSub}>active &amp; peer-reviewed</span>
          </div>
        </SectionReveal>

        <div className={styles.list}>
          {researchProjects.map((proj, i) => (
            <SectionReveal key={proj.id} delay={i * 0.07}>
              <div className={styles.entry}>
                <div className={styles.entryHead}>
                  <span className={styles.title}>{proj.title}</span>
                  {proj.published && <span className={styles.publishedBadge}>published</span>}
                  <span className={styles.period}>{proj.period}</span>
                </div>
                {proj.supervisor && (
                  <div className={styles.entryMeta}>{proj.supervisor}</div>
                )}
                <div className={styles.entryTags}>{proj.tags.join(" · ")}</div>
                <ul className={styles.bullets}>
                  {proj.highlights.map((h, j) => (
                    <li key={j} className={styles.bullet}>{h}</li>
                  ))}
                </ul>
                <button className={styles.readMore} onClick={() => navigate(`/research/${proj.slug}`)}>
                  Read more <ArrowRight size={12} />
                </button>
              </div>
            </SectionReveal>
          ))}
        </div>

        {/* ── Projects ──────────────────────────────────────── */}
        <SectionReveal>
          <div className={`${styles.zoneHeader} ${styles.zoneHeaderSpaced}`}>
            <span className={styles.zoneTitle}>Projects</span>
            <span className={styles.zoneSub}>engineering &amp; applied</span>
          </div>
        </SectionReveal>

        <div className={styles.list}>
          {projects.map((proj, i) => (
            <SectionReveal key={proj.id} delay={i * 0.07}>
              <div className={styles.entry}>
                <div className={styles.entryHead}>
                  <span className={styles.title}>{proj.title}</span>
                  <span className={styles.period}>{proj.period}</span>
                </div>
                <div className={styles.entryTags}>{proj.tags.join(" · ")}</div>
                <ul className={styles.bullets}>
                  {proj.highlights.map((h, j) => (
                    <li key={j} className={styles.bullet}>{h}</li>
                  ))}
                </ul>
                <button className={styles.readMore} onClick={() => navigate(`/projects/${proj.slug}`)}>
                  Read more <ArrowRight size={12} />
                </button>
              </div>
            </SectionReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
