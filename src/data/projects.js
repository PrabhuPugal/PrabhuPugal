export const projects = [
  {
    id: 1,
    title: "Forecasting of Postprandial Blood Glucose",
    period: "Sept 2025 – Dec 2025",
    tags: ["Diffusion Models", "Time-Series ML", "Healthcare AI", "CGM", "PyTorch"],
    description:
      "Developed diffusion-based deep learning models for multivariate physiological time-series forecasting using CGM data and contextual signals (meals, insulin, activity). Designed preprocessing pipelines to align irregular clinical data, handle missing values, and encode temporal dependencies. Achieved accurate prediction of post-meal glucose dynamics over a 200-minute horizon.",
    highlights: [
      "Diffusion-based models for multivariate CGM time-series",
      "200-minute post-meal glucose prediction horizon",
      "Preprocessing pipeline for irregular clinical + contextual data",
      "Evaluated generalization across unseen individuals",
    ],
    github: null,
    live: null,
  },
  {
    id: 2,
    title: "DRILL: Competitive Outcome Prediction",
    period: "Aug 2025 – Dec 2025",
    tags: ["XGBoost", "CatBoost", "CS:GO", "ML", "Feature Engineering"],
    description:
      "Modeled round-level win probability in CS:GO using large-scale event-based gameplay data. Engineered high-dimensional features capturing game state (economy, player health, utility usage, positional context). Trained gradient-boosted models achieving strong predictive performance (ROC-AUC ~0.87). Evaluated probabilistic calibration using LogLoss, Brier score, and Expected Calibration Error (ECE).",
    highlights: [
      "ROC-AUC ~0.87 on round-level win prediction",
      "High-dim feature engineering: economy, health, utility, position",
      "XGBoost + CatBoost with probabilistic calibration",
      "Analyzed failure modes under distributional shifts",
    ],
    github: null,
    live: null,
  },
  {
    id: 3,
    title: "Intelligent Log Analysis & Incident Triage System",
    period: "Apr 2025 – Sept 2025",
    tags: ["Python", "ML", "REST API", "Anomaly Detection", "Linux"],
    description:
      "Designed and implemented a modular log analysis system to ingest, normalize, and process large-scale application and system logs in Linux environments. Developed ML-assisted and rule-based methods to detect anomalies, recurring error patterns, and incident signatures across multiple log sources. Exposed analysis results via REST APIs to support debugging workflows.",
    highlights: [
      "Modular log ingestion + normalization for Linux environments",
      "ML-assisted anomaly detection and incident triage",
      "REST API exposure of analysis and triage results",
      "Evaluated across diverse log datasets for robustness",
    ],
    github: null,
    live: null,
  },
];
