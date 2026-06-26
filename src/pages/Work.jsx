import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import ScrambleText from "../components/ScrambleText";
import { researchProjects } from "../data/research";
import { projects } from "../data/projects";
import styles from "./Work.module.css";

const KEYWORDS = [
  // Compound phrases first (prevent partial matches)
  "automatic emergency dispatch", "full trajectory distribution", "zero environment errors",
  "shared token budget", "budget-aware behavior", "circadian conditioning",
  "personalized diffusion", "real-time drowsiness", "three-axis fidelity",
  "14% individual variance", "91.97% accuracy", "irreversible actions",
  "verification layer", "cognitive routing", "reasoning depth",
  "fidelity collapse", "classification head", "Wasserstein distance",
  "equipment value", "broadcast overlay", "alcohol interlock",
  "ignition gate", "sensor fusion", "GPS coordinates",
  "seven-map pool", "decoupled vLLM", "3x fewer tokens",
  "token ledger", "tick-by-tick", "freeze-frame",
  "45 participants", "14B scale", "8 A100s",
  "Self-Consistency-8", "postprandial", "0.0099",
  // Single terms
  "GRPO", "LoRA+MLP", "Lin's CCC",
  "CRPS", "RMSE", "CSDI", "ECE", "FID", "MAE", "CatBoost",
];

const _kwLower = KEYWORDS.map((k) => k.toLowerCase());
const _kwPattern = new RegExp(
  `(?<![a-zA-Z])(${KEYWORDS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![a-zA-Z])`,
  "gi"
);

function highlightKeywords(text) {
  return text.split(_kwPattern).map((part, i) =>
    _kwLower.includes(part.toLowerCase())
      ? <span key={i} className={styles.keyword}>{part}</span>
      : part
  );
}

const allWork = [
  ...researchProjects.map((p) => ({ ...p, type: "research" })),
  ...projects.map((p) => ({ ...p, type: "project" })),
];

export default function Work() {
  const navigate = useNavigate();
  return (
    <section className="section">
      <div className="container">
        <SectionReveal>
          <div className="section-header">
            <ScrambleText className="section-label" text="03 / work" />
          </div>
        </SectionReveal>

        <div className={styles.list}>
          {allWork.map((proj, i) => (
            <SectionReveal key={`${proj.type}-${proj.id}`} delay={i * 0.07}>
              <div className={styles.entry} style={{ borderLeft: `3px solid ${proj.color}`, paddingLeft: "1rem" }}>
                <div className={styles.entryHead}>
                  <span className={styles.title}>{proj.title}</span>
                  <span className={styles.period}>{proj.period}</span>
                </div>
                {proj.supervisor && (
                  <div className={styles.entryMeta}>{proj.supervisor}</div>
                )}
                <div className={styles.entryTags}>{proj.tags.join(" · ")}</div>
                <ul className={styles.bullets}>
                  {proj.highlights.map((h, j) => (
                    <li key={j} className={styles.bullet}>{highlightKeywords(h)}</li>
                  ))}
                </ul>
                <button
                  className={styles.readMore}
                  onClick={() => navigate(`/${proj.type === "research" ? "research" : "projects"}/${proj.slug}`)}
                >
                  Read more <ArrowRight size={12} />
                </button>
              </div>
            </SectionReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
