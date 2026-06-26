import { useState, useEffect } from "react";
import { ArrowRight, Mail } from "lucide-react";
import MagneticWrap from "../components/MagneticWrap";
import { GithubIcon, InstagramIcon, LinkedinIcon, GoogleScholarIcon } from "../components/SocialIcons";
import TypewriterText from "../components/TypewriterText";
import { contactInfo } from "../data/contact";
import styles from "./Home.module.css";

const primaryRole = "Graduate Researcher @ USC HUMANS Lab";
const bioText = "MS computer science student at USC specializing in Inference-Time Compute Efficiency, Cognitive Routing Architectures, and LLM Behavioral Alignment. Graduate researcher at the HUMANS Lab, building CogSpan, a cognitive routing framework that teaches language models to allocate reasoning more efficiently across complex tasks. My work spans Token Budget Optimization, Adaptive Reasoning Allocation, Psychologically Grounded Model Behavior, and AI Safety Benchmarking.";

const snapshots = [
  {
    prompt: "Why won't my loss converge?",
    winner: 3,
    tokens: [
      { token: '"skill issue"',  prob: 0.64, color: "#25BC24" },
      { token: '"more epochs"',  prob: 0.18, color: "#33BBC8" },
      { token: '"just cry"',     prob: 0.10, color: "#492EE1" },
      { token: '"pray harder"',  prob: 0.05, color: "#ADAD27" },
      { token: '"git blame"',    prob: 0.03, color: "#D338D3" },
    ],
    scores: [
      { label: "ppl",        value: "3.2"  },
      { label: "coherence",  value: "0.91" },
      { label: "p_tok",      value: "12"   },
      { label: "budget",     value: "988"  },
    ],
  },
  {
    prompt: "Summarise my Masters in one sentence.",
    winner: 3,
    tokens: [
      { token: '"delaying unemployment"', prob: 0.61, color: "#C23621" },
      { token: '"send help"',             prob: 0.20, color: "#D338D3" },
      { token: '"what\'s a GPA"',         prob: 0.10, color: "#ADAD27" },
      { token: '"I owe USC money"',       prob: 0.06, color: "#33BBC8" },
      { token: '"lol idk"',               prob: 0.03, color: "#492EE1" },
    ],
    scores: [
      { label: "ppl",        value: "8.7"  },
      { label: "coherence",  value: "0.74" },
      { label: "p_tok",      value: "9"    },
      { label: "budget",     value: "976"  },
    ],
  },
  {
    prompt: "Why did the transformer cross the road?",
    winner: 0,
    tokens: [
      { token: '"to self-attend"',      prob: 0.59, color: "#33BBC8" },
      { token: '"BERT dared it"',       prob: 0.21, color: "#ADAD27" },
      { token: '"no positional clue"',  prob: 0.11, color: "#492EE1" },
      { token: '"lost in translation"', prob: 0.06, color: "#25BC24" },
      { token: '"asked GPT first"',     prob: 0.03, color: "#D338D3" },
    ],
    scores: [
      { label: "ppl",        value: "12.4" },
      { label: "coherence",  value: "0.68" },
      { label: "p_tok",      value: "10"   },
      { label: "budget",     value: "963"  },
    ],
  },
  {
    prompt: "My GPU is on fire. Literally.",
    winner: 1,
    tokens: [
      { token: '"free hand warmer"', prob: 0.58, color: "#C23621" },
      { token: '"s\'mores time"',    prob: 0.22, color: "#ADAD27" },
      { token: '"feature not bug"',  prob: 0.11, color: "#25BC24" },
      { token: '"still faster"',     prob: 0.06, color: "#D338D3" },
      { token: '"worth it"',         prob: 0.03, color: "#33BBC8" },
    ],
    scores: [
      { label: "ppl",        value: "5.1"  },
      { label: "coherence",  value: "0.83" },
      { label: "p_tok",      value: "8"    },
      { label: "budget",     value: "951"  },
    ],
  },
];



