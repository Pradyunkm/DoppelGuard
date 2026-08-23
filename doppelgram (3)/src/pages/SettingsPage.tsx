import React from 'react';
import {
  Sun,
  Moon,
  Laptop,
  RotateCcw,
  Shield,
  Info,
  Layers,
  Database,
  Check,
  AlertTriangle,
  Code2,
  ExternalLink
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { ThemeMode } from '../types/common';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, resetDemoData, followedUserIds, likedPostIds, savedPostIds, posts } = useSocial();

  const themeOptions: { id: ThemeMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'light', label: 'Light Mode', icon: Sun },
    { id: 'dark', label: 'Dark Mode', icon: Moon },
    { id: 'system', label: 'System Default', icon: Laptop }
  ];

  return (
    <div id="doppelgram-settings-page" className="w-full max-w-3xl mx-auto px-4 py-6 md:py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Settings & Environment
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Manage simulation preferences, appearance, and local demo datasets.
        </p>
      </div>

      {/* Theme Selection Card */}
      <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Appearance & Theme
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Select your preferred color scheme for the DoppelGram interface.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themeOptions.map(opt => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-rose-500 bg-rose-500/5 dark:bg-rose-500/10 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-rose-500 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    {opt.label}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-rose-500" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Local Simulation Data Management */}
      <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 shadow-xs flex flex-col gap-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Demo State & Reset
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            DoppelGram stores your likes, comments, and follows inside browser local storage for persistent testing.
          </p>
        </div>

        {/* Current State Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-center">
            <span className="block text-lg font-black text-rose-500">{likedPostIds.length}</span>
            <span className="text-xs font-semibold text-neutral-500">Liked Posts</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-center">
            <span className="block text-lg font-black text-amber-500">{savedPostIds.length}</span>
            <span className="text-xs font-semibold text-neutral-500">Saved Items</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-center">
            <span className="block text-lg font-black text-purple-500">{followedUserIds.length}</span>
            <span className="text-xs font-semibold text-neutral-500">Followed Creators</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 text-center">
            <span className="block text-lg font-black text-emerald-500">{posts.length}</span>
            <span className="text-xs font-semibold text-neutral-500">Total Posts</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={resetDemoData}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data to Initial Baseline</span>
          </button>
        </div>
      </section>

      {/* About the Simulation */}
      <section className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-4 leading-relaxed">
        <div className="flex items-center gap-2.5 text-neutral-900 dark:text-white">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-bold">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold">About DoppelGram Simulation</h2>
            <span className="text-xs text-neutral-400">Controlled Fictional Environment</span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 space-y-3">
          <p>
            <strong>DoppelGram</strong> is a self-contained, standalone web application simulating a modern photo-sharing social platform. It provides rich profile records, story rails, infinite feeds, comment drawers, and media galleries.
          </p>
          <p>
            <strong>Fictional Sandbox Guarantee:</strong> All profiles, accounts, followers, comments, and media entries in this application are completely fictional and isolated. No connections are made to Instagram, Meta, or any real third-party social media APIs.
          </p>
          <p>
            <strong>Standardized Data Export:</strong> Every profile in DoppelGram includes a standard JSON export schema containing username, display name, bio, photo URL, follower statistics, verified status, and external links, ready to be ingested by external analysis tools.
          </p>
        </div>

        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>DoppelGram v1.0.0 • Client-side Simulation</span>
          <span>React 19 + TypeScript + Vite + Tailwind</span>
        </div>
      </section>
    </div>
  );
};
