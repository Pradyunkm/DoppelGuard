import React, { useState } from "react";
import { ProfileInput, ProfileAnalysisResponse } from "../types";
import { SAMPLE_PROFILES } from "../data/sampleProfiles";
import { doppelguardApi } from "../services/doppelguardApi";
import { ProfileCard } from "../components/ProfileCard";
import { LiveUrlScanner } from "../components/LiveUrlScanner";
import { 
  UserCheck, 
  Code2, 
  Sliders, 
  Sparkles, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  CheckCircle,
  Plus,
  Trash2
} from "lucide-react";

interface CheckProfilePageProps {
  onScanComplete: (result: ProfileAnalysisResponse) => void;
}

export const CheckProfilePage: React.FC<CheckProfilePageProps> = ({ onScanComplete }) => {
  // Input mode: 'form' | 'json'
  const [inputMode, setInputMode] = useState<"form" | "json">("form");

  // Profile Form State
  const [profile, setProfile] = useState<ProfileInput>({
    username: "elonmusk_official_eth",
    name: "Elon Musk [Official Tesla Live]",
    bio: "Founder of Tesla & SpaceX. Celebrating Cybertruck delivery with 5,000 ETH Giveaway! Click link to claim now.",
    photo_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
    followers: 340,
    following: 4890,
    account_age_days: 3,
    links: ["https://t.me/tesla_official_giveaway", "http://bit.ly/claim-eth-now"],
  });

  // JSON Raw Text state
  const [jsonText, setJsonText] = useState<string>(
    JSON.stringify(
      {
        username: "elonmusk_official_eth",
        name: "Elon Musk [Official Tesla Live]",
        bio: "Founder of Tesla & SpaceX. Celebrating Cybertruck delivery with 5,000 ETH Giveaway! Click link to claim now.",
        photo_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
        followers: 340,
        following: 4890,
        account_age_days: 3,
        links: ["https://t.me/tesla_official_giveaway", "http://bit.ly/claim-eth-now"],
      },
      null,
      2
    )
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Link input helper
  const [newLink, setNewLink] = useState("");

  // Loading & error state
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Handle Preset Selection
  const handleSelectPreset = (presetId: string) => {
    const selected = SAMPLE_PROFILES.find((p) => p.id === presetId);
    if (selected) {
      setProfile(selected.profile);
      setJsonText(JSON.stringify(selected.profile, null, 2));
      setJsonError(null);
    }
  };

  // Handle JSON textarea change & auto-sync with form
  const handleJsonChange = (text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "object" && parsed !== null) {
        setProfile({
          username: parsed.username || "",
          name: parsed.name || "",
          bio: parsed.bio || "",
          photo_url: parsed.photo_url || "",
          followers: Number(parsed.followers) || 0,
          following: Number(parsed.following) || 0,
          account_age_days: Number(parsed.account_age_days) || 0,
          links: Array.isArray(parsed.links) ? parsed.links : [],
        });
        setJsonError(null);
      }
    } catch (err: any) {
      setJsonError("Invalid JSON syntax: " + err.message);
    }
  };

  // Handle form change & sync with JSON
  const handleFieldChange = (field: keyof ProfileInput, value: any) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const handleAddLink = () => {
    if (!newLink.trim()) return;
    const updatedLinks = [...(profile.links || []), newLink.trim()];
    handleFieldChange("links", updatedLinks);
    setNewLink("");
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = (profile.links || []).filter((_, i) => i !== index);
    handleFieldChange("links", updatedLinks);
  };

  // Run Profile Check
  const handleSubmitScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.username.trim()) {
      setApiError("A profile username handle is required.");
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      const result = await doppelguardApi.checkProfile(profile);
      onScanComplete(result);
    } catch (err: any) {
      setApiError(err.message || "Failed to communicate with DoppelGuard scoring API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-mono">
            PROFILE RISK <span className="text-indigo-400">ANALYSIS</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Submit social media profile metadata to extract explainable risk signals, likely impersonation target, and threat taxonomy.
          </p>
        </div>

        {/* Sample Profile Selector Dropdown */}
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300">Quick Presets:</span>
          <select
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            id="sample-preset-select"
            defaultValue="elon-eth-scam"
          >
            {SAMPLE_PROFILES.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.category}] {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ONE-CLICK LIVE URL SCANNER EMBED */}
      <LiveUrlScanner
        onScanComplete={onScanComplete}
        onProfileLoaded={(scraped) => {
          setProfile(scraped);
          setJsonText(JSON.stringify(scraped, null, 2));
        }}
      />

      {apiError && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-4 text-xs text-rose-200">
          <div className="flex items-center space-x-2 font-semibold">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <span>Analysis Request Failed</span>
          </div>
          <p className="mt-1">{apiError}</p>
        </div>
      )}

      {/* Main Grid: Input Form / JSON & Live Profile Preview */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Input Workbench (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          {/* Method Toggle Tabs */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setInputMode("form")}
                className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  inputMode === "form"
                    ? "bg-indigo-600 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
                id="tab-manual-form"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Manual Form Fields</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode("json")}
                className={`flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  inputMode === "json"
                    ? "bg-indigo-600 text-white font-semibold shadow-sm"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
                id="tab-raw-json"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>Raw JSON Blob</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              POST /profile/check
            </span>
          </div>

          <form onSubmit={handleSubmitScan} className="space-y-5">
            {inputMode === "form" ? (
              <div className="space-y-4">
                {/* Username Handle */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Username / Handle <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-mono text-slate-500">
                      @
                    </span>
                    <input
                      type="text"
                      required
                      value={profile.username}
                      onChange={(e) => handleFieldChange("username", e.target.value)}
                      placeholder="elonmusk_official"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 pl-8 pr-4 text-xs font-mono text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      id="input-username"
                    />
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profile.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="Elon Musk [Official]"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    id="input-display-name"
                  />
                </div>

                {/* Bio Text */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Profile Biography / Description
                  </label>
                  <textarea
                    rows={3}
                    value={profile.bio || ""}
                    onChange={(e) => handleFieldChange("bio", e.target.value)}
                    placeholder="Founder of Tesla & SpaceX. Official 5000 ETH giveaway for community..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    id="input-bio"
                  />
                </div>

                {/* Avatar Photo URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={profile.photo_url || ""}
                    onChange={(e) => handleFieldChange("photo_url", e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-xs font-mono text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    id="input-photo-url"
                  />
                </div>

                {/* Metrics 3-Col: Followers, Following, Account Age */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Followers Count
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={profile.followers || 0}
                      onChange={(e) => handleFieldChange("followers", parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      id="input-followers"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Following Count
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={profile.following || 0}
                      onChange={(e) => handleFieldChange("following", parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      id="input-following"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Account Age (Days)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={profile.account_age_days || 0}
                      onChange={(e) => handleFieldChange("account_age_days", parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs font-mono text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      id="input-account-age"
                    />
                  </div>
                </div>

                {/* External Links */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    External Profile Links & Endpoints
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      placeholder="https://t.me/crypto_official or https://bit.ly/claim"
                      className="flex-1 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  {profile.links && profile.links.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                      {profile.links.map((link, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-1.5 text-xs font-mono text-slate-300 border border-slate-800/80"
                        >
                          <span className="truncate max-w-sm">{link}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(idx)}
                            className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Paste Raw Profile JSON Payload
                </label>
                <textarea
                  rows={14}
                  value={jsonText}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  placeholder={`{\n  "username": "...",\n  "name": "...",\n  "bio": "...",\n  "followers": 100\n}`}
                  className="w-full font-mono text-xs rounded-xl border border-slate-800 bg-slate-950 p-4 text-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  id="textarea-raw-json"
                />
                {jsonError && (
                  <p className="mt-2 text-xs text-rose-400 font-mono">{jsonError}</p>
                )}
              </div>
            )}

            {/* Submit Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleSelectPreset("elon-eth-scam")}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                id="btn-run-analysis"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Evaluating Forensic Signals...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    <span>Run Impersonation Analysis</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Profile Visualizer (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Target Profile Preview
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 font-mono">
                Real-time Rendering
              </span>
            </div>

            <ProfileCard
              profile={profile}
              badge="Candidate Under Audit"
              badgeType="suspect"
              highlight
            />

            <div className="mt-5 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Forensic Signal Pipeline
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-slate-400">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
                  <span>64-bit DCT Perceptual Hashing (pHash & dHash)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Trained XGBoost & Random Forest Ensemble ML</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
                  <span>SHAP-style Feature Attribution (Explainable AI)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Target Mimicry & High-Profile Entity Matching</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
