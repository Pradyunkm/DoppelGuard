import React, { useState, useEffect } from 'react';
import {
  Grid,
  Bookmark,
  Tag,
  Info,
  Calendar,
  Clock,
  MapPin,
  Globe,
  Share2,
  FileJson,
  UserCheck,
  UserPlus,
  Heart,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { Avatar } from '../components/common/Avatar';
import { VerifiedBadge } from '../components/common/Badge';
import { getPostsForUser } from '../data/posts';
import { UserProfile } from '../types/profile';

// Count-up helper component for stats animation with reliable fallback
const AnimatedCount: React.FC<{ value?: number }> = ({ value = 0 }) => {
  const target = typeof value === 'number' && !isNaN(value) ? value : 0;
  const [displayValue, setDisplayValue] = useState<number>(target);

  useEffect(() => {
    setDisplayValue(target);
  }, [target]);

  return <span>{displayValue.toLocaleString()}</span>;
};

export const ProfilePage: React.FC = () => {
  const {
    profiles,
    currentUser,
    viewedProfileUsername,
    posts: allContextPosts,
    savedPostIds,
    followedUserIds,
    toggleFollowUser,
    openPostDetail,
    openExportJsonModal,
    navigateToProfile,
    addToast
  } = useSocial();

  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged' | 'about'>('posts');
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);

  // Determine which profile is being viewed
  const targetUsername = viewedProfileUsername || currentUser.username;
  const isOwnProfile = targetUsername === currentUser.username;

  const profile: UserProfile =
    profiles.find(p => p.username === targetUsername) ||
    (isOwnProfile ? currentUser : profiles[0]);

  const isFollowing = followedUserIds.includes(profile.id);

  // Get posts for this specific user
  const userPosts = isOwnProfile
    ? allContextPosts.filter(p => p.userId === currentUser.id)
    : getPostsForUser(profile.id, profile.username);

  // Saved posts (if viewing saved tab)
  const savedPosts = allContextPosts.filter(p => savedPostIds.includes(p.id));

  const handleShareProfile = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    addToast({
      type: 'info',
      message: `Link to @${profile.username}'s profile copied`
    });
  };

  // Format bio with clickable mentions (@username) and hashtags
  const renderFormattedBio = (bioText: string) => {
    if (!bioText) return null;
    const parts = bioText.split(/(\s+)/);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        const username = part.replace(/^@|[.,!?:;✨🌲☕🚴‍♂️⚡🏺🚆🏔️]+$/g, '').trim();
        return (
          <span
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              navigateToProfile(username);
            }}
            className="text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer"
            title={`View @${username}'s profile`}
          >
            {part}
          </span>
        );
      }
      if (part.startsWith('#')) {
        return (
          <span key={i} className="text-purple-600 dark:text-purple-400 font-semibold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Handle clicking on profile links
  const handleLinkClick = (e: React.MouseEvent, url: string, title?: string) => {
    e.preventDefault();
    e.stopPropagation();

    const lowerTitle = (title || '').toLowerCase();
    const lowerUrl = url.toLowerCase();

    // Check if the URL points to DoppelGuard Security Hub
    if (
      lowerUrl.includes('localhost:5173') ||
      lowerUrl.includes('doppelguard') ||
      lowerTitle.includes('doppelguard') ||
      lowerTitle.includes('platform') ||
      lowerUrl.includes('doppelgram.internal')
    ) {
      window.open(`http://localhost:5173/?username=${profile.username}`, '_blank', 'noopener,noreferrer');
      addToast({
        type: 'info',
        message: `Opening DoppelGuard Security Audit for @${profile.username}...`
      });
      return;
    }

    // Check if the URL points to an internal DoppelGram profile
    const internalMatch =
      url.match(/doppelgram\.(?:com|internal)\/([a-zA-Z0-9_]+)/i) ||
      url.match(/^\/profile\/([a-zA-Z0-9_]+)/i) ||
      url.match(/^\/([a-zA-Z0-9_]+)$/);

    let matchedUsername = internalMatch ? internalMatch[1] : null;

    if (!matchedUsername) {
      const found = profiles.find(p => url.toLowerCase().includes(p.username.toLowerCase()));
      if (found && (url.includes('doppelgram') || url.startsWith('/'))) {
        matchedUsername = found.username;
      }
    }

    if (matchedUsername) {
      navigateToProfile(matchedUsername);
      return;
    }

    // Real external URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Fallback: open verification modal
    openExportJsonModal(profile);
  };

  return (
    <div id="doppelgram-profile-page" className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Large Avatar */}
          <div className="shrink-0">
            <Avatar
              src={profile.profileImage}
              alt={profile.displayName}
              size="2xl"
              hasStoryRing={true}
              hasUnseenStory={false}
            />
          </div>

          {/* Profile Information & Actions */}
          <div className="flex-1 flex flex-col gap-4 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-col">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                    {profile.displayName}
                  </h1>
                  {profile.verified && <VerifiedBadge size="md" type={profile.badgeType} />}
                </div>
                <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                  @{profile.username}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center sm:justify-end gap-2 flex-wrap">
                {!isOwnProfile ? (
                  <button
                    onClick={() => toggleFollowUser(profile.id)}
                    className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
                      isFollowing
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    Your Profile
                  </span>
                )}

                {/* Security Audit / Check Profile button */}
                <button
                  id="profile-scan-security-btn"
                  onClick={() => {
                    const doppelguardUrl = (import.meta as any).env?.VITE_DOPPELGUARD_FRONTEND_URL || 'https://color-changelog-ebony-constitution.trycloudflare.com';
                    const params = new URLSearchParams({
                      username: profile.username,
                      name: profile.displayName || '',
                      bio: profile.bio || '',
                      photo_url: profile.profileImage || '',
                      followers: String(profile.followers || 0),
                      following: String(profile.following || 0),
                      account_age_days: String(profile.accountAgeDays || 0),
                      links: (profile.links || []).map(l => l.url).join(',')
                    });
                    window.open(`${doppelguardUrl}/?${params.toString()}`, '_blank', 'noopener,noreferrer');
                    addToast({
                      type: 'info',
                      message: `Redirecting to DoppelGuard to audit @${profile.username}...`
                    });
                  }}
                  title="Check profile in DoppelGuard AI for impersonation, scam triggers, and fake signals"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 hover:bg-indigo-500/20 dark:hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <span>Check Profile</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShareProfile}
                  title="Share profile link"
                  className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats Counter Bar */}
            <div className="flex items-center justify-around sm:justify-start gap-6 py-3 border-y border-neutral-100 dark:border-neutral-800/80 text-sm">
              <div className="flex flex-col sm:flex-row items-center gap-1">
                <strong className="font-extrabold text-neutral-900 dark:text-white">
                  <AnimatedCount value={userPosts.length} />
                </strong>
                <span className="text-xs text-neutral-500">posts</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-1">
                <strong className="font-extrabold text-neutral-900 dark:text-white">
                  <AnimatedCount value={(profile?.followers ?? 0) + (isFollowing ? 1 : 0)} />
                </strong>
                <span className="text-xs text-neutral-500">followers</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-1">
                <strong className="font-extrabold text-neutral-900 dark:text-white">
                  <AnimatedCount value={profile?.following ?? 0} />
                </strong>
                <span className="text-xs text-neutral-500">following</span>
              </div>

              <div className="hidden md:flex flex-col sm:flex-row items-center gap-1">
                <strong className="font-extrabold text-neutral-900 dark:text-white">
                  <AnimatedCount value={profile?.accountAgeDays ?? 0} />
                </strong>
                <span className="text-xs text-neutral-500">days active</span>
              </div>
            </div>

            {/* Bio */}
            <div className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed max-w-xl">
              <p className="whitespace-pre-line">{renderFormattedBio(profile.bio)}</p>
            </div>

            {/* Category, Location & Links Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              {profile.categoryTag && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium">
                  <Sparkles className="w-3 h-3 text-rose-500" />
                  {profile.categoryTag}
                </span>
              )}

              {profile.location && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  {profile.location}
                </span>
              )}

              {profile.accountAgeDays && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300">
                  <Clock className="w-3 h-3" />
                  {profile.accountAgeDays} days old
                </span>
              )}
            </div>

            {/* External / Internal Profile Links */}
            {profile.links && profile.links.length > 0 && (
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                {profile.links.map(link => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={(e) => handleLinkClick(e, link.url, link.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-500 px-3 py-1.5 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs select-none"
                    title={`Open link: ${link.title}`}
                  >
                    <Globe className="w-3.5 h-3.5 text-rose-500" />
                    <span>{link.title}</span>
                    <ExternalLink className="w-3 h-3 opacity-70 text-rose-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-center gap-8 mb-6">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'posts'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posts ({userPosts.length})</span>
        </button>

        {isOwnProfile && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'saved'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved ({savedPosts.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('tagged')}
          className={`flex items-center gap-2 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'tagged'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Tagged</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 py-3 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'about'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>About</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        userPosts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8">
            <Grid className="w-10 h-10 mx-auto text-neutral-400 mb-2" />
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">No Posts Yet</h3>
            <p className="text-xs text-neutral-500 mt-1">This user hasn't published any simulation photos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {userPosts.map(post => (
              <div
                key={post.id}
                onClick={() => openPostDetail(post)}
                onMouseEnter={() => setHoveredPostId(post.id)}
                onMouseLeave={() => setHoveredPostId(null)}
                className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-950 cursor-pointer group shadow-xs"
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover stats */}
                <div
                  className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 flex items-center justify-center gap-6 text-white font-bold text-sm ${
                    hoveredPostId === post.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="flex items-center gap-1.5 drop-shadow-md">
                    <Heart className="w-5 h-5 fill-white" />
                    <span>{post.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 drop-shadow-md">
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'saved' && (
        savedPosts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8">
            <Bookmark className="w-10 h-10 mx-auto text-amber-500/60 mb-2" />
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">No Saved Posts</h3>
            <p className="text-xs text-neutral-500 mt-1">Tap the bookmark icon on any post in the feed to save it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {savedPosts.map(post => (
              <div
                key={post.id}
                onClick={() => openPostDetail(post)}
                className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-950 cursor-pointer group shadow-xs"
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'tagged' && (
        <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8">
          <Tag className="w-10 h-10 mx-auto text-neutral-400 mb-2" />
          <h3 className="font-bold text-base text-neutral-900 dark:text-white">Photos of @{profile.username}</h3>
          <p className="text-xs text-neutral-500 mt-1">When creators tag @{profile.username} in photos, they will appear here.</p>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
              Account Details & Simulation Metadata
            </h3>
            <p className="text-xs text-neutral-500">
              Verified dataset metrics for @{profile.username}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 flex flex-col gap-1">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                Date Joined
              </span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {profile.joinedDate || 'October 2021'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 flex flex-col gap-1">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Account Age
              </span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {profile.accountAgeDays} days active (~{(profile.accountAgeDays / 365).toFixed(1)} years)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 flex flex-col gap-1">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Verification Status
              </span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {profile.verified ? `Verified (${profile.badgeType || 'Standard'})` : 'Standard Account'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 flex flex-col gap-1">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-500" />
                Location
              </span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {profile.location || 'Global / Remote'}
              </span>
            </div>
          </div>

          {/* Quick CTA to export */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => openExportJsonModal(profile)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all cursor-pointer"
            >
              <FileJson className="w-4 h-4" />
              <span>Export Raw JSON Record</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
