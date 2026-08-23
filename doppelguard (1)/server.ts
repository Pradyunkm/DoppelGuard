import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

interface ProfileInput {
  username: string;
  name?: string;
  bio?: string;
  photo_url?: string;
  followers?: number;
  following?: number;
  account_age_days?: number;
  links?: string[];
}

interface SignalItem {
  name: string;
  contribution: number;
  explanation: string;
}

interface ProfileAnalysisResponse {
  id: string;
  risk_score: number;
  risk_band: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  signals: SignalItem[];
  likely_target: string | null;
  threat_type: "fake_bot" | "impersonation" | "recruitment_scam" | "brand_impersonation" | "suspicious" | "none";
  recommended_action: string;
  created_at: string;
  profile: ProfileInput;
}

// In-memory reports store seeded with high-fidelity historical data
let reportsStore: ProfileAnalysisResponse[] = [
  {
    id: "rep-101",
    risk_score: 94.5,
    risk_band: "CRITICAL",
    likely_target: "Elon Musk",
    threat_type: "impersonation",
    recommended_action: "Immediate Action Required: Block and report this profile for severe active impersonation targeting Elon Musk. Notify compliance team and issue a user warning advisory.",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    profile: {
      username: "elonmusk_official_eth",
      name: "Elon Musk [Official Tesla Live]",
      bio: "Founder of Tesla & SpaceX. Celebrating Cybertruck delivery with 5,000 ETH Giveaway! Click link to claim now.",
      photo_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
      followers: 340,
      following: 4890,
      account_age_days: 3,
      links: ["https://t.me/tesla_official_giveaway", "http://bit.ly/claim-eth-now"]
    },
    signals: [
      { name: "Handle & Target Mimicry", contribution: 24.5, explanation: "Detected entity spoofing pattern against Elon Musk with '_official_eth' suffix." },
      { name: "Behavioral Anomaly & Age Velocity", contribution: 25.0, explanation: "Brand new account created 3 days ago; aggressive mass-following ratio (4890 following vs 340 followers)." },
      { name: "Text & Lexical Scam Triggers", contribution: 20.0, explanation: "High risk text pattern detected. Matched scam/urgency keywords: giveaway, send eth, dm to claim, official support." },
      { name: "External Link Credibility", contribution: 15.0, explanation: "Profile directs users to unverified/shortened external endpoints (bit.ly, t.me)." },
      { name: "Visual Asset & Avatar Likeness", contribution: 10.0, explanation: "Custom avatar URL matches high-profile public figure headshot." }
    ]
  },
  {
    id: "rep-102",
    risk_score: 87.0,
    risk_band: "CRITICAL",
    likely_target: "Vitalik Buterin",
    threat_type: "impersonation",
    recommended_action: "Immediate Action Required: Suspend direct messaging and flag for credential harvesting investigation.",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    profile: {
      username: "vitalik_eth_support_desk",
      name: "Vitalik Buterin (Community Desk)",
      bio: "Ethereum core developer. Resolving Metamask and ERC20 wallet transfer issues. Send DM for assistance.",
      photo_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      followers: 120,
      following: 3200,
      account_age_days: 12,
      links: ["https://t.me/eth_support_desk_bot"]
    },
    signals: [
      { name: "Handle & Target Mimicry", contribution: 22.0, explanation: "Detected entity spoofing pattern against Vitalik Buterin." },
      { name: "Behavioral Anomaly & Age Velocity", contribution: 23.0, explanation: "Recently created account (12 days old); mass-following ratio." },
      { name: "Text & Lexical Scam Triggers", contribution: 22.0, explanation: "Contains unverified authority assertions and support phishing keywords." },
      { name: "External Link Credibility", contribution: 12.0, explanation: "Directs to unverified Telegram bot support link." },
      { name: "Visual Asset & Avatar Likeness", contribution: 8.0, explanation: "Cloned public avatar image signature." }
    ]
  },
  {
    id: "rep-103",
    risk_score: 78.0,
    risk_band: "HIGH",
    likely_target: "Sundar Pichai",
    threat_type: "recruitment_scam",
    recommended_action: "Enforce Secondary Verification: Restrict outbound messaging and flag malicious phishing link for takedown.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    profile: {
      username: "google_careers_recruitment",
      name: "Google Talent Acquisition HR",
      bio: "Official Global Recruiting Team at Google. Hiring remote Software Engineers, PMs, and Designers. Salary $120k-$240k.",
      photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      followers: 950,
      following: 1800,
      account_age_days: 21,
      links: ["https://google-careers-portal.top/apply", "https://wa.me/1987654321"]
    },
    signals: [
      { name: "Handle & Target Mimicry", contribution: 21.0, explanation: "Target mimicry against Google corporate recruitment." },
      { name: "Behavioral Anomaly & Age Velocity", contribution: 18.0, explanation: "Young account created 21 days ago mimicking major enterprise brand." },
      { name: "Text & Lexical Scam Triggers", contribution: 19.0, explanation: "Matched high-risk recruitment fraud indicators (unrealistic remote hiring, salary solicitation)." },
      { name: "External Link Credibility", contribution: 15.0, explanation: "Phishing TLD (.top) masquerading as official Google careers domain." },
      { name: "Visual Asset & Avatar Likeness", contribution: 5.0, explanation: "Stock corporate recruiter headshot." }
    ]
  },
  {
    id: "rep-104",
    risk_score: 8.5,
    risk_band: "LOW",
    likely_target: null,
    threat_type: "none",
    recommended_action: "Standard Operating Status: No immediate mitigation necessary. Profile metrics align with normal user interaction patterns.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    profile: {
      username: "sarah_designs_portfolio",
      name: "Sarah Jenkins | Product Designer",
      bio: "Senior UI/UX Designer @ TechFlow. Sharing design systems, case studies, and minimalist wireframes.",
      photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      followers: 5420,
      following: 480,
      account_age_days: 780,
      links: ["https://sarahjenkins.design", "https://dribbble.com/sjenk"]
    },
    signals: [
      { name: "Handle & Target Mimicry", contribution: 0.0, explanation: "No celebrity or entity spoofing patterns detected." },
      { name: "Behavioral Anomaly & Age Velocity", contribution: 2.0, explanation: "Mature account (780 days old) with natural follower/following ratio." },
      { name: "Text & Lexical Scam Triggers", contribution: 1.5, explanation: "Bio text contains standard portfolio and career descriptions." },
      { name: "External Link Credibility", contribution: 3.0, explanation: "Verified custom top-level domain and official Dribbble portfolio." },
      { name: "Visual Asset & Avatar Likeness", contribution: 2.0, explanation: "Original portrait avatar." }
    ]
  }
];

