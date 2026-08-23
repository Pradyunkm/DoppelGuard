import React from "react";
import { RiskBand } from "../types";
import { AlertTriangle, ShieldCheck, AlertOctagon, Flame } from "lucide-react";

interface RiskGaugeProps {
  score: number; // 0 to 100
  band: RiskBand;
  size?: "sm" | "md" | "lg";
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, band, size = "md" }) => {
  const normalizedScore = Math.min(Math.max(score, 0), 100);

  // SVG dimensions based on size
  const config = {
    sm: { radius: 38, stroke: 7, sizePx: 96, textClass: "text-xl", subClass: "text-[10px]" },
    md: { radius: 64, stroke: 10, sizePx: 160, textClass: "text-3xl", subClass: "text-xs" },
    lg: { radius: 90, stroke: 14, sizePx: 220, textClass: "text-5xl", subClass: "text-sm" },
  }[size];

  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Band styles
  const bandConfig = {
    LOW: {
      color: "text-emerald-400",
      stroke: "#10b981",
      glow: "rgba(16, 185, 129, 0.25)",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      icon: ShieldCheck,
      label: "Low Risk",
    },
    MEDIUM: {
      color: "text-amber-400",
      stroke: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.25)",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      icon: AlertTriangle,
      label: "Medium Risk",
    },
    HIGH: {
      color: "text-orange-400",
      stroke: "#f97316",
      glow: "rgba(249, 115, 22, 0.3)",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      icon: AlertOctagon,
      label: "High Risk",
    },
    CRITICAL: {
      color: "text-rose-400",
      stroke: "#f43f5e",
      glow: "rgba(244, 63, 94, 0.4)",
      bg: "bg-rose-500/15",
      border: "border-rose-500/40",
      icon: Flame,
      label: "Critical Threat",
    },
  }[band] || {
    color: "text-slate-400",
    stroke: "#64748b",
    glow: "rgba(100, 116, 139, 0.2)",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    icon: ShieldCheck,
    label: "Unknown",
  };

  const Icon = bandConfig.icon;

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className="relative flex items-center justify-center rounded-full p-2"
        style={{
          boxShadow: `0 0 35px ${bandConfig.glow}`,
        }}
      >
        <svg
          width={config.sizePx}
          height={config.sizePx}
          className="-rotate-90 transform"
        >
          {/* Background circle track */}
          <circle
            cx={config.sizePx / 2}
            cy={config.sizePx / 2}
            r={config.radius}
            stroke="#1e293b"
            strokeWidth={config.stroke}
            fill="transparent"
          />
          {/* Animated fill circle */}
          <circle
            cx={config.sizePx / 2}
            cy={config.sizePx / 2}
            r={config.radius}
            stroke={bandConfig.stroke}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-mono font-black tracking-tight text-white ${config.textClass}`}>
            {normalizedScore.toFixed(0)}
          </span>
          <span className={`font-mono uppercase tracking-widest text-slate-400 ${config.subClass}`}>
            / 100 Score
          </span>
        </div>
      </div>

      {/* Band Badge */}
      <div
        className={`mt-4 inline-flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${bandConfig.bg} ${bandConfig.color} border ${bandConfig.border}`}
      >
        <Icon className="h-3.5 w-3.5" />
        <span>{bandConfig.label}</span>
      </div>
    </div>
  );
};
