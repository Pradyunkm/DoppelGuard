import React, { useState } from 'react';
import { X, Send, Heart, Smile } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../common/Avatar';
import { Post } from '../../types/post';

export const CommentDrawer: React.FC = () => {
  const { activeCommentDrawerPost, closeCommentDrawer, addComment, currentUser, navigateToProfile } = useSocial();
  const [commentText, setCommentText] = useState('');
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>([]);

  if (!activeCommentDrawerPost) return null;

  const post = activeCommentDrawerPost;
  const comments = post.comments || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleEmojiClick = (emoji: string) => {
    setCommentText(prev => prev + emoji);
  };

  const toggleLikeComment = (commentId: string) => {
    setLikedCommentIds(prev =>
      prev.includes(commentId) ? prev.filter(id => id !== commentId) : [...prev, commentId]
    );
  };

  return (
    <div
      id="doppelgram-comment-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={closeCommentDrawer}
    >
      <div
        id="doppelgram-comment-drawer-content"
        className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col max-h-[85vh] h-[550px] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          <div className="flex flex-col">
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
              Comments
            </h3>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Post by @{post.username}
            </span>
          </div>
          <button
            onClick={closeCommentDrawer}
            className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Comments list */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Post Caption as first comment item */}
          <div className="flex items-start gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
            <Avatar src={post.userAvatar} alt={post.username} size="sm" />
            <div className="flex-1 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
              <span
                onClick={() => {
                  closeCommentDrawer();
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
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-400">
              <Smile className="w-10 h-10 mb-2 stroke-[1.5] text-neutral-300 dark:text-neutral-600" />
              <p className="text-sm font-medium">No comments yet</p>
              <p className="text-xs text-neutral-500 mt-0.5">Be the first to start the conversation!</p>
            </div>
          ) : (
            comments.map(c => {
              const isCommentLiked = likedCommentIds.includes(c.id);
              const totalCommentLikes = (c.likesCount || 0) + (isCommentLiked ? 1 : 0);

              return (
                <div key={c.id} className="flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar
                      src={c.userAvatar}
                      alt={c.username}
                      size="sm"
                      onClick={() => {
                        closeCommentDrawer();
                        navigateToProfile(c.username);
                      }}
                    />
                    <div className="flex flex-col flex-1">
                      <div className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
                        <span
                          onClick={() => {
                            closeCommentDrawer();
                            navigateToProfile(c.username);
                          }}
                          className="font-bold text-neutral-900 dark:text-white mr-1.5 cursor-pointer hover:underline"
                        >
                          {c.username}
                        </span>
                        <span>{c.content}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
                        <span>{c.timestamp}</span>
                        {totalCommentLikes > 0 && (
                          <span>
                            {totalCommentLikes} {totalCommentLikes === 1 ? 'like' : 'likes'}
                          </span>
                        )}
                        <button
                          onClick={() => setCommentText(`@${c.username} `)}
                          className="font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleLikeComment(c.id)}
                    className={`p-1.5 rounded-full transition-transform active:scale-75 ${
                      isCommentLiked
                        ? 'text-rose-500'
                        : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isCommentLiked ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Emoji Quick Picker */}
        <div className="flex items-center gap-2 px-5 py-2 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40">
          {['❤️', '🙌', '🔥', '👏', '😍', '✨', '☕', '💯'].map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleEmojiClick(emoji)}
              className="text-base hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Bottom Input Composer */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-3 bg-white dark:bg-neutral-900 shrink-0"
        >
          <Avatar src={currentUser.profileImage} alt={currentUser.displayName} size="sm" />
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder={`Add a comment as @${currentUser.username}...`}
            className="flex-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 text-xs sm:text-sm px-4 py-2.5 rounded-full outline-hidden border border-transparent focus:border-rose-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="p-2.5 rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
