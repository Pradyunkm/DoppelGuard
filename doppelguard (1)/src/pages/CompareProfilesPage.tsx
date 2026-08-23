import React, { useState } from "react";
import { ProfileInput, CompareResponse } from "../types";
import { SAMPLE_PROFILES } from "../data/sampleProfiles";
import { doppelguardApi } from "../services/doppelguardApi";
import { ProfileCard } from "../components/ProfileCard";
import { 
  GitCompare, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  HelpCircle, 
  Play, 
  RotateCcw,
  CheckCircle2,
  FileCheck
} from "lucide-react";

export const CompareProfilesPage: React.FC = () => {
  // Preset selector
  const [selectedPairIndex, setSelectedPairIndex] = useState<number>(0);

  // Profile A: Reference
  const [profileA, setProfileA] = useState<ProfileInput>(
    SAMPLE_PROFILES[0].comparisonTarget || {
      username: "elonmusk",
      name: "Elon Musk",
      bio: "Mars & Cars, Chips & Starlink",
      photo_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
      followers: 180000000,
      following: 750,
      account_age_days: 5200,
      links: ["https://x.com/elonmusk", "https://tesla.com"]
    }
  );

  // Profile B: Suspect / Candidate
  const [profileB, setProfileB] = useState<ProfileInput>(
    SAMPLE_PROFILES[0].profile
  );

  // Result state
  const [result, setResult] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load preset pair
  const handleSelectPresetPair = (index: number) => {
    setSelectedPairIndex(index);
    const sample = SAMPLE_PROFILES[index];
    if (sample && sample.comparisonTarget) {
      setProfileA(sample.comparisonTarget);
      setProfileB(sample.profile);
      setResult(null);
    }
  };

  // Run Comparison
  const handleRunComparison = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileA.username || !profileB.username) {
      setError("Both profiles require at least a username handle.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const compResult = await doppelguardApi.compareProfiles(profileA, profileB);
      setResult(compResult);
    } catch (err: any) {
      setError(err.message || "Failed to compare profiles.");
    } finally {
      setLoading(false);
    }
  };

  const verdictConfig = {
    impersonation: {
      label: "Malicious Impersonation Detected",
      bg: "bg-rose-500/15 text-rose-300 border-rose-500/40",
      icon: Flame,
      desc: "Profile B demonstrates severe lexical/visual mimicry of Profile A with unverified ownership or high-risk scam indicators.",
    },
    legitimate_dual_account: {
      label: "Legitimate Dual / Secondary Account",
      bg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
      icon: ShieldCheck,
      desc: "Profile B appears to be an authorized secondary, portfolio, or backup account affiliated with Profile A.",
    },
    ambiguous: {
      label: "Ambiguous / Inconclusive Overlap",
      bg: "bg-amber-500/15 text-amber-300 border-amber-500/40",
      icon: HelpCircle,
      desc: "Profiles exhibit partial surface similarity without definitive evidence of either malicious intent or authorized linkage.",
    },
  }[result?.relationship || "ambiguous"];

  const VerdictIcon = verdictConfig.icon;

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-mono">
            DUAL PROFILE <span className="text-indigo-400">COMPARATOR</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Compare two profiles side-by-side to compute similarity vectors, forensic evidence, and identity verdict.
          </p>
        </div>

        {/* Preset pairs dropdown */}
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <span className="text-xs font-semibold text-slate-300">Preset Pairs:</span>
          <select
            value={selectedPairIndex}
            onChange={(e) => handleSelectPresetPair(parseInt(e.target.value))}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none"
            id="preset-compare-select"
          >
            {SAMPLE_PROFILES.filter((p) => p.comparisonTarget).map((p, idx) => (
              <option key={p.id} value={idx}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-4 text-xs text-rose-200">
          <div className="flex items-center space-x-2 font-semibold">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <span>Comparison Failed</span>
          </div>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Input Form Workbench */}
      <form onSubmit={handleRunComparison} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Profile A: Reference Target */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Profile A (Reference / Authentic)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Baseline Target</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Handle</label>
                <input
                  type="text"
                  required
                  value={profileA.username}
                  onChange={(e) => setProfileA({ ...profileA, username: e.target.value })}
                  placeholder="elonmusk"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Display Name</label>
                <input
                  type="text"
                  value={profileA.name || ""}
                  onChange={(e) => setProfileA({ ...profileA, name: e.target.value })}
                  placeholder="Elon Musk"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={profileA.bio || ""}
                  onChange={(e) => setProfileA({ ...profileA, bio: e.target.value })}
                  placeholder="Mars & Cars..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Followers</label>
                  <input
                    type="number"
                    value={profileA.followers || 0}
                    onChange={(e) => setProfileA({ ...profileA, followers: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Following</label>
                  <input
                    type="number"
                    value={profileA.following || 0}
                    onChange={(e) => setProfileA({ ...profileA, following: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Age (days)</label>
                  <input
                    type="number"
                    value={profileA.account_age_days || 0}
                    onChange={(e) => setProfileA({ ...profileA, account_age_days: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Profile B: Suspect Candidate */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
                Profile B (Candidate / Suspect)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Audited Entity</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Handle</label>
                <input
                  type="text"
                  required
                  value={profileB.username}
                  onChange={(e) => setProfileB({ ...profileB, username: e.target.value })}
                  placeholder="elonmusk_official_eth"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-white focus:border-rose-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Display Name</label>
                <input
                  type="text"
                  value={profileB.name || ""}
                  onChange={(e) => setProfileB({ ...profileB, name: e.target.value })}
                  placeholder="Elon Musk [Official Tesla Live]"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-rose-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={profileB.bio || ""}
                  onChange={(e) => setProfileB({ ...profileB, bio: e.target.value })}
                  placeholder="ETH Giveaway..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white focus:border-rose-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Followers</label>
                  <input
                    type="number"
                    value={profileB.followers || 0}
                    onChange={(e) => setProfileB({ ...profileB, followers: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Following</label>
                  <input
                    type="number"
                    value={profileB.following || 0}
                    onChange={(e) => setProfileB({ ...profileB, following: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Age (days)</label>
                  <input
                    type="number"
                    value={profileB.account_age_days || 0}
                    onChange={(e) => setProfileB({ ...profileB, account_age_days: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Comparison Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-500 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-violet-600/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            id="btn-run-compare"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Computing Comparison Vector...</span>
              </>
            ) : (
              <>
                <GitCompare className="h-4 w-4" />
                <span>Execute Profile Correlation (POST /profile/compare)</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comparison Analysis Results Section */}
      {result && (
        <div className="space-y-6 pt-6 border-t border-slate-800">
          {/* Verdict Banner */}
          <div className={`rounded-3xl border p-6 md:p-8 backdrop-blur-md ${verdictConfig.bg}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="rounded-2xl bg-slate-950/50 p-3 ring-1 ring-white/20">
                  <VerdictIcon className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider font-mono opacity-80">
                      Relationship Verdict
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl font-mono mt-1">
                    {verdictConfig.label}
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed opacity-90 max-w-2xl">
                    {verdictConfig.desc}
                  </p>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="flex flex-col items-center md:items-end justify-center rounded-2xl bg-slate-950/40 p-4 border border-white/10 font-mono">
                <span className="text-[11px] uppercase tracking-wider opacity-80">
                  Detection Confidence
                </span>
                <span className="text-3xl font-black text-white mt-1">
                  {result.confidence.toFixed(1)}%
                </span>
                <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Similarity Dimension Matrix & Evidence List */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Similarity Matrix Bars (6 Cols) */}
            <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Similarity Dimension Vector
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Breakdown of identity overlap across lexical, visual, and semantic dimensions (0-100%).
              </p>

              <div className="space-y-4">
                {[
                  { label: "Handle Match (Levenshtein)", value: result.similarity.username, color: "bg-indigo-500" },
                  { label: "Display Name Similarity", value: result.similarity.name, color: "bg-violet-500" },
                  { label: "Bio Text & Intent Overlap", value: result.similarity.bio, color: "bg-sky-500" },
                  { label: "Visual Avatar / Photo Asset", value: result.similarity.photo, color: "bg-rose-500" },
                ].map((dim, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300 font-semibold">{dim.label}</span>
                      <span className="font-bold text-white">{dim.value.toFixed(1)}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${dim.color}`}
                        style={{ width: `${dim.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Forensic Evidence Breakdown (6 Cols) */}
            <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Forensic Evidence Checklist
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Key differential observations extracted by the comparison correlation engine.
              </p>

              <div className="space-y-3">
                {result.evidence.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs"
                  >
                    <FileCheck className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-200">{item.name}</h4>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">{item.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side-by-Side Profile Cards View */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-4">
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono mb-2">
                Reference Profile A
              </span>
              <ProfileCard profile={profileA} badge="Reference" badgeType="reference" />
            </div>

            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-rose-400 font-mono mb-2">
                Candidate Profile B
              </span>
              <ProfileCard profile={profileB} badge="Candidate" badgeType="suspect" highlight />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
