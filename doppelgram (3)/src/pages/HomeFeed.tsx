import React, { useState, useEffect } from 'react';
import { Sparkles, Users, RefreshCw, Layers, UserCheck } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { StoriesBar } from '../components/stories/StoriesBar';
import { PostCard } from '../components/feed/PostCard';
import { SuggestionsRail } from '../components/feed/SuggestionsRail';
import { Avatar } from '../components/common/Avatar';
import { VerifiedBadge } from '../components/common/Badge';

export const HomeFeed: React.FC = () => {
  const { posts, followedUserIds, profiles, navigateToProfile, navigateToExplore } = useSocial();
  const [feedTab, setFeedTab] = useState<'forYou' | 'following'>('forYou');
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  const followedProfiles = profiles.filter(p => followedUserIds.includes(p.id));

  // Initial simulated loading for realism
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const displayedPosts = posts.filter(post => {
    if (feedTab === 'following') {
      return followedUserIds.includes(post.userId);
    }
    return true;
  });

  const visiblePosts = displayedPosts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex justify-center px-3 sm:px-4 py-4 md:py-6">
      {/* Main Feed Column */}
      <main className="w-full max-w-xl flex flex-col min-w-0">
        {/* Top Feed Filter Tabs */}
        <div className="flex items-center justify-between mb-4 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-1.5 shadow-xs">
          <button
            onClick={() => {
              setFeedTab('forYou');
              setVisibleCount(6);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              feedTab === 'forYou'
                ? 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>For You</span>
          </button>
          <button
            onClick={() => {
              setFeedTab('following');
              setVisibleCount(6);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              feedTab === 'following'
                ? 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Following ({followedUserIds.length})</span>
          </button>
        </div>

        {/* When in Following tab, show the list of followed creators */}
        {feedTab === 'following' && (
          <div className="mb-6 p-4 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <UserCheck className="w-4 h-4 text-rose-500" />
                <span>Creators You Follow ({followedProfiles.length})</span>
              </div>
              <button
                onClick={() => navigateToExplore()}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Find More
              </button>
            </div>

            {followedProfiles.length === 0 ? (
              <p className="text-xs text-neutral-400">You haven't followed any creators yet.</p>
            ) : (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {followedProfiles.map(p => (
                  <div
                    key={p.id}
                    onClick={() => navigateToProfile(p.username)}
                    className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group min-w-[72px]"
                  >
                    <Avatar src={p.profileImage} alt={p.displayName} size="md" />
                    <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-rose-500 truncate max-w-[72px] text-center">
                      {p.username}
                    </span>
                    <span className="text-[10px] text-neutral-500 truncate max-w-[72px] text-center">
                      {p.displayName.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stories Horizontal Bar */}
        <StoriesBar />

        {/* Feed Posts */}
        {isLoading ? (
          // Skeleton Loaders
          <div className="flex flex-col gap-6">
            {[1, 2].map(i => (
              <div
                key={i}
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 animate-pulse flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="w-28 h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="w-20 h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  </div>
                </div>
                <div className="w-full aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
                <div className="flex flex-col gap-2">
                  <div className="w-32 h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 text-center flex flex-col items-center gap-3 my-4">
            <Layers className="w-12 h-12 text-rose-500/60" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              No posts in your following feed yet
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm">
              Follow more simulated creators to populate your custom timeline or switch back to For You.
            </p>
            <button
              onClick={() => setFeedTab('forYou')}
              className="mt-2 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white font-bold text-xs hover:opacity-90 transition-opacity"
            >
              Back to For You
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {visiblePosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Load more infinite loop indicator */}
            {visibleCount < displayedPosts.length ? (
              <div className="flex justify-center py-6">
                <button
                  onClick={handleLoadMore}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Load More Simulation Posts</span>
                </button>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-neutral-400">
                ✨ You've caught up with all latest simulation updates!
              </div>
            )}
          </div>
        )}
      </main>

      {/* Right Suggestions Rail */}
      <SuggestionsRail />
    </div>
  );
};
