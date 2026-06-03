import { GraduationCap, MapPin, Calendar, BookOpen } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import styles from "./Education.module.css";

const education = [
  {
    id: 1,
    degree: "Master of Science in Computer Science",
    school: "University of Southern California",
    location: "Los Angeles, CA",
    period: "Jan 2026 – May 2027 (Expected)",
    courses: [
      "Applied Natural Language Processing",
      "Deep Learning and its Applications",
      "Statistical Machine Learning",
    ],
    focus: [
      "Machine Learning Systems",
      "Deep Learning Architectures",
      "Generative AI",
      "Representation Learning",
    ],
    current: true,
  },
  {
    id: 2,
    degree: "Master of Science in Software Systems",
    school: "Coimbatore Institute of Technology",
    location: "Tamil Nadu, India",
    period: "Sep 2020 – May 2025",
    courses: [
      "Advanced Data Structures & Algorithms",
      "Artificial Intelligence",
      "Operating Systems",
      "Computer Networks",
    ],
    focus: [],
    current: false,
  },
];

export default function Education() {
  return (
    <section className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <span className="section-label">05 / education</span>
            <h2 className="section-title">Education</h2>
          </div>
        </SectionReveal>

        <div className={styles.grid}>
          {education.map((edu, i) => (
            <SectionReveal key={edu.id} delay={i * 0.15}>
              <div className={styles.card}>
                {edu.current && <div className={styles.currentBar} />}
                <div className={styles.cardHeader}>
                  <GraduationCap size={22} className={styles.icon} />
                  <div>
                    <h3 className={styles.degree}>{edu.degree}</h3>
                    <p className={styles.school}>{edu.school}</p>
                  </div>
                </div>

                <div className={styles.details}>
                  <span className={styles.detail}>
                    <MapPin size={13} /> {edu.location}
                  </span>
                  <span className={styles.detail}>
                    <Calendar size={13} /> {edu.period}
                  </span>
                </div>

                <div className={styles.divider} />

                <div className={styles.section}>
                  <div className={styles.sectionLabel}>
                    <BookOpen size={13} /> Relevant Courses
                  </div>
                  <ul className={styles.list}>
                    {edu.courses.map((c) => (
                      <li key={c} className={styles.listItem}>{c}</li>
                    ))}
                  </ul>
                </div>

                {edu.focus.length > 0 && (
                  <div className={styles.section}>
                    <div className={styles.sectionLabel}>Focus Areas</div>
                    <div className={styles.focusBadges}>
                      {edu.focus.map((f) => (
                        <span key={f} className={styles.focusBadge}>{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
