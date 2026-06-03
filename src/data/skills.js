// macOS Terminal "Basic" ANSI palette
const T = {
  red:     "#C23621",
  green:   "#25BC24",
  yellow:  "#ADAD27",
  blue:    "#492EE1",
  magenta: "#D338D3",
  cyan:    "#33BBC8",
  // bright variants
  bred:     "#FC391F",
  bgreen:   "#31E722",
  byellow:  "#EAEC23",
  bblue:    "#5833FF",
  bmagenta: "#F935F8",
  bcyan:    "#14F0F0",
};

export const skills = [
  {
    category: "Programming",
    icon: "Code2",
    items: [
      { name: "Python",  color: T.cyan },
      { name: "C/C++",   color: T.blue },
      { name: "SQL",     color: T.yellow },
      { name: "Bash",    color: T.green },
    ],
  },
  {
    category: "Machine Learning & AI",
    icon: "Brain",
    items: [
      { name: "Deep Learning",          color: T.magenta },
      { name: "Reinforcement Learning", color: T.red },
      { name: "LLM Systems",            color: T.cyan },
      { name: "Generative AI",          color: T.blue },
      { name: "Model Evaluation",       color: T.yellow },
    ],
  },
  {
    category: "Frameworks & Libraries",
    icon: "Layers",
    items: [
      { name: "PyTorch",      color: T.bred },
      { name: "Scikit-learn", color: T.yellow },
      { name: "NumPy",        color: T.cyan },
      { name: "Pandas",       color: T.magenta },
      { name: "TRL",          color: T.green },
      { name: "PEFT",         color: T.bgreen },
      { name: "vLLM",         color: T.blue },
      { name: "Hugging Face", color: T.byellow },
    ],
  },
  {
    category: "Systems & Infrastructure",
    icon: "Server",
    items: [
      { name: "REST APIs",   color: T.green },
      { name: "Docker",      color: T.cyan },
      { name: "Apptainer",   color: T.blue },
      { name: "CI/CD",       color: T.yellow },
      { name: "Linux / HPC", color: T.byellow },
      { name: "Slurm",       color: T.magenta },
    ],
  },
  {
    category: "Tools",
    icon: "Wrench",
    items: [
      { name: "Git / GitHub",  color: T.red },
      { name: "Power BI",      color: T.byellow },
      { name: "Jupyter",       color: T.bred },
      { name: "Lambda Labs",   color: T.magenta },
      { name: "USC CARC",      color: T.cyan },
    ],
  },
  {
    category: "Research Methods",
    icon: "FlaskConical",
    items: [
      { name: "Experimental Design",    color: T.bgreen },
      { name: "Benchmarking",           color: T.cyan },
      { name: "Statistical Evaluation", color: T.byellow },
      { name: "Distribution Analysis",  color: T.bmagenta },
    ],
  },
];
