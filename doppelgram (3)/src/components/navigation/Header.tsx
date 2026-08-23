import React from 'react';
import { Camera, Search, PlusSquare, Moon, Sun, Shield } from 'lucide-react';
import { useSocial } from '../../context/SocialContext';

export const Header: React.FC = () => {
  const {
    navigateToHome,
    setSearchModalOpen,
    setCreatePostModalOpen,
    theme,
    setTheme
  } = useSocial();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      id="doppelgram-mobile-header"
      className="md:hidden sticky top-0 z-30 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 flex items-center justify-between"
    >
      <div
        onClick={navigateToHome}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 p-[1.5px] shadow-sm">
          <div className="w-full h-full bg-white dark:bg-neutral-900 rounded-[7px] flex items-center justify-center">
            <Camera className="w-4 h-4 text-rose-500" />
          </div>
        </div>
        <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-rose-600 to-purple-600 dark:from-rose-400 dark:to-purple-400 bg-clip-text text-transparent">
          DoppelGram
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setSearchModalOpen(true)}
          className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Search simulation"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 text-purple-400" />
          ) : (
            <Sun className="w-5 h-5 text-amber-500" />
          )}
        </button>
      </div>
    </header>
  );
};
