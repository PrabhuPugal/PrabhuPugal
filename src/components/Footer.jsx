import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} Prabhu Pugalenthi
        </p>
        <div className={styles.links}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={styles.iconLink}
          >
            <GithubIcon size={18} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className={styles.iconLink}
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href="mailto:prabhupugal01@gmail.com"
            aria-label="Email"
            className={styles.iconLink}
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
