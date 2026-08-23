import React from 'react';
import { SocialProvider, useSocial } from './context/SocialContext';
import { Sidebar } from './components/navigation/Sidebar';
import { Header } from './components/navigation/Header';
import { BottomNav } from './components/navigation/BottomNav';
import { DemoBanner } from './components/common/DemoBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { StoryViewer } from './components/stories/StoryViewer';
import { CommentDrawer } from './components/feed/CommentDrawer';
import { PostDetailModal } from './components/feed/PostDetailModal';
import { QuickSearchModal } from './components/search/QuickSearchModal';
import { CreatePostModal } from './components/post/CreatePostModal';
import { JsonExportModal } from './components/profile/JsonExportModal';
import { DoppelGramAiSafetyChat } from './components/common/DoppelGramAiSafetyChat';

import { HomeFeed } from './pages/HomeFeed';
import { ExplorePage } from './pages/ExplorePage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activePage } = useSocial();

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomeFeed />;
      case 'explore':
        return <ExplorePage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomeFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex flex-col antialiased">
      {/* Top Persistent Dismissible Demo Banner */}
      <DemoBanner />

      {/* Mobile Top Header */}
      <Header />

      {/* Main App Container */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Desktop Sidebar Nav */}
        <Sidebar />

        {/* Dynamic Main Page Content */}
        <div className="flex-1 min-w-0 pb-20 md:pb-8">
          {renderActivePage()}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />

      {/* Global Interactive Overlays & Modals */}
      <StoryViewer />
      <CommentDrawer />
      <PostDetailModal />
      <QuickSearchModal />
      <CreatePostModal />
      <JsonExportModal />
      <ToastContainer />

      {/* Floating AI Cyber Safety & Scam Copilot */}
      <DoppelGramAiSafetyChat />
    </div>
  );
};

export default function App() {
  return (
    <SocialProvider>
      <AppContent />
    </SocialProvider>
  );
}
