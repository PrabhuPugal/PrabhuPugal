import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Clock, ExternalLink, Image } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { GithubIcon } from "../components/SocialIcons";
import Tag from "../components/Tag";
import { experiences } from "../data/experience";
import { researchProjects } from "../data/research";
import { projects } from "../data/projects";
import styles from "./PostDetail.module.css";

const TYPE_CONFIG = {
  experience: {
    label: "Experience",
    backPath: "/experience",
    detailPath: "/experience",
    backLabel: "02 / experience",
    getData: () => experiences,
    getTitle:    (e) => e.role,
    getSubtitle: (e) => e.company,
    getText:     (e) => null,
    getBullets:  (e) => e.bullets,
    getTags:     (e) => null,
  },
  research: {
    label: "Research",
    backPath: "/work",
    detailPath: "/research",
    backLabel: "03 / work",
    getData: () => researchProjects,
    getTitle:    (e) => e.title,
    getSubtitle: (e) => e.supervisor,
    getText:     (e) => e.abstract,
    getBullets:  (e) => e.highlights,
    getTags:     (e) => e.tags,
  },
  projects: {
    label: "Projects",
    backPath: "/work",
    detailPath: "/projects",
    backLabel: "03 / work",
    getData: () => projects,
    getTitle:    (e) => e.title,
    getSubtitle: (e) => null,
    getText:     (e) => e.description,
    getBullets:  (e) => e.highlights,
    getTags:     (e) => e.tags,
  },
};

const BODY_KWORDS = [
  "Cognitive Load Theory", "DeepSpeed ZeRO-3", "token ledger", "cognitive routing",
  "Self-Consistency-8", "ReasoningEconomicsEnv", "MetaMathQA", "NuminaMath-TIR",
  "CogRouter", "CogSpan", "ACT-R", "CoPO", "CoSFT", "GRPO", "FSDP",
  "AssistantBench", "WebArena", "MATH500", "AIME24", "GSM8K", "AIME", "GAIA",
  "LoRA+MLP", "Qwen3-8B", "Qwen2.5", "vLLM", "LoRA",
  "Lin's CCC", "Wasserstein", "CRPS", "CSDI", "RMSE", "ECE", "FID",
  "CatBoost", "XGBoost", "Extension A", "Extension B", "CNN", "OCR",
];
const _bkLower   = BODY_KWORDS.map((k) => k.toLowerCase());
const _bkPattern = new RegExp(
  `(?<![a-zA-Z])(${BODY_KWORDS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![a-zA-Z])`,
  "gi"
);

function parseInline(text) {
  // Split on **manual bold markers** first
  return text.split(/\*\*(.*?)\*\*/).flatMap((seg, i) => {
    if (i % 2 === 1) return [<strong key={`m${i}`}>{seg}</strong>];
    // Auto-bold recognised technical keywords in plain text segments
    return seg.split(_bkPattern).map((part, j) =>
      _bkLower.includes(part.toLowerCase())
        ? <strong key={`k${i}-${j}`}>{part}</strong>
        : part
    );
  });
}

function BodyBlock({ block }) {
  if (typeof block === "string") {
    return <p className={styles.bodyText}>{parseInline(block)}</p>;
  }
  if (block.type === "heading") {
    return <h2 className={styles.bodyHeading}>{block.content}</h2>;
  }
  if (block.type === "code") {
    return (
      <div className={styles.codeBlock}>
        {block.lang && <span className={styles.codeLang}>{block.lang}</span>}
        <SyntaxHighlighter
          language={block.lang === "cpp" ? "cpp" : block.lang || "text"}
          style={oneDark}
          customStyle={{
            margin: 0,
            background: "transparent",
            padding: "1rem 1.1rem",
            fontSize: "0.78rem",
            lineHeight: "1.75",
          }}
          codeTagProps={{ style: { fontFamily: "var(--font-mono)" } }}
        >
          {block.content}
        </SyntaxHighlighter>
      </div>
    );
  }
  if (block.type === "image" && block.src) {
    return (
      <figure className={styles.bodyFigure}>
        <img src={block.src} alt={block.caption || ""} className={styles.bodyImg} />
        {block.caption && <figcaption className={styles.bodyCaption}>{block.caption}</figcaption>}
      </figure>
    );
  }
  return <p className={styles.bodyText}>{parseInline(block.content)}</p>;
}

