import { Code2, Brain, Layers, Server, Wrench, FlaskConical } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import { skills } from "../data/skills";
import styles from "./About.module.css";

const iconMap = { Code2, Brain, Layers, Server, Wrench, FlaskConical };

export default function About() {
  return (
    <main className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <span className="section-label">01 / about</span>
            <h2 className="section-title">About Me</h2>
          </div>
        </SectionReveal>

        <div className={styles.grid}>
          <SectionReveal delay={0.1}>
            <div className={styles.bio}>
              <p>
                I'm a Master of Computer Science student at the{" "}
                <strong>University of Southern California</strong> (Jan 2026 – May 2027),
                focusing on Machine Learning Systems, Deep Learning Architectures, and
                Generative AI.
              </p>
              <br />
              <p>
                Currently, I work as a{" "}
                <strong>Graduate Research Assistant at USC</strong>, extending CogRouter —
                an ACT-R-inspired cognitive routing framework — to generalize across
                agentic and mathematical reasoning domains. My research sits at the
                intersection of LLM systems, reinforcement learning, and AI safety.
              </p>
              <br />
              <p>
                Previously, I completed a 5-year integrated MS in Software Systems at{" "}
                <strong>Coimbatore Institute of Technology</strong> in Tamil Nadu, India,
                and interned at Ernst & Young as both a Data Analyst and Software Developer.
              </p>
              <br />
              <p>
                When I'm not building reasoning agents, I'm exploring new places,
                trying new food, and occasionally writing about what I learn.
              </p>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className={styles.skills}>
              <h3 className={styles.skillsTitle}>Skills</h3>
              <div className={styles.skillsGrid}>
                {skills.map((group, i) => {
                  const Icon = iconMap[group.icon];
                  return (
                    <div key={i} className={styles.skillGroup}>
                      <div className={styles.groupHeader}>
                        {Icon && <Icon size={15} className={styles.groupIcon} />}
                        <span className={styles.groupName}>{group.category}</span>
                      </div>
                      <div className={styles.badges}>
                        {group.items.map((item) => (
                          <span key={item} className={styles.badge}>{item}</span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </main>
  );
}
