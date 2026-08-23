import React, { useState, useEffect } from "react";
import { getApiBaseUrl, setApiBaseUrl, doppelguardApi } from "../services/doppelguardApi";
import { 
  Settings, 
  Server, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Save, 
  RotateCcw, 
  Code, 
  Cpu,
  Layers,
  Sparkles
} from "lucide-react";

export const SettingsPage: React.FC = () => {
  const [apiUrl, setApiUrl] = useState<string>(getApiBaseUrl() || "");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  // Scoring Weights state for previewing rules
  const [weights, setWeights] = useState({
    handle_mimicry: 25,
    text_similarity: 20,
    behavioral_anomaly: 25,
    image_similarity: 15,
    link_suspicion: 15,
  });

  const checkBackendHealth = async () => {
    setCheckingHealth(true);
    try {
      const data = await doppelguardApi.checkHealth();
      setHealthStatus({ online: true, data });
    } catch (err: any) {
      setHealthStatus({ online: false, error: err.message });
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const handleSaveApiUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setApiBaseUrl(apiUrl);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    checkBackendHealth();
  };

  const handleResetApiUrl = () => {
    setApiUrl("");
    setApiBaseUrl("");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    checkBackendHealth();
  };

  const handleWeightChange = (key: keyof typeof weights, val: number) => {
    setWeights((prev) => ({ ...prev, [key]: val }));
  };

  const totalWeight = Object.values(weights).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-mono">
          ENGINE CONFIGURATION & <span className="text-indigo-400">SETTINGS</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage backend endpoints, tune signal correlation weights, and inspect system forensics architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Col: Backend API Settings (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* API Connection Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 font-mono">
                <Server className="h-5 w-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase">Backend Service Gateway</h3>
              </div>
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-mono text-slate-400">
                FastAPI / Express
              </span>
            </div>

            <form onSubmit={handleSaveApiUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target API Base URL
                </label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="e.g. http://localhost:8000 (leave empty for integrated runner)"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-mono text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                  id="input-backend-url"
                />
                <p className="mt-1.5 text-[11px] text-slate-500">
                  Default (empty) connects to the current host origin. Enter <code className="text-indigo-400">http://localhost:8000</code> when running standalone Python Uvicorn.
                </p>
              </div>

              {/* Status Ping Display */}
              <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 font-mono">
                    Gateway Health Probe:
                  </span>
                  <button
                    type="button"
                    onClick={checkBackendHealth}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                  >
                    <RefreshCw className={`h-3 w-3 ${checkingHealth ? "animate-spin" : ""}`} />
                    <span>Ping Now</span>
                  </button>
                </div>

                <div className="mt-2 flex items-center space-x-2">
                  {healthStatus?.online ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-mono text-emerald-300">
                        ONLINE — {healthStatus.data.service || "DoppelGuard Engine"} (v{healthStatus.data.version || "1.0"})
                      </span>
                    </>
                  ) : healthStatus ? (
                    <>
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                      <span className="text-xs font-mono text-amber-300">
                        {healthStatus.error || "Offline / Fallback mode active"}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500">Checking...</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetApiUrl}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset to Integrated</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
                  id="btn-save-api-url"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save URL</span>
                </button>
              </div>

              {savedSuccess && (
                <div className="rounded-lg bg-emerald-500/10 p-2 text-center text-xs font-medium text-emerald-300 border border-emerald-500/30">
                  Settings successfully persisted to local client storage.
                </div>
              )}
            </form>
          </div>

          {/* Scoring Rules Tuner */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 font-mono">
                <Sliders className="h-5 w-5 text-violet-400" />
                <h3 className="text-sm font-bold text-white uppercase">Scoring Weight Distribution</h3>
              </div>
              <span className={`text-xs font-mono font-bold ${totalWeight === 100 ? "text-emerald-400" : "text-amber-400"}`}>
                Total: {totalWeight}%
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              These weights mirror the configuration parameters declared in <code className="text-indigo-300 font-mono">backend/scoring/rules.py</code>. Adjusting them modifies signal contributions.
            </p>

            <div className="space-y-4 text-xs font-mono">
              {[
                { key: "handle_mimicry", label: "Handle & Target Mimicry Weight", desc: "Levenshtein, prefixes (_official, _support), homoglyphs" },
                { key: "behavioral_anomaly", label: "Behavioral & Age Velocity Weight", desc: "Account age, mass-following ratios, velocity anomalies" },
                { key: "text_similarity", label: "Text & Scam Lexical Weight", desc: "Giveaway triggers, phishing keywords, urgency phrases" },
                { key: "image_similarity", label: "Visual Likeness / Avatar Weight", desc: "Avatar URL matching, reverse image search proxies" },
                { key: "link_suspicion", label: "External Link Reputation Weight", desc: "Shorteners (bit.ly, t.me), suspicious TLDs (.xyz, .top)" },
              ].map((item) => {
                const k = item.key as keyof typeof weights;
                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex justify-between text-slate-300 font-semibold">
                      <span>{item.label}</span>
                      <span className="text-white">{weights[k]}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      value={weights[k]}
                      onChange={(e) => handleWeightChange(k, parseInt(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Architecture & Modular Forensics Guide (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center space-x-2 font-mono border-b border-slate-800 pb-3">
              <Cpu className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white uppercase">ML Upgrade Roadmap</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              DoppelGuard is architected with strictly isolated, swappable scoring components in <code className="text-indigo-300 font-mono">backend/scoring/</code>:
            </p>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="font-bold text-indigo-400">1. rules.py</span>
                <p className="text-slate-400 text-[10px] mt-0.5">Weighted rule configs, known entity pattern dictionary, and band boundaries.</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="font-bold text-indigo-400">2. text_signal.py</span>
                <p className="text-slate-400 text-[10px] mt-0.5">Swap with <code className="text-slate-300">SentenceTransformers</code> or <code className="text-slate-300">spaCy</code> cosine embeddings.</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="font-bold text-indigo-400">3. image_signal.py</span>
                <p className="text-slate-400 text-[10px] mt-0.5">Swap with <code className="text-slate-300">CLIP</code> / <code className="text-slate-300">FaceNet</code> facial similarity vectors.</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="font-bold text-indigo-400">4. behavior_signal.py</span>
                <p className="text-slate-400 text-[10px] mt-0.5">Temporal posting velocity and Graph Neural Network botnet clustering.</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="font-bold text-indigo-400">5. engine.py</span>
                <p className="text-slate-400 text-[10px] mt-0.5">Correlation engine computing aggregate risk score (0-100), band, and actions.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Database Strategy
            </h4>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Configured with SQLAlchemy for zero-setup SQLite out of the box, with seamless PostgreSQL support by updating <code className="text-indigo-300 font-mono">DATABASE_URL</code> in <code className="text-indigo-300 font-mono">backend/.env</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