export default function PostDetail({ type }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const cfg = TYPE_CONFIG[type];
  const data = cfg.getData();
  const entry = data.find((e) => e.slug === slug);

  if (!entry) {
    navigate(cfg.backPath, { replace: true });
    return null;
  }

  const title    = cfg.getTitle(entry);
  const subtitle = cfg.getSubtitle(entry);
  const text     = cfg.getText(entry);
  const bullets  = cfg.getBullets(entry);
  const tags     = cfg.getTags(entry);

  // Research + projects share one nav chain (mirrors the Work page)
  const isWorkType = type === "research" || type === "projects";
  const navEntries = isWorkType
    ? [
        ...researchProjects.map((e) => ({ ...e, _detailPath: "/research" })),
        ...projects.map((e) => ({ ...e, _detailPath: "/projects" })),
      ]
    : data.map((e) => ({ ...e, _detailPath: cfg.detailPath }));

  const navIdx = navEntries.findIndex((e) => e.slug === slug);
  const prev   = navIdx > 0 ? navEntries[navIdx - 1] : null;
  const next   = navIdx < navEntries.length - 1 ? navEntries[navIdx + 1] : null;

  return (
    <article className={styles.page}>
      <div className={styles.container}>

        {/* Back */}
        <button className={styles.back} onClick={() => navigate(cfg.backPath)}>
          <ArrowLeft size={13} />
          <span>{cfg.backLabel}</span>
        </button>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerMeta}>
            {entry.current && <span className={styles.currentBadge}>Present</span>}
          </div>

          <h1 className={styles.title}>{title}</h1>
          {subtitle && type !== "research" && <p className={styles.subtitle}>{subtitle}</p>}

          <div className={styles.details}>
            {entry.location && (
              <span className={styles.detail}>
                <MapPin size={11} /> {entry.location}
              </span>
            )}
            <span className={styles.detail}>
              <Calendar size={11} /> {entry.period}
            </span>
            {entry.readTime && (
              <span className={styles.detail}>
                <Clock size={11} /> {entry.readTime}
              </span>
            )}
          </div>

          {tags && tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map((t) => <Tag key={t} label={t} />)}
            </div>
          )}
        </header>

        <div className={styles.divider} />

        {/* Cover image */}
        {entry.coverImage && (
          <div className={styles.cover}>
            <img src={entry.coverImage} alt={title} className={styles.coverImg} />
          </div>
        )}

        {/* Abstract / description */}
        {text && (
          <div className={styles.section}>
            <p className={styles.bodyText}>{text}</p>
          </div>
        )}

        {/* Rich body blocks */}
        {entry.body && entry.body.length > 0 && (
          <div className={styles.section}>
            {entry.body.map((block, i) => (
              <BodyBlock key={i} block={block} />
            ))}
          </div>
        )}

        {/* Experience bullets */}
        {type === "experience" && bullets && bullets.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>What I worked on</h2>
            <ul className={styles.bulletList}>
              {bullets.map((b, i) => <li key={i} className={styles.bullet}>{b}</li>)}
            </ul>
          </div>
        )}

        {/* Key highlights for research / projects */}
        {type !== "experience" && bullets && bullets.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>Key Highlights</h2>
            <ul className={styles.bulletList}>
              {bullets.map((b, i) => <li key={i} className={styles.bullet}>{b}</li>)}
            </ul>
          </div>
        )}

        {/* Image gallery */}
        {entry.images && entry.images.length > 0 ? (
          <div className={styles.section}>
            <h2 className={styles.sectionHeading}>Gallery</h2>
            <div className={`${styles.imageGrid} ${entry.images.length === 1 ? styles.imageGridSingle : ""}`}>
              {entry.images.map((img, i) => (
                <figure key={i} className={styles.figure}>
                  <img src={img.src} alt={img.caption || title} className={styles.galleryImg} />
                  {img.caption && <figcaption className={styles.caption}>{img.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.emptyGallery}>
            <Image size={18} className={styles.emptyIcon} />
            <p>Add images by putting photos in <code>public/work/</code> and updating the <code>images</code> array in the data file.</p>
          </div>
        )}

        {/* Links */}
        {(entry.github || entry.live) && (
          <div className={styles.links}>
            {entry.github && (
              <a href={entry.github} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                <GithubIcon size={14} /> Code
              </a>
            )}
            {entry.live && (
              <a href={entry.live} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
          </div>
        )}

        {/* Written date */}
        {entry.writtenDate && (
          <p className={styles.writtenDate}>Written {entry.writtenDate}</p>
        )}

        <div className={styles.divider} />

        {/* Prev / next navigation */}
        <nav className={styles.postNav}>
          {prev ? (
            <button className={styles.navBtn} onClick={() => navigate(`${prev._detailPath}/${prev.slug}`)}>
              <ArrowLeft size={13} />
              <span className={styles.navLabel}>
                <span className={styles.navHint}>Previous</span>
                <span className={styles.navTitle}>{prev.title ?? prev.role}</span>
              </span>
            </button>
          ) : <span />}

          {next ? (
            <button className={`${styles.navBtn} ${styles.navBtnRight}`} onClick={() => navigate(`${next._detailPath}/${next.slug}`)}>
              <span className={styles.navLabel}>
                <span className={styles.navHint}>Next</span>
                <span className={styles.navTitle}>{next.title ?? next.role}</span>
              </span>
              <ArrowLeft size={13} style={{ transform: "rotate(180deg)" }} />
            </button>
          ) : <span />}
        </nav>

      </div>
    </article>
  );
}
