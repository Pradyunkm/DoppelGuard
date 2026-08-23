import React, { useState } from "react";
import { doppelguardApi } from "../services/doppelguardApi";
import { ProfileAnalysisResponse } from "../types";
import { 
  Globe, 
  Sparkles, 
  Search, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  Cpu,
  Layers,
  Image as ImageIcon
} from "lucide-react";

interface LiveUrlScannerProps {
  onScanComplete: (analysis: ProfileAnalysisResponse) => void;
  onProfileLoaded?: (profile: any) => void;
}

const SAMPLE_LIVE_URLS = [
  { label: "X: @elonmusk_official_eth", url: "https://x.com/elonmusk_official_eth", tag: "Crypto Scam" },
  { label: "LinkedIn: @google_careers_recruitment", url: "https://linkedin.com/in/google_careers_recruitment", tag: "HR Fraud" },
  { label: "Instagram: @apple_care_direct_help", url: "https://instagram.com/apple_care_direct_help", tag: "Brand Spoof" },
  { label: "X: @sarah_designs_portfolio", url: "https://x.com/sarah_designs_portfolio", tag: "Legitimate" },
];

export const LiveUrlScanner: React.FC<LiveUrlScannerProps> = ({ onScanComplete, onProfileLoaded }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (targetUrl?: string) => {
    const inputUrl = (targetUrl || url).trim();
    if (!inputUrl) {
      setError("Please enter a valid social media or web profile URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setScanStep("Initiating public endpoint connection & scraping OpenGraph tags...");

    try {
      setTimeout(() => setScanStep("Extracting visual avatar & computing 64-bit DCT pHash..."), 400);
      setTimeout(() => setScanStep("Running XGBoost/Random Forest ensemble ML inference..."), 800);

      const res = await doppelguardApi.scrapeAndCheckProfile(inputUrl);

      if (onProfileLoaded) {
        onProfileLoaded(res.scraped_profile);
      }
      onScanComplete(res.analysis);
    } catch (err: any) {
      setError(err.message || "Failed to scrape and analyze the profile URL.");
    } finally {
      setLoading(false);
      setScanStep(null);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 p-5 shadow-2xl backdrop-blur-md">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-600/15 blur-2xl" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="rounded-xl bg-indigo-500/20 p-2 text-indigo-400 ring-1 ring-indigo-500/30">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white font-mono tracking-wide">
                ONE-CLICK LIVE URL INGESTION
              </h3>
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 font-mono border border-indigo-500/30">
                LIVE PIPELINE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Paste any public Twitter/X, Instagram, LinkedIn, GitHub, or Telegram URL for instant automated ingestion.
            </p>
          </div>
        </div>

        {/* Pipeline capability tags */}
        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <span className="flex items-center space-x-1 bg-slate-950/60 px-2 py-1 rounded-lg border border-slate-800">
            <ImageIcon className="h-3 w-3 text-indigo-400" />
            <span>pHash Vision</span>
          </span>
          <span className="flex items-center space-x-1 bg-slate-950/60 px-2 py-1 rounded-lg border border-slate-800">
            <Cpu className="h-3 w-3 text-violet-400" />
            <span>XGBoost ML</span>
          </span>
        </div>
      </div>

      {/* URL Input Bar */}
      <div className="mt-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://x.com/elonmusk_official_eth or https://instagram.com/..."
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-slate-500 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
            />
          </div>

          <button
            onClick={() => handleScan()}
            disabled={loading}
            className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
          >
            {loading ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <span>Ingest & Audit</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Live Step Progress Indicator */}
        {scanStep && (
          <div className="mt-2.5 flex items-center space-x-2 rounded-lg bg-indigo-950/40 px-3 py-1.5 text-xs text-indigo-300 border border-indigo-800/40 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-indigo-400" />
            <span className="font-mono text-[11px]">{scanStep}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-2.5 rounded-lg bg-rose-950/40 p-2.5 text-xs text-rose-300 border border-rose-800/40 flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Sample URL Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center mr-1">
            <Sparkles className="h-3 w-3 text-indigo-400 mr-1" />
            Try Live Examples:
          </span>
          {SAMPLE_LIVE_URLS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUrl(sample.url);
                handleScan(sample.url);
              }}
              className="group flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:border-indigo-500 hover:bg-slate-900 transition-colors"
            >
              <span>{sample.label}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                sample.tag === "Legitimate" 
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800" 
                  : "bg-rose-950 text-rose-300 border border-rose-800"
              }`}>
                {sample.tag}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
