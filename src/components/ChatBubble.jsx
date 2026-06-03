import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import styles from "./ChatBubble.module.css";

// Keyword fallback used when API is unavailable (local dev without vercel dev)
const pbReplies = [
  { keys: ["research", "cogrouter", "cog", "cogspan", "neurips", "paper"],
    reply: "Building CogSpan — teaching LLMs to route reasoning like a human brain. Going well, 3 caffeine levels above optimal." },
  { keys: ["hire", "job", "intern", "opportunity", "work", "recruit"],
    reply: "Currently deployed at USC ISI. Available for new inference runs from Summer 2027. Low latency guaranteed." },
  { keys: ["usc", "trojan", "la", "los angeles", "california"],
    reply: "Fight on ✌️. Yes I owe them tuition. No I do not regret it. Mostly." },
  { keys: ["llm", "gpt", "claude", "ai", "model", "transformer", "bert"],
    reply: "LLMs are just vibes with matrix multiplication. Very expensive, surprisingly effective vibes." },
  { keys: ["travel", "food", "eat", "trip", "place"],
    reply: "Context window is full of travel memories. Navigate to /photos for the full rollout." },
  { keys: ["sleep", "tired", "rest", "nap", "bed"],
    reply: "sleep() not implemented. See also: coffee.py, deadlines.json, advisor_emails.txt." },
  { keys: ["loss", "train", "gradient", "epoch", "overfit", "converge"],
    reply: "Skill issue. Also check your learning rate. Also cry. Then lower the lr." },
  { keys: ["gpu", "cuda", "vram", "memory", "oom"],
    reply: "Have you tried smaller batch size? No? Bigger GPU? Also valid." },
  { keys: ["hello", "hi", "hey", "sup", "yo"],
    reply: "<|im_start|>assistant — hey! ask me anything. I have opinions." },
  { keys: ["name", "who", "you", "pb", "prabhu"],
    reply: "I'm pb — Prabhu Pugalenthi. Grad student, researcher, professional loss-curve-watcher." },
  { keys: ["phd", "masters", "degree", "grad", "school"],
    reply: "MS CS @ USC. Officially: delaying unemployment. Unofficially: having the time of my life." },
  { keys: ["hobby", "fun", "free", "outside", "weekend"],
    reply: "Travelling, trying new food, and occasionally touching grass between training runs." },
];

const defaultFallback = "Hmm, high perplexity on that one. Try asking about research, LLMs, travel, or my sleep schedule.";

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
    { from: "pb", text: "Hey — ask me anything. I'm basically a language model at this point." }
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
              <span className={styles.model}>
                {usingApi ? "pb-mini · groq" : "pb-mini · local"}
              </span>
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
