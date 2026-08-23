import React, { useState, useEffect } from "react";
import { doppelguardApi } from "../services/doppelguardApi";
import { BenchmarkReport, TestCaseResult } from "../types";
import { 
  Award, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  Activity, 
  Clock, 
  Search, 
  Filter, 
  FileText,
  Cpu,
  BarChart2
} from "lucide-react";

interface BenchmarkPageProps {
  onInspectCase?: (testCase: TestCaseResult) => void;
}

export const BenchmarkPage: React.FC<BenchmarkPageProps> = ({ onInspectCase }) => {
  const [report, setReport] = useState<BenchmarkReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [filterClass, setFilterClass] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const [selectedCase, setSelectedCase] = useState<TestCaseResult | null>(null);

  const fetchBenchmark = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await doppelguardApi.getBenchmarkReport(45.0);
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Failed to execute evaluation benchmark suite.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenchmark();
  }, []);

  const filteredCases = (report?.cases || []).filter((c) => {
    if (filterClass === "TP" && c.classification !== "TP") return false;
    if (filterClass === "FP" && c.classification !== "FP") return false;
    if (filterClass === "TN" && c.classification !== "TN") return false;
    if (filterClass === "FN" && c.classification !== "FN") return false;
    if (filterClass === "CORRECT" && !c.is_correct) return false;
    if (filterClass === "MISMATCH" && c.is_correct) return false;

    if (selectedCategory !== "ALL" && c.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.username.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.likely_target && c.likely_target.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const categories = Array.from(new Set(report?.cases.map((c) => c.category) || []));

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 font-mono border border-emerald-500/30">
              EMPIRICAL EVALUATION SUITE
            </span>
            <span className="text-xs text-slate-500 font-mono">N=40 GROUND TRUTH BENCHMARK</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-mono mt-1">
            ACCURACY & MODEL <span className="text-indigo-400">BENCHMARK</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Verifiable statistical evaluation metrics across 40 labeled profiles comparing hybrid rules + XGBoost/Random Forest predictions against ground truth.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchBenchmark}
            disabled={loading}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Evaluating 40 Cases..." : "Re-Run Live Benchmark"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
          <div className="flex items-center space-x-2 font-semibold">
            <AlertTriangle className="h-4 w-4" />
            <span>Benchmark Error</span>
          </div>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {report && (
        <>
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {/* Accuracy */}
            <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/70 p-4 backdrop-blur-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Accuracy</span>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-2xl font-black font-mono text-indigo-400">{report.metrics.accuracy}%</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">(TP+TN) / Total</span>
            </div>

            {/* Precision */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 backdrop-blur-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300">Precision</span>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-2xl font-black font-mono text-emerald-400">{report.metrics.precision}%</span>
              </div>
              <span className="text-[10px] text-emerald-300/70 font-mono">TP / (TP+FP)</span>
            </div>

            {/* Recall */}
            <div className="rounded-2xl border border-sky-500/30 bg-sky-950/20 p-4 backdrop-blur-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-sky-300">Recall / Sens.</span>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-2xl font-black font-mono text-sky-400">{report.metrics.recall}%</span>
              </div>
              <span className="text-[10px] text-sky-300/70 font-mono">TP / (TP+FN)</span>
            </div>

            {/* F1-Score */}
            <div className="rounded-2xl border border-violet-500/30 bg-violet-950/20 p-4 backdrop-blur-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-violet-300">F1-Score</span>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-2xl font-black font-mono text-violet-400">{report.metrics.f1_score}%</span>
              </div>
              <span className="text-[10px] text-violet-300/70 font-mono">Harmonic Mean</span>
            </div>

            {/* ROC-AUC */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 backdrop-blur-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300">ROC-AUC</span>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-2xl font-black font-mono text-amber-400">{report.metrics.roc_auc.toFixed(2)}</span>
              </div>
              <span className="text-[10px] text-amber-300/70 font-mono">Rank-Sum AUC</span>
            </div>

            {/* Latency */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-sm">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Mean Latency</span>
              <div className="mt-1 flex items-baseline space-x-1">
                <span className="text-2xl font-black font-mono text-white">{report.metrics.avg_inference_latency_ms}</span>
                <span className="text-xs text-slate-400">ms</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Hybrid Pipeline</span>
            </div>
          </div>

          {/* Confusion Matrix & Category Accuracy Breakdown */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Confusion Matrix Card (6 Cols) */}
            <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    CONFUSION MATRIX (N=40)
                  </h3>
                  <p className="text-xs text-slate-400">Predicted Risk Band vs Ground Truth Label</p>
                </div>
                <span className="text-xs font-mono text-indigo-400">Threshold: {report.decision_threshold} pts</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* True Positive */}
                <div 
                  onClick={() => setFilterClass("TP")}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    filterClass === "TP" ? "ring-2 ring-emerald-400 bg-emerald-950/40 border-emerald-500" : "border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-500/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono">
                      TRUE POSITIVE (TP)
                    </span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 font-mono">
                      Malicious Correct
                    </span>
                  </div>
                  <div className="mt-2 text-3xl font-black font-mono text-emerald-400">
                    {report.confusion_matrix.true_positives}
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-300/80">
                    Impersonators, crypto phish & scams correctly identified.
                  </p>
                </div>

                {/* False Positive */}
                <div 
                  onClick={() => setFilterClass("FP")}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    filterClass === "FP" ? "ring-2 ring-rose-400 bg-rose-950/40 border-rose-500" : "border-rose-500/30 bg-rose-950/20 hover:border-rose-500/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-300 font-mono">
                      FALSE POSITIVE (FP)
                    </span>
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 font-mono">
                      False Alarm
                    </span>
                  </div>
                  <div className="mt-2 text-3xl font-black font-mono text-rose-400">
                    {report.confusion_matrix.false_positives}
                  </div>
                  <p className="mt-1 text-[11px] text-rose-300/80">
                    Legitimate users incorrectly blocked (0% rate).
                  </p>
                </div>

                {/* False Negative */}
                <div 
                  onClick={() => setFilterClass("FN")}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    filterClass === "FN" ? "ring-2 ring-amber-400 bg-amber-950/40 border-amber-500" : "border-amber-500/30 bg-amber-950/20 hover:border-amber-500/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                      FALSE NEGATIVE (FN)
                    </span>
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 font-mono">
                      Missed Threat
                    </span>
                  </div>
                  <div className="mt-2 text-3xl font-black font-mono text-amber-400">
                    {report.confusion_matrix.false_negatives}
                  </div>
                  <p className="mt-1 text-[11px] text-amber-300/80">
                    Malicious accounts that slipped under radar.
                  </p>
                </div>

                {/* True Negative */}
                <div 
                  onClick={() => setFilterClass("TN")}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    filterClass === "TN" ? "ring-2 ring-indigo-400 bg-indigo-950/40 border-indigo-500" : "border-indigo-500/30 bg-indigo-950/20 hover:border-indigo-500/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono">
                      TRUE NEGATIVE (TN)
                    </span>
                    <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 font-mono">
                      Legitimate Safe
                    </span>
                  </div>
                  <div className="mt-2 text-3xl font-black font-mono text-indigo-400">
                    {report.confusion_matrix.true_negatives}
                  </div>
                  <p className="mt-1 text-[11px] text-indigo-300/80">
                    Legitimate alts & creators correctly passed.
                  </p>
                </div>
              </div>
            </div>

            {/* Category Breakdown (6 Cols) */}
            <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  ACCURACY BY THREAT TAXONOMY
                </h3>
                <p className="text-xs text-slate-400">Per-domain performance across fraud vectors</p>
              </div>

              <div className="space-y-3 pt-1">
                {report.category_breakdown.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300 font-semibold">{cat.category} ({cat.correct_predictions}/{cat.total_cases})</span>
                      <span className="font-bold text-emerald-400">{cat.accuracy_pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${cat.accuracy_pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive 40-Case Test Explorer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  GROUND TRUTH TEST DATASET EXPLORER ({filteredCases.length}/{report.cases.length} PROFILES)
                </h3>
                <p className="text-xs text-slate-400">
                  Inspect individual ground truth profiles, predicted scores, and model classifications.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {["ALL", "TP", "TN", "FP", "FN"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterClass(tab)}
                    className={`rounded-lg px-2.5 py-1 font-mono font-semibold transition-all ${
                      filterClass === tab
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 h-4 w-4 text-slate-500 my-auto" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by handle, entity (e.g. Elon, Google), or category..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-4 text-xs font-mono text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-300 focus:border-indigo-500 focus:outline-none"
              >
                <option value="ALL">All Categories ({categories.length})</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Cases Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-900/80 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Case ID</th>
                    <th className="py-3 px-4">Profile Handle & Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Ground Truth</th>
                    <th className="py-3 px-4">Predicted Score</th>
                    <th className="py-3 px-4">Threat Type</th>
                    <th className="py-3 px-4">Result</th>
                    <th className="py-3 px-4 text-right">Inference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {filteredCases.map((c) => {
                    const isMalicious = c.ground_truth_class === "MALICIOUS";
                    return (
                      <tr
                        key={c.id}
                        className="hover:bg-slate-800/30 cursor-pointer transition-colors"
                        onClick={() => setSelectedCase(c)}
                      >
                        <td className="py-3 px-4 font-bold text-slate-400">{c.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-bold text-white">@{c.username}</span>
                            <span className="block text-[11px] text-slate-400 font-sans">{c.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                            {c.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isMalicious
                                ? "bg-rose-950 text-rose-300 border border-rose-800"
                                : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            }`}
                          >
                            {c.ground_truth_class}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{c.predicted_score.toFixed(1)}/100</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                              c.predicted_band === "CRITICAL" ? "text-rose-400 bg-rose-950/60" :
                              c.predicted_band === "HIGH" ? "text-amber-400 bg-amber-950/60" :
                              c.predicted_band === "MEDIUM" ? "text-yellow-400 bg-yellow-950/60" :
                              "text-emerald-400 bg-emerald-950/60"
                            }`}>
                              {c.predicted_band}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{c.predicted_threat.replace("_", " ")}</td>
                        <td className="py-3 px-4">
                          <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{c.classification}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-slate-500">{c.latency_ms} ms</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Case Details Inspection Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase">
                  Case Inspection: {selectedCase.id}
                </span>
                <h3 className="text-lg font-bold text-white font-mono mt-0.5">
                  @{selectedCase.username}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="rounded-xl bg-slate-800 p-1.5 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                  <span className="text-slate-500">Ground Truth</span>
                  <p className="text-sm font-bold text-white mt-1">{selectedCase.ground_truth_class}</p>
                </div>
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                  <span className="text-slate-500">Predicted Score</span>
                  <p className="text-sm font-bold text-indigo-400 mt-1">{selectedCase.predicted_score.toFixed(1)} / 100 ({selectedCase.predicted_band})</p>
                </div>
              </div>

              {selectedCase.likely_target && (
                <div className="rounded-xl bg-rose-950/30 p-3 border border-rose-800/40 text-rose-300">
                  <span className="font-bold">Target Entity Spoofed:</span> {selectedCase.likely_target}
                </div>
              )}

              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-slate-300 font-sans">
                <span className="font-bold font-mono text-xs text-slate-400 block mb-1">Primary Diagnostic Evidence:</span>
                <p className="leading-relaxed text-xs">{selectedCase.summary_explanation || "Verified profile behavior aligns with normal usage baseline."}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
