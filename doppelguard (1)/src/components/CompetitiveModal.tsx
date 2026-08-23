import React, { useState, useEffect } from "react";
import { doppelguardApi } from "../services/doppelguardApi";
import { CompetitiveMatrixData } from "../types";
import { 
  ShieldCheck, 
  X, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Award
} from "lucide-react";

interface CompetitiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompetitiveModal: React.FC<CompetitiveModalProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<CompetitiveMatrixData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !data) {
      setLoading(true);
      doppelguardApi.getCompetitiveMatrix()
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-xl bg-slate-800 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="rounded-2xl bg-indigo-500/20 p-3 text-indigo-400 ring-1 ring-indigo-500/30">
            <Award className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-bold text-indigo-300 font-mono">
                COMPETITIVE DIFFERENTIATION
              </span>
              <span className="text-xs text-slate-500 font-mono">INTERNATIONAL DEFENSE</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white font-mono mt-1">
              DoppelGuard vs Industry Landscape
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              How DoppelGuard’s multimodal AI architecture defends where existing tools (Botometer, FaceCheck, SocialBlade, ZeroFox) fail.
            </p>
          </div>
        </div>

        {/* Competitive Matrix Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 mb-6">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-900/80 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3 px-4">Solution</th>
                <th className="py-3 px-4">Core Signals</th>
                <th className="py-3 px-4">Image Forensics</th>
                <th className="py-3 px-4">Target Identity Attribution</th>
                <th className="py-3 px-4">Cross-Platform Audit</th>
                <th className="py-3 px-4">Explainability (XAI)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {data?.competitors.map((c, idx) => {
                const isDoppelGuard = c.name.includes("DoppelGuard");
                return (
                  <tr
                    key={idx}
                    className={isDoppelGuard ? "bg-indigo-950/30 font-semibold text-white border-l-4 border-indigo-500" : "hover:bg-slate-900/40"}
                  >
                    <td className="py-3.5 px-4 font-bold">
                      {isDoppelGuard ? (
                        <div className="flex items-center space-x-1.5 text-indigo-300">
                          <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0" />
                          <span>{c.name}</span>
                        </div>
                      ) : (
                        c.name
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{c.signals}</td>
                    <td className="py-3.5 px-4">{c.image_analysis}</td>
                    <td className="py-3.5 px-4">{c.target_identification}</td>
                    <td className="py-3.5 px-4">{c.cross_platform}</td>
                    <td className="py-3.5 px-4">{c.explainability}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 30-Second Elevator Pitch Highlights */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-violet-950/40 p-5">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono mb-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>30-Second Hackathon Judge Pitch Highlights</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Multimodal Fusion over Single Signals:</strong> Unlike Botometer (text-only) or FaceCheck (pixels-only), DoppelGuard correlates 64-bit DCT pHash visual hashes with handle typography, age velocity, and scam lexical patterns.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Actionable Target Grounding:</strong> We don’t just say "this is a bot" — we identify <em>who</em> is being impersonated (e.g. Elon Musk, Google HR) and produce regulatory-compliant recommended takedown advisories.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>End-to-End Real World Integration:</strong> Proven live in the DoppelGram social platform, providing consumer-facing warning banners and instant one-click backend forensic audits.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
