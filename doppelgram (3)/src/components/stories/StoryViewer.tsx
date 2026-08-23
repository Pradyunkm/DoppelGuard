import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, Pause, Play } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../common/Avatar';

export const StoryViewer: React.FC = () => {
  const { activeStory, closeStory, stories, openStory, addToast } = useSocial();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedProgressRef = useRef<number>(0);

  const story = activeStory?.story;
  const slides = story?.slides || [];
  const activeSlide = slides[currentSlideIndex];
  const slideDuration = activeSlide?.durationMs || 5000;

  // Initialize or change active story
  useEffect(() => {
    if (activeStory) {
      setCurrentSlideIndex(activeStory.slideIndex || 0);
      setProgress(0);
      pausedProgressRef.current = 0;
      setIsPaused(false);
      setIsLiked(false);
    }
  }, [activeStory?.story.id, activeStory?.slideIndex]);

  const handleNext = useCallback(() => {
    if (!story) return;
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setProgress(0);
      pausedProgressRef.current = 0;
    } else {
      // Advance to next user's story if available
      const currentStoryIndex = stories.findIndex(s => s.id === story.id);
      if (currentStoryIndex !== -1 && currentStoryIndex < stories.length - 1) {
        openStory(stories[currentStoryIndex + 1], 0);
      } else {
        closeStory();
      }
    }
  }, [story, currentSlideIndex, slides.length, stories, openStory, closeStory]);

  const handlePrev = useCallback(() => {
    if (!story) return;
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      setProgress(0);
      pausedProgressRef.current = 0;
    } else {
      // Go to previous story
      const currentStoryIndex = stories.findIndex(s => s.id === story.id);
      if (currentStoryIndex > 0) {
        const prevStory = stories[currentStoryIndex - 1];
        openStory(prevStory, prevStory.slides.length - 1);
      }
    }
  }, [story, currentSlideIndex, stories, openStory]);

  // Progress animation loop
  useEffect(() => {
    if (!activeStory || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = 50; // ms
    const step = (interval / slideDuration) * 100;

    timerRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeStory, isPaused, slideDuration, handleNext]);

  if (!activeStory || !story || !activeSlide) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addToast({
      type: 'success',
      message: `Reply sent to @${story.username}`
    });
    setReplyText('');
  };

  const handleQuickReaction = (emoji: string) => {
    addToast({
      type: 'success',
      message: `Reacted ${emoji} to @${story.username}`
    });
  };

  return (
    <div
      id="doppelgram-story-viewer-modal"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center select-none"
    >
      {/* Background click to close */}
      <button
        onClick={closeStory}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        title="Close story"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation arrows (desktop) */}
      <button
        onClick={handlePrev}
        className="hidden md:flex absolute left-8 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        title="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="hidden md:flex absolute right-8 z-40 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        title="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Story Stage Container */}
      <div
        className="relative w-full max-w-md h-[92vh] max-h-[820px] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Top Segmented Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
          {slides.map((s, idx) => {
            let fillPercent = 0;
            if (idx < currentSlideIndex) fillPercent = 100;
            else if (idx === currentSlideIndex) fillPercent = progress;

            return (
              <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75 ease-linear rounded-full"
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Top Header info */}
        <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar src={story.userAvatar} alt={story.username} size="sm" />
            <div className="flex items-center gap-2 text-white">
              <span className="font-semibold text-sm drop-shadow-md">
                {story.username}
              </span>
              <span className="text-xs text-white/70">
                {activeSlide.timestamp}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPaused(prev => !prev)}
              className="p-1.5 text-white/80 hover:text-white"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={closeStory}
              className="p-1.5 text-white/80 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media visual container */}
        <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
          <img
            src={activeSlide.mediaUrl}
            alt="Story media"
            className="w-full h-full object-cover"
          />

          {/* Left / Right tap zones for navigation */}
          <div
            onClick={e => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer"
          />
          <div
            onClick={e => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-0 top-0 bottom-0 w-2/3 z-20 cursor-pointer"
          />

          {/* Caption banner if exists */}
          {activeSlide.caption && (
            <div className="absolute bottom-20 left-4 right-4 z-30 p-3 rounded-xl bg-black/60 backdrop-blur-md text-white text-center text-sm font-medium">
              {activeSlide.caption}
            </div>
          )}
        </div>

        {/* Bottom Reaction & Reply Bar */}
        <div className="absolute bottom-3 left-3 right-3 z-30 flex flex-col gap-2">
          {/* Quick emoji bar */}
          <div className="flex items-center justify-around py-1 px-2 rounded-full bg-black/40 backdrop-blur-md">
            {['🔥', '❤️', '👏', '😍', '☕', '🚀'].map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleQuickReaction(emoji)}
                className="text-lg hover:scale-125 active:scale-95 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder={`Reply to @${story.username}...`}
              className="flex-1 bg-white/20 hover:bg-white/25 focus:bg-white/30 text-white placeholder-white/70 text-sm px-4 py-2.5 rounded-full outline-hidden border border-white/20 transition-colors"
            />
            <button
              type="button"
              onClick={() => {
                setIsLiked(prev => !prev);
                if (!isLiked) {
                  addToast({ type: 'success', message: `Liked @${story.username}'s story` });
                }
              }}
              className={`p-2.5 rounded-full transition-transform active:scale-90 ${
                isLiked ? 'text-rose-500 bg-white/20' : 'text-white bg-white/10 hover:bg-white/20'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2.5 rounded-full bg-rose-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-rose-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
