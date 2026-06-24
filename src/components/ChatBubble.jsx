import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import styles from "./ChatBubble.module.css";

// Keyword fallback used when API is unavailable (local dev without vercel dev)
const pbReplies = [
  { keys: ["research", "cogrouter", "cog", "cogspan", "neurips", "paper"],
    reply: "pb is working on CogSpan at the HUMANS Lab, extending CogRouter to route LLM reasoning across agentic and mathematical tasks using cognitive science principles." },
  { keys: ["hire", "job", "intern", "opportunity", "work", "recruit"],
    reply: "pb is currently a Graduate Researcher at USC and open to opportunities from Summer 2027. Feel free to reach out via LinkedIn or email." },
  { keys: ["usc", "trojan", "la", "los angeles", "california"],
    reply: "pb is an MS Computer Science student at the University of Southern California in Los Angeles, graduating May 2027." },
  { keys: ["llm", "gpt", "claude", "ai", "model", "transformer", "bert"],
    reply: "pb's research focuses on LLM reasoning, cognitive routing, behavioral analysis of language models, and AI safety benchmarking." },
  { keys: ["travel", "food", "eat", "trip", "place"],
    reply: "pb enjoys exploring new places and trying new food. Check out the Photos section for shots taken along the way." },
  { keys: ["sleep", "tired", "rest", "nap", "bed"],
    reply: "pb keeps late hours in the lab, occupational hazard of running experiments that always need one more epoch." },
  { keys: ["loss", "train", "gradient", "epoch", "overfit", "converge"],
    reply: "pb works on LLM training, fine-tuning with QLoRA/SFT, and evaluation. Loss curves are a daily concern." },
  { keys: ["gpu", "cuda", "vram", "memory", "oom"],
    reply: "pb runs experiments on HPC clusters using Slurm and Apptainer. Large-scale GPU compute is part of the workflow." },
  { keys: ["hello", "hi", "hey", "sup", "yo"],
    reply: "i'm pb-mini, ask me anything about pb!" },
  { keys: ["name", "who", "you", "pb", "prabhu"],
    reply: "pb is Prabhu Pugalenthi, MS CS student at USC and Graduate Researcher at the HUMANS Lab, working on LLM reasoning and cognitive AI systems." },
  { keys: ["phd", "masters", "degree", "grad", "school"],
    reply: "pb holds a 5-year integrated MS in Software Systems from CIT, India, and is currently pursuing an MS in Computer Science at USC." },
  { keys: ["hobby", "fun", "free", "outside", "weekend"],
    reply: "Outside of research, pb enjoys travelling, trying new food, competitive gaming, and story-mode games." },
];

const defaultFallback = "I don't have a specific answer for that. Try asking about pb's research, experience, education, or background.";

function getFallbackReply(input) {
  const lower = input.toLowerCase();
  const match = pbReplies.find(({ keys }) => keys.some(k => lower.includes(k)));
  return match ? match.reply : defaultFallback;
}

// Convert our {from, text} messages to OpenAI-style {role, content}
function toApiMessages(messages) {
  return messages.map(m => ({
    role: m.from === "pb" ? "assistant" : "user",
    content: m.text,
  }));
}

async function fetchReply(conversationHistory) {
  // Only send last 6 messages to keep token usage low
  const trimmed = conversationHistory.slice(-6);
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: toApiMessages(trimmed) }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return data.reply;
}

export default function ChatBubble() {
  const [open, setOpen]         = useState(false);
  const [input, setInput]       = useState("");
  const [messages, setMessages] = useState([
    { from: "pb", text: "Hey, ask me anything. I'm basically a language model at this point." }
  ]);
  const [typing, setTyping]     = useState(false);
  const [usingApi, setUsingApi] = useState(true); // flips to false on first API failure
  const bottomRef               = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || typing) return;

    const userMsg = { from: "user", text: q };
    const nextHistory = [...messages, userMsg];
    setInput("");
    setMessages(nextHistory);
    setTyping(true);

    let reply;
    if (usingApi) {
      try {
        reply = await fetchReply(nextHistory);
      } catch {
        setUsingApi(false);
        reply = getFallbackReply(q);
      }
    } else {
      // Small artificial delay so it doesn't feel instant
      await new Promise(r => setTimeout(r, 600));
      reply = getFallbackReply(q);
    }

    setMessages(prev => [...prev, { from: "pb", text: reply }]);
    setTyping(false);
  };

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  return (
    <div className={styles.wrap}>
      {open && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <span className={styles.title}>// ask pb</span>
            <div className={styles.headerRight}>
              <span className={styles.model}>pb-mini</span>
              <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close chat">
                <X size={13} />
              </button>
            </div>
          </div>

          <div className={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} className={m.from === "pb" ? styles.msgPb : styles.msgUser}>
                <span className={styles.msgFrom}>{m.from === "pb" ? "pb" : "you"}</span>
                <span className={styles.msgText}>{m.text}</span>
              </div>
            ))}
            {typing && (
              <div className={styles.msgPb}>
                <span className={styles.msgFrom}>pb</span>
                <span className={styles.msgText}>
                  <span className={styles.dot} style={{ animationDelay: "0s" }}>.</span>
                  <span className={styles.dot} style={{ animationDelay: "0.2s" }}>.</span>
                  <span className={styles.dot} style={{ animationDelay: "0.4s" }}>.</span>
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="ask me something..."
              autoComplete="off"
              autoFocus
            />
            <button type="submit" className={styles.send} disabled={typing}>↵</button>
          </form>
        </div>
      )}

      <button
        className={`${styles.bubble} ${open ? styles.bubbleOpen : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Chat with pb"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
      </button>
    </div>
  );
}
