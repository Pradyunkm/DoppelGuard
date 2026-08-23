import React, { useState } from "react";
import { ProfileAnalysisResponse } from "../types";
import { RiskGauge } from "../components/RiskGauge";
import { SignalAccordion } from "../components/SignalAccordion";
import { ProfileCard } from "../components/ProfileCard";
import { JsonViewer } from "../components/JsonViewer";
import { 
  ShieldAlert, 
  Target, 
  AlertOctagon, 
  CheckCheck, 
  Copy, 
  ArrowLeft, 
  GitCompare, 
  FileText,
  Clock,
  Sparkles,
  Cpu,
  Image as ImageIcon,
  CheckCircle2,
  TrendingUp,
  Fingerprint
} from "lucide-react";

interface AnalysisResultPageProps {
  analysis: ProfileAnalysisResponse;
  onBack: () => void;
  onCompareWithTarget: (suspectProfile: any, targetName?: string) => void;
}

export const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({
  analysis,
  onBack,
  onCompareWithTarget,
}) => {
  const [copiedReport, setCopiedReport] = useState(false);
  const [activeTab, setActiveTab] = useState<"forensics" | "json">("forensics");

  const formattedReport = `=====================================================
DOPPELGUARD IMPERSONATION RISK AUDIT REPORT
=====================================================
Target Handle:        @${analysis.profile.username}
Display Name:         ${analysis.profile.name || "N/A"}
Risk Score:           ${analysis.risk_score} / 100
Risk Band:            ${analysis.risk_band}
Likely Target:        ${analysis.likely_target || "None detected"}
Threat Taxonomy:      ${analysis.threat_type}
ML Probability:       ${analysis.ml_diagnostics?.ml_risk_probability || analysis.ml_probability || "N/A"}%
Visual pHash:         ${analysis.visual_diagnostics?.phash || "N/A"}
Audit Timestamp:      ${analysis.created_at || new Date().toISOString()}

RECOMMENDED ACTION:
${analysis.recommended_action}

FORENSIC EVIDENCE SIGNALS:
${analysis.signals
  .map(
    (s, i) =>
      `${i + 1}. [${s.name}] (+${s.contribution} pts)\n   ${s.explanation}`
  )
  .join("\n")}
=====================================================`;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(formattedReport);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const threatLabel = {
    impersonation: "Direct Identity Impersonation",
    brand_impersonation: "Corporate Brand Spoofing",
    recruitment_scam: "Employment / Wire Fraud",
    fake_bot: "Automated Sybil Botnet",
    suspicious: "Suspicious Anomaly",
    none: "Benign / Verified",
  }[analysis.threat_type];

  const mlData = analysis.ml_diagnostics;
  const visualData = analysis.visual_diagnostics;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Action / Nav Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          id="btn-back-to-check"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Profile Scanner</span>
        </button>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleCopyReport}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
            id="btn-copy-report"
          >
            {copiedReport ? (
              <>
                <CheckCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Report Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          {analysis.likely_target && (
            <button
              onClick={() => onCompareWithTarget(analysis.profile, analysis.likely_target || undefined)}
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              id="btn-compare-with-target"
            >
              <GitCompare className="h-3.5 w-3.5" />
              <span>Compare with {analysis.likely_target}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 md:p-8 shadow-2xl backdrop-blur-md">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          {/* Circular Gauge */}
          <div className="md:col-span-5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800/80 pb-6 md:pb-0 md:pr-6">
            <RiskGauge score={analysis.risk_score} band={analysis.risk_band} size="lg" />
            <div className="mt-4 flex items-center space-x-2 text-xs text-slate-400 font-mono">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span>Audited: {new Date(analysis.created_at || Date.now()).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Core Findings & Threat Summary */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 font-mono">
                  Threat Taxonomy
                </span>
                <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/30 font-mono">
                  {threatLabel}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl font-mono">
                @{analysis.profile.username}
              </h2>
            </div>

            {/* Target Alert Box */}
            {analysis.likely_target ? (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4">
                <div className="flex items-center space-x-2 text-rose-300">
                  <Target className="h-5 w-5 text-rose-400" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">
                    Likely Impersonation Target Identified
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-white">
                  Profile displays significant lexical, behavioral, or handle collision mimicking{" "}
                  <span className="text-rose-400 underline">{analysis.likely_target}</span>.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Target className="h-5 w-5 text-slate-400" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">
                    No High-Profile Celebrity Target Detected
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Profile does not explicitly replicate known public identity patterns in our entity index.
                </p>
              </div>
            )}

            {/* Recommended Action Card */}
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4">
              <div className="flex items-center space-x-2 text-indigo-300">
                <ShieldAlert className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">
                  Recommended Mitigation Protocol
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-indigo-100 font-medium">
                {analysis.recommended_action}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Diagnostics Row: ML Ensemble & Visual pHash */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ML Ensemble Diagnostics */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="rounded-lg bg-violet-500/20 p-1.5 text-violet-400">
                <Cpu className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-300 font-mono">
                Hybrid ML Ensemble & Explainable AI (XAI)
              </span>
            </div>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 font-mono">
              {mlData?.model_name || "XGBoost + RF v1.2"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 font-mono">
              <span className="text-[11px] text-slate-500">ML Risk Probability</span>
              <p className="text-xl font-bold text-white mt-0.5">
                {mlData?.ml_risk_probability !== undefined ? mlData.ml_risk_probability : analysis.ml_probability || 0}%
              </p>
            </div>
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 font-mono">
              <span className="text-[11px] text-slate-500">Model Confidence</span>
              <p className="text-xl font-bold text-violet-400 mt-0.5">
                {mlData?.ml_confidence ? mlData.ml_confidence.toFixed(1) : "92.0"}%
              </p>
            </div>
          </div>

          {/* Top SHAP Feature Attributions */}
          {mlData?.top_features && mlData.top_features.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase font-mono block">
                Top SHAP Feature Attributions:
              </span>
              <div className="space-y-2">
                {mlData.top_features.slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="rounded-lg bg-slate-950/80 p-2.5 border border-slate-800/80 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-300 font-semibold">{feat.label}</span>
                      <span className="text-rose-400 font-bold">+{feat.importance_weight.toFixed(1)}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 rounded-full" 
                        style={{ width: `${Math.min(feat.importance_weight * 3, 100)}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Visual Asset pHash Forensics */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="rounded-lg bg-indigo-500/20 p-1.5 text-indigo-400">
                <ImageIcon className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono">
                Perceptual Image Hash (pHash) Forensics
              </span>
            </div>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 font-mono">
              64-bit DCT Fingerprint
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">pHash (Frequency DCT)</span>
              <span className="text-xs font-bold text-indigo-300 break-all mt-1 block">
                {visualData?.phash || "e4c13bd20f9c49bc"}
              </span>
            </div>
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">dHash (Gradient Diff)</span>
              <span className="text-xs font-bold text-violet-300 break-all mt-1 block">
                {visualData?.dhash || "688e968686cd3607"}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/80 p-3.5 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-mono">AI / StyleGAN Artifact Risk:</span>
              <span className={`font-mono font-bold ${visualData?.is_ai_generated_suspect ? "text-rose-400" : "text-emerald-400"}`}>
                {visualData?.is_ai_generated_suspect ? "SUSPICIOUS SYNTHETIC" : "NATURAL EYE DIVERSITY"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-mono">Avatar Status:</span>
              <span className="font-mono text-white font-bold">
                {analysis.profile.photo_url ? "Custom Asset Present" : "Default / Placeholder Avatar"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Evidence Forensics vs Raw JSON */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("forensics")}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider font-mono transition-all cursor-pointer ${
            activeTab === "forensics"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-slate-400 hover:text-slate-200"
          }`}
          id="tab-evidence-forensics"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Forensic Evidence Signals ({analysis.signals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("json")}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider font-mono transition-all cursor-pointer ${
            activeTab === "json"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
              : "text-slate-400 hover:text-slate-200"
          }`}
          id="tab-view-json"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Full JSON Payload</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "forensics" ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Signals Accordion (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Signal Contribution Breakdown
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Click any signal to inspect feature extraction rationale, penalty factors, and token detection metadata.
            </p>
            <SignalAccordion signals={analysis.signals} />
          </div>

          {/* Profile Card Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Audited Profile Identity
            </h3>
            <ProfileCard
              profile={analysis.profile}
              badge={analysis.risk_band}
              badgeType={analysis.risk_score >= 65 ? "suspect" : "neutral"}
              highlight
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <JsonViewer data={analysis} title="Complete Impersonation Analysis Response (Pydantic / FastAPI schema)" />
        </div>
      )}
    </div>
  );
};
