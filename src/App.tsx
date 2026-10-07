/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { InstagramProvider, useInstagram } from './context/InstagramContext';
import { Navbar } from './components/Navigation/Navbar';
import { BottomNavbar } from './components/Navigation/BottomNavbar';
import { FeedView } from './components/Feed/FeedView';
import { ExploreView } from './components/Explore/ExploreView';
import { ReelsView } from './components/Reels/ReelsView';
import { DirectMessagesView } from './components/Direct/DirectMessagesView';
import { NotificationsView } from './components/Notifications/NotificationsView';
import { ProfileView } from './components/Profile/ProfileView';
import { StoryViewerModal } from './components/Feed/StoryViewerModal';
import { CreatePostModal } from './components/Create/CreatePostModal';
import { ExpoExportModal } from './components/Expo/ExpoExportModal';
import { Wifi, Battery, Signal } from 'lucide-react';

const MobileApplication: React.FC = () => {
  const {
    activeTab,
    toastMessage,
    activeStoryModal,
  } = useInstagram();

  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Render the current mobile screen view
  const renderActiveView = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedView />;
      case 'explore':
        return <ExploreView />;
      case 'reels':
        return <ReelsView />;
      case 'messages':
        return <DirectMessagesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <FeedView />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-950 flex justify-center items-center p-0 sm:py-4 select-none">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 border border-neutral-700 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Standalone Native Mobile App Body */}
      <div className="relative w-full sm:max-w-[425px] h-screen sm:h-[870px] bg-black sm:rounded-[50px] sm:border-[8px] sm:border-neutral-800 sm:shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col sm:ring-1 sm:ring-white/10">
        
        {/* iOS Status Bar with Dynamic Island */}
        <div className="w-full pt-2 pb-1 px-6 flex items-center justify-between bg-black text-white text-[12px] font-semibold shrink-0 z-40 select-none">
          {/* Current clock time */}
          <span>{currentTime}</span>

          {/* Dynamic Island Speaker Pill */}
          <div className="hidden sm:flex w-24 h-4 bg-neutral-900 rounded-full items-center justify-end pr-2 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
          </div>

          {/* Mobile Status Indicators */}
          <div className="flex items-center gap-1.5 text-neutral-200">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Mobile Top App Header */}
        <Navbar />

        {/* Scrollable Screen Content */}
        <main className="flex-1 w-full overflow-y-auto no-scrollbar bg-black text-white" aria-label="Instagram Mobile Screen">
          {renderActiveView()}
        </main>

        {/* Mobile Bottom 5-Tab Bar */}
        <div className="relative z-40 shrink-0">
          <BottomNavbar />
        </div>

        {/* Home Indicator Bar */}
        <div className="w-full py-1.5 bg-black flex justify-center z-40 shrink-0">
          <div className="w-32 h-1 bg-white/40 rounded-full" />
        </div>
      </div>

      {/* Global Interactive Modals */}
      {activeStoryModal && <StoryViewerModal />}
      <CreatePostModal />
      <ExpoExportModal />
    </div>
  );
};

export default function App() {
  return (
    <InstagramProvider>
      <MobileApplication />
    </InstagramProvider>
  );
}
