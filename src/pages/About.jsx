import { useState } from "react";
import { Brain, Server, Wrench, FlaskConical, Gamepad2, BookOpen, ExternalLink, ChevronDown, GraduationCap, MapPin, Calendar } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import ScrambleText from "../components/ScrambleText";
import { skills } from "../data/skills";
import styles from "./About.module.css";
import edu from "./Education.module.css";

const iconMap = { Brain, Server, Wrench, FlaskConical };

const education = [
  {
    id: 1,
    degree: "Master of Science in Computer Science",
    school: "University of Southern California",
    logo: "/usc.png",
    logoRaw: true,
    location: "Los Angeles, CA",
    period: "Jan 2026 – May 2027 (Expected)",
    courses: ["Applied Natural Language Processing", "Deep Learning and its Applications", "Statistical Machine Learning", "Information Retrieval Systems"],
    focus: ["Natural Language Processing", "LLM Systems & Reasoning", "AI Safety & Benchmarking", "Cognitive Architectures"],
    current: true,
  },
  {
    id: 2,
    degree: "Master of Science in Software Systems",
    school: "Coimbatore Institute of Technology",
    logo: "/cit.png",
    logoRaw: true,
    location: "Tamil Nadu, India",
    period: "Sep 2020 – May 2025",
    courses: ["Artificial Intelligence", "Machine Learning", "Operating Systems", "Computer Networks"],
    focus: ["Theoretical Machine Learning", "AI Agentic Simulation", "Generative AI", "LLM-Augmented IoT Systems"],
    current: false,
  },
];