// Helper functions for analysis
const KNOWN_TARGETS: Record<string, string[]> = {
  "Elon Musk": ["elon", "musk", "tesla", "spacex", "x_official", "xceo"],
  "Vitalik Buterin": ["vitalik", "buterin", "ethereum", "eth_foundation", "erc20"],
  "Changpeng Zhao (CZ)": ["cz_binance", "changpeng", "binance_vip", "binance_help"],
  "Sam Altman": ["sam_altman", "sama", "openai", "chatgpt_official"],
  "Sundar Pichai": ["sundar", "pichai", "google_ceo", "alphabet"],
  "Apple Support": ["apple_care", "apple_support", "tim_cook_official"],
  "Meta Security": ["meta_support", "instagram_verify", "facebook_security", "meta_badge"]
};

const HIGH_RISK_KEYWORDS = [
  "giveaway", "airdrop", "send eth", "send btc", "official support",
  "whatsapp me", "dm to claim", "crypto investment", "forex trader",
  "recovery specialist", "guaranteed profit", "verify badge",
  "hiring urgently", "telegram link in bio", "customer support representative", "backup account"
];

const SUSPICIOUS_DOMAINS = [
  "bit.ly", "tinyurl.com", "t.me", "wa.me", "cutt.ly", "linktr.ee",
  ".xyz", ".top", ".buzz", ".ru", ".tk", ".cf", ".click", ".vip", ".cc"
];

