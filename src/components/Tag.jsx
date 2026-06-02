import styles from "./Tag.module.css";

export default function Tag({ label }) {
  return <span className={styles.tag}>{label}</span>;
}