export default function About() {
  const [openCat, setOpenCat] = useState(skills[0]?.category ?? null);
  const toggle = (cat) => setOpenCat(prev => prev === cat ? null : cat);
  const [openEduId, setOpenEduId] = useState(null);
  const toggleEdu = (id) => setOpenEduId(prev => prev === id ? null : id);

  return (
    <section className={styles.aboutSection}>
      <div className={styles.threeCol}>

        {/* ── Left: Education ── */}
        <SectionReveal delay={0.05}>
          <div className={styles.col}>
            <ScrambleText className="section-label" text="01 / about" />
            <div className={styles.eduCol}>
              {education.map((e) => {
                const isOpen = openEduId === e.id;
                return (
                  <div data-shine key={e.id} className={`${edu.card} ${styles.eduCard}`} onClick={() => toggleEdu(e.id)}>
                    {e.current && <div className={edu.currentBar} />}
                    <button className={styles.eduToggle} aria-expanded={isOpen}>
                      <div className={styles.eduToggleLeft}>
                        <GraduationCap size={15} className={edu.icon} />
                        <div>
                          <h3 className={edu.degree}>{e.degree}</h3>
                          <p className={edu.school}>{e.school}</p>
                        </div>
                      </div>
                      <div className={styles.eduToggleRight}>
                        {e.logo && (
                          <img src={e.logo} alt={e.school} className={`${edu.schoolLogo} ${e.logoRaw ? edu.schoolLogoRaw : ""}`} />
                        )}
                        <ChevronDown size={13} className={`${styles.chevron} ${isOpen ? "" : styles.chevronCollapsed}`} />
                      </div>
                    </button>
                    <div className={`${styles.eduBodyWrap} ${isOpen ? "" : styles.eduBodyHidden}`} onClick={e => e.stopPropagation()}>
                      <div className={styles.eduBody}>
                        <div className={edu.details}>
                          <span className={edu.detail}><MapPin size={11} /> {e.location}</span>
                          <span className={edu.detail}><Calendar size={11} /> {e.period}</span>
                        </div>
                        <div className={edu.divider} />
                        <div className={edu.section}>
                          <div className={edu.sectionLabel}><BookOpen size={11} /> Relevant Courses</div>
                          <ul className={edu.list}>
                            {e.courses.map(c => <li key={c} className={edu.listItem}>{c}</li>)}
                          </ul>
                        </div>
                        {e.focus.length > 0 && (
                          <div className={edu.section}>
                            <div className={edu.sectionLabel}>Focus Areas</div>
                            <div className={edu.focusBadges}>
                              {e.focus.map(f => <span key={f} className={edu.focusBadge}>{f}</span>)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionReveal>

        {/* ── Center: Bio ── */}
        <SectionReveal delay={0.1}>
          <div className={`${styles.col} ${styles.centerCol}`}>
            <div className={styles.bio}>
              <p className={styles.intro}>
                Hi, I'm Prabhu Pugalenthi but most people call me PB (like peanut butter)!
              </p>
              <p>
                I'm a Master's student in Computer Science at the{" "}
                <strong>University of Southern California</strong> in Los Angeles,
                California, focusing on Natural Language Processing, Machine Learning
                Systems, and Deep Learning Architectures. My research interests span
                LLM systems, reinforcement learning, cognitive architectures, and AI
                safety.
              </p>
              <p>
                Currently, I'm a{" "}
                <strong>Graduate Researcher at the HUMANS Lab at USC</strong>, where I
                work on developing and evaluating AI systems that improve reasoning
                efficiency and decision-making across complex tasks, while also studying
                the psychological and behavioral patterns exhibited by LLMs during
                reasoning, decision-making, and interaction. I'm especially interested
                in reasoning budgeting, cognitive routing, model trustworthiness, and
                evaluating how LLMs behave under pressure, constraints, and
                safety-critical settings.
              </p>
              <p>
                Before USC, I completed a 5-year integrated Master's in Software Systems
                at <strong>Coimbatore Institute of Technology</strong> in Tamil Nadu,
                India. I also interned at Ernst &amp; Young as a Data Analyst and
                Software Developer, where I worked on data pipelines, analytics
                dashboards, backend systems, document intelligence, and ML-based
                business analysis projects.
              </p>
              <p>
                My interest in computer science started pretty early. As a kid, I built
                my first PC from scratch using only the manual, took around six hours,
                and immediately became obsessed with what actually happens inside a
                computer when you press a key. That curiosity eventually turned into
                machine learning, research, and now a slightly unhealthy relationship
                with LLM benchmarks.
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* ── Right: Skills + Papers + Fun Fact ── */}
        <SectionReveal delay={0.15}>
          <div className={styles.col}>
            <div className={styles.rightCol}>

              {/* Skills */}
              <div className={styles.skills}>
                <h3 className={styles.skillsTitle}>Skills</h3>
                <div className={styles.skillsGrid}>
                  {skills.map((group, i) => {
                    const Icon = iconMap[group.icon];
                    const isCollapsed = openCat !== group.category;
                    return (
                      <div data-shine key={i} className={styles.skillGroup} onClick={() => toggle(group.category)} style={{ cursor: "pointer" }}>
                        <button className={styles.groupHeader} aria-expanded={!isCollapsed}>
                          <div className={styles.groupHeaderLeft}>
                            {Icon && <Icon size={14} className={styles.groupIcon} />}
                            <span className={styles.groupName}>{group.category}</span>
                          </div>
                          <ChevronDown size={13} className={`${styles.chevron} ${isCollapsed ? styles.chevronCollapsed : ""}`} />
                        </button>
                        <div className={`${styles.badgesWrap} ${isCollapsed ? styles.badgesHidden : ""}`} onClick={e => e.stopPropagation()}>
                          <div className={styles.badges}>
                            {group.items.map(item => (
                              <span key={item.name} className={styles.badge} style={{ "--brand": item.color }}>{item.name}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Papers */}
              <div data-shine className={styles.readingCard}>
                <h3 className={styles.cardTitle}>
                  <BookOpen size={14} style={{ display: "inline", marginRight: "0.4rem", verticalAlign: "middle" }} />
                  Papers I'd Recommend
                </h3>
                <div className={styles.readingList}>
                  <a href="https://openreview.net/forum?id=a7Z2yN6eb2" target="_blank" rel="noopener noreferrer" className={styles.readingItem}>
                    <span className={styles.readingType}>authored</span>
                    <p className={styles.readingName}>Beyond the Mean: Three-Axis Fidelity for Aligning LLM-Based Survey Simulators</p>
                    <span className={styles.readingMeta}>Pugalenthi et al. · OpenReview <ExternalLink size={10} /></span>
                  </a>
                  <div className={styles.readingDivider} />
                  <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener noreferrer" className={styles.readingItem}>
                    <span className={styles.readingType}>paper</span>
                    <p className={styles.readingName}>Attention Is All You Need</p>
                    <span className={styles.readingMeta}>Vaswani et al., 2017 <ExternalLink size={10} /></span>
                  </a>
                </div>
              </div>

              {/* Fun Fact */}
              <div data-shine className={styles.funFact}>
                <div className={styles.funFactLabel}>
                  <Gamepad2 size={13} />
                  <span>fun fact</span>
                </div>
                <p className={styles.funFactText}>
                  When I'm not building reasoning agents, I'm exploring LA, playing
                  Valorant or CS, or lost in a story-mode game because sometimes
                  the quest objective is clearer than a research problem.
                </p>
              </div>

            </div>
          </div>
        </SectionReveal>

      </div>
    </section>
  );
}
