import React from 'react';
import { Home, Search, Compass, Film, Send, Heart, PlusSquare, Smartphone, Settings } from 'lucide-react';
import { useInstagram } from '../../context/InstagramContext';
import { ActiveTab } from '../../types/instagram';

export const Sidebar: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    chats,
    notifications,
    setIsCreateModalOpen,
    setIsExpoModalOpen,
  } = useInstagram();

  const unreadMessagesCount = chats.reduce((acc, c) => acc + c.unreadCount, 0);
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      tab: 'feed',
      label: 'Home',
      icon: <Home className={`w-6 h-6 ${activeTab === 'feed' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />,
    },
    {
      tab: 'explore',
      label: 'Search',
      icon: <Search className={`w-6 h-6 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />,
    },
    {
      tab: 'explore',
      label: 'Explore',
      icon: <Compass className={`w-6 h-6 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />,
    },
    {
      tab: 'reels',
      label: 'Reels',
      icon: <Film className={`w-6 h-6 ${activeTab === 'reels' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />,
    },
    {
      tab: 'messages',
      label: 'Messages',
      icon: <Send className={`w-6 h-6 -rotate-12 ${activeTab === 'messages' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />,
      badge: unreadMessagesCount,
    },
    {
      tab: 'notifications',
      label: 'Notifications',
      icon: <Heart className={`w-6 h-6 ${activeTab === 'notifications' ? 'fill-white' : 'stroke-[1.8]'}`} />,
      badge: unreadNotifsCount,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-18 xl:w-60 h-screen sticky top-0 border-r border-neutral-800 bg-black text-white p-3 xl:px-4 xl:py-6 select-none shrink-0 z-20">
      <div className="flex flex-col gap-6">
        {/* Brand Wordmark */}
        <div className="pt-2 px-2">
          <button
            onClick={() => setActiveTab('feed')}
            className="hidden xl:block text-3xl font-brand tracking-normal text-left text-white hover:opacity-80 transition-opacity cursor-pointer"
          >
            Instagram
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className="xl:hidden flex items-center justify-center p-2 rounded-lg hover:bg-neutral-900 cursor-pointer"
            aria-label="Instagram Home"
          >
            <span className="text-2xl font-brand">IG</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
          {navItems.map((item, idx) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={`${item.label}-${idx}`}
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer group ${
                  isActive
                    ? 'font-bold text-white bg-neutral-900/60'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                }`}
                title={item.label}
              >
                <div className="relative flex items-center justify-center">
                  {item.icon}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-black">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="hidden xl:inline text-sm tracking-tight">{item.label}</span>
              </button>
            );
          })}

          {/* Create Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-4 p-3 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition-all cursor-pointer group"
            title="Create Post"
          >
            <PlusSquare className="w-6 h-6 stroke-[1.8] group-hover:scale-105 transition-transform" />
            <span className="hidden xl:inline text-sm font-medium tracking-tight">Create</span>
          </button>

          {/* Profile link */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'font-bold text-white bg-neutral-900/60'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
            title="Profile"
          >
            <div className={`w-6 h-6 rounded-full overflow-hidden ring-2 ${activeTab === 'profile' ? 'ring-white' : 'ring-transparent'}`}>
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden xl:inline text-sm tracking-tight truncate max-w-[120px]">
              Profile
            </span>
          </button>
        </nav>
      </div>

      {/* Bottom Sidebar items */}
      <div className="flex flex-col gap-2 pt-4 border-t border-neutral-800/60">
        {/* Expo.dev Export Helper Button */}
        <button
          onClick={() => setIsExpoModalOpen(true)}
          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-purple-500/30 text-purple-200 hover:border-purple-400 hover:text-white transition-all cursor-pointer"
          title="Expo.dev Native App Build Kit"
        >
          <Smartphone className="w-5 h-5 text-pink-400 shrink-0" />
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold">Expo.dev Mobile</span>
            <span className="text-[10px] text-neutral-400">Build native app</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-4 p-3 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings className="w-6 h-6 stroke-[1.8]" />
          <span className="hidden xl:inline text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};
