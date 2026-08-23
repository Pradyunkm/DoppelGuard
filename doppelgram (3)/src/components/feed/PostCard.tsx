import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Send, MapPin } from 'lucide-react';
import { Post } from '../../types/post';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../common/Avatar';
import { VerifiedBadge } from '../common/Badge';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    likedPostIds,
    savedPostIds,
    toggleLikePost,
    toggleSavePost,
    navigateToProfile,
    openPostDetail,
    openCommentDrawer,
    addComment,
    addToast
  } = useSocial();

  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const lastTapRef = useRef<number>(0);

  const isLiked = likedPostIds.includes(post.id);
  const isSaved = savedPostIds.includes(post.id);

  // Double tap to like
  const handleImageTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!isLiked) {
        toggleLikePost(post.id);
      }
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 900);
    }
    lastTapRef.current = now;
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    addToast({
      type: 'info',
      message: `Link to @${post.username}'s post copied to clipboard`
    });
  };

  const handleQuickCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  // Format caption hashtags & mentions
  const renderFormattedCaption = (text: string) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, i) => {
      if (part.startsWith('#')) {
        return (
          <span key={i} className="text-rose-600 dark:text-rose-400 hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      if (part.startsWith('@')) {
        const username = part.replace(/^@|[.,!?]$/g, '');
        return (
          <span
            key={i}
            onClick={() => navigateToProfile(username)}
            className="text-fuchsia-600 dark:text-fuchsia-400 font-semibold hover:underline cursor-pointer"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <article
      id={`post-${post.id}`}
      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl shadow-xs overflow-hidden mb-6 transition-all duration-200"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800/60">
        <div
          onClick={() => navigateToProfile(post.username)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <Avatar
            src={post.userAvatar}
            alt={post.userDisplayName || post.username}
            size="sm"
            className="group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-neutral-900 dark:text-white truncate group-hover:text-rose-500 transition-colors">
                {post.username}
              </span>
              {post.isVerified && <VerifiedBadge size="sm" />}
            </div>
            {post.location && (
              <div className="flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                <span className="truncate">{post.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-neutral-400">
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {post.timestamp}
          </span>
          <button
            onClick={() => openPostDetail(post)}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Media Image with Double-tap Heart animation */}
      <div
        onClick={handleImageTap}
        className="relative w-full aspect-square bg-neutral-950 flex items-center justify-center overflow-hidden cursor-pointer group select-none"
      >
        <img
          src={post.mediaUrl}
          alt={post.caption}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          loading="lazy"
        />

        {/* Double-tap Heart Burst */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart className="w-28 h-28 fill-rose-500 text-rose-500 drop-shadow-2xl animate-heart-burst" />
          </div>
        )}
      </div>

      {/* Action Buttons Bar */}
      <div className="px-4 pt-3.5 pb-2">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
              onClick={() => toggleLikePost(post.id)}
              className={`flex items-center gap-1.5 transition-transform active:scale-80 cursor-pointer ${
                isLiked ? 'text-rose-500' : 'text-neutral-700 dark:text-neutral-300 hover:text-rose-500 dark:hover:text-rose-400'
              }`}
            >
              <Heart
                className={`w-6 h-6 transition-all duration-200 ${
                  isLiked ? 'fill-rose-500 scale-110' : 'stroke-[1.8]'
                }`}
              />
            </button>

            {/* Comment Button */}
            <button
              onClick={() => openCommentDrawer(post)}
              className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <MessageCircle className="w-6 h-6 stroke-[1.8]" />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          {/* Bookmark / Save */}
          <button
            onClick={() => toggleSavePost(post.id)}
            className={`transition-transform active:scale-80 cursor-pointer ${
              isSaved
                ? 'text-amber-500 dark:text-amber-400'
                : 'text-neutral-700 dark:text-neutral-300 hover:text-amber-500 dark:hover:text-amber-400'
            }`}
          >
            <Bookmark
              className={`w-6 h-6 transition-all duration-200 ${
                isSaved ? 'fill-amber-500 scale-105' : 'stroke-[1.8]'
              }`}
            />
          </button>
        </div>

        {/* Likes Count */}
        <div className="mb-2">
          <span className="text-sm font-extrabold text-neutral-900 dark:text-white">
            {post.likesCount.toLocaleString()} {post.likesCount === 1 ? 'like' : 'likes'}
          </span>
        </div>

        {/* Caption */}
        <div className="text-sm text-neutral-800 dark:text-neutral-200 mb-2 leading-relaxed">
          <span
            onClick={() => navigateToProfile(post.username)}
            className="font-bold text-neutral-900 dark:text-white mr-2 cursor-pointer hover:underline"
          >
            {post.username}
          </span>
          <span>
            {isCaptionExpanded || post.caption.length <= 110 ? (
              renderFormattedCaption(post.caption)
            ) : (
              <>
                {renderFormattedCaption(post.caption.slice(0, 110))}...{' '}
                <button
                  onClick={() => setIsCaptionExpanded(true)}
                  className="text-neutral-500 dark:text-neutral-400 text-xs font-semibold hover:underline"
                >
                  more
                </button>
              </>
            )}
          </span>
        </div>

        {/* Comments link */}
        {post.commentsCount > 0 && (
          <button
            onClick={() => openCommentDrawer(post)}
            className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 mb-2 transition-colors cursor-pointer"
          >
            View all {post.commentsCount} comments
          </button>
        )}

        {/* Latest 2 comments preview */}
        {post.comments && post.comments.length > 0 && (
          <div className="flex flex-col gap-1 mb-3">
            {post.comments.slice(-2).map(c => (
              <div key={c.id} className="flex items-start justify-between text-xs text-neutral-700 dark:text-neutral-300">
                <div>
                  <span
                    onClick={() => navigateToProfile(c.username)}
                    className="font-semibold text-neutral-900 dark:text-white mr-1.5 cursor-pointer hover:underline"
                  >
                    {c.username}
                  </span>
                  <span>{c.content}</span>
                </div>
                <span className="text-[10px] text-neutral-400 ml-2 shrink-0">{c.timestamp}</span>
              </div>
            ))}
          </div>
        )}

        {/* Inline Quick Comment Input */}
        <form
          onSubmit={handleQuickCommentSubmit}
          className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80"
        >
          <input
            type="text"
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-hidden py-1"
          />
          <button
            type="submit"
            disabled={!commentInput.trim()}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 disabled:opacity-40 disabled:cursor-not-allowed hover:text-rose-700 dark:hover:text-rose-300 transition-colors shrink-0"
          >
            Post
          </button>
        </form>
      </div>
    </article>
  );
};
