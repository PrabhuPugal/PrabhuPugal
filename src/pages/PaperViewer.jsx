import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { researchProjects } from "../data/research";
import { projects } from "../data/projects";
import styles from "./PaperViewer.module.css";

const allEntries = [
  ...researchProjects,
  ...projects,
];

export default function PaperViewer() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const entry = allEntries.find((e) => e.slug === slug && e.paper);

  useEffect(() => {
    if (!entry) return;
    const prev = document.title;
    document.title = entry.title;
    return () => { document.title = prev; };
  }, [entry]);

  if (!entry) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className={styles.viewer}>
      <iframe
        src={entry.paper}
        className={styles.frame}
        title={entry.title}
      />
    </div>
  );
}
