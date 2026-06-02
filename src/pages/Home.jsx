import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../components/SocialIcons";
import TypewriterText from "../components/TypewriterText";
import styles from "./Home.module.css";

const roles = [
  "Graduate Research Assistant @ USC",
  "Machine Learning & LLM Systems Researcher",
  "Building smarter reasoning agents",
  "AI Safety & Trustworthiness",
];

export default function Home() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleKey, setRoleKey] = useState(0);
  const [nameDone, setNameDone] = useState(false);

  useEffect(() => {
    if (!nameDone) return;
    const timer = setTimeout(() => {
      const next = () => {
        setRoleIndex((i) => (i + 1) % roles.length);
        setRoleKey((k) => k + 1);
      };
      const id = setInterval(next, 3600);
      return () => clearInterval(id);
    }, 800);
    return () => clearTimeout(timer);
  }, [nameDone]);

  return (
    <main className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <span className={styles.label}>// hello world</span>

          <h1 className={styles.name}>
            <TypewriterText
              text="Prabhu Pugalenthi."
              speed={55}
              delay={300}
              onDone={() => setNameDone(true)}
            />
          </h1>

          <div className={styles.roleWrap}>
            {nameDone && (
              <TypewriterText
                key={roleKey}
                text={roles[roleIndex]}
                speed={38}
                delay={200}
                className={styles.role}
              />
            )}
          </div>

          <p className={styles.bio}>
            MS Computer Science student at USC, specializing in ML Systems and Generative AI.
            Currently a Graduate Research Assistant working on LLM reasoning, cognitive routing,
            and AI safety benchmarking.
          </p>

          <div className={styles.ctas}>
            <Link to="/research" className={styles.btnPrimary}>
              View Research <ArrowRight size={16} />
            </Link>
            <Link to="/projects" className={styles.btnSecondary}>
              See Projects <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.socials}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="GitHub"
            >
              <GithubIcon size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={20} />
            </a>
            <a
              href="mailto:prabhupugal01@gmail.com"
              className={styles.socialLink}
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        <div className={styles.decoration}>
          <div className={styles.typeCard}>
            <div className={styles.typeCardHeader}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
            <div className={styles.typeCardBody}>
              <span className={styles.codeLine}>
                <span className={styles.kw}>const</span> prabhu = &#123;
              </span>
              <span className={styles.codeLine}>
                &nbsp;&nbsp;role: <span className={styles.str}>"Researcher"</span>,
              </span>
              <span className={styles.codeLine}>
                &nbsp;&nbsp;school: <span className={styles.str}>"USC"</span>,
              </span>
              <span className={styles.codeLine}>
                &nbsp;&nbsp;focus: <span className={styles.str}>"LLM Systems"</span>,
              </span>
              <span className={styles.codeLine}>
                &nbsp;&nbsp;building: <span className={styles.str}>"CogRouter"</span>,
              </span>
              <span className={styles.codeLine}>&#125;;</span>
              <span className={styles.codeLine}>&nbsp;</span>
              <span className={styles.codeLine}>
                prabhu.<span className={styles.fn}>research</span>();
                <span className="cursor" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span className={styles.scrollText}>scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </main>
  );
}
