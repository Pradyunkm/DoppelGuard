import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, Hash, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../common/Avatar';
import { VerifiedBadge } from '../common/Badge';

export const QuickSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setSearchModalOpen,
    profiles,
    posts,
    navigateToProfile,
    navigateToExplore,
    followedUserIds,
    toggleFollowUser
  } = useSocial();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Filter profiles
  const matchingProfiles = profiles.filter(p => {
    if (!cleanQuery) return false;
    return (
      p.username.toLowerCase().includes(cleanQuery) ||
      p.displayName.toLowerCase().includes(cleanQuery) ||
      p.bio.toLowerCase().includes(cleanQuery) ||
      p.categoryTag?.toLowerCase().includes(cleanQuery)
    );
  }).slice(0, 6);

  // Extract relevant hashtags from posts
  const allTags: string[] = Array.from(new Set(posts.flatMap(p => p.tags || [])));
  const matchingTags: string[] = allTags.filter((t: string) => {
    if (!cleanQuery) return false;
    return t.toLowerCase().includes(cleanQuery.replace(/^#/, ''));
  }).slice(0, 4);

  const totalResultsCount = matchingProfiles.length + matchingTags.length;

  const handleSelectProfile = (username: string) => {
    setSearchModalOpen(false);
    navigateToProfile(username);
  };

  const handleSelectTag = (tag: string) => {
    setSearchModalOpen(false);
    navigateToExplore(`#${tag}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < totalResultsCount - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, totalResultsCount - 1)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < matchingProfiles.length) {
        const selected = matchingProfiles[selectedIndex];
        if (selected) handleSelectProfile(selected.username);
      } else {
        const tagIndex = selectedIndex - matchingProfiles.length;
        const selectedTag = matchingTags[tagIndex];
        if (selectedTag) handleSelectTag(selectedTag);
      }
    }
  };

  return (
    <div
      id="doppelgram-quick-search-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150"
      onClick={() => setSearchModalOpen(false)}
    >
      <div
        id="doppelgram-quick-search-modal"
        className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search creators, keywords, #hashtags..."
            className="flex-1 bg-transparent text-sm sm:text-base text-neutral-900 dark:text-white placeholder-neutral-400 outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchModalOpen(false)}
            className="text-xs font-mono px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!cleanQuery ? (
            <div className="p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 px-2">
                Popular Simulation Creators
              </div>
              <div className="flex flex-col gap-1">
                {profiles.slice(0, 5).map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProfile(p.username)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar src={p.profileImage} alt={p.displayName} size="sm" />
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                            {p.displayName}
                          </span>
                          {p.verified && <VerifiedBadge size="sm" type={p.badgeType} />}
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          @{p.username} • {p.categoryTag || 'Creator'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ) : totalResultsCount === 0 ? (
            <div className="p-8 text-center text-neutral-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-600" />
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                No matching simulation records found
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Try searching for "alex", "elena", "novatech", "coffee", or "#architecture"
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-2">
              {matchingProfiles.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1 px-2">
                    Profiles ({matchingProfiles.length})
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {matchingProfiles.map((p, idx) => {
                      const isFocused = selectedIndex === idx;
                      const isFollowing = followedUserIds.includes(p.id);

                      return (
                        <div
                          key={p.id}
                          onClick={() => handleSelectProfile(p.username)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                            isFocused
                              ? 'bg-neutral-100 dark:bg-neutral-800'
                              : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar src={p.profileImage} alt={p.displayName} size="sm" />
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                                  {p.displayName}
                                </span>
                                {p.verified && <VerifiedBadge size="sm" type={p.badgeType} />}
                              </div>
                              <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                @{p.username} • {p.followers.toLocaleString()} followers
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                toggleFollowUser(p.id);
                              }}
                              className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                                isFollowing
                                  ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                                  : 'bg-rose-500 text-white hover:bg-rose-600'
                              }`}
                            >
                              {isFollowing ? 'Following' : 'Follow'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {matchingTags.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1 px-2">
                    Hashtags
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {matchingTags.map((tag, idx) => {
                      const overallIdx = matchingProfiles.length + idx;
                      const isFocused = selectedIndex === overallIdx;

                      return (
                        <div
                          key={tag}
                          onClick={() => handleSelectTag(tag)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                            isFocused
                              ? 'bg-neutral-100 dark:bg-neutral-800'
                              : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                              <Hash className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                              #{tag}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-400 flex items-center gap-1">
                            Explore <CornerDownLeft className="w-3 h-3" />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
          <span>Navigate with <kbd className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">↓</kbd></span>
          <span>Select with <kbd className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">↵ Enter</kbd></span>
        </div>
      </div>
    </div>
  );
};
