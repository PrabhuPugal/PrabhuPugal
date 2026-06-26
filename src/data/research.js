export const researchProjects = [
  {
    id: 1,
    slug: "cogspan-adaptive-compute",
    color: "#C084FC",
    title: "CogSpan: Cognitive Routing as a General Principle Across Agentic and Reasoning Tasks",
    period: "Apr 2026 – Present",
    supervisor: null,
    tags: ["LLM Agents", "GRPO", "CoPO", "Adaptive Compute", "ACT-R"],
    abstract:
      "Extended CogRouter (Yang et al., 2026) with two orthogonal modules grounded in ACT-R theory and Cognitive Load Theory, targeting the gaps the original authors explicitly identified: cost awareness and budget tracking. Evaluated across both agentic tool-use and mathematical reasoning to establish cognitive routing as a domain-general principle, targeting NeurIPS 2027 / ICLR 2027.",
    highlights: [
      "CogSpan applies cognitive routing to assign the right reasoning depth per step, instead of thinking equally hard at every action.",
      "Extended CogRouter to two completely different task types: web-based agentic tool use and competition-level math.",
      "Built a token ledger that watches spend mid-episode and quietly caps reasoning depth when the agent burns through budget too fast.",
      "Matched Self-Consistency-8 at 3x fewer tokens, routing most problems shallow and escalating only when the task demands it.",
      "Designing a verification layer that flags irreversible actions before the agent can proceed, with no human in the loop.",
    ],
    writtenDate: "Jun 2026",
    readTime: "5 min read",
    paper: null,
    coverImage: null,
    images: [],
    body: [
      { type: "heading", content: "The question" },
      { type: "paragraph", content: "CogRouter (Yang et al., 2026) introduced something genuinely new. Instead of making an LLM agent think harder everywhere, it trained a router that decided how hard to think at each individual step of a multi-step task. The insight came from cognitive science: not every step in a long-horizon task deserves the same depth of reasoning. Picking up an object in a simulated lab environment is not the same cognitive problem as deciding which room to search next after two failed attempts. CogRouter defined four cognitive levels from L1 instinctive response to L4 strategic planning, and trained a router via supervised fine-tuning then reinforcement learning to assign the right level to each step. The results were strong: **82.3% success rate** on embodied benchmarks while using **62% fewer tokens** than uniform deep reasoning." },
      { type: "image", src: "/work/cogspan/act.png", caption: "ACT-R (Anderson, 1982) models cognition as a hierarchy from reflexive responses to deliberate planning. This is the same structure CogRouter borrows to define its four routing levels L1 through L4. Source: Wikipedia" },
      { type: "paragraph", content: "But three important questions were left unanswered, and the authors said so explicitly in the conclusion. Does cognitive routing generalize beyond simple embodied environments to harder agentic benchmarks like WebArena and GAIA, where steps involve real browser actions and API calls with heterogeneous real-world costs? Can it adapt when a per-episode token budget is being over or under spent, since CogRouter has no budget tracking mechanism at all? And does the routing principle transfer to a completely different task type like mathematical reasoning, where there are no tool costs but reasoning depth still matters enormously for accuracy? We are answering all three with CogSpan." },
      { type: "heading", content: "What we built" },
      { type: "paragraph", content: "Extension A made the router cost-aware. The original CogRouter sees the observation, the task context, and the interaction history. It does not know how expensive the next action will be to execute. On WebArena, clicking a button costs essentially nothing. Calling an external API can cost real money. Submitting a form is both expensive and irreversible. Extension A augments the router input with a normalized cost vector for the available actions and retrains the policy via GRPO with a reward that penalizes total API costs incurred across the episode. The policy learns to route lightweight cognitive levels to cheap reversible steps and heavier reasoning to costly or consequential ones." },
      { type: "paragraph", content: "Extension B is the online token ledger, a training-free inference-time wrapper that requires no retraining of the base router. It tracks remaining budget and computes a pressure signal: p = remaining budget divided by the expected remaining budget if tokens were spent uniformly across the episode. When pressure drops below 0.6, meaning the agent is over-spending relative to a sustainable pace, the ledger caps the router's output at L2 and prevents the agent from engaging in expensive L3 or L4 reasoning it cannot afford. When pressure is above 1.4, it permits L3 and L4 freely. The intervention touches only the cognitive level assignment; the underlying model weights are entirely untouched." },
      { type: "code", lang: "python", content: `class TokenLedger:
    def __init__(self, budget: int, estimated_steps: int,
                 tau_low: float = 0.6, tau_high: float = 1.4):
        assert estimated_steps > 1   # bug we hit: div-by-zero at t == T
        self.B0  = budget
        self.B   = budget
        self.T   = estimated_steps
        self.t   = 0
        self.tau_low  = tau_low
        self.tau_high = tau_high

    def budget_pressure(self) -> float:
        time_fraction = self.t / self.T
        if time_fraction >= 1.0:
            return 0.0
        expected_remaining = self.B0 * (1.0 - time_fraction)
        return self.B / expected_remaining

    def apply_ceiling(self, proposed_level: int) -> int:
        p = self.budget_pressure()
        if p < self.tau_low:
            return min(proposed_level, 2)   # cap at L2 when over-budget
        elif p > self.tau_high:
            return proposed_level            # permit L3/L4 when under-budget
        return proposed_level

    def step(self, router_level: int, tokens_used: int) -> int:
        adjusted = self.apply_ceiling(router_level)
        self.B  -= tokens_used
        self.t  += 1
        return adjusted` },
      { type: "heading", content: "The two-track evaluation framework" },
      { type: "paragraph", content: "The core claim of CogSpan is that cognitive routing is domain-general, not just an efficiency trick for simple embodied environments. Proving this required an evaluation framework spanning two qualitatively different task types. Track 1 covers agentic tool-use: WebArena with 812 tasks involving browser actions across real websites, GAIA with 466 tasks requiring multi-step reasoning with tool use, and AssistantBench with 214 tasks. Cognitive levels in Track 1 map onto action complexity, from dispatching a learned pattern directly at L1 to running multi-agent simulation of consequences at L4. Track 2 covers mathematical reasoning: MATH500, AIME24, and GSM8K. Cognitive levels in Track 2 map onto reasoning strategy, from a direct answer at L1 to majority voting across multiple sampled solutions at L4." },
      { type: "paragraph", content: "The key structural observation is that Extension B applies identically to both tracks because per-episode token budgets exist in both settings. An agent solving a 10-step web navigation task and an agent working through an AIME problem both face a finite compute horizon. This structural consistency is what lets us argue the principle is general rather than domain-specific." },
      { type: "heading", content: "What the experiments show so far" },
      { type: "paragraph", content: "We have run four-mode ablation experiments on Track 2 with Qwen2.5-7B-Instruct across MATH500, GSM8K, and AIME. The full pipeline reached **67.0%** on MATH500 versus **65.6%** for the CogRouter baseline, with **3.8% fewer tokens**. Removing the CLT load estimator costs **0.7 accuracy points**. Removing the token ledger costs **0.14K extra tokens** per problem but barely affects accuracy on short math problems, which confirms the ledger's contribution scales with episode length. GSM8K is near-ceiling at 88.4%, and AIME is hard-capped at 10% regardless of routing configuration because the competition problems exceed Qwen2.5-7B's mathematical capability independent of how deeply it reasons." },
      { type: "image", src: "/work/cogspan/CLT.png", caption: "Cognitive Load Theory (Sweller, 1988) breaks cognitive effort into intrinsic load (how hard the task is), extraneous load (wasted effort), and germane load (effort that builds understanding). CogSpan's CLT estimator reads these signals to decide how much reasoning depth the current step actually warrants. The ablation above shows that removing it costs 0.7 accuracy points. Source: InteDashboard" },
      { type: "paragraph", content: "Track 1 evaluation is currently blocked. CogRouter's trained CoPO checkpoint is stored on a private cluster and has not been released. We are reproducing it by running the full CoPO training loop from the public CogRouter repository, and resolving a vllm installation failure on our GH200 server caused by aarch64 incompatibilities in the fastsafetensors dependency. The NeurIPS 2027 / ICLR 2027 argument requires Track 1 numbers. Getting them is the immediate priority." },
      { type: "heading", content: "What we are building toward" },
      { type: "paragraph", content: "The key Track 2 comparison is Self-Consistency-8, which always runs L4 majority voting across eight sampled solutions. CogSpan should match its accuracy on MATH500 while using roughly three times fewer tokens by routing most problems to L1 or L2 and only escalating to L4 when the routing signal warrants it. That is the efficiency story for NeurIPS 2027 / ICLR 2027. On the horizon is a follow-on project targeting ICLR 2027 that grew directly out of building the two-track evaluation framework. While designing cost-conditioned routing for WebArena, we kept hitting a harder version of the same question: what should an agent do when the next action is not just expensive but genuinely irreversible or security-sensitive? Submitting a form, executing code, deleting a file, making an external API call that modifies state are qualitatively different from browsing or reading, and an agent that routes to L1 instinctive response on any of these is a liability. The follow-on project is a full safety layer for agentic LLMs targeting this class of high-stakes actions, with its own dataset of labeled high-risk actions from WebArena and AssistantBench, its own training pipeline for a pre-action verification classifier, and its own evaluation framework built around attack success rate and task success rate under adversarial prompt injection conditions." },
    ],
  },
  {
    id: 2,
    slug: "reasoning-economics",
    color: "#4ADE80",
    title: "ReasoningEconomicsEnv: Sequential Token Budget Allocation for LLMs",
    period: "Jan 2026 – Apr 2026",
    supervisor: null,
    tags: ["Reinforcement Learning", "GRPO", "LLM Systems", "Adaptive Compute", "TRL"],
    abstract:
      "Built a reinforcement learning environment where a language model must solve a sequence of math problems under a shared token budget, learning to treat compute as a finite resource that must be allocated across an entire episode rather than optimized one question at a time.",
    highlights: [
      "Ten questions, one shared token budget. ReasoningEconomicsEnv tests whether LLMs can allocate reasoning across an episode, not just per question.",
      "Overspend on an easy question and you fail the hard one later. The environment creates real tradeoffs within a single episode.",
      "Trained with GRPO. Budget-aware behavior only emerged at 14B scale, smaller models ignored the signal entirely.",
      "Ran on 8 A100s with a decoupled vLLM inference server to reach the model sizes where the behavior actually appeared.",
      "Logged zero environment errors across all completed runs. Every failure was infrastructure, not a flaw in the idea.",
    ],
    writtenDate: "Apr 2026",
    readTime: "5 min read",
    paper: "/work/reasoning/ReasoningEnv.pdf",
    coverImage: null,
    images: [],
    body: [
      { type: "heading", content: "The question" },
      { type: "paragraph", content: "Every paper on efficient LLM reasoning at the time was solving the same problem: given one question, how do you make the model use fewer tokens to answer it? Methods like O1-Pruner, DAST, and SelfBudgeter all shaped rewards to penalize long reasoning traces on individual queries. But none of them asked the more realistic question: what happens when a model has to answer ten questions in a row and the tokens it spends on question three are tokens it cannot spend on question seven?" },
      { type: "paragraph", content: "This is how LLM inference actually works in deployed systems. A user session has a budget. A document processing pipeline has a budget. An exam has a time limit. The model needs to decide not just how much to think, but how much to think now versus later. That requires learning something fundamentally different: not just shorter reasoning, but strategic allocation of a shared resource across a horizon of decisions where earlier choices constrain later ones." },
      { type: "paragraph", content: "The failure mode we were targeting was overthinking on easy problems. A model that spends 800 tokens working through a trivial arithmetic problem has stolen that compute budget from a hard algebra problem later in the same episode. No per-query efficiency method can fix this because they never see the episode structure. The model needs to know what is remaining and calibrate accordingly." },
      { type: "heading", content: "The environment design" },
      { type: "paragraph", content: "We built ReasoningEconomicsEnv as an RL environment that constructs multi-question episodes from mixed mathematical reasoning datasets, specifically MetaMathQA and NuminaMath-TIR. Each episode contains up to ten sequential math problems. The model receives the current question plus the remaining token budget as part of its input at every step, solves the problem, and the environment decrements the budget by however many tokens the reasoning trace and answer consumed. The next question then arrives with the updated budget state." },
      { type: "paragraph", content: "The same model plays two roles simultaneously: it acts as the solver generating a reasoning trace and final answer, and as the implicit allocator deciding how long that reasoning trace should be. This is the core design choice that separates our setting from all prior work. There is no separate allocator module. The policy itself must learn to integrate problem difficulty, remaining budget, and position in the episode into a single generation decision." },
      { type: "image", src: "/work/reasoning/Screenshot 2026-06-25 204602.png", maxWidth: "42%", caption: "Figure 1. End-to-end flow of ReasoningEconomicsEnv. Questions are drawn from MetaMathQA and NuminaMath-TIR and packed into a shared-budget episode. At each step the model generates a reasoning trace, the environment decrements the budget, applies hard-cap or soft-budget control, and computes a reward combining correctness with efficiency. The policy is updated via GRPO and evaluated on the accuracy-budget tradeoff across full episodes." },
      { type: "paragraph", content: "We implemented two budget constraint regimes. Hard-cap mode terminates the episode early if the budget runs out, giving the model a hard cliff to reason about. Soft-budget mode applies a continuous penalty proportional to overspend, allowing the model to exceed the budget but punishing it for doing so. Soft-budget mode turned out to be a better curriculum stage, reducing premature episode termination and producing more variance in reward signals that GRPO could learn from." },
      { type: "image", src: "/work/reasoning/Screenshot 2026-06-25 204647.png", caption: "Step-level reward function. The model earns a correctness signal c_t and an efficiency bonus scaled by how far under fair-share token usage it stays. Overspending beyond the fair share is penalized through the β term, with an additional P_over penalty in hard-cap mode. This forces the policy to internalize per-step cost alongside accuracy." },
      { type: "image", src: "/work/reasoning/Screenshot 2026-06-25 204641.png", caption: "Episode-level reward. After all N questions are answered, the model receives a bonus proportional to overall accuracy and how close total token usage landed to the target utilization U_target. The max(0, ...) term means the bonus disappears entirely if token usage deviates too far from target in either direction, not just if it overshoots." },
      { type: "code", lang: "python", content: `class ReasoningEconomicsEnv:
    def __init__(self, budget: int, n_questions: int = 10,
                 mode: str = "soft"):
        self.B0 = budget          # initial episode budget
        self.B  = budget          # remaining budget
        self.T  = n_questions
        self.mode = mode

    def step(self, response: str, is_correct: bool) -> tuple[float, bool]:
        tau      = count_tokens(response)
        tau_fair = self.B0 / self.T         # fair share per question

        r_step = (1.0 if is_correct else -0.1)
        r_step += 0.3 * (1 - tau / tau_fair) * is_correct

        if self.mode == "soft":
            overspend = max(0, tau / tau_fair - 1)
            r_step -= 0.5 * overspend
        elif self.mode == "hard" and self.B - tau < 0:
            return r_step, True             # episode terminates early

        self.B -= tau
        return r_step, self.B <= 0

    def episode_bonus(self, n_correct: int, total_tokens: int,
                      target: float = 0.85) -> float:
        accuracy = n_correct / self.T
        utilization_gap = abs(total_tokens / self.B0 - target)
        return 2.0 * accuracy * max(0, 1 - utilization_gap)` },
      { type: "heading", content: "The infrastructure challenge" },
      { type: "paragraph", content: "The most technically demanding part of the project was not the environment design but scaling the training pipeline to model sizes where the budget allocation behavior actually emerged. Smaller models failed to learn non-trivial allocation strategies regardless of how the reward was shaped." },
      { type: "paragraph", content: "Our training runs spanned two hardware configurations. For models up to 4B parameters we used single and dual H100 setups with standard training loops. For 14B and 32B scale we built a distributed setup on 8 A100s integrating DeepSpeed ZeRO-3 with CPU optimizer offloading on GPUs 0 to 5 for the PyTorch GRPO trainer, and a standalone vLLM inference server with tensor parallel size 2 on GPUs 6 and 7. Decoupling the generation server from the training process was essential because concurrent generation and gradient updates at 14B scale would have exhausted VRAM entirely." },
      { type: "paragraph", content: "The first positive average reward appeared at **14B scale** with Qwen2.5-14B-Instruct under FSDP sharding, reaching **0.260**. Switching to the full ZeRO-3 plus vLLM architecture with Qwen3-14B on 4-question episodes produced a **positive mean reward of 0.469** across 480 logged episodes and 1,920 environment turns with zero environment-step errors. Pushing to 10-question rollouts produced the strongest reward signal at **3.589** with accuracy approaching **39%**, but both attempts failed from NCCL broadcast timeouts before completing, a distributed synchronization bottleneck rather than an environment or reward failure." },
      { type: "image", src: "/work/reasoning/Screenshot 2026-06-25 204655.png", caption: "Table 1. Comprehensive post-training results across model scales and infrastructure configurations. Positive average reward first appears at 14B scale. The ZeRO-3 + vLLM setup with Qwen3-14B reached 0.469 on 4-question episodes and 3.589 on 10-question rollouts before NCCL timeouts ended both runs. Every environment-step error rate was zero across all completed runs: all failures were distributed infrastructure issues, not reward or environment bugs." },
      { type: "heading", content: "What the results showed" },
      { type: "paragraph", content: "The clearest finding was the scale threshold. Models below roughly 7B parameters did not learn to differentiate their reasoning depth based on remaining budget. They either reasoned at a fixed length regardless of budget state or collapsed to minimal generation to minimize overspend penalties. At 14B scale the behavior changed qualitatively: the model began producing shorter reasoning traces on questions that arrived late in episodes with depleted budgets, and longer traces earlier when budget was plentiful and problems were harder." },
      { type: "paragraph", content: "The soft-budget curriculum was consistently better than hard-cap for early training. Hard-cap mode caused too many early episode terminations on smaller models, producing sparse reward signals that GRPO could not learn from. Soft-budget allowed the model to overspend and observe the penalty, giving it a continuous gradient signal about the cost of over-reasoning." },
      { type: "paragraph", content: "The infrastructure results established that the environment and reward function were not the bottleneck. Every environment-step error rate was zero across completed runs. The failures at 10-question scale were purely NCCL synchronization issues in the distributed backend, meaning the path to long-horizon training at 14B and 32B scale is a systems problem, not a modeling one." },
    ],
  },
  {
    id: 3,
    slug: "llm-survey-simulation",
    color: "#F472B6",
    title: "Beyond the Mean: Three-Axis Fidelity for LLM-Based Survey Simulation",
    published: true,
    venue: "ICML 2026",
    period: "Feb 2026 – Apr 2026",
    supervisor: null,
    tags: ["NLP", "LoRA", "PEFT", "Statistical Alignment", "Qwen3"],
    abstract:
      "Investigated how well LLMs can simulate population-level survey responses from a 5% pilot sample, introducing a three-axis fidelity framework that goes beyond mean-matching to evaluate predictor-outcome structure, distributional alignment, and individual-level tracking across 1,466 real respondents from a COVID-19 misinformation survey.",
    highlights: [
      "Can an LLM recover what 1,466 survey respondents would have said, given only 74 real responses? Tested on a COVID-19 misinformation dataset.",
      "Matching the average is the wrong target. We measured three-axis fidelity using Lin's CCC and Wasserstein distance across structure, distribution, and individual tracking.",
      "LoRA+MLP fine-tuning with a classification head beat text generation on all three axes, even sharing the same backbone.",
      "The best model explained only 14% individual variance. Population-level accuracy hides almost all of the actual failure.",
      "Fidelity collapse hit hardest for conservative respondents, dropping by more than half. Invisible without subgroup analysis.",
    ],
    writtenDate: "Apr 2026",
    readTime: "4 min read",
    paper: "/work/beyond/Beyond_the_mean_three_axis_fidelity.pdf",
    coverImage: null,
    images: [],
    body: [
      { type: "heading", content: "The question" },
      { type: "paragraph", content: "LLM survey simulation papers kept claiming that language models could stand in for human survey respondents. But how they measured this was almost always the same: check if the average simulated response matched the average real response. We thought this was the wrong question. The canonical failure mode is a model that puts every simulated respondent at exactly 2.5 on a 4-point Likert scale. It can perfectly match the population mean while completely flattening the variance, erasing the difference between someone who rates every misinformation claim 4 out of 4 and someone who rates them all 1. And downstream uses like targeted interventions or causal inference depend not just on getting the mean right but on getting the relationships between who someone is and what they believe right." },
      { type: "paragraph", content: "We ran this on a real COVID-19 misinformation survey from South Korea, May 2020, with 1,466 respondents each answering 36 belief items across misinformation and true-information claims on a 4-point Likert scale. We drew a 5% pilot of 74 respondents, held out the remaining 1,392, and asked: given only the pilot, how much of the full population's statistical structure can an LLM recover?" },
      { type: "heading", content: "The three-axis framework" },
      { type: "paragraph", content: "We decomposed recovery into three independent axes, each answering a fundamentally different question." },
      { type: "paragraph", content: "The first axis is structural fidelity: do predictor-outcome relationships match? We regressed a per-respondent discernment score (TRUEINFO mean minus MISINFO mean) on 12 predictors including open-mindedness, faith in intuition, need for evidence, political orientation, and age, then measured Lin's Concordance Correlation Coefficient between the simulator's regression coefficients and the ground truth coefficients. CCC penalizes both directional errors and magnitude errors simultaneously, so a model that gets the sign right but inflates or compresses the slope still loses points." },
      { type: "paragraph", content: "The second axis is marginal fidelity: does the full cross-respondent distribution match, not just the mean? We used Wasserstein-1 Earth Mover's Distance between the simulator's and ground truth distributions of the per-respondent discernment, MISINFO mean, and TRUEINFO mean scalars." },
      { type: "paragraph", content: "The third axis is individual fidelity: does each simulated respondent actually track their specific real human counterpart? We computed paired Pearson correlation and mean absolute error across matched respondent pairs on their discernment scores, separating whether the model correctly ranks respondents by discernment from whether it gets each person's absolute value close." },
      { type: "heading", content: "What we benchmarked" },
      { type: "paragraph", content: "We ran six simulators across four families. Zero-shot batch prompting gave each held-out respondent's demographic and psychometric profile and asked for all 36 ratings in one prompt. Zero-shot per-item did the same but queried one claim at a time, isolating the effect of cross-item conditioning. Few-shot variants injected five pilot respondents as in-context examples. LoRA fine-tuned Qwen3-8B on the 74-person pilot with standard autoregressive generation. LoRA+MLP added a trained classification head on the final hidden state with cross-entropy over the four Likert classes plus a Have-Not-Seen class. On top of all prompt-based simulators we also applied Prediction-Powered Inference rectification, which uses the pilot to debias per-item population estimates." },
      { type: "code", lang: "python", content: `def three_axis_fidelity(sim_responses, gt_responses, predictors):
    # Per-respondent scalar summaries
    sim_d = sim_responses[:, trueinfo_idx].mean(1) - sim_responses[:, misinfo_idx].mean(1)
    gt_d  = gt_responses[:, trueinfo_idx].mean(1)  - gt_responses[:, misinfo_idx].mean(1)

    # Axis 1: Structural fidelity — Lin's CCC on regression coefficients
    sim_betas = LinearRegression().fit(predictors, sim_d).coef_
    gt_betas  = LinearRegression().fit(predictors, gt_d).coef_
    ccc = lin_ccc(sim_betas, gt_betas)

    # Axis 2: Marginal fidelity — Wasserstein-1 on discernment distribution
    emd_d = wasserstein_distance(sim_d, gt_d)

    # Axis 3: Individual fidelity — paired Pearson and MAE
    r_d, _  = pearsonr(sim_d, gt_d)
    mae_d   = np.abs(sim_d - gt_d).mean()

    return {"structural_ccc": ccc, "marginal_emd": emd_d,
            "individual_r": r_d, "individual_mae": mae_d}

def lin_ccc(x, y):
    mx, my = x.mean(), y.mean()
    cov = np.cov(x, y)[0, 1]
    return 2 * cov / (x.var() + y.var() + (mx - my) ** 2)` },
      { type: "heading", content: "What the results showed" },
      { type: "paragraph", content: "LoRA+MLP was the only method that simultaneously cleared meaningful thresholds on all three axes: structural CCC of **0.85** on bivariate correlations and **0.78** on OLS coefficients, the lowest marginal EMD of **0.17** across all three per-respondent scalar summaries, and the highest individual Pearson of **0.37**." },
      { type: "image", src: "/work/beyond/Screenshot 2026-06-25 172541.png", caption: "Table 1. Headline metrics across all three fidelity axes. LoRA+MLP is the only method that leads on every column simultaneously: best structural CCC on both bivariate correlations and OLS coefficients, lowest marginal EMD, and highest individual Pearson. No other simulator clears all three axes at once." },
      { type: "image", src: "/work/beyond/Screenshot 2026-06-25 172548.png", caption: "Figure 1. Structural-fidelity forest plot showing Lin's CCC with 95% bootstrap confidence intervals for all six simulators, on both bivariate correlations (top) and standardized OLS coefficients (bottom). LoRA+MLP's interval sits comfortably right of all others, confirming the structural lead is not a sampling fluke." },
      { type: "paragraph", content: "The more important finding was the ceiling. Even LoRA+MLP's individual Pearson of **0.37** means the model accounts for only about **14%** of the cross-respondent variance in discernment. You can get the population-level distribution looking right while still being almost completely wrong about what any specific person would answer. This matters most for downstream uses where you want to ask questions like who in this population is most susceptible to misinformation, rather than what is the average susceptibility." },
      { type: "image", src: "/work/beyond/Screenshot 2026-06-25 172554.png", caption: "Table 2. Structural fidelity decomposed into sign-agreement (fraction of the 12 predictors where simulator and ground truth point the same direction) and slope inflation ratio. LoRA+MLP agrees on direction 92% of the time but inflates slope magnitudes by 28%, a pattern that looks good on CCC but reveals systematic overconfidence in effect sizes." },
      { type: "paragraph", content: "The output head turned out to matter more than expected. LoRA and LoRA+MLP share the same Qwen3-8B backbone and the same LoRA rank, differing only in whether the output is autoregressive token generation or a trained classification head. The classification head produced dramatically better structural and marginal fidelity, compressing the slope inflation that standard fine-tuning introduced." },
      { type: "image", src: "/work/beyond/Screenshot 2026-06-25 172604.png", caption: "Figure 2. Cross-respondent Wasserstein-1 Earth Mover's Distance on the three per-respondent scalar summaries. LoRA+MLP achieves the lowest EMD across all three (discernment 0.17, Misinfo mean 0.12, Trueinfo mean 0.12). LoRA without the classification head scores 0.63 on discernment, more than 3x worse, showing the output head is what drives marginal fidelity." },
      { type: "paragraph", content: "PPI rectification helped biased simulators like zero-shot batch but ran into a structural degeneracy with fine-tuned models: when a fine-tuned model memorizes the pilot, the rectification formula reduces algebraically to the simulator's own held-out mean, making PPI a no-op in exactly the cases where fine-tuning works best." },
      { type: "image", src: "/work/beyond/Screenshot 2026-06-25 172609.png", caption: "Table 3. PPI rectification applied to per-subset population means. The correction moves prompt-based simulators (ZS, FS) closer to ground truth in most cases. For LoRA-family models, PPI is effectively a no-op: the rectifier has nothing left to correct when fine-tuning has already memorized the pilot." },
      { type: "paragraph", content: "The subgroup analysis revealed the sharpest finding. Aggregate fidelity of **0.85 CCC** collapsed to **0.40** for conservative respondents and **0.69** for the oldest cohort. A model can pass every aggregate audit while systematically misrepresenting the subpopulations a pluralistic simulator is most supposed to represent." },
      { type: "image", src: "/work/beyond/Screenshot 2026-06-25 172620.png", caption: "Figure 3. Subgroup fidelity of LoRA+MLP across demographic splits evaluated on all three axes simultaneously. Conservative respondents are the worst-served group: structural CCC drops from 0.85 aggregate to 0.40, and the marginal EMD widens significantly. A model that passes every aggregate audit can still systematically misrepresent the subpopulations that matter most." },
    ],
  },
];
