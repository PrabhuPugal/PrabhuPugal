import { GithubIcon, InstagramIcon, LinkedinIcon } from "./SocialIcons";
import { contactInfo } from "../data/contact";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.meta}>
          <p className={styles.copy}>
            &copy; {new Date().getFullYear()} Prabhu Pugalenthi
          </p>
          <div className={styles.emails}>
            <a href={`mailto:${contactInfo.personalEmail}`} className={styles.emailLink}>
              {contactInfo.personalEmail}
            </a>
            <a href={`mailto:${contactInfo.universityEmail}`} className={styles.emailLink}>
              {contactInfo.universityEmail}
            </a>
          </div>
        </div>

        <div className={styles.links}>
          <a
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={`${styles.iconLink} ${styles.github}`}
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={contactInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className={`${styles.iconLink} ${styles.linkedin}`}
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href={contactInfo.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className={`${styles.iconLink} ${styles.instagram}`}
          >
            <InstagramIcon size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
