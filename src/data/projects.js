export const projects = [
  {
    id: 1,
    slug: "drill-csgo-prediction",
    color: "#52B788",
    title: "DRILL: Demo-Based Round Win Inference for Competitive Map Pool Analysis",
    period: "Aug 2025 – Dec 2025",
    tags: ["Machine Learning", "Gradient Boosting", "CatBoost", "Esports Analytics"],
    summary: "Round-level win probability model for CS2 built from raw demo files, evaluated on calibration across the full competitive map pool.",
    description:
      "Built a round win probability system for CS2 that parses raw demo files tick by tick, engineers tactical and economic features from each game state snapshot, and trains gradient-boosted models evaluated on calibration to ensure predicted probabilities are trustworthy enough for broadcast overlays and analyst tools.",
    highlights: [
      "Trained a model to predict who wins a CS2 round from a single freeze-frame of the game, before any action is taken.",
      "Parsed raw demo files tick by tick to reconstruct the game server's view of every round across the full seven-map competitive pool.",
      "The key insight: economy and equipment value predict round outcomes far better than alive counts alone, even in 3v2 situations.",
      "Focused on calibration, not just accuracy. A 73% predicted win rate that actually corresponds to 73% of real rounds is trustworthy. An uncalibrated one is worse than useless.",
      "CatBoost achieved near-perfect calibration with an ECE of 0.0099, meaning confidence estimates were almost exactly right across all probability buckets.",
    ],
    writtenDate: "Dec 2025",
    readTime: "3 min read",
    github: null,
    live: null,
    coverImage: null,
    images: [],
    body: [
      { type: "heading", content: "Why this" },
      { type: "paragraph", content: "I have played Counter-Strike since I was in school. Watching pro matches, I noticed analysts can look at a freeze-frame of a round and tell you who is going to win almost instantly. They look at the economy, how many players are alive, which side of the map the bomb is on. I wanted to know if a model could learn to do the same, and more importantly, whether the confidence it assigned to its predictions would be trustworthy enough to put in a real broadcast overlay. That second part is what makes this different from a standard classification problem. A model that says 78% CT win when the real rate for that game state is 61% is worse than useless for a live analyst tool." },
      { type: "heading", content: "The dataset and demo parsing" },
      { type: "paragraph", content: "I built a dataset mixing professional match replays from HLTV with personal competitive demos across the full active map pool: Mirage, Inferno, Nuke, Dust2, Ancient, Anubis, and Vertigo. Pro demos add clean high-skill game states with decisive economic patterns. Personal demos add the mid-skill messiness where a 3v2 still gets thrown because of bad positioning. Training on both made the model more robust across the skill range it would realistically see." },
      { type: "code", lang: "python", content: `def extract_features(tick_state: dict) -> dict:
    return {
        "ct_alive":        tick_state["ct_alive"],
        "t_alive":         tick_state["t_alive"],
        "alive_advantage": tick_state["ct_alive"] - tick_state["t_alive"],
        "bomb_planted":    int(tick_state["bomb_planted"]),
        "bomb_time_left":  tick_state.get("bomb_time_left", 40),
        "ct_eq_value":     tick_state["ct_equipment_value"],
        "t_eq_value":      tick_state["t_equipment_value"],
        "eq_advantage":    tick_state["ct_equipment_value"] - tick_state["t_equipment_value"],
        "ct_money":        tick_state["ct_money"],
        "t_money":         tick_state["t_money"],
        "map":             tick_state["map_name"],
        "round_type":      tick_state["round_type"],  # pistol / eco / full buy
        "time_remaining":  tick_state["time_remaining"],
    }` },
      { type: "heading", content: "Training and calibration" },
      { type: "paragraph", content: "I trained CatBoost and XGBoost on an 80/10/10 split stratified by map. CatBoost handled categorical features like map name and round type natively without manual encoding. The evaluation focused on ECE (Expected Calibration Error), the average gap between predicted probability and observed win rate across probability bins. AUC tells you if the ranking is right. ECE tells you if the numbers mean what they say, which is what actually matters for a live overlay." },
      { type: "code", lang: "python", content: `from catboost import CatBoostClassifier
from sklearn.calibration import calibration_curve

model = CatBoostClassifier(
    iterations=500, learning_rate=0.05, depth=6,
    eval_metric="AUC", cat_features=["map", "round_type"], random_seed=42,
)
model.fit(X_train, y_train, eval_set=(X_val, y_val), verbose=100)

prob_true, prob_pred = calibration_curve(y_test, model.predict_proba(X_test)[:,1], n_bins=10)
ece = float(np.mean(np.abs(prob_true - prob_pred)))
print(f"ECE: {ece:.4f}")  # CatBoost: 0.0099 | XGBoost: 0.0341` },
      { type: "heading", content: "What I found" },
      { type: "paragraph", content: "CatBoost won on every metric: AUC **0.8724** vs **0.8611**, ECE **0.0099** vs **0.0341**, Brier **0.1847** vs **0.1923**. The calibration gap was the more meaningful one. XGBoost's predictions were systematically biased in the 60 to 80 percent probability range, exactly where most non-trivial rounds sit. CatBoost's ECE of 0.0099 means it is less than one percentage point off from the true win rate across all probability buckets, which is the threshold where you can actually trust the number on screen." },
      { type: "paragraph", content: "The map feature turned out to matter more than expected. Ablating it pushed ECE from 0.0099 to 0.0187 and dropped AUC to 0.8502. Maps have structurally different dynamics: Nuke heavily favors CT-side even in even-player situations because of its vertical geometry, while Mirage is much closer to 50/50 in neutral states. The model needed that context to calibrate predictions correctly per map rather than averaging over all of them." },
    ],
  },
  {
    id: 2,
    slug: "blood-glucose-forecasting",
    color: "#EF476F",
    title: "Diffusion Based Forecasting of Postprandial Blood Glucose Using Multimodal Physiological Signals",
    period: "Aug 2025 – Nov 2025",
    tags: ["Diffusion Models", "CSDI", "Time Series", "Generative AI", "Healthcare"],
    summary: "Conditional diffusion model that generates full distributions of post-meal glucose trajectories from multimodal physiological signals, outperforming LSTM, Transformer, and vanilla CSDI baselines.",
    description:
      "Built a personalized conditional diffusion model that generates full probability distributions over future glucose trajectories in the 30 to 60 minutes after a meal, conditioning on heart rate, caloric burn, carbohydrate intake, and engineered physiological features rather than producing a single deterministic forecast.",
    highlights: [
      "Blood glucose after a meal does not follow one path. It follows a range of possible paths. We modeled that range instead of predicting a single number.",
      "Extended a diffusion model to take in heart rate, calorie burn, carb intake, and circadian signals, generating full trajectory distributions instead of point forecasts.",
      "Trained a separate model for each of 45 participants because one person's response to pasta is completely different from another's.",
      "Outperformed every baseline on all four metrics. The distributional approach was more accurate and more honest about what it did not know.",
      "For healthcare forecasting, knowing the range of likely outcomes matters more than getting a single average right. This project showed that concretely.",
    ],
    writtenDate: "Nov 2025",
    readTime: "5 min read",
    github: null,
    live: null,
    coverImage: null,
    images: [],
    body: [
      { type: "heading", content: "The question" },
      { type: "paragraph", content: "The 30 to 60 minutes after eating is the most dangerous window in diabetes management. Glucose can spike fast enough to cause acute hyperglycemic excursions that, repeated over time, drive microvascular and macrovascular complications. Overcorrect with insulin and you risk hypoglycemia, which is immediately life-threatening. The clinical problem is not just predicting where glucose is going but knowing how uncertain that prediction is, because the right insulin dose for a trajectory that peaks at 180 is very different from the right dose for one that peaks at 240." },
      { type: "paragraph", content: "Every standard approach to glucose forecasting, ARIMA, LSTMs, GRUs, Transformers, produces a single number: the most likely glucose value at each future timestep. That single number discards exactly the information a closed-loop insulin delivery system needs most. If the model is 95% confident the glucose will peak at 170, the system can act aggressively. If the model is highly uncertain across a wide range of possible trajectories, the system should be conservative. A point forecast cannot express this distinction." },
      { type: "paragraph", content: "The deeper problem is individual variability. Two people eating identical meals with identical baseline glucose will follow completely different postprandial trajectories depending on their insulin sensitivity, activity level, stress, circadian phase, and gut absorption kinetics. A model trained across participants and asked to generalize will average these differences away. We wanted a model that learned each person's specific dynamics separately." },
      { type: "heading", content: "The pipeline" },
      { type: "paragraph", content: "We used the CGMacros dataset from PhysioNet, a multimodal free-living collection from roughly 45 participants each monitored for 5 to 10 days, with continuous glucose monitoring values, heart rate, calories burned, and logged carbohydrate intake synchronized at 1 to 5 minute intervals. Each participant's file contained 15,000 to 20,000 timestamped entries, giving us roughly 14,000 to 15,000 overlapping 200-step windows per participant after preprocessing." },
      { type: "paragraph", content: "Preprocessing had to handle real-world messiness. The raw signals contained symbolic entries like Low and High instead of numeric glucose values, irregular sampling, and short gaps across all channels. We converted symbolic entries to numeric estimates, filled short gaps with linear interpolation, removed implausible spikes, and resampled everything onto a uniform time grid before windowing." },
      { type: "paragraph", content: "The feature engineering layer added the physiological context the model needed to understand why glucose was moving. We computed carbohydrates-on-board using a dual-phase absorption model that tracks how much of a logged meal is still being digested at each timestep, a 60-minute rolling carbohydrate sum, time since last meal, a 15-minute rolling heart rate average, and sinusoidal encodings of hour-of-day and day-of-week to capture circadian effects. These features were injected at every denoising step rather than only at the input, so the model could condition its noise removal on current physiological context throughout the reverse diffusion process." },
      { type: "code", lang: "python", content: `def compute_side_features(df, t):
    # Carbohydrates-on-board: dual-phase absorption model
    cob = 0.0
    for meal_t, carbs in df['meals'][:t]:
        dt = (t - meal_t) * 5          # convert steps to minutes
        cob += carbs * 0.6 * np.exp(-dt / 30)   # fast phase
        cob += carbs * 0.4 * np.exp(-dt / 90)   # slow phase

    rolling_carb   = df['carbs'][max(0, t-12):t].sum()
    meal_times     = [m[0] for m in df['meals'] if m[0] <= t]
    time_since_meal = (t - meal_times[-1]) * 5 if meal_times else 999
    rolling_hr     = df['heart_rate'][max(0, t-3):t].mean()

    hour     = df['timestamp'][t].hour + df['timestamp'][t].minute / 60
    circ_sin = np.sin(2 * np.pi * hour / 24)
    circ_cos = np.cos(2 * np.pi * hour / 24)

    return np.array([cob, rolling_carb, time_since_meal,
                     rolling_hr, circ_sin, circ_cos])


class PersonalizedCSDI(nn.Module):
    def forward(self, x_noisy, cond, side, t):
        g_emb    = self.conv1d(x_noisy)
        cond_emb = self.linear(cond)
        side_emb = self.side_proj(side)
        step_emb = self.sinusoidal(t, dim=128)
        x_in = torch.cat([g_emb, cond_emb, side_emb, step_emb], dim=1)
        return self.unet(x_in)           # transformer-enhanced U-Net

    def p_loss(self, x_0, cond, side, t):
        noise   = torch.randn_like(x_0)
        x_noisy = self.q_sample(x_0, t, noise)
        return F.mse_loss(self.forward(x_noisy, cond, side, t), noise)` },
      { type: "paragraph", content: "We trained one model per participant for 2000 epochs with a batch size of 64 and a learning rate of 1e-3, with a multi-step scheduler to stabilize convergence in the final training phase. Across 45 participants this produced nearly 750,000 windowed training examples total." },
      { type: "heading", content: "Why diffusion and not the alternatives" },
      { type: "paragraph", content: "We tested linear autoregression, LSTMs, GRUs, and Transformers before committing to diffusion. Linear autoregression could not handle the nonlinear post-meal glucose rise. LSTMs and GRUs modeled the sequence structure reasonably but produced only one forecast and were sensitive to irregular sampling gaps. Transformers captured longer-range patterns but consistently smoothed out the sharp postprandial spikes that are clinically the most important features to get right." },
      { type: "paragraph", content: "The fundamental problem with all of these is that they collapse a distribution into a point. In the postprandial window, glucose does not follow a unique deterministic trajectory. Two measurements taken 5 minutes apart with identical histories can diverge significantly over the next hour depending on factors the model cannot observe. A diffusion model addresses this directly: it learns to generate the full distribution of plausible future trajectories, and the spread of that distribution is itself an informative signal about how confident the system should be." },
      { type: "heading", content: "What the results showed" },
      { type: "paragraph", content: "Our model achieved RMSE of **10.81** and MAE of **9.02** on the held-out test windows, compared to 11.13 and 9.32 for vanilla CSDI, 21.56 and 18.59 for LSTM, and 19.48 and 16.92 for Transformer. The gap against LSTM and Transformer was large enough to confirm that the diffusion approach was capturing physiological structure those architectures missed entirely." },
      { type: "paragraph", content: "The distributional metrics told the more interesting story. FID of **5.67** versus 6.734 for CSDI conditional confirmed that the generated trajectories were statistically realistic at the distribution level, not just numerically close. CRPS of **6.45** versus 6.68 for CSDI conditional showed that our full predictive distributions were better calibrated, a result driven directly by the richer multimodal conditioning." },
      { type: "paragraph", content: "The personalization mattered. Training one model per participant allowed each model to learn the specific timing and magnitude of that participant's postprandial response, the point at which carbohydrate absorption peaks for their physiology, how their heart rate signal correlates with their glucose excursions, and what their typical circadian glucose baseline looks like. A shared model would have averaged these individual dynamics into a generic trajectory that fit everyone roughly and nobody precisely." },
    ],
  },
  {
    id: 3,
    slug: "iot-accident-detection",
    color: "#06D6A0",
    title: "Enhancing Road Safety: An IoT-Based Multi-Sensor Accident Detection and Automated Emergency Response System",
    period: "Apr 2024 – Dec 2024",
    tags: ["IoT", "Embedded Systems", "Computer Vision", "CNN", "Arduino"],
    summary: "A multi-sensor in-vehicle system that detects drunk driving, drowsiness, impacts, and road tilt in real time, and automatically dispatches emergency alerts with GPS coordinates on accident detection.",
    description:
      "Built a multi-sensor vehicle safety system that monitors for the leading causes of road accidents in real time, blocks impaired driving before it starts, detects drowsiness before it causes a crash, identifies accidents the moment they happen, and automatically dispatches emergency alerts with GPS coordinates to hospitals and contacts without any input from the driver.",
    highlights: [
      "Built a car safety system that handles three of the most common causes of road accidents: drunk driving, drowsiness, and crashes, all without the driver pressing anything.",
      "The alcohol sensor is wired directly to the ignition. The car cannot start if the driver fails a breath test. No override, no bypass.",
      "Trained a neural network on eye images to detect drowsiness in real time, achieving 91.97% accuracy across three alertness states.",
      "When a crash is detected, the system automatically pulls GPS coordinates and texts the driver's contacts and nearby hospitals without any human input.",
      "Validated the full system end-to-end on a physical model car under simulated crash and impairment scenarios, with every sensor, alert, and dashboard notification confirmed working.",
    ],
    writtenDate: "Dec 2024",
    readTime: "6 min read",
    github: null,
    live: null,
    coverImage: null,
    images: [],
    body: [
      { type: "heading", content: "The question" },
      { type: "paragraph", content: "Overspeeding alone accounted for 72.3% of road accidents and 71.2% of total deaths in India in 2022 according to the Ministry of Road Transport and Highways. Drunk driving and mobile device usage contributed another 8.3% of fatalities. The pattern across all of these causes is the same: a human made a bad decision, or stopped being able to make decisions at all, and the vehicle had no way to intervene." },
      { type: "paragraph", content: "Modern vehicles are already full of sensors. They monitor tire pressure, engine temperature, fuel levels, and dozens of other mechanical parameters. But almost none of this sensor infrastructure is pointed at the driver. The car knows everything about itself and nothing about the person operating it. We wanted to build a system that flipped this: a sensor layer aimed at the driver and the driving context that could catch the failure modes the vehicle's existing electronics completely ignore." },
      { type: "paragraph", content: "The three failure modes we targeted were the ones responsible for the most deaths. Drunk driving is preventable before it starts if you can measure alcohol levels before the engine turns on. Drowsiness is preventable if you can detect it from eye behavior before it causes a lane departure or a collision. And for accidents that happen anyway, the gap between crash and ambulance arrival is often the difference between survival and death. Automating that emergency call and attaching a GPS coordinate to it costs almost nothing and potentially saves everything." },
      { type: "heading", content: "The system architecture" },
      { type: "paragraph", content: "We built the Smart Accident Detection and Response System around an Arduino UNO microcontroller that integrated all sensor inputs and coordinated responses. A NodeMCU module handled cloud connectivity and real-time data transmission to the Blynk IoT platform. Emergency communications ran through a SIM800L GSM module with a SIM card for cellular connectivity, and a NEO-6M GPS unit provided precise location coordinates for incident reporting." },
      { type: "paragraph", content: "The sensor fusion layer had three distinct components targeting the three failure modes. The MQ3 alcohol sensor positioned near the steering wheel measured alcohol vapor concentration in cabin air in the range of 25 to 500 parts per million. The ADXL345 accelerometer mounted under the chassis monitored the vehicle's angle and acceleration profile. The OV7270 camera module mounted in the driver's heads-up display captured the driver's face for drowsiness detection." },
      { type: "paragraph", content: "The alcohol interlock was the most important component for preventing accidents before they start. When the driver turned the ignition, the system prompted them to take a breath test. The relay module controlling power to the drive motor would not close until the alcohol sensor returned a reading below threshold. The engine could not start until the driver passed. During driving, the system continued monitoring cabin air so that alcohol consumed after starting could also trigger an alert." },
      { type: "code", lang: "cpp", content: `#include <Wire.h>
#include <Adafruit_ADXL345_U.h>

const int MQ3_PIN      = A0;
const int RELAY_PIN    = 7;
const int PUSH_BTN     = 2;
const int GRAVITY_BTN  = 3;
const int ALCOHOL_THRESHOLD = 400;   // ~0.08 BAC equivalent in ppm
const int ANGLE_THRESHOLD   = 30;    // MoRTH exceptional gradient (degrees)

Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);

void loop() {
    int alcohol_level = analogRead(MQ3_PIN);

    // Stage 1: Alcohol interlock
    if (digitalRead(PUSH_BTN) == LOW) {
        if (alcohol_level > ALCOHOL_THRESHOLD) {
            digitalWrite(RELAY_PIN, LOW);
            send_gsm_alert("Drunk driving attempt detected");
        } else {
            digitalWrite(RELAY_PIN, HIGH);   // engine enabled
        }
    }

    // Stage 2: Accelerometer tilt detection
    sensors_event_t event;
    accel.getEvent(&event);
    float angle = atan2(event.acceleration.y,
                        event.acceleration.z) * 180.0 / PI;
    if (abs(angle) > ANGLE_THRESHOLD) trigger_emergency();

    // Stage 3: Airbag deployment confirmation
    if (digitalRead(GRAVITY_BTN) == LOW) trigger_emergency();
}

void trigger_emergency() {
    String gps_coords = get_gps_location();
    send_gsm_alert("ACCIDENT DETECTED. Location: " + gps_coords);
    send_blynk_notification(gps_coords);
}` },
      { type: "paragraph", content: "The accident detection logic used two independent signals. The ADXL345 triggered an alert when the vehicle's angle exceeded 30 degrees from horizontal, the exceptional gradient threshold defined by the Indian Roads Congress for the steepest road conditions. The gravity push button placed in front of the airbag system fired only when the airbag physically deployed, confirming head-on collisions where the vehicle's own safety systems had already determined the impact was severe enough. Together these two sensors covered different accident types with complementary detection mechanisms." },
      { type: "heading", content: "The drowsiness detection model" },
      { type: "paragraph", content: "Driver drowsiness was the most technically involved component because it required a real-time computer vision pipeline running on an embedded processor with tight latency requirements. We trained a convolutional neural network on the UMass MRL Eye Dataset, which contains labeled eye images covering a range of alertness and drowsiness states including different lighting conditions, eye shapes, and levels of closure. The model classified each camera frame into one of three states: alert, slightly drowsy, and very drowsy, based solely on eye behavior." },
      { type: "code", lang: "python", content: `def build_drowsiness_cnn(input_shape=(64, 64, 1)):
    """
    Lightweight CNN for real-time drowsiness detection on edge hardware.
    Input:  grayscale eye crop from OV7270 camera module
    Output: Alert (0) / Slightly Drowsy (1) / Very Drowsy (2)
    """
    model = models.Sequential([
        layers.Conv2D(32, (3,3), activation='relu', input_shape=input_shape),
        layers.MaxPooling2D((2,2)),
        layers.Conv2D(64, (3,3), activation='relu'),
        layers.MaxPooling2D((2,2)),
        layers.Conv2D(64, (3,3), activation='relu'),
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(3, activation='softmax'),
    ])
    model.compile(optimizer='adam',
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])
    return model

# Results on 1,457 labeled examples:
# Alert:           Precision 95.2%   Recall 93.7%   F1 94.4%
# Slightly Drowsy: Precision 90.4%   Recall 88.6%   F1 89.5%
# Very Drowsy:     Precision 92.1%   Recall 91.5%   F1 91.8%
# Overall Accuracy: 91.97%` },
      { type: "paragraph", content: "The model achieved **91.97% overall accuracy** across all three classes. The recall numbers told the safety-critical story: **93.7% recall on alert** meant the system very rarely told a driver they were drowsy when they were not, which would be annoying and erode trust. **88.6% recall on slightly drowsy** and **91.5% on very drowsy** meant the system caught the vast majority of real drowsiness events before they progressed to dangerous impairment. We validated the model under daytime, nighttime, and artificial lighting conditions and found consistent accuracy despite the variation in illumination." },
      { type: "heading", content: "End to end validation" },
      { type: "paragraph", content: "We built a miniature car model replacing the engine with a DC motor to simulate the full system under controlled accident scenarios. This let us test all sensor integrations and alert chains without requiring a real vehicle or real accidents. We simulated drunk driving attempts by exposing the alcohol sensor to alcohol vapor before ignition, verified the relay blocked the motor correctly, and confirmed the Blynk cloud dashboard received the alert. We simulated rollovers by tilting the chassis beyond 30 degrees and confirmed the accelerometer triggered the GSM emergency alert with GPS coordinates. We simulated airbag deployment by pressing the gravity push button and confirmed the full emergency chain fired: SMS to emergency contacts, location push to the Blynk dashboard, and hospital notification with coordinates." },
      { type: "paragraph", content: "The Blynk IoT dashboard displayed accelerometer readings in the XYZ plane, the alcohol level on the LDR scale, and the gravity sensor status as a binary 0 or 1, where 1 indicated airbag deployment. All sensor readings, threshold crossings, and alert triggers were logged in real time and visible remotely, which meant the emergency contact or hospital receiving the SMS could also pull up the live dashboard to see what the sensor readings looked like at the moment of impact." },
    ],
  },
];
