import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionReveal from "../components/SectionReveal";
import ScrambleText from "../components/ScrambleText";
import { researchProjects } from "../data/research";
import { projects } from "../data/projects";
import styles from "./Work.module.css";

const KEYWORDS = [
  // Research frameworks and methods (longer terms first to avoid partial matches)
  "Cognitive Load Theory", "DeepSpeed ZeRO-3", "token ledger", "cognitive routing",
  "Self-Consistency-8", "CogRouter", "CogSpan", "ACT-R", "CoPO", "CoSFT", "GRPO", "FSDP",
  // Benchmarks
  "AssistantBench", "WebArena", "MATH500", "AIME24", "GSM8K", "AIME", "GAIA",
  // Models / libraries
  "LoRA+MLP", "Qwen3-8B", "Qwen2.5", "vLLM", "LoRA",
  // Stats / metrics
  "Lin's CCC", "Wasserstein", "CRPS", "RMSE", "CSDI", "ECE", "FID", "MAE",
  // Project: DRILL
  "CatBoost", "XGBoost",
  // Project: IoT
  "CNN", "GPS",
  // Venues
  "NeurIPS 2027", "ICLR 2027",
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
