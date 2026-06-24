import { useState } from "react";
import { Brain, Server, Wrench, FlaskConical, BookOpen, ChevronDown, GraduationCap, MapPin, Calendar } from "lucide-react";
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
  const [openEduId, setOpenEduId] = useState(null);
  const toggleEdu = (id) => setOpenEduId(prev => prev === id ? null : id);

  return (
    <section className={styles.page}>
      <div className={styles.inner}>

        {/* Section label */}
        <SectionReveal>
          <ScrambleText className="section-label" text="01 / about" />
        </SectionReveal>

        {/* Zone 1: Bio + Education (left) + Photos (right) */}
        <div className={styles.zone1}>

          <SectionReveal delay={0.05}>
            <div className={styles.bioAndEdu}>
              <div className={styles.bio}>
                <p className={styles.intro}>
                  Hi, I'm Prabhu Pugalenthi, but most people call me PB, like peanut butter!
                </p>
                <p>
                  I'm a Master's student in Computer Science at the{" "}
                  <strong>University of Southern California</strong> in Los Angeles,
                  focusing on Natural Language Processing, Machine Learning Systems with
                  cognitive thinking and reasoning, Deep Learning Architectures, and AI Safety.
                </p>
                <p>
                  Currently, I'm a{" "}
                  <strong>Graduate Researcher at the HUMANS Lab at USC</strong>, where I
                  work on developing and evaluating AI systems that improve reasoning
                  efficiency and decision-making across complex tasks. I also study the
                  psychological and behavioral patterns exhibited by LLMs during reasoning,
                  decision-making, and interaction. I'm especially interested in token
                  budgeting, cognitive routing, model trustworthiness, and evaluating how
                  LLMs behave under pressure, constraints, and safety-critical settings.
                </p>
                <p>
                  Before USC, I completed a 5-year integrated Master's in Software Systems
                  at <strong>Coimbatore Institute of Technology</strong> in Tamil Nadu,
                  India. I also interned at <strong>Ernst &amp; Young</strong> as a <strong>Data Analyst</strong> and
                  <strong>Software Developer</strong>, where I worked on data pipelines, analytics
                  dashboards, backend systems, document intelligence, and ML-based
                  business analysis projects.
                </p>
                <p>
                  Outside the lab, I'm usually exploring LA, listening to music, making
                  playlists for moods that probably don't need playlists, or watching
                  sports. NBA, Formula 1, and soccer are the big three! I'm also a big
                  fan of cinematic story-mode games like Death Stranding, The Last of Us,
                  God of War, and Ghost of Tsushima. I used to be pretty good at
                  competitive games like Valorant, NBA 2K, and FC, but I've now hung up
                  the cape and accepted my peaceful retirement arc.
                </p>
                <p className={styles.closing}>
                  Anyway, that's me! What's your story?
                </p>
              </div>

              <div className={styles.eduStack}>
                {education.map((e) => {
                  const isOpen = openEduId === e.id;
                  return (
                    <div data-shine key={e.id} className={`${edu.card} ${styles.eduCard} ${styles.eduCompact}`} onClick={() => toggleEdu(e.id)}>
                      <div className={edu.currentBar} />
                      <button className={styles.eduToggle} aria-expanded={isOpen}>
                        <div className={styles.eduToggleLeft}>
                          <GraduationCap size={13} className={edu.icon} />
                          <div>
                            <h3 className={edu.degree}>{e.degree}</h3>
                            <p className={edu.school}>{e.school}</p>
                          </div>
                        </div>
                        <div className={styles.eduToggleRight}>
                          {e.logo && (
                            <img src={e.logo} alt={e.school} className={`${edu.schoolLogo} ${e.logoRaw ? edu.schoolLogoRaw : ""}`} />
                          )}
                          <ChevronDown size={12} className={`${styles.chevron} ${isOpen ? "" : styles.chevronCollapsed}`} />
                        </div>
                      </button>
                      <div className={`${styles.eduBodyWrap} ${isOpen ? "" : styles.eduBodyHidden}`} onClick={ev => ev.stopPropagation()}>
                        <div className={styles.eduBody}>
                          <div className={edu.details}>
                            <span className={edu.detail}><MapPin size={10} /> {e.location}</span>
                            <span className={edu.detail}><Calendar size={10} /> {e.period}</span>
                          </div>
                          <div className={edu.divider} />
                          <div className={edu.section}>
                            <div className={edu.sectionLabel}><BookOpen size={10} /> Relevant Courses</div>
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

              <div className={styles.skillsSection}>
                <h3 className={styles.zoneHeading}>Skills &amp; Expertise</h3>
                <div className={styles.skillsRows}>
                  {skills.map((group, i) => {
                    const Icon = iconMap[group.icon];
                    return (
                      <div key={i} className={styles.skillRow}>
                        <div className={styles.skillCatLabel}>
                          {Icon && <Icon size={13} className={styles.skillIcon} />}
                          <span>{group.category}</span>
                        </div>
                        <div className={styles.badges}>
                          {group.items.map(item => (
                            <span key={item.name} className={styles.badge}>{item.name}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.08}>
            <div className={styles.photoColRight}>
              <div className={styles.photoItem}>
                <div className={styles.stripSlot}>
                  <img src="/photos/ginsburg night.jpg" alt="Ginsburg Hall at night" className={styles.stripPhoto} />
                </div>
                <p className={styles.photoCaption}>Ginsburg Hall, the building I didn't know I needed until I got here</p>
                <p className={styles.photoCredit}>© <a href="https://www.usgbc.org/" target="_blank" rel="noopener noreferrer">usgbc.org</a></p>
              </div>
              <div className={styles.photoItem}>
                <div className={styles.stripSlot}>
                  <img src="/photos/lab.jpg" alt="The HUMANS Lab" className={styles.stripPhoto} />
                </div>
                <p className={styles.photoCaption}>The lab, proof that if you love what you do, hours stop counting</p>
              </div>
            </div>
          </SectionReveal>

        </div>


      </div>
    </section>
  );
}
