import React, { useState, useEffect } from "react";
import { ProfileAnalysisResponse, RiskBand } from "../types";
import { doppelguardApi } from "../services/doppelguardApi";
import { ProfileCard } from "../components/ProfileCard";
import { SignalAccordion } from "../components/SignalAccordion";
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  ArrowUpDown, 
  AlertTriangle, 
  X, 
  RefreshCw,
  Clock,
  Target
} from "lucide-react";

interface ReportsPageProps {
  onInspectReport: (report: ProfileAnalysisResponse) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onInspectReport }) => {
  const [reports, setReports] = useState<ProfileAnalysisResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBand, setSelectedBand] = useState<string>("ALL");
  const [selectedThreat, setSelectedThreat] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"date" | "score">("date");

  // Inspection modal
  const [modalReport, setModalReport] = useState<ProfileAnalysisResponse | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await doppelguardApi.getReports();
      setReports(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this analysis report?")) return;
    try {
      await doppelguardApi.deleteReport(id);
      setReports(reports.filter((r) => r.id !== id));
      if (modalReport && modalReport.id === id) setModalReport(null);
    } catch (err: any) {
      alert("Error deleting report: " + err.message);
    }
  };

  // Filter and sort logic
  const filteredReports = reports.filter((r) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      r.profile.username.toLowerCase().includes(q) ||
      (r.profile.name && r.profile.name.toLowerCase().includes(q)) ||
      (r.likely_target && r.likely_target.toLowerCase().includes(q));

    const matchesBand = selectedBand === "ALL" || r.risk_band === selectedBand;
    const matchesThreat = selectedThreat === "ALL" || r.threat_type === selectedThreat;

    return matchesSearch && matchesBand && matchesThreat;
  });

  filteredReports.sort((a, b) => {
    if (sortBy === "score") {
      return b.risk_score - a.risk_score;
    }
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return dateB - dateA;
  });

  const exportCSV = () => {
    if (filteredReports.length === 0) return;
    const headers = ["ID", "Username", "Display Name", "Risk Score", "Risk Band", "Threat Type", "Likely Target", "Timestamp"];
    const rows = filteredReports.map((r) => [
      `"${r.id || ""}"`,
      `"${r.profile.username}"`,
      `"${(r.profile.name || "").replace(/"/g, '""')}"`,
      r.risk_score,
      `"${r.risk_band}"`,
      `"${r.threat_type}"`,
      `"${r.likely_target || "None"}"`,
      `"${r.created_at || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `doppelguard-reports-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBandBadge = (band: RiskBand) => {
    const styles = {
      CRITICAL: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      HIGH: "bg-orange-500/15 text-orange-400 border-orange-500/30",
      MEDIUM: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      LOW: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    }[band];
    return (
      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase font-mono ${styles}`}>
        {band}
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-mono">
            AUDIT REPORTS <span className="text-indigo-400">DATABASE</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Historical impersonation forensic logs, threat classifications, and mitigation action audit trails.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchReports}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            title="Refresh database"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-indigo-400" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center space-x-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/40 transition-colors"
            id="btn-export-csv"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
          <div className="flex items-center space-x-2 font-semibold">
            <AlertTriangle className="h-4 w-4" />
            <span>Reports Fetch Error</span>
          </div>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search input */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute inset-y-0 left-0 ml-3 my-auto h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search handle, name, target entity..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Risk Band Select */}
          <div>
            <select
              value={selectedBand}
              onChange={(e) => setSelectedBand(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="ALL">All Risk Bands</option>
              <option value="CRITICAL">Critical Threats</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          {/* Threat Type Select */}
          <div>
            <select
              value={selectedThreat}
              onChange={(e) => setSelectedThreat(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="ALL">All Threat Types</option>
              <option value="impersonation">Identity Impersonation</option>
              <option value="brand_impersonation">Brand Mimicry</option>
              <option value="recruitment_scam">Recruitment Fraud</option>
              <option value="fake_bot">Fake Botnet</option>
              <option value="none">Benign / None</option>
            </select>
          </div>

          {/* Sort By Toggle */}
          <div>
            <button
              onClick={() => setSortBy(sortBy === "date" ? "score" : "date")}
              className="flex w-full items-center justify-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-indigo-400" />
              <span>Sort: {sortBy === "date" ? "Most Recent" : "Highest Score"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3.5 px-4">Profile Target</th>
                <th className="py-3.5 px-4">Risk Score</th>
                <th className="py-3.5 px-4">Threat Band</th>
                <th className="py-3.5 px-4">Taxonomy</th>
                <th className="py-3.5 px-4">Likely Impersonation Target</th>
                <th className="py-3.5 px-4">Audit Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    No matching audit reports found.
                  </td>
                </tr>
              ) : (
                filteredReports.map((rep) => (
                  <tr
                    key={rep.id}
                    onClick={() => setModalReport(rep)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={rep.profile.photo_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60"}
                          alt={rep.profile.username}
                          className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-700 bg-slate-800"
                        />
                        <div>
                          <span className="font-bold text-white font-mono">@{rep.profile.username}</span>
                          {rep.profile.name && (
                            <span className="block text-[11px] text-slate-400">{rep.profile.name}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {rep.risk_score.toFixed(1)}/100
                    </td>

                    <td className="py-3.5 px-4">
                      {getBandBadge(rep.risk_band)}
                    </td>

                    <td className="py-3.5 px-4 font-mono uppercase text-[11px] text-slate-400">
                      {rep.threat_type.replace("_", " ")}
                    </td>

                    <td className="py-3.5 px-4">
                      {rep.likely_target ? (
                        <span className="inline-flex items-center space-x-1 rounded-md bg-rose-950/50 px-2 py-0.5 text-xs text-rose-300 border border-rose-800/60 font-mono">
                          <Target className="h-3 w-3" />
                          <span>{rep.likely_target}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">None</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-slate-400 font-mono">
                      {rep.created_at ? new Date(rep.created_at).toLocaleDateString() : "Just now"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectReport(rep);
                          }}
                          className="rounded-lg bg-indigo-600/20 p-1.5 text-indigo-300 hover:bg-indigo-600/40"
                          title="Open Full Report Page"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(rep.id!, e)}
                          className="rounded-lg bg-rose-600/10 p-1.5 text-rose-400 hover:bg-rose-600/30"
                          title="Delete Report"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Modal View */}
      {modalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2 font-mono">
                <FileText className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Audit Snapshot: @{modalReport.profile.username}
                </h3>
              </div>
              <button
                onClick={() => setModalReport(null)}
                className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-400 uppercase">Score</span>
                <span className="block text-2xl font-black text-white">{modalReport.risk_score}/100</span>
              </div>
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-400 uppercase">Band</span>
                <span className="block text-2xl font-black text-indigo-400">{modalReport.risk_band}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                Forensic Signals
              </h4>
              <SignalAccordion signals={modalReport.signals} />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setModalReport(null)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Close
              </button>

              <button
                onClick={() => {
                  onInspectReport(modalReport);
                  setModalReport(null);
                }}
                className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Open Full Interactive Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
