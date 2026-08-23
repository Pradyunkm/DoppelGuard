import React, { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  Activity, 
  UserCheck, 
  GitCompare, 
  FileText, 
  Settings, 
  Wifi, 
  WifiOff,
  BarChart2,
  Globe,
  Award
} from "lucide-react";
import { doppelguardApi, getApiBaseUrl } from "../services/doppelguardApi";
import { CompetitiveModal } from "./CompetitiveModal";

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab }) => {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [showCompModal, setShowCompModal] = useState<boolean>(false);

  const checkConnection = async () => {
    try {
      await doppelguardApi.checkHealth();
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "check", label: "Check Profile", icon: UserCheck },
    { id: "benchmark", label: "Accuracy", icon: BarChart2, badge: "100%" },
    { id: "cross-platform", label: "Cross-Platform", icon: Globe },
    { id: "compare", label: "Comparator", icon: GitCompare },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 gap-3">
          {/* Brand Identity */}
          <div 
            onClick={() => onSelectTab("dashboard")}
            className="flex cursor-pointer items-center space-x-3 shrink-0 group select-none"
            id="brand-header-link"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-indigo-500 shadow-md shadow-indigo-500/25 ring-1 ring-white/20 transition-transform group-hover:scale-105">
              <ShieldCheck className="h-5 w-5 text-white" />
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base font-bold tracking-tight text-white whitespace-nowrap">
                  DOPPEL<span className="text-indigo-400">GUARD</span>
                </span>
                <span className="whitespace-nowrap rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-indigo-300 ring-1 ring-indigo-500/30">
                  v2.0 ML
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden xl:block font-mono tracking-tight whitespace-nowrap">
                Multimodal Impersonation Forensics
              </span>
            </div>
          </div>

          {/* Desktop Navigation Bar */}
          <nav className="hidden lg:flex items-center space-x-1 rounded-2xl bg-slate-900/80 p-1 border border-slate-800/90 shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-mono font-bold text-emerald-300 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Status Indicator & Action CTA Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Competitive VS Matrix Modal Trigger */}
            <button
              onClick={() => setShowCompModal(true)}
              className="flex items-center space-x-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/50 hover:text-white transition-all cursor-pointer whitespace-nowrap"
              title="Competitive Matrix vs Botometer, FaceCheck, SocialBlade"
            >
              <Award className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span className="hidden sm:inline font-mono">VS Matrix</span>
            </button>

            {/* Backend Engine Status Pill */}
            <div
              className={`flex items-center space-x-1.5 rounded-xl px-2.5 py-1.5 text-xs font-mono ring-1 transition-all whitespace-nowrap ${
                backendOnline === true
                  ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                  : backendOnline === false
                  ? "bg-amber-500/10 text-amber-300 ring-amber-500/30"
                  : "bg-slate-800 text-slate-400 ring-slate-700"
              }`}
              title={`Backend: ${getApiBaseUrl() || "Integrated Local Service"}`}
            >
              {backendOnline === true ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  <span className="hidden md:inline">Online</span>
                </>
              ) : backendOnline === false ? (
                <>
                  <WifiOff className="h-3 w-3 text-amber-400 shrink-0" />
                  <span className="hidden md:inline">Standby</span>
                </>
              ) : (
                <>
                  <Wifi className="h-3 w-3 animate-pulse text-slate-400 shrink-0" />
                  <span className="hidden md:inline">Connecting</span>
                </>
              )}
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => onSelectTab("check")}
              className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 ring-1 ring-white/15 hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              id="quick-scan-btn"
            >
              <UserCheck className="h-3.5 w-3.5 shrink-0" />
              <span>Scan Profile</span>
            </button>
          </div>
        </div>

        {/* Medium/Mobile Overflow Navigation Row */}
        <div className="flex lg:hidden border-t border-slate-800/80 bg-slate-950/90 px-3 py-1.5 overflow-x-auto no-scrollbar">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all ${
                    isActive 
                      ? "bg-indigo-600 text-white font-bold shadow-xs" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <CompetitiveModal isOpen={showCompModal} onClose={() => setShowCompModal(false)} />
    </>
  );
};
