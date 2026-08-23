import React from 'react';
import { Plus } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../common/Avatar';

export const StoriesBar: React.FC = () => {
  const { stories, currentUser, openStory, setCreatePostModalOpen } = useSocial();

  return (
    <div
      id="doppelgram-stories-bar"
      aria-label="Stories"
      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-xs mb-6 overflow-hidden"
    >
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
        {/* Your Story item */}
        <div
          onClick={() => setCreatePostModalOpen(true)}
          className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
        >
          <div className="relative">
            <Avatar
              src={currentUser.profileImage}
              alt="Your story"
              size="lg"
              className="group-hover:opacity-90"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center border-2 border-white dark:border-neutral-900 shadow-sm">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 max-w-[68px] truncate">
            Your Story
          </span>
        </div>

        {/* Stories list */}
        {stories.map(story => (
          <div
            key={story.id}
            onClick={() => openStory(story, 0)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <Avatar
              src={story.userAvatar}
              alt={story.username}
              size="lg"
              hasStoryRing={true}
              hasUnseenStory={story.hasUnseen}
            />
            <span
              className={`text-xs max-w-[68px] truncate transition-colors ${
                story.hasUnseen
                  ? 'font-semibold text-neutral-900 dark:text-white'
                  : 'font-normal text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {story.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
