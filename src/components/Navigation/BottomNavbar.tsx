import React from 'react';
import { Home, Compass, Film, PlusSquare } from 'lucide-react';
import { useInstagram } from '../../context/InstagramContext';
import { ActiveTab } from '../../types/instagram';

export const BottomNavbar: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, setIsCreateModalOpen } = useInstagram();

  const tabs: { tab?: ActiveTab; icon: React.ReactNode; label: string; onClick?: () => void }[] = [
    {
      tab: 'feed',
      label: 'Home',
      icon: <Home className={`w-6 h-6 ${activeTab === 'feed' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />,
      onClick: () => setActiveTab('feed'),
    },
    {
      tab: 'explore',
      label: 'Explore',
      icon: <Compass className={`w-6 h-6 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />,
      onClick: () => setActiveTab('explore'),
    },
    {
      label: 'Create',
      icon: <PlusSquare className="w-6 h-6 stroke-[1.8]" />,
      onClick: () => setIsCreateModalOpen(true),
    },
    {
      tab: 'reels',
      label: 'Reels',
      icon: <Film className={`w-6 h-6 ${activeTab === 'reels' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />,
      onClick: () => setActiveTab('reels'),
    },
    {
      tab: 'profile',
      label: 'Profile',
      icon: (
        <div className={`w-7 h-7 rounded-full overflow-hidden p-[1.5px] transition-all ${
          activeTab === 'profile' ? 'ring-2 ring-white' : 'ring-1 ring-transparent'
        }`}>
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            referrerPolicy="no-referrer"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      ),
      onClick: () => setActiveTab('profile'),
    },
  ];

  return (
    <nav
      className="w-full bg-black/95 backdrop-blur-md border-t border-neutral-800/80 px-2 py-1 flex items-center justify-around h-12 text-white select-none shrink-0"
      aria-label="Mobile Bottom Navigation"
    >
      {tabs.map((item, idx) => {
        const isActive = item.tab && activeTab === item.tab;
        return (
          <button
            key={idx}
            onClick={item.onClick}
            aria-label={item.label}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-transform active:scale-90 cursor-pointer ${
              isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {item.icon}
          </button>
        );
      })}
    </nav>
  );
};
