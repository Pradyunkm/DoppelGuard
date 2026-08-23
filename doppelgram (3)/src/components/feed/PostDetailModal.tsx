import React, { useState } from 'react';
import { X, Heart, Bookmark, Share2, Send, MapPin, MoreHorizontal } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../common/Avatar';
import { VerifiedBadge } from '../common/Badge';

export const PostDetailModal: React.FC = () => {
  const {
    activePostDetail,
    closePostDetail,
    likedPostIds,
    savedPostIds,
    toggleLikePost,
    toggleSavePost,
    addComment,
    navigateToProfile,
    addToast
  } = useSocial();

  const [commentInput, setCommentInput] = useState('');

  if (!activePostDetail) return null;

  const post = activePostDetail;
  const isLiked = likedPostIds.includes(post.id);
  const isSaved = savedPostIds.includes(post.id);
  const comments = post.comments || [];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    addToast({
      type: 'info',
      message: `Link to @${post.username}'s post copied to clipboard`
    });
  };

  return (
    <div
      id="doppelgram-post-detail-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={closePostDetail}
    >
      <button
        onClick={closePostDetail}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        id="doppelgram-post-detail-modal"
        className="w-full max-w-5xl max-h-[90vh] bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        {/* Media Preview Column */}
        <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
          <img
            src={post.mediaUrl}
            alt={post.caption}
            className="w-full h-full max-h-[75vh] object-contain"
          />
        </div>

        {/* Details & Comments Column */}
        <div className="w-full md:w-2/5 flex flex-col h-full justify-between bg-white dark:bg-neutral-900 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800">
          {/* Post Header */}
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div
              onClick={() => {
                closePostDetail();
                navigateToProfile(post.username);
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Avatar src={post.userAvatar} alt={post.username} size="sm" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-rose-500 transition-colors">
                    {post.username}
                  </span>
                  {post.isVerified && <VerifiedBadge size="sm" />}
                </div>
                {post.location && (
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {post.location}
                  </span>
                )}
              </div>
            </div>
            <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Comments List / Body */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 max-h-[350px] md:max-h-[420px]">
            {/* Caption item */}
            <div className="flex items-start gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
              <Avatar src={post.userAvatar} alt={post.username} size="sm" />
              <div className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
                <span
                  onClick={() => {
                    closePostDetail();
                    navigateToProfile(post.username);
                  }}
                  className="font-bold text-neutral-900 dark:text-white mr-1.5 cursor-pointer hover:underline"
                >
                  {post.username}
                </span>
                <span>{post.caption}</span>
                <div className="text-[11px] text-neutral-400 mt-1">{post.timestamp}</div>
              </div>
            </div>

            {/* Comments list */}
            {comments.map(c => (
              <div key={c.id} className="flex items-start gap-3 text-xs sm:text-sm">
                <Avatar
                  src={c.userAvatar}
                  alt={c.username}
                  size="sm"
                  onClick={() => {
                    closePostDetail();
                    navigateToProfile(c.username);
                  }}
                />
                <div className="flex-1">
                  <span
                    onClick={() => {
                      closePostDetail();
                      navigateToProfile(c.username);
                    }}
                    className="font-bold text-neutral-900 dark:text-white mr-1.5 cursor-pointer hover:underline"
                  >
                    {c.username}
                  </span>
                  <span className="text-neutral-800 dark:text-neutral-200">{c.content}</span>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{c.timestamp}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Actions & Composer */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLikePost(post.id)}
                  className={`transition-transform active:scale-80 ${
                    isLiked ? 'text-rose-500' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-rose-500' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => toggleSavePost(post.id)}
                className={`transition-transform active:scale-80 ${
                  isSaved ? 'text-amber-500' : 'text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-amber-500' : ''}`} />
              </button>
            </div>

            <div>
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {post.likesCount.toLocaleString()} likes
              </span>
              <span className="block text-[11px] text-neutral-400 mt-0.5">
                {post.timestamp}
              </span>
            </div>

            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-white dark:bg-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 px-3 py-2 rounded-lg outline-hidden border border-neutral-200 dark:border-neutral-700 focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="p-2 rounded-lg bg-rose-500 text-white disabled:opacity-40 hover:bg-rose-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
