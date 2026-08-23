import React from 'react';
import { AlertCircle, X, Shield, Sparkles } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

export const DemoBanner: React.FC = () => {
  const { isBannerDismissed, dismissBanner } = useSocial();

  if (isBannerDismissed) return null;

  return (
    <div
      id="doppelgram-demo-banner"
      className="relative z-40 bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border-b border-amber-500/20 dark:border-amber-500/30 px-3 py-2 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="inline-flex items-center justify-center p-1 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
            <AlertCircle className="w-4 h-4" />
          </span>
          <p className="truncate font-medium">
            <strong className="font-semibold text-neutral-900 dark:text-white">Simulated Environment:</strong>{' '}
            Controlled social platform simulation. All profiles, photos, and usernames are completely fictional.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-neutral-200/70 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300">
            <Shield className="w-3 h-3 text-emerald-500" />
            Sandbox Mode
          </span>
          <button
            onClick={dismissBanner}
            title="Dismiss notice"
            className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