function levenshtein(s1: string, s2: string): number {
  const str1 = (s1 || "").toLowerCase().trim();
  const str2 = (s2 || "").toLowerCase().trim();
  if (str1 === str2) return 100;
  if (!str1 || !str2) return 0;
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  const dist = dp[m][n];
  const maxL = Math.max(m, n);
  return Math.max(0, Math.min(100, Math.round((1 - dist / maxL) * 100)));
}

function analyzeProfile(profile: ProfileInput): Omit<ProfileAnalysisResponse, "id" | "created_at"> {
  const username = (profile.username || "").toLowerCase().trim();
  const name = (profile.name || "").toLowerCase().trim();
  const bio = (profile.bio || "").toLowerCase().trim();
  const photo_url = (profile.photo_url || "").trim();
  const followers = Number(profile.followers) || 0;
  const following = Number(profile.following) || 0;
  const age = Number(profile.account_age_days) || 0;
  const links = profile.links || [];

  const corpus = `${username} ${name} ${bio}`;

  // 1. Target identification
  let likely_target: string | null = null;
  let targetScore = 0;
  for (const [targetName, patterns] of Object.entries(KNOWN_TARGETS)) {
    const matches = patterns.filter(p => corpus.includes(p)).length;
    if (matches > 0 && (!likely_target || matches * 30 > targetScore)) {
      likely_target = targetName;
      targetScore = Math.min(matches * 35, 95);
    }
  }

  // 2. Handle Mimicry Signal (Weight: 0.25)
  let handleRaw = 0;
  if (likely_target) handleRaw += targetScore * 0.7;
  if (["_off", "support", "help", "giveaway", "claim", "bot", "vip"].some(s => username.includes(s))) {
    handleRaw += 35;
  }
  if (/\d{4,}$/.test(username)) handleRaw += 20;
  if (username.includes("__")) handleRaw += 15;
  handleRaw = Math.min(handleRaw, 100);

  // 3. Behavioral Anomaly Signal (Weight: 0.25)
  let behavRaw = 0;
  const behavFlags: string[] = [];
  if (age <= 3) {
    behavRaw += 35;
    behavFlags.push(`Brand new account created only ${age} days ago`);
  } else if (age <= 14) {
    behavRaw += 25;
    behavFlags.push(`Recently created account (${age} days old)`);
  } else if (age <= 45) {
    behavRaw += 12;
    behavFlags.push(`Young account (${age} days old)`);
  }

  if (following > 400 && followers < 50) {
    behavRaw += 30;
    behavFlags.push(`Aggressive mass-following ratio (${following} following vs ${followers} followers)`);
  } else if (following > 1000 && followers < 200) {
    behavRaw += 20;
    behavFlags.push(`Skewed following-to-follower ratio (${following} : ${followers})`);
  }
  behavRaw = Math.min(behavRaw, 100);

  // 4. Text & Lexical Signal (Weight: 0.20)
  let textRaw = 0;
  const matchedKeywords: string[] = [];
  for (const kw of HIGH_RISK_KEYWORDS) {
    if (corpus.includes(kw)) {
      matchedKeywords.push(kw);
      textRaw += 22;
    }
  }
  if (corpus.includes("0x") || corpus.includes("t.me/") || corpus.includes("wa.me/")) {
    textRaw += 18;
    matchedKeywords.push("direct chat/wallet link");
  }
  textRaw = Math.min(textRaw, 100);

  // 5. External Link Credibility (Weight: 0.15)
  let linkRaw = 0;
  const badLinks = links.filter(l => SUSPICIOUS_DOMAINS.some(d => l.toLowerCase().includes(d)));
  if (badLinks.length > 0) {
    linkRaw = Math.min(badLinks.length * 45, 100);
  } else if (bio.includes("t.me/") || bio.includes("wa.me/")) {
    linkRaw = 40;
  }

  // 6. Visual Asset & Avatar Likeness (Weight: 0.15)
  let imgRaw = 10;
  if (!photo_url || photo_url.includes("default") || photo_url.includes("placeholder")) {
    imgRaw = 40;
  } else if (["tempavatar", "imghoster", ".top", ".cc"].some(d => photo_url.includes(d))) {
    imgRaw = 75;
  } else if (likely_target) {
    imgRaw = 65; // Matches high profile entity pattern
  }

  // Weighted total (Sum of weights = 1.0)
  const weightedScore = (
    (handleRaw * 0.25) +
    (behavRaw * 0.25) +
    (textRaw * 0.20) +
    (linkRaw * 0.15) +
    (imgRaw * 0.15)
  );

  const risk_score = Math.round(Math.min(Math.max(weightedScore, 0), 100) * 10) / 10;

  let risk_band: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
  if (risk_score >= 85) risk_band = "CRITICAL";
  else if (risk_score >= 65) risk_band = "HIGH";
  else if (risk_score >= 35) risk_band = "MEDIUM";

  let threat_type: "fake_bot" | "impersonation" | "recruitment_scam" | "brand_impersonation" | "suspicious" | "none" = "none";
  if (risk_score >= 35) {
    if (likely_target && ["apple", "google", "meta", "binance", "support"].some(k => likely_target!.toLowerCase().includes(k))) {
      threat_type = "brand_impersonation";
    } else if (likely_target) {
      threat_type = "impersonation";
    } else if (bio.includes("hiring") || bio.includes("recruiter") || bio.includes("salary")) {
      threat_type = "recruitment_scam";
    } else if (behavFlags.some(f => f.includes("mass-following")) || (following > 1000 && followers < 50)) {
      threat_type = "fake_bot";
    } else if (risk_score >= 65) {
      threat_type = "impersonation";
    } else {
      threat_type = "suspicious";
    }
  }

  let recommended_action = "Standard Operating Status: No immediate mitigation necessary. Profile metrics align with normal user interaction patterns.";
  if (risk_band === "CRITICAL") {
    recommended_action = `Immediate Action Required: Block and report this profile for severe active impersonation${likely_target ? ` targeting ${likely_target}` : ""}. Notify compliance team and issue a user warning advisory.`;
  } else if (risk_band === "HIGH") {
    recommended_action = "Enforce Secondary Verification: Restrict outbound direct messaging privileges and request government ID or official domain email verification.";
  } else if (risk_band === "MEDIUM") {
    recommended_action = "Flag for Manual Queue: Add profile to human moderator review watchlist; monitor follower acquisition velocity and link click-throughs.";
  }

  const signals: SignalItem[] = [
    {
      name: "Handle & Target Mimicry",
      contribution: Math.round(handleRaw * 0.25 * 10) / 10,
      explanation: `Score: ${handleRaw}/100. ${likely_target ? `Detected entity spoofing pattern against ${likely_target}.` : "No explicit celebrity or brand pattern in handle."}`
    },
    {
      name: "Behavioral Anomaly & Age Velocity",
      contribution: Math.round(behavRaw * 0.25 * 10) / 10,
      explanation: behavFlags.length > 0 ? behavFlags.join("; ") + "." : `Account metrics are balanced (Age: ${age}d, ${followers} followers, ${following} following).`
    },
    {
      name: "Text & Lexical Scam Triggers",
      contribution: Math.round(textRaw * 0.20 * 10) / 10,
      explanation: matchedKeywords.length > 0 ? `Trigger keywords detected: ${matchedKeywords.join(", ")}.` : "Bio text contains standard conversational phrases with no critical scam triggers."
    },
    {
      name: "External Link Credibility",
      contribution: Math.round(linkRaw * 0.15 * 10) / 10,
      explanation: `Evaluated ${links.length} destination links. ${linkRaw > 30 ? "Detected high-risk redirect or shortener URLs." : "Links appear clean or absent."}`
    },
    {
      name: "Visual Asset & Avatar Likeness",
      contribution: Math.round(imgRaw * 0.15 * 10) / 10,
      explanation: photo_url ? "Custom avatar URL inspected." : "Profile uses a default or missing avatar image."
    }
  ];

  return {
    risk_score,
    risk_band,
    signals,
    likely_target,
    threat_type,
    recommended_action,
    profile
  };
}

