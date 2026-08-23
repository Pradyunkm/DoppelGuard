import React from "react";
import { ProfileInput } from "../types";
import { Users, Calendar, Link2, ExternalLink, AtSign } from "lucide-react";

interface ProfileCardProps {
  profile: ProfileInput;
  badge?: string;
  badgeType?: "suspect" | "reference" | "neutral";
  highlight?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  badge,
  badgeType = "neutral",
  highlight = false,
}) => {
  const formatNumber = (num: number = 0) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  const badgeStyles = {
    suspect: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    reference: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    neutral: "bg-slate-700/50 text-slate-300 border-slate-600",
  }[badgeType];

  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all ${
        highlight
          ? "border-indigo-500/60 bg-slate-900/90 shadow-xl shadow-indigo-500/10"
          : "border-slate-800 bg-slate-900/60"
      }`}
    >
      {/* Top row: Avatar + Name + Handle + Badge */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <img
              src={profile.photo_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120"}
              alt={profile.name || profile.username}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-700/80 bg-slate-800"
              onError={(e) => {
                // fallback placeholder
                (e.target as HTMLElement).setAttribute(
                  "src",
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120"
                );
              }}
            />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-base font-bold text-white tracking-tight">
                {profile.name || profile.username}
              </h3>
            </div>
            <div className="flex items-center text-xs font-mono text-indigo-400">
              <AtSign className="h-3 w-3 mr-0.5" />
              <span>{profile.username}</span>
            </div>
          </div>
        </div>

        {badge && (
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${badgeStyles}`}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Bio text */}
      {profile.bio && (
        <p className="mt-3.5 text-xs leading-relaxed text-slate-300 line-clamp-3">
          {profile.bio}
        </p>
      )}

      {/* Stats bar */}
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-950/60 p-2.5 text-center font-mono border border-slate-800/60">
        <div>
          <span className="block text-xs font-bold text-white">
            {formatNumber(profile.followers)}
          </span>
          <span className="text-[10px] text-slate-400">Followers</span>
        </div>
        <div className="border-x border-slate-800/80">
          <span className="block text-xs font-bold text-white">
            {formatNumber(profile.following)}
          </span>
          <span className="text-[10px] text-slate-400">Following</span>
        </div>
        <div>
          <span className="block text-xs font-bold text-white">
            {profile.account_age_days || 0}d
          </span>
          <span className="text-[10px] text-slate-400">Account Age</span>
        </div>
      </div>

      {/* Links preview */}
      {profile.links && profile.links.length > 0 && (
        <div className="mt-3.5 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
            External Endpoints ({profile.links.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {profile.links.map((link, i) => (
              <span
                key={i}
                className="inline-flex items-center space-x-1 rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300 font-mono ring-1 ring-slate-700/50"
              >
                <Link2 className="h-2.5 w-2.5 text-indigo-400" />
                <span className="max-w-[160px] truncate">{link}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
