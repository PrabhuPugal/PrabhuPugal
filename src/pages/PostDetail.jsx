import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, User, ExternalLink, Image } from "lucide-react";
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
    backPath: "/research",
    backLabel: "03 / research",
    getData: () => researchProjects,
    getTitle:    (e) => e.title,
    getSubtitle: (e) => e.supervisor,
    getText:     (e) => e.abstract,
    getBullets:  (e) => e.highlights,
    getTags:     (e) => e.tags,
  },
  projects: {
    label: "Projects",
    backPath: "/projects",
    backLabel: "04 / projects",
    getData: () => projects,
    getTitle:    (e) => e.title,
    getSubtitle: (e) => null,
    getText:     (e) => e.description,
    getBullets:  (e) => e.highlights,
    getTags:     (e) => e.tags,
  },
};

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

  const idx  = data.findIndex((e) => e.slug === slug);
  const prev = idx > 0 ? data[idx - 1] : null;
  const next = idx < data.length - 1 ? data[idx + 1] : null;

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
            <span className={styles.typeLabel}>{cfg.label}</span>
            {entry.current && <span className={styles.currentBadge}>Present</span>}
          </div>

          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

          <div className={styles.details}>
            {entry.location && (
              <span className={styles.detail}>
                <MapPin size={11} /> {entry.location}
              </span>
            )}
            <span className={styles.detail}>
              <Calendar size={11} /> {entry.period}
            </span>
            {entry.supervisor && (
              <span className={styles.detail}>
                <User size={11} /> {entry.supervisor}
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

        {/* Extended body paragraphs */}
        {entry.body && entry.body.length > 0 && (
          <div className={styles.section}>
            {entry.body.map((para, i) => (
              <p key={i} className={styles.bodyText}>{para}</p>
            ))}
          </div>
        )}

        {/* Experience bullets (no abstract, just the bullets) */}
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
            <p>Add images to this post by putting photos in <code>public/work/</code> and updating <code>src/data/{type}.js</code> — set the <code>images</code> array and optionally <code>coverImage</code>.</p>
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

        <div className={styles.divider} />

        {/* Prev / next navigation */}
        <nav className={styles.postNav}>
          {prev ? (
            <button className={styles.navBtn} onClick={() => navigate(`/${cfg.backPath.slice(1)}/${prev.slug}`)}>
              <ArrowLeft size={13} />
              <span className={styles.navLabel}>
                <span className={styles.navHint}>Previous</span>
                <span className={styles.navTitle}>{cfg.getTitle(prev)}</span>
              </span>
            </button>
          ) : <span />}

          {next ? (
            <button className={`${styles.navBtn} ${styles.navBtnRight}`} onClick={() => navigate(`/${cfg.backPath.slice(1)}/${next.slug}`)}>
              <span className={styles.navLabel}>
                <span className={styles.navHint}>Next</span>
                <span className={styles.navTitle}>{cfg.getTitle(next)}</span>
              </span>
              <ArrowLeft size={13} style={{ transform: "rotate(180deg)" }} />
            </button>
          ) : <span />}
        </nav>

      </div>
    </article>
  );
}