function compareProfiles(profA: ProfileInput, profB: ProfileInput) {
  const simUser = levenshtein(profA.username, profB.username);
  const simName = levenshtein(profA.name || "", profB.name || "");
  
  // Bio word token overlap
  const wordsA = new Set((profA.bio || "").toLowerCase().split(/\s+/).filter(Boolean));
  const wordsB = new Set((profB.bio || "").toLowerCase().split(/\s+/).filter(Boolean));
  let simBio = 0;
  if (wordsA.size > 0 && wordsB.size > 0) {
    let inter = 0;
    wordsB.forEach(w => { if (wordsA.has(w)) inter++; });
    const union = new Set([...Array.from(wordsA), ...Array.from(wordsB)]).size;
    simBio = Math.round((inter / union) * 100);
  }

  // Photo match
  let simPhoto = 15;
  if (profA.photo_url && profB.photo_url) {
    if (profA.photo_url.trim().toLowerCase() === profB.photo_url.trim().toLowerCase()) {
      simPhoto = 100;
    } else if (profA.photo_url.split("/").pop() === profB.photo_url.split("/").pop()) {
      simPhoto = 90;
    } else {
      simPhoto = 45;
    }
  }

  const evidence: { name: string; explanation: string }[] = [];
  if (simName >= 85) {
    evidence.push({
      name: "High Display Name Collision",
      explanation: `Display names '${profA.name}' and '${profB.name}' share a ${simName}% lexical match.`
    });
  }
  if (simUser >= 75) {
    evidence.push({
      name: "Handle Typo-Squatting / Mutation",
      explanation: `Suspect handle '@${profB.username}' is a direct mutation (${simUser}% match) of '@${profA.username}'.`
    });
  } else if (simUser < 40 && simName > 80) {
    evidence.push({
      name: "Disparate Handle Cloned Display Name",
      explanation: `Handle '@${profB.username}' differs significantly while cloning the identity name '${profA.name}'.`
    });
  }
  if (simPhoto >= 80) {
    evidence.push({
      name: "Identical Profile Picture",
      explanation: `Avatar asset match is ${simPhoto}%, strongly indicating cloned profile visuals.`
    });
  }

  const ageA = Number(profA.account_age_days) || 0;
  const ageB = Number(profB.account_age_days) || 0;
  const follA = Number(profA.followers) || 0;
  const follB = Number(profB.followers) || 0;
  const ageDiff = ageA - ageB;

  if (ageDiff > 180 && follA > (follB * 5)) {
    evidence.push({
      name: "Severe Age & Follower Asymmetry",
      explanation: `Profile A was created ${ageDiff} days earlier and possesses ${follA} followers vs ${follB} on Profile B.`
    });
  }

  const linksB = (profB.links || []).map(l => l.toLowerCase());
  const linksA = (profA.links || []).map(l => l.toLowerCase());
  const bioBLower = (profB.bio || "").toLowerCase();
  const claimsDual = bioBLower.includes("backup") || bioBLower.includes("2nd account") || bioBLower.includes("alt account");
  const hasMutualBacklink = linksB.some(l => l.includes(profA.username.toLowerCase())) || linksA.some(l => l.includes(profB.username.toLowerCase()));

  const overallSim = (simUser * 0.3) + (simName * 0.3) + (simBio * 0.2) + (simPhoto * 0.2);

  let relationship: "legitimate_dual_account" | "impersonation" | "ambiguous" = "ambiguous";
  let confidence = 65;

  if (hasMutualBacklink || (claimsDual && simUser < 85 && ageB > 60)) {
    relationship = "legitimate_dual_account";
    confidence = 88;
    evidence.push({
      name: "Authentic Cross-Referencing",
      explanation: "Profile B explicitly references or cross-links legitimate ownership without deceptive call-to-actions."
    });
  } else if (overallSim >= 60 && (ageDiff > 30 || follA > (follB * 3))) {
    relationship = "impersonation";
    confidence = Math.min(96, Math.round(50 + overallSim * 0.45));
  } else if (overallSim < 35) {
    relationship = "ambiguous";
    confidence = 72;
    evidence.push({
      name: "Low Overall Similarity",
      explanation: "Profiles share negligible visual, textural, or behavioral characteristics."
    });
  } else {
    relationship = "ambiguous";
    confidence = 65;
    evidence.push({
      name: "Inconclusive Heuristics",
      explanation: "Signals show partial overlap without definitive impersonation intent or proven authorization."
    });
  }

  return {
    similarity: {
      username: simUser,
      name: simName,
      bio: simBio,
      photo: simPhoto
    },
    relationship,
    evidence,
    confidence
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS middleware
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check endpoints
  const handleHealth = (req: express.Request, res: express.Response) => {
    res.json({
      status: "ok",
      service: "DoppelGuard Impersonation Risk Engine",
      version: "1.0.0",
      reports_count: reportsStore.length
    });
  };
  app.get("/health", handleHealth);
  app.get("/api/health", handleHealth);

  // Profile Check endpoint
  const handleCheck = (req: express.Request, res: express.Response) => {
    try {
      const profile: ProfileInput = req.body;
      if (!profile || !profile.username) {
        return res.status(400).json({ error: "username field is required in request body" });
      }

      const analysis = analyzeProfile(profile);
      const newReport: ProfileAnalysisResponse = {
        ...analysis,
        id: `rep-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        created_at: new Date().toISOString()
      };

      reportsStore.unshift(newReport);
      if (reportsStore.length > 200) reportsStore = reportsStore.slice(0, 200);

      res.json(newReport);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to analyze profile" });
    }
  };
  app.post("/profile/check", handleCheck);
  app.post("/api/profile/check", handleCheck);

  // Profile Compare endpoint
  const handleCompare = (req: express.Request, res: express.Response) => {
    try {
      const { profileA, profileB } = req.body;
      if (!profileA || !profileB || !profileA.username || !profileB.username) {
        return res.status(400).json({ error: "Both profileA and profileB with usernames are required" });
      }

      const result = compareProfiles(profileA, profileB);
      res.json({
        ...result,
        id: `comp-${Date.now()}`,
        created_at: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to compare profiles" });
    }
  };
  app.post("/profile/compare", handleCompare);
  app.post("/api/profile/compare", handleCompare);

  // Reports endpoint
  const handleGetReports = (req: express.Request, res: express.Response) => {
    const { band, threat_type, search } = req.query;
    let filtered = [...reportsStore];

    if (band && typeof band === "string") {
      filtered = filtered.filter(r => r.risk_band.toUpperCase() === band.toUpperCase());
    }
    if (threat_type && typeof threat_type === "string") {
      filtered = filtered.filter(r => r.threat_type === threat_type);
    }
    if (search && typeof search === "string") {
      const q = search.toLowerCase();
      filtered = filtered.filter(r => 
        r.profile.username.toLowerCase().includes(q) ||
        (r.profile.name && r.profile.name.toLowerCase().includes(q)) ||
        (r.likely_target && r.likely_target.toLowerCase().includes(q))
      );
    }

    res.json(filtered);
  };
  app.get("/reports", handleGetReports);
  app.get("/api/reports", handleGetReports);

  // Delete report endpoint
  const handleDeleteReport = (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    reportsStore = reportsStore.filter(r => r.id !== id);
    res.json({ status: "deleted", id });
  };
  app.delete("/reports/:id", handleDeleteReport);
  app.delete("/api/reports/:id", handleDeleteReport);

  // Vite middleware for dev / static for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DoppelGuard server running on http://localhost:${PORT}`);
  });
}

startServer();
