export const researchProjects = [
  {
    id: 1,
    title: "CogRouter: LLM Safety & Trustworthiness Benchmarking",
    period: "Apr 2026 – Present",
    supervisor: "Prof. Emilio Ferrara, USC ISI",
    tags: ["VLMs", "Agent Evaluation", "AI Safety", "OSWorld", "vLLM", "Slurm"],
    abstract:
      "Conducting research to evaluate open-source vision-language models on AI safety dimensions including jailbreak resistance, bias, and agent-level harmful behavior. Integrated Qwen3-VL-8B-Instruct into the OSWorld benchmark by building a custom agent class with tool-call action parsing, smart-resize image preprocessing, coordinate scaling, and history-aware multi-turn context management. Deployed evaluation infrastructure across USC CARC (Endeavour, Apptainer/Slurm) and Lambda Labs A100 instances, serving the model via vLLM's OpenAI-compatible endpoint (~33GB VRAM utilization). Extended benchmarking to the OS-HARM safety suite to measure attack success rate (ASR) and task success rate across desktop agent scenarios involving potentially harmful instructions.",
    highlights: [
      "Integrated Qwen3-VL-8B-Instruct into OSWorld benchmark",
      "Deployed on USC CARC + Lambda Labs A100s (~33GB VRAM)",
      "Extended to OS-HARM safety suite — measuring ASR and TSR",
      "Patched OSWorld routing layer for local vLLM-served models",
    ],
  },
  {
    id: 2,
    title: "Reasoning Economics Environment for LLMs",
    period: "Jan 2026 – Apr 2026",
    supervisor: null,
    tags: ["Reinforcement Learning", "LLM Systems", "GRPO", "TRL", "Qwen3"],
    abstract:
      "Designed a reinforcement learning environment to study compute-optimal reasoning by training LLMs to allocate tokens adaptively across queries of varying difficulty under shared budget constraints. Formulated the problem as a knapsack-constrained MDP with states encoding query complexity, remaining token budget, and sequential task dependencies. Implemented GRPO-based training using TRL's GRPOTrainer, validating the pipeline end-to-end on Qwen3-1.7B and scaling experiments to Qwen3-8B on Lambda Labs A100 instances.",
    highlights: [
      "Knapsack-constrained MDP for compute-optimal token allocation",
      "GRPO training via TRL on Qwen3-1.7B → Qwen3-8B",
      "Benchmarked against uniform, greedy, and oracle baselines",
      "Reward functions measuring accuracy, budget utilization, trajectory",
    ],
  },
  {
    id: 3,
    title: "LLM-Based Social Survey Simulation",
    period: "Feb 2026 – Apr 2026",
    supervisor: null,
    tags: ["NLP", "LoRA Fine-tuning", "PEFT", "Statistical Evaluation", "Qwen"],
    abstract:
      "Developed LLM-based frameworks to simulate population-level survey responses from limited pilot samples, targeting data-scarce settings where full survey deployment is cost-prohibitive. Fine-tuned Qwen2.5-7B-Instruct and Qwen3-8B using LoRA across split configurations; best results achieved at 50/10/40 train/val/test split over 3 epochs. Implemented pilot-conditioned few-shot prompting to inject base-rate priors and reduce systematic bias in LLM-generated survey data.",
    highlights: [
      "Fine-tuned Qwen2.5-7B & Qwen3-8B with LoRA (TRL/PEFT)",
      "Metrics: Pearson correlation, Earth Mover's Distance, MAE",
      "Pilot-conditioned few-shot prompting for base-rate priors",
      "Reproducible pipelines for large-scale simulation & analysis",
    ],
  },
];
