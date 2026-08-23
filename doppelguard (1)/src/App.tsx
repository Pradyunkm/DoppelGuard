import React, { useState } from "react";
import { Header } from "./components/Header";
import { DashboardPage } from "./pages/DashboardPage";
import { CheckProfilePage } from "./pages/CheckProfilePage";
import { AnalysisResultPage } from "./pages/AnalysisResultPage";
import { CompareProfilesPage } from "./pages/CompareProfilesPage";
import { BenchmarkPage } from "./pages/BenchmarkPage";
import { CrossPlatformPage } from "./pages/CrossPlatformPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { DoppelGuardAiChat } from "./components/DoppelGuardAiChat";
import { ProfileAnalysisResponse } from "./types";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [currentAnalysis, setCurrentAnalysis] = useState<ProfileAnalysisResponse | null>(null);

  // Auto-scan if opened with ?username=... from external apps like DoppelGram
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("username");
    const nameParam = params.get("name");
    const bioParam = params.get("bio");
    const photoParam = params.get("photo_url") || params.get("avatar");
    const followersParam = params.get("followers");
    const followingParam = params.get("following");
    const ageParam = params.get("account_age_days") || params.get("age");
    const linksParam = params.get("links");
    const tabParam = params.get("tab");

    if (userParam) {
      const linksArray = linksParam ? linksParam.split(",").filter(Boolean) : [];
      const profileToScan = {
        username: userParam.replace(/^@/, ""),
        name: nameParam || userParam.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        bio: bioParam || "Inspected from DoppelGram social platform simulation.",
        photo_url: photoParam || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
        followers: followersParam ? parseInt(followersParam, 10) : (userParam.includes("official") || userParam.includes("giveaway") ? 120 : 4500),
        following: followingParam ? parseInt(followingParam, 10) : (userParam.includes("official") || userParam.includes("giveaway") ? 4800 : 320),
        account_age_days: ageParam ? parseInt(ageParam, 10) : (userParam.includes("official") || userParam.includes("giveaway") ? 4 : 850),
        links: linksArray.length > 0 ? linksArray : (userParam.includes("official") || userParam.includes("giveaway") ? ["https://t.me/claim-giveaway"] : [])
      };

      import("./services/doppelguardApi").then(({ doppelguardApi }) => {
        doppelguardApi.checkProfile(profileToScan)
          .then((res) => {
            setCurrentAnalysis(res);
            setCurrentTab("result");
          })
          .catch((err) => {
            console.error("Auto-scan error:", err);
            setCurrentTab("check");
          });
      });
    } else if (tabParam) {
      setCurrentTab(tabParam);
    }
  }, []);

  const handleNavigate = (tab: string, analysisData?: ProfileAnalysisResponse) => {
    if (analysisData) {
      setCurrentAnalysis(analysisData);
      setCurrentTab("result");
    } else {
      setCurrentTab(tab);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScanComplete = (result: ProfileAnalysisResponse) => {
    setCurrentAnalysis(result);
    setCurrentTab("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCompareWithTarget = (suspectProfile: any, targetName?: string) => {
    setCurrentTab("compare");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col font-sans antialiased">
      {/* Glow background ambient accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-96 w-96 rounded-full bg-indigo-900/15 blur-3xl" />
      </div>

      {/* Navigation Header */}
      <Header currentTab={currentTab} onSelectTab={handleNavigate} />

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 pt-6 sm:px-6 lg:px-8">
        {currentTab === "dashboard" && (
          <DashboardPage onNavigate={handleNavigate} />
        )}

        {currentTab === "check" && (
          <CheckProfilePage onScanComplete={handleScanComplete} />
        )}

        {currentTab === "benchmark" && (
          <BenchmarkPage />
        )}

        {currentTab === "cross-platform" && (
          <CrossPlatformPage />
        )}

        {currentTab === "result" && currentAnalysis && (
          <AnalysisResultPage
            analysis={currentAnalysis}
            onBack={() => setCurrentTab("check")}
            onCompareWithTarget={handleCompareWithTarget}
          />
        )}

        {currentTab === "compare" && (
          <CompareProfilesPage />
        )}

        {currentTab === "reports" && (
          <ReportsPage
            onInspectReport={(report) => {
              setCurrentAnalysis(report);
              setCurrentTab("result");
            }}
          />
        )}

        {currentTab === "settings" && (
          <SettingsPage />
        )}
      </main>

      {/* Floating AI Security Analyst Copilot */}
      <DoppelGuardAiChat />

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>DoppelGuard™ AI Multimodal Impersonation Risk Forensics Engine</span>
          <span>FastAPI + 64-bit pHash + XGBoost/RF ML + React v2.0</span>
        </div>
      </footer>
    </div>
  );
}
