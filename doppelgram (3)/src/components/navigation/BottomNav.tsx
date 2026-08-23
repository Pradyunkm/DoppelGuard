import React from 'react';
import { Home, Compass, PlusSquare, Settings, User } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../common/Avatar';

export const BottomNav: React.FC = () => {
  const {
    activePage,
    currentUser,
    navigateToHome,
    navigateToExplore,
    navigateToSettings,
    navigateToProfile,
    setCreatePostModalOpen
  } = useSocial();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: navigateToHome,
      isActive: activePage === 'home'
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
      action: () => navigateToExplore(),
      isActive: activePage === 'explore'
    },
    {
      id: 'create',
      label: 'Create',
      icon: PlusSquare,
      action: () => setCreatePostModalOpen(true),
      isAction: true
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      action: navigateToSettings,
      isActive: activePage === 'settings'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      action: () => navigateToProfile(currentUser.username),
      isActive: activePage === 'profile',
      isAvatar: true
    }
  ];

  return (
    <nav
      id="doppelgram-mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-200 dark:border-neutral-800 px-3 py-2 flex items-center justify-around"
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const active = item.isActive;

        if (item.isAvatar) {
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`p-1 rounded-full transition-transform active:scale-95 ${
                active ? 'ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-neutral-950' : ''
              }`}
            >
              <Avatar src={currentUser.profileImage} alt={currentUser.displayName} size="xs" />
            </button>
          );
        }

        if (item.isAction) {
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-fuchsia-600 text-white shadow-md shadow-rose-500/30 active:scale-90 transition-transform"
            >
              <Icon className="w-5 h-5 stroke-[2.5]" />
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors active:scale-95 ${
              active
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Icon className={`w-6 h-6 ${active ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          </button>
        );
      })}
    </nav>
  );
};
