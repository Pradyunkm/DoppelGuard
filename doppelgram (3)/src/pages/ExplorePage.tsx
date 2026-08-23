import React, { useState } from 'react';
import { Search, Heart, MessageCircle, Sparkles, Filter, Users, X } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { Avatar } from '../components/common/Avatar';
import { VerifiedBadge } from '../components/common/Badge';

const CATEGORIES = [
  { id: 'all', label: 'All Media' },
  { id: 'photography', label: 'Photography', tag: 'photography' },
  { id: 'tech', label: 'Tech & Hardware', tag: 'tech' },
  { id: 'design', label: 'Design & Architecture', tag: 'architecture' },
  { id: 'coffee', label: 'Coffee & Culinary', tag: 'food' },
  { id: 'adventure', label: 'Outdoors & Travel', tag: 'nature' }
];

export const ExplorePage: React.FC = () => {
  const {
    posts,
    profiles,
    searchQuery,
    setSearchQuery,
    selectedExploreCategory,
    setSelectedExploreCategory,
    openPostDetail,
    navigateToProfile
  } = useSocial();

  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);

  const cleanQuery = searchQuery.toLowerCase().trim();

  // Filter posts
  const filteredPosts = posts.filter(post => {
    // Check search query
    if (cleanQuery) {
      const matchUsername = post.username.toLowerCase().includes(cleanQuery);
      const matchCaption = post.caption.toLowerCase().includes(cleanQuery);
      const matchLocation = post.location?.toLowerCase().includes(cleanQuery);
      const matchTags = post.tags?.some(t => t.toLowerCase().includes(cleanQuery.replace('#', '')));
      if (!matchUsername && !matchCaption && !matchLocation && !matchTags) return false;
    }

    // Check category filter
    if (selectedExploreCategory !== 'all') {
      if (selectedExploreCategory === 'photography') {
        return post.tags?.some(t => ['leicaq2', 'photography', '35mm', 'cinematography', 'nightphotography'].includes(t));
      }
      if (selectedExploreCategory === 'tech') {
        return post.tags?.some(t => ['semiconductors', 'rustlang', 'gamedev', 'hardware', 'startups', 'quantumcomputing'].includes(t));
      }
      if (selectedExploreCategory === 'design') {
        return post.tags?.some(t => ['minimalism', 'architecture', 'scandinaviandesign', 'graphicdesign', 'ceramics', 'japandi'].includes(t));
      }
      if (selectedExploreCategory === 'coffee') {
        return post.tags?.some(t => ['coffeetime', 'specialtycoffee', 'sourdough', 'baking', 'v60'].includes(t));
      }
      if (selectedExploreCategory === 'adventure') {
        return post.tags?.some(t => ['alpinism', 'mountaineering', 'wanderlust', 'urbanism', 'cycling'].includes(t));
      }
    }

    return true;
  });

  // Filter profiles matching search query
  const matchingProfiles = cleanQuery
    ? profiles.filter(
        p =>
          p.username.toLowerCase().includes(cleanQuery) ||
          p.displayName.toLowerCase().includes(cleanQuery) ||
          p.bio.toLowerCase().includes(cleanQuery)
      )
    : [];

  return (
    <div id="doppelgram-explore-page" className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Search Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search posts, tags (#coffee, #tech), creators..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-hidden focus:border-rose-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map(cat => {
            const isActive = selectedExploreCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedExploreCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
                    : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* If search query has matching profiles */}
      {matchingProfiles.length > 0 && (
        <div className="mb-8 p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-500" />
            <span>Matching Creators ({matchingProfiles.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {matchingProfiles.map(p => (
              <div
                key={p.id}
                onClick={() => navigateToProfile(p.username)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/60 cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all"
              >
                <Avatar src={p.profileImage} alt={p.displayName} size="md" />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                      {p.displayName}
                    </span>
                    {p.verified && <VerifiedBadge size="sm" type={p.badgeType} />}
                  </div>
                  <span className="text-xs text-neutral-500 truncate">@{p.username}</span>
                  <span className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {p.followers.toLocaleString()} followers
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Posts */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
          <Sparkles className="w-10 h-10 mx-auto text-rose-500/60 mb-2" />
          <h3 className="font-bold text-base text-neutral-900 dark:text-white">
            No posts found
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Try adjusting your search keywords or switching category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              onClick={() => openPostDetail(post)}
              onMouseEnter={() => setHoveredPostId(post.id)}
              onMouseLeave={() => setHoveredPostId(null)}
              className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-neutral-950 cursor-pointer group shadow-xs"
            >
              <img
                src={post.mediaUrl}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Overlay */}
              <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 flex flex-col justify-between p-3 ${
                  hoveredPostId === post.id ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Avatar src={post.userAvatar} alt={post.username} size="xs" />
                  <span className="text-xs font-bold text-white truncate drop-shadow-sm">
                    {post.username}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4 text-white font-bold text-sm">
                  <div className="flex items-center gap-1.5 drop-shadow-md">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{post.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 drop-shadow-md">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>

                <div className="text-[11px] text-white/80 line-clamp-1">
                  {post.caption}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
