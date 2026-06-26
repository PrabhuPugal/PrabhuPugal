import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import styles from "./ChatBubble.module.css";

// Keyword fallback used when API is unavailable (local dev without vercel dev)
const pbReplies = [
  { keys: ["cogspan", "cogrouter", "cognitive routing", "cog router", "adaptive compute", "token ledger"],
    reply: "CogSpan teaches LLMs to route reasoning depth per step rather than thinking equally hard at everything. It defines four levels (L1–L4) inspired by ACT-R, uses a CLT estimator to pick the right level per step, and builds a token ledger to cap depth when budget runs low. Matched Self-Consistency-8 at 3x fewer tokens." },
  { keys: ["reasoning", "reasoningenv", "reasoning env", "token budget", "shared budget", "grpo"],
    reply: "ReasoningEconomicsEnv is an RL environment where the model answers 10 questions sharing one token budget. Overspend on an easy question and you fail the hard one later. Budget-aware behaviour only emerged at 14B scale (Qwen3-14B). Trained with GRPO on 8 A100s." },
  { keys: ["beyond the mean", "survey", "simulation", "fidelity", "covid", "misinformation", "lora", "icml"],
    reply: "Beyond the Mean tests whether an LLM can simulate 1,466 survey respondents from just 74 real responses on a COVID-19 misinformation dataset. Published at ICML 2026. LoRA+MLP with a classification head won on all three fidelity axes, but the best model still only explained 14% of individual variance." },
  { keys: ["drill", "cs2", "csgo", "counter-strike", "round", "freeze-frame", "catboost", "ece"],
    reply: "DRILL predicts who wins a CS2 round from a single freeze-frame before any action is taken. Parsed raw demo files tick-by-tick across 7 maps. CatBoost achieved ECE 0.0099 vs XGBoost 0.0108 — the calibration gap is what matters for a live broadcast overlay." },
  { keys: ["blood glucose", "forecasting", "glucose", "postprandial", "csdi", "diffusion", "cgm"],
    reply: "The blood glucose project extends CSDI with circadian conditioning and multimodal inputs (heart rate, carbs, step count) to forecast full trajectory distributions per person. Built personalized models for 45 participants. RMSE 10.81, MAE 9.02, FID 5.67, CRPS 6.45 — beat every baseline." },
  { keys: ["iot", "accident", "drowsiness", "alcohol", "crash", "gps", "cnn", "arduino", "road safety"],
    reply: "The IoT project is a multi-sensor in-vehicle system detecting drunk driving, drowsiness, and crashes without any driver input. The ignition gate uses alcohol interlock — fail the breath test, car doesn't start. CNN hit 91.97% drowsiness accuracy. On crash, GPS coordinates are sent automatically to hospitals and emergency contacts. Won 1st prize at the IoT Expo." },
  { keys: ["ey", "ernst", "young", "intern", "contract miner", "sentiment", "experience"],
    reply: "pb interned at Ernst & Young in Chennai as a Data Analyst. Built Contract Miner — an in-house chatbot that ingests scanned lease agreements and answers auditor questions. EY valued it at $30 million and is rolling it out company-wide. The work was showcased to the Global Vice Chair and recognised up to the Director of EMEA." },
  { keys: ["hire", "job", "opportunity", "recruit", "available"],
    reply: "pb is open to opportunities from Summer 2027. Best way to reach him is LinkedIn or email — links are on the home page." },
  { keys: ["usc", "trojan", "university", "los angeles", "la", "california", "school", "degree", "masters", "grad"],
    reply: "pb is an MS Computer Science student at USC, graduating May 2027. He also holds an integrated MS in Software Systems from CIT India — so USC is technically his second master's, and yes he brings it up." },
  { keys: ["hello", "hi", "hey", "sup", "yo", "what can"],
    reply: "i'm pb-mini. ask me about pb's research, projects, experience, or background." },
  { keys: ["who", "name", "pb", "prabhu", "about"],
    reply: "pb is Prabhu Pugalenthi — MS CS student at USC, Graduate Researcher at the HUMANS Lab, working on LLM reasoning efficiency and cognitive routing. From Coimbatore, India. Currently in Downtown LA." },
  { keys: ["travel", "food", "eat", "trip", "place", "visit", "hobby", "game", "fun"],
    reply: "pb travels whenever he can — US trips include the Grand Canyon, Sedona, Chicago, Atlanta, Orlando, and more. He takes food very seriously and games when the experiments are running." },
  { keys: ["gpu", "cuda", "a100", "cluster", "slurm", "training", "loss", "epoch"],
    reply: "pb runs experiments on HPC clusters with Slurm and Apptainer. 8 A100s for the big runs. Loss curves and NCCL timeouts are a daily concern." },
];

const offTopicFallbacks = [
  "i'm fine-tuned on exactly one person's life. this question is not in that dataset. ask me about pb instead.",
  "i would genuinely love to help, but my entire knowledge base is one human being and his projects. i'm very good at that one thing.",
  "that's a great question for a general-purpose model. i am not that. i am very specifically pb-mini.",
  "bold of you to think i know anything beyond pb's research and what he ate in sedona. ask me something about him.",
  "look, it's been a long day and i'm running on what i know — which is pb, his work, and not much else. what did you want to know about him?",
  "my training data is one guy's portfolio. this question fell right off the edge of it. try asking about cogspan or something.",
  "i would help but i've only ever learned about one person and honestly that took up all the space. ask me about pb.",
  "not my domain. my domain is very small and pb-shaped. what's your actual question about him?",
];
let _offTopicIdx = 0;

const defaultFallback = () => {
  const msg = offTopicFallbacks[_offTopicIdx % offTopicFallbacks.length];
  _offTopicIdx++;
  return msg;
};

function getFallbackReply(input) {
  const lower = input.toLowerCase();
  const match = pbReplies.find(({ keys }) => keys.some(k => lower.includes(k)));
  return match ? match.reply : defaultFallback();
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
