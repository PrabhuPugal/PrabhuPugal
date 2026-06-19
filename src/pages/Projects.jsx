import { useNavigate } from "react-router-dom";
import { Cpu, Calendar, ExternalLink, ArrowRight } from "lucide-react";
import { GithubIcon } from "../components/SocialIcons";
import SectionReveal from "../components/SectionReveal";
import ScrambleText from "../components/ScrambleText";
import Tag from "../components/Tag";
import { projects } from "../data/projects";
import styles from "./Projects.module.css";

export default function Projects() {
  const navigate = useNavigate();

  return (
    <section className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <ScrambleText className="section-label" text="04 / projects" />
          </div>
        </SectionReveal>

        <div className={styles.grid}>
          {projects.map((proj, i) => (
            <SectionReveal key={proj.id} delay={i * 0.1}>
              <div data-shine className={styles.card}>
                {/* Header */}
                <div className={styles.cardHeader}>
                  <Cpu size={16} className={styles.icon} />
                  <div className={styles.cardMeta}>
                    <h3 className={styles.title}>{proj.title}</h3>
                    <span className={styles.period}><Calendar size={12} /> {proj.period}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className={styles.tags}>
                  {proj.tags.map((t) => <Tag key={t} label={t} />)}
                </div>

                {/* 1-2 line summary */}
                <p className={styles.summary}>{proj.summary}</p>

                {/* Footer: links + Read more */}
                <div className={styles.footer}>
                  <div className={styles.links}>
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        <GithubIcon size={13} /> Code
                      </a>
                    )}
                    {proj.live && (
                      <a href={proj.live} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        <ExternalLink size={13} /> Live
                      </a>
                    )}
                  </div>
                  <button
                    className={styles.readMore}
                    onClick={() => navigate(`/projects/${proj.slug}`)}
                  >
                    Read more <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
