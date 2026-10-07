import React from 'react';
import { Heart, Send, Smartphone, Monitor, Sun, Moon } from 'lucide-react';
import { useInstagram } from '../../context/InstagramContext';

export const Navbar: React.FC = () => {
  const {
    chats,
    notifications,
    setActiveTab,
    activeTab,
    deviceFrameMode,
    setDeviceFrameMode,
    theme,
    setTheme,
    setIsExpoModalOpen,
  } = useInstagram();

  const unreadMessagesCount = chats.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 w-full bg-black/95 backdrop-blur-md border-b border-neutral-800/80 px-4 py-2 flex items-center justify-between text-white shrink-0 select-none">
      {/* Brand Zone: Instagram Wordmark */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('feed')}
          className="text-2xl font-brand tracking-normal text-white hover:opacity-85 transition-opacity text-left cursor-pointer"
          aria-label="Instagram Home"
        >
          Instagram
        </button>
      </div>

      {/* Right Action Icons Zone */}
      <div className="flex items-center gap-1.5">
        {/* Expo.dev Export Kit Button */}
        <button
          onClick={() => setIsExpoModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/40 text-pink-300 rounded-full hover:bg-pink-500/30 transition-colors cursor-pointer"
          title="Expo.dev Native App Code & Build Kit"
        >
          <Smartphone className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-[11px] font-bold">Expo App</span>
        </button>

        {/* Notifications Heart */}
        <button
          onClick={() => setActiveTab('notifications')}
          className={`relative min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'notifications' ? 'text-white' : 'text-neutral-300 hover:text-white'
          }`}
          aria-label="Notifications"
        >
          <Heart className={`w-6 h-6 ${activeTab === 'notifications' ? 'fill-white' : ''}`} />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-black animate-pulse" />
          )}
        </button>

        {/* Direct Messages Paper Airplane */}
        <button
          onClick={() => setActiveTab('messages')}
          className={`relative min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'messages' ? 'text-white' : 'text-neutral-300 hover:text-white'
          }`}
          aria-label="Direct Messages"
        >
          <Send className={`w-6 h-6 -rotate-12 ${activeTab === 'messages' ? 'fill-white' : ''}`} />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-black">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
