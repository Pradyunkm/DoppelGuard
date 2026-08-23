import React, { useState, useEffect } from "react";
import { doppelguardApi } from "../services/doppelguardApi";
import { CrossPlatformResponse } from "../types";
import { 
  Globe, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  UserX,
  ExternalLink,
  Layers
} from "lucide-react";

export const CrossPlatformPage: React.FC = () => {
  const [username, setUsername] = useState("elonmusk");
  const [result, setResult] = useState<CrossPlatformResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async (targetUser?: string) => {
    const queryUser = (targetUser || username).trim();
    if (!queryUser) {
      setError("Please enter a username to audit.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await doppelguardApi.checkCrossPlatform(queryUser);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to complete cross-platform audit.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAudit("elonmusk");
  }, []);

  const sampleHandles = [
    { label: "@elonmusk", handle: "elonmusk", tag: "Targeted VIP" },
    { label: "@vitalikbuterin", handle: "vitalikbuterin", tag: "Targeted VIP" },
    { label: "@sarah_designs_portfolio", handle: "sarah_designs_portfolio", tag: "Creator" },
    { label: "@jio_ambani_giveaway_india", handle: "jio_ambani_giveaway_india", tag: "Phishing Bot" }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs font-bold text-violet-300 font-mono border border-violet-500/30">
              CROSS-PLATFORM MATRIX
            </span>
            <span className="text-xs text-slate-500 font-mono">COORDINATED INAUTHENTIC BEHAVIOR (CIB)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-mono mt-1">
            IDENTITY CONSISTENCY <span className="text-indigo-400">AUDITOR</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Simultaneously correlate handle footprints across Twitter/X, Instagram, LinkedIn, GitHub, YouTube, and Telegram to detect asymmetric clone networks.
          </p>
        </div>
      </div>

      {/* Handle Search Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-mono text-slate-500">
              @
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="elonmusk or vitalikbuterin"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-8 pr-4 text-xs font-mono text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleAudit()}
            />
          </div>

          <button
            onClick={() => handleAudit()}
            disabled={loading}
            className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Auditing Networks...</span>
              </>
            ) : (
              <>
                <Globe className="h-4 w-4" />
                <span>Audit Cross-Platform</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center mr-1">
            <Sparkles className="h-3 w-3 text-indigo-400 mr-1" />
            Quick Presets:
          </span>
          {sampleHandles.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUsername(sample.handle);
                handleAudit(sample.handle);
              }}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:border-indigo-500 hover:bg-slate-900 transition-colors"
            >
              <span>{sample.label}</span>
              <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400">{sample.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
          <div className="flex items-center space-x-2 font-semibold">
            <AlertTriangle className="h-4 w-4" />
            <span>Audit Request Failed</span>
          </div>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Consistency Verdict Summary Banner */}
          <div className={`rounded-3xl border p-6 md:p-8 backdrop-blur-md ${
            result.high_risk_clones_count > 0
              ? "bg-rose-950/20 border-rose-500/40 text-rose-300"
              : "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="rounded-2xl bg-slate-950/60 p-3 ring-1 ring-white/20">
                  {result.high_risk_clones_count > 0 ? (
                    <ShieldAlert className="h-8 w-8 text-rose-400" />
                  ) : (
                    <ShieldCheck className="h-8 w-8 text-emerald-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider font-mono opacity-80">
                      Cross-Platform Verdict
                    </span>
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-mono border border-white/10 font-bold">
                      {result.verdict.replace(/_/g, " ")}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl font-mono mt-1 text-white">
                    @{result.username} — {result.canonical_name}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed opacity-90 max-w-2xl">
                    {result.summary}
                  </p>
                </div>
              </div>

              {/* Consistency Score Meter */}
              <div className="flex flex-col items-center md:items-end justify-center rounded-2xl bg-slate-950/60 p-4 border border-white/10 font-mono">
                <span className="text-[11px] uppercase tracking-wider opacity-80">
                  Consistency Score
                </span>
                <span className="text-3xl font-black text-white mt-1">
                  {result.consistency_score.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Max Age Gap: {result.max_age_divergence_days} days
                </span>
              </div>
            </div>
          </div>

          {/* Platform Footprint Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.platform_details.map((item, idx) => {
              const isSpoof = item.status === "HIGH_RISK_SPOOF";
              const isVerified = item.status === "VERIFIED_AUTHENTIC";
              const isUnclaimed = item.status === "UNCLAIMED";

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-5 transition-all ${
                    isSpoof
                      ? "border-rose-500/50 bg-rose-950/20 shadow-lg shadow-rose-950/30"
                      : isVerified
                      ? "border-emerald-500/40 bg-emerald-950/15"
                      : isUnclaimed
                      ? "border-slate-800 bg-slate-900/30 opacity-60"
                      : "border-slate-800 bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      {item.platform}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                        isSpoof
                          ? "bg-rose-950 text-rose-300 border border-rose-800"
                          : isVerified
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : isUnclaimed
                          ? "bg-slate-800 text-slate-400"
                          : "bg-indigo-950 text-indigo-300 border border-indigo-800"
                      }`}
                    >
                      {item.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {!isUnclaimed ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80"}
                          alt={item.handle}
                          className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-700 bg-slate-800"
                        />
                        <div>
                          <span className="font-mono text-xs font-bold text-white">@{item.handle}</span>
                          <span className="block text-[11px] text-slate-400 font-mono">
                            {item.followers.toLocaleString()} followers • {item.age_days}d old
                          </span>
                        </div>
                      </div>

                      {item.alert && (
                        <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-2.5 text-[11px] text-rose-200">
                          <div className="flex items-center space-x-1.5 font-bold mb-0.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                            <span>High-Risk Alert</span>
                          </div>
                          <p>{item.alert}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-xs text-slate-500 font-mono">
                      <UserX className="mx-auto h-6 w-6 mb-1 opacity-60" />
                      <span>Handle unclaimed on {item.platform}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
