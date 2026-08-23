import React from 'react';
import {
  Home,
  Compass,
  PlusSquare,
  Bookmark,
  Settings,
  Search,
  Sparkles,
  Sun,
  Moon,
  Camera
} from 'lucide-react';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../common/Avatar';
import { VerifiedBadge } from '../common/Badge';

export const Sidebar: React.FC = () => {
  const {
    activePage,
    currentUser,
    navigateToHome,
    navigateToExplore,
    navigateToSettings,
    navigateToProfile,
    setSearchModalOpen,
    setCreatePostModalOpen,
    theme,
    setTheme
  } = useSocial();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: navigateToHome,
      isActive: activePage === 'home'
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      action: () => setSearchModalOpen(true),
      shortcut: '⌘K'
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
      action: () => setCreatePostModalOpen(true)
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      action: navigateToSettings,
      isActive: activePage === 'settings'
    }
  ];

  return (
    <aside
      id="doppelgram-desktop-sidebar"
      className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 border-r border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl px-4 py-6 select-none z-30 shrink-0"
    >
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div
          onClick={navigateToHome}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-amber-400 p-[2px] shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white dark:bg-neutral-900 rounded-[10px] flex items-center justify-center">
              <Camera className="w-5 h-5 text-rose-500 group-hover:rotate-6 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-rose-600 via-fuchsia-600 to-purple-600 dark:from-rose-400 dark:via-fuchsia-400 dark:to-purple-400 bg-clip-text text-transparent">
              DoppelGram
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Social Simulation
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? 'bg-neutral-100 dark:bg-neutral-800/80 text-rose-600 dark:text-rose-400 font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      active ? 'stroke-[2.5]' : 'stroke-[1.8]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-neutral-200/60 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                    {item.shortcut}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Create CTA Button */}
          <div className="pt-3">
            <button
              onClick={() => setCreatePostModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white font-semibold text-sm shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <PlusSquare className="w-4 h-4" />
              <span>Simulate New Post</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Bottom Section: Theme & Current Profile */}
      <div className="flex flex-col gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-900 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-purple-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <span>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
          </div>
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Switch</span>
        </button>

        {/* Current User Persona Card */}
        <div
          onClick={() => navigateToProfile(currentUser.username)}
          className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 ${
            activePage === 'profile'
              ? 'bg-neutral-100 dark:bg-neutral-800 ring-1 ring-neutral-300 dark:ring-neutral-700'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar src={currentUser.profileImage} alt={currentUser.displayName} size="sm" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                  {currentUser.displayName}
                </span>
                <VerifiedBadge size="sm" />
              </div>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                @{currentUser.username}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
            You
          </span>
        </div>
      </div>
    </aside>
  );
};
