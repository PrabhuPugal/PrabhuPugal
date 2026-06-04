// One accent color per category — applied to every badge in that group
const C = {
  research: "#A78BFA", // violet / purple
  systems:  "#4ADE80", // green
  tools:    "#FCD34D", // amber
  methods:  "#FB7185", // rose
};

export const skills = [
  {
    category: "Research Areas",
    icon: "Brain",
    items: [
      { name: "Reasoning Budgeting",          color: C.research },
      { name: "Cognitive Routing",            color: C.research },
      { name: "LLM Behavioral Analysis",      color: C.research },
      { name: "Psychological Traits in LLMs", color: C.research },
      { name: "Token-level Inference",        color: C.research },
      { name: "AI-based Game Coaching",       color: C.research },
      { name: "Social Survey Simulation",     color: C.research },
      { name: "AI Safety Benchmarking",       color: C.research },
      { name: "Agentic Reasoning",            color: C.research },
      { name: "Mathematical Reasoning",       color: C.research },
    ],
  },
  {
    category: "Systems & Infrastructure",
    icon: "Server",
    items: [
      { name: "Linux / HPC",  color: C.systems },
      { name: "Slurm",        color: C.systems },
      { name: "Docker",       color: C.systems },
      { name: "Apptainer",    color: C.systems },
      { name: "REST APIs",    color: C.systems },
      { name: "CI/CD",        color: C.systems },
    ],
  },
  {
    category: "Tools",
    icon: "Wrench",
    items: [
      { name: "Git / GitHub",  color: C.tools },
      { name: "PyTorch",       color: C.tools },
      { name: "Hugging Face",  color: C.tools },
      { name: "vLLM",          color: C.tools },
      { name: "MongoDB",       color: C.tools },
      { name: "Power BI",      color: C.tools },
      { name: "Jupyter",       color: C.tools },
    ],
  },
  {
    category: "Research Methods",
    icon: "FlaskConical",
    items: [
      { name: "Experimental Design",        color: C.methods },
      { name: "Benchmarking & Evaluation",  color: C.methods },
      { name: "Statistical Analysis",       color: C.methods },
      { name: "Distribution Analysis",      color: C.methods },
      { name: "Token Probability Analysis", color: C.methods },
      { name: "Prompt Engineering",         color: C.methods },
      { name: "RLHF / RLAIF",               color: C.methods },
      { name: "Fine-tuning (QLoRA / SFT)",  color: C.methods },
      { name: "Ablation Studies",           color: C.methods },
      { name: "Human-subject Study Design", color: C.methods },
    ],
  },
];
