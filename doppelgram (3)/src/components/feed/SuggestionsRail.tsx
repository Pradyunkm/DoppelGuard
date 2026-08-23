import React from 'react';
import { Sparkles, Hash, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../common/Avatar';
import { VerifiedBadge } from '../common/Badge';

export const SuggestionsRail: React.FC = () => {
  const {
    profiles,
    currentUser,
    followedUserIds,
    toggleFollowUser,
    navigateToProfile,
    navigateToExplore,
    navigateToSettings
  } = useSocial();

  // Suggestions: profiles not yet followed or interesting ones
  const suggestedProfiles = profiles.slice(0, 5);

  const trendingTags = [
    { tag: 'architecture', count: '14.2k posts' },
    { tag: 'specialtycoffee', count: '9.8k posts' },
    { tag: 'leicaq2', count: '6.4k posts' },
    { tag: 'quantumcomputing', count: '4.1k posts' },
    { tag: 'urbanism', count: '3.7k posts' }
  ];

  return (
    <aside
      id="doppelgram-desktop-suggestions-rail"
      className="hidden xl:flex flex-col gap-6 w-80 shrink-0 sticky top-6 self-start pl-6 select-none"
    >
      {/* Current User Card */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
        <div
          onClick={() => navigateToProfile(currentUser.username)}
          className="flex items-center gap-3 cursor-pointer min-w-0"
        >
          <Avatar src={currentUser.profileImage} alt={currentUser.displayName} size="md" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                {currentUser.displayName}
              </span>
              <VerifiedBadge size="sm" />
            </div>
            <span className="text-xs text-neutral-500 truncate">@{currentUser.username}</span>
          </div>
        </div>
        <button
          onClick={navigateToSettings}
          className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
        >
          Settings
        </button>
      </div>

      {/* Suggested Creators */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Suggested For You
          </span>
          <button
            onClick={() => navigateToExplore()}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            See All
          </button>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          {suggestedProfiles.map(p => {
            const isFollowing = followedUserIds.includes(p.id);

            return (
              <div key={p.id} className="flex items-center justify-between gap-2">
                <div
                  onClick={() => navigateToProfile(p.username)}
                  className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
                >
                  <Avatar src={p.profileImage} alt={p.displayName} size="sm" />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-rose-500 truncate transition-colors">
                        {p.username}
                      </span>
                      {p.verified && <VerifiedBadge size="sm" type={p.badgeType} />}
                    </div>
                    <span className="text-[11px] text-neutral-500 truncate">
                      {p.categoryTag || 'Creator'} • {(p.followers || 0).toLocaleString()} followers
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollowUser(p.id)}
                  className={`text-xs font-bold px-3 py-1 rounded-full transition-all shrink-0 cursor-pointer ${
                    isFollowing
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
                      : 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Hashtags */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Simulation Trends
        </span>

        <div className="flex flex-col gap-2">
          {trendingTags.map(item => (
            <div
              key={item.tag}
              onClick={() => navigateToExplore(`#${item.tag}`)}
              className="flex items-center justify-between p-1.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                  <Hash className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  #{item.tag}
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Simulation Info Note */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200/60 dark:from-neutral-900 dark:to-neutral-800/40 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
        <div className="flex items-center gap-1.5 font-bold text-neutral-800 dark:text-neutral-200 mb-1">
          <ShieldCheck className="w-4 h-4 text-rose-500" />
          <span>About DoppelGram</span>
        </div>
        <p className="text-[11px]">
          DoppelGram is a standalone, controlled social media simulation. Designed for testing and demo environments with realistic profiles, feeds, and galleries.
        </p>
      </div>
    </aside>
  );
};
