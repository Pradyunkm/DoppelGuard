import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles, MapPin, Hash, Check } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../common/Avatar';

const PRESET_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
    title: 'Alpine Valley Mist'
  },
  {
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1000&auto=format&fit=crop&q=80',
    title: 'Pine Forest Path'
  },
  {
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80',
    title: 'Modern Coding Desk'
  },
  {
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&auto=format&fit=crop&q=80',
    title: 'Minimal Espresso Bar'
  },
  {
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&auto=format&fit=crop&q=80',
    title: 'Studio Interior Light'
  },
  {
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80',
    title: 'Tokyo Rain Reflections'
  }
];

export const CreatePostModal: React.FC = () => {
  const { isCreatePostModalOpen, setCreatePostModalOpen, createNewPost, currentUser } = useSocial();
  const [selectedUrl, setSelectedUrl] = useState(PRESET_IMAGES[0].url);
  const [customUrl, setCustomUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [isCustomMode, setIsCustomMode] = useState(false);

  if (!isCreatePostModalOpen) return null;

  const activeMediaUrl = isCustomMode && customUrl.trim() ? customUrl.trim() : selectedUrl;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMediaUrl || !caption.trim()) return;

    // Extract tags from caption
    const tagMatches = caption.match(/#[\w\d_]+/g);
    const tags = tagMatches ? tagMatches.map(t => t.replace('#', '')) : ['simulation', 'photography'];

    createNewPost({
      mediaUrl: activeMediaUrl,
      caption: caption.trim(),
      location: location.trim() || undefined,
      tags
    });

    setCaption('');
    setCreatePostModalOpen(false);
  };

  return (
    <div
      id="doppelgram-create-post-overlay"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={() => setCreatePostModalOpen(false)}
    >
      <div
        id="doppelgram-create-post-modal"
        className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                Simulate New Post
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Publish a photo into the simulation feed
              </p>
            </div>
          </div>
          <button
            onClick={() => setCreatePostModalOpen(false)}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {/* User info */}
          <div className="flex items-center gap-3">
            <Avatar src={currentUser.profileImage} alt={currentUser.displayName} size="sm" />
            <div>
              <span className="font-bold text-sm text-neutral-900 dark:text-white block">
                {currentUser.displayName}
              </span>
              <span className="text-xs text-neutral-500">@{currentUser.username} (You)</span>
            </div>
          </div>

          {/* Media Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
              Select Preset Photo or Custom Image URL
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
              {PRESET_IMAGES.map((img, i) => {
                const isSelected = !isCustomMode && selectedUrl === img.url;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedUrl(img.url);
                      setIsCustomMode(false);
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 scale-105 shadow-md shadow-rose-500/20 ring-2 ring-rose-500/30'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white stroke-[3] drop-shadow-md" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom URL Option */}
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={e => {
                  setCustomUrl(e.target.value);
                  setIsCustomMode(true);
                }}
                placeholder="Or paste any custom image URL (https://...)"
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 outline-hidden focus:border-rose-500"
              />
              {customUrl && (
                <button
                  type="button"
                  onClick={() => setIsCustomMode(true)}
                  className={`text-xs px-3 py-2 rounded-xl font-semibold transition-colors ${
                    isCustomMode
                      ? 'bg-rose-500 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  Use URL
                </button>
              )}
            </div>
          </div>

          {/* Active Preview */}
          <div className="w-full aspect-video sm:aspect-2/1 rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center relative border border-neutral-200 dark:border-neutral-800">
            <img
              src={activeMediaUrl}
              alt="Post preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] text-white font-medium">
              Live Feed Preview
            </div>
          </div>

          {/* Caption Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={3}
              placeholder="Write a caption with tags and mentions (e.g., Sunday morning coffee #specialtycoffee @alex_roberts)..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 outline-hidden focus:border-rose-500 resize-none"
            />
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Add location..."
                className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 outline-hidden focus:border-rose-500"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!caption.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-fuchsia-600 hover:opacity-95 text-white font-bold text-sm shadow-md shadow-rose-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Publish to DoppelGram Feed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