function LLMCard() {
  const [snap, setSnap] = useState(0);
  const [phase, setPhase] = useState("generating");
  const [fading, setFading] = useState(false);
  const [typedOutput, setTypedOutput] = useState("");

  // 5s cycle
  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setSnap((s) => (s + 1) % snapshots.length);
        setFading(false);
      }, 300);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // first 3s = generating, then show output
  useEffect(() => {
    setPhase("generating");
    setTypedOutput("");
    const id = setTimeout(() => setPhase("output"), 3000);
    return () => clearTimeout(id);
  }, [snap]);

  // typewriter when output phase begins
  useEffect(() => {
    if (phase !== "output") return;
    const target = snapshots[snap].tokens[snapshots[snap].winner].token;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTypedOutput(target.slice(0, i));
      if (i >= target.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, [phase]);

  const { prompt, tokens, scores } = snapshots[snap];

  return (
    <div className={styles.llmCard}>
      <div className={styles.llmHeader}>
        <span className={styles.llmModel}>tokenscrooge-1b</span>
        <span className={styles.llmStatus}>
          <span className={styles.pulse} />
          {phase === "generating" ? "generating" : "sampled"}
        </span>
      </div>

      <div className={styles.llmBody}>
        <div className={styles.llmSection}>
          <span className={styles.llmLabel}>prompt</span>
          <span className={`${styles.llmPromptText} ${fading ? styles.fade : ""}`}>
            "{prompt}"
          </span>
        </div>

        <div className={styles.llmSection}>
          <span className={styles.llmLabel}>next token · top-5</span>
          <div className={`${styles.llmTokens} ${fading ? styles.fade : ""}`}>
            {tokens.map(({ token, prob, color }, i) => {
              const isOutput = phase === "output";
              const isWinner = isOutput && i === snapshots[snap].winner;
              return (
                <div key={token} className={`${styles.llmToken} ${isWinner ? styles.llmTokenWinner : ""}`}>
                  <span className={`${styles.tokenName} ${isWinner ? styles.tokenNameWinner : ""}`}>{token}</span>
                  <div className={styles.tokenBarTrack}>
                    <div
                      key={`${phase}-${token}`}
                      className={isOutput ? styles.tokenBarFillAnimate : styles.tokenBarFill}
                      style={{
                        "--bar-w": `${prob * 100}%`,
                        background: color,
                        ...(isOutput ? { animationDelay: `${i * 0.08}s` } : { width: "0%" }),
                      }}
                    />
                  </div>
                  {isOutput && (
                    <span className={styles.tokenProb} style={{ color }}>
                      {Math.round(prob * 100)}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {phase === "generating" ? (
          <div className={styles.thinking}>
            <span className={styles.thinkingText}>thinking</span>
            <span className={styles.thinkDot} style={{ animationDelay: "0s" }}>.</span>
            <span className={styles.thinkDot} style={{ animationDelay: "0.2s" }}>.</span>
            <span className={styles.thinkDot} style={{ animationDelay: "0.4s" }}>.</span>
          </div>
        ) : (
          <div className={styles.llmSection}>
            <span className={styles.llmLabel}>output</span>
            <span className={styles.llmOutput}>
              → {typedOutput}<span className="cursor" />
            </span>
          </div>
        )}
      </div>

      <div className={styles.llmFooter}>
        {scores.map(({ label, value }) => (
          <span key={label}>{label}&nbsp;{value}</span>
        ))}
      </div>
    </div>
  );
}

export default function Home({ onSelectSection }) {
  const [labelDone, setLabelDone] = useState(false);
  const [nameDone,  setNameDone]  = useState(false);
  const [roleDone,  setRoleDone]  = useState(false);
  const [bioDone,   setBioDone]   = useState(false);

  useEffect(() => {
    if (!roleDone) return;
    setBioDone(true);
  }, [roleDone]);

  return (
    <main className={styles.hero}>
      <div className={styles.inner}>

        {/* Column 1 — Photo */}
        <div className={styles.photoCol}>
          <div className={styles.avatar}>
            <img src="/me.jpg" alt="Prabhu Pugalenthi" className={styles.avatarImg} />
          </div>
        </div>

        {/* Column 2 — Content */}
        <div className={styles.content}>
          <span className={styles.label}>
            <TypewriterText
              text="<|im_start|>user hello world"
              speed={18}
              delay={100}
              onDone={() => setLabelDone(true)}
            />
          </span>

          <h1 className={styles.name}>
            {labelDone && (
              <TypewriterText
                text="Prabhu Pugalenthi"
                speed={32}
                delay={0}
                onDone={() => setNameDone(true)}
              />
            )}
          </h1>

          <div className={styles.roleWrap}>
            {nameDone && (
              <TypewriterText
                text={primaryRole}
                speed={16}
                delay={0}
                className={styles.role}
                onDone={() => setRoleDone(true)}
              />
            )}
          </div>

          <p className={styles.bio}>
            {roleDone && (
              <span className={styles.bioReveal}>
                {bioText}
              </span>
            )}
          </p>

          {bioDone && (
          <div className={styles.ctas} style={{ animation: "fadeUp 0.4s ease both" }}>
            <MagneticWrap>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => onSelectSection("work")}
              >
                See Work <ArrowRight size={16} />
              </button>
            </MagneticWrap>
            <MagneticWrap>
              <a
                href="/resume.pdf"
                download
                className={styles.btnResume}
                data-tooltip="Download my latest resume as a PDF"
              >
                Resume ↓
              </a>
            </MagneticWrap>
          </div>
          )}

          {bioDone && (<div className={styles.socials} style={{ animation: "fadeUp 0.4s ease 0.15s both" }}>
            <a
              href={contactInfo.scholar}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles.scholar}`}
              aria-label="Google Scholar"
            >
              <GoogleScholarIcon size={20} />
            </a>
            <a
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles.github}`}
              aria-label="GitHub"
            >
              <GithubIcon size={20} />
            </a>
            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles.linkedin}`}
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={20} />
            </a>
            <a
              href={`mailto:${contactInfo.personalEmail}`}
              className={`${styles.socialLink} ${styles.email}`}
              aria-label="Personal email"
            >
              <Mail size={20} />
            </a>
            <a
              href={contactInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles.instagram}`}
              aria-label="Instagram"
            >
              <InstagramIcon size={20} />
            </a>
          </div>
          )}
        </div>

        {/* Column 3 — LLM card */}
        <div className={styles.decoration}>
          <LLMCard />
        </div>
      </div>

    </main>
  );
}
