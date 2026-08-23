import React, { useState } from "react";
import { SignalItem } from "../types";
import { ChevronDown, ChevronUp, AlertCircle, Info, CheckCircle2 } from "lucide-react";

interface SignalAccordionProps {
  signals: SignalItem[];
}

export const SignalAccordion: React.FC<SignalAccordionProps> = ({ signals }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3">
      {signals.map((sig, idx) => {
        const isExpanded = expandedIndex === idx;
        const isHigh = sig.contribution >= 15;
        const isMed = sig.contribution >= 8 && sig.contribution < 15;

        return (
          <div
            key={idx}
            className={`rounded-xl border transition-all ${
              isExpanded
                ? "border-slate-700 bg-slate-900/90 shadow-md"
                : "border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/70"
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="flex w-full items-center justify-between p-4 text-left focus:outline-none"
              id={`signal-item-btn-${idx}`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    isHigh
                      ? "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30"
                      : isMed
                      ? "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                  }`}
                >
                  {isHigh ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : isMed ? (
                    <Info className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100">{sig.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Impact: +{sig.contribution.toFixed(1)} pts
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Visual contribution bar */}
                <div className="hidden sm:flex w-28 items-center space-x-2">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHigh ? "bg-rose-500" : isMed ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(sig.contribution * 4, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-md bg-slate-800/80 p-1 text-slate-400">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-slate-800/80 px-4 py-3 bg-slate-950/40 rounded-b-xl">
                <p className="text-xs leading-relaxed text-slate-300">
                  {sig.explanation}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Engine Feature Extraction: {sig.name}</span>
                  <span>Calculated Contribution: {sig.contribution.toFixed(1)}/25.0</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
