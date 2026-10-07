import React from 'react';
import { useInstagram } from '../../context/InstagramContext';

export const SuggestedSidebar: React.FC = () => {
  const { currentUser, suggestedUsers, toggleFollowUser, setActiveTab } = useInstagram();

  return (
    <aside className="hidden lg:block w-80 py-6 px-4 select-none shrink-0" aria-label="Suggested Accounts">
      {/* Current User Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-neutral-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white tracking-tight group-hover:text-neutral-300">
              {currentUser.username}
            </span>
            <span className="text-xs text-neutral-400 truncate max-w-[150px]">
              {currentUser.name}
            </span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className="text-xs font-semibold text-blue-500 hover:text-white transition-colors cursor-pointer"
        >
          Profile
        </button>
      </div>

      {/* Suggested For You Header */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="font-semibold text-neutral-400">Suggested for you</span>
        <button
          onClick={() => setActiveTab('explore')}
          className="font-semibold text-white hover:text-neutral-400 transition-colors cursor-pointer"
        >
          See All
        </button>
      </div>

      {/* Suggested Accounts List */}
      <div className="flex flex-col gap-3">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-neutral-800">
                <img
                  src={user.avatar}
                  alt={user.username}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-white truncate max-w-[130px]">
                    {user.username}
                  </span>
                  {user.isVerified && <span className="text-blue-500 font-bold text-[10px]">●</span>}
                </div>
                <span className="text-neutral-500 text-[11px] truncate max-w-[130px]">
                  {user.isFollowing ? 'Follows you' : 'Suggested for you'}
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleFollowUser(user.id)}
              className={`font-semibold cursor-pointer transition-colors ${
                user.isFollowing
                  ? 'text-neutral-400 hover:text-red-400'
                  : 'text-blue-500 hover:text-blue-400'
              }`}
            >
              {user.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>

      {/* Footer links */}
      <footer className="mt-8 pt-4 text-[11px] text-neutral-600 leading-relaxed">
        <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3">
          <span>About</span>
          <span>·</span>
          <span>Help</span>
          <span>·</span>
          <span>Press</span>
          <span>·</span>
          <span>API</span>
          <span>·</span>
          <span>Jobs</span>
          <span>·</span>
          <span>Privacy</span>
          <span>·</span>
          <span>Terms</span>
          <span>·</span>
          <span>Locations</span>
          <span>·</span>
          <span>Language</span>
        </div>
        <p className="text-neutral-600 font-normal">© 2026 INSTAGRAM CLONE FOR EXPO & WEB</p>
      </footer>
    </aside>
  );
};
