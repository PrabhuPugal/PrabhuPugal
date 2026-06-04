import { useState } from "react";
import { Brain, Server, Wrench, FlaskConical, Gamepad2, BookOpen, ExternalLink, ChevronDown } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import { skills } from "../data/skills";
import styles from "./About.module.css";

const iconMap = { Brain, Server, Wrench, FlaskConical };

export default function About() {
  // Only one category open at a time; first one open by default
  const [openCat, setOpenCat] = useState(skills[0]?.category ?? null);
  const toggle = (cat) => setOpenCat(prev => prev === cat ? null : cat);

  return (
    <section className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <span className="section-label">01 / about</span>
          </div>
        </SectionReveal>

        <div className={styles.grid}>
          <SectionReveal delay={0.1}>
            <div className={styles.bio}>
              <p className={styles.intro}>
                Hi, I'm Prabhu Pugalenthi but most people call me PB (like peanut butter).
              </p>

              <p>
                I'm a Master's student in Computer Science at the{" "}
                <strong>University of Southern California</strong> in Los Angeles, California, focusing on Natural
                Language Processing, Machine Learning Systems, and Deep Learning
                Architectures. My research interests span LLM systems, reinforcement
                learning, cognitive architectures, and AI safety.
              </p>

              <p>
                Currently, I'm a{" "}
                <strong>Graduate Researcher at the HUMANS Lab at USC</strong>,
                where I work on developing and evaluating AI systems that improve
                reasoning efficiency and decision-making across complex tasks, while
                also studying the psychological and behavioral patterns exhibited by
                LLMs during reasoning, decision-making, and interaction. I'm especially
                interested in reasoning budgeting, cognitive routing, model
                trustworthiness, and evaluating how LLMs behave under pressure,
                constraints, and safety-critical settings.
              </p>

              <p>
                Before USC, I completed a 5-year integrated Master's in Software Systems
                at <strong>Coimbatore Institute of Technology</strong> in Tamil Nadu,
                India. I also interned at Ernst &amp; Young as a Data Analyst and Software Developer,
                where I worked on data pipelines, analytics dashboards, backend systems,
                document intelligence, and ML-based business analysis projects.
              </p>

              <p>
                My interest in computer science started pretty early. As a kid, I built
                my first PC from scratch using only the manual, took around six hours,
                and immediately became obsessed with what actually happens inside a
                computer when you press a key. That curiosity eventually turned into
                machine learning, research, and now a slightly unhealthy relationship
                with LLM benchmarks.
              </p>

              <div className={styles.funFact}>
                <div className={styles.funFactLabel}>
                  <Gamepad2 size={13} />
                  <span>fun fact</span>
                </div>
                <p className={styles.funFactText}>
                  When I'm not building reasoning agents, I'm probably exploring LA,
                  trying new food, sitting in the lab debugging something that worked
                  yesterday, or hanging out on Discord. I also play competitive games
                  like Valorant and CS, and I'm a big fan of story-mode games because,
                  sometimes it's nice when the quest objective is clearer than a
                  research problem.
                </p>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div className={styles.rightCol}>

              {/* Skills */}
              <div className={styles.skills}>
                <h3 className={styles.skillsTitle}>Skills</h3>
                <div className={styles.skillsGrid}>
                  {skills.map((group, i) => {
                    const Icon = iconMap[group.icon];
                    const isCollapsed = openCat !== group.category;
                    return (
                      <div key={i} className={styles.skillGroup}>
                        <button
                          className={styles.groupHeader}
                          onClick={() => toggle(group.category)}
                          aria-expanded={!isCollapsed}
                        >
                          <div className={styles.groupHeaderLeft}>
                            {Icon && <Icon size={14} className={styles.groupIcon} />}
                            <span className={styles.groupName}>{group.category}</span>
                          </div>
                          <ChevronDown
                            size={13}
                            className={`${styles.chevron} ${isCollapsed ? styles.chevronCollapsed : ""}`}
                          />
                        </button>
                        <div className={`${styles.badgesWrap} ${isCollapsed ? styles.badgesHidden : ""}`}>
                          <div className={styles.badges}>
                            {group.items.map((item) => (
                              <span
                                key={item.name}
                                className={styles.badge}
                                style={{ "--brand": item.color }}
                              >{item.name}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Papers */}
              <div className={styles.readingCard}>
                <h3 className={styles.cardTitle}>
                  <BookOpen size={14} style={{ display: "inline", marginRight: "0.4rem", verticalAlign: "middle" }} />
                  Papers I'd Recommend You to Read
                </h3>
                <div className={styles.readingList}>
                  <a
                    href="https://openreview.net/forum?id=a7Z2yN6eb2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.readingItem}
                  >
                    <span className={styles.readingType}>authored</span>
                    <p className={styles.readingName}>
                      Beyond the Mean: Three-Axis Fidelity for Aligning LLM-Based Survey Simulators from Small Pilot Data
                    </p>
                    <span className={styles.readingMeta}>Pugalenthi et al. · OpenReview <ExternalLink size={10} /></span>
                  </a>
                  <div className={styles.readingDivider} />
                  <a
                    href="https://arxiv.org/abs/1706.03762"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.readingItem}
                  >
                    <span className={styles.readingType}>paper</span>
                    <p className={styles.readingName}>Attention Is All You Need</p>
                    <span className={styles.readingMeta}>Vaswani et al., 2017 · the one that started it all <ExternalLink size={10} /></span>
                  </a>
                </div>
              </div>

            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
