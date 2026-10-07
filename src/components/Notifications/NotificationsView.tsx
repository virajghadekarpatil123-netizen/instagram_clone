import React from 'react';
import { Heart, MessageCircle, UserPlus, Check } from 'lucide-react';
import { useInstagram } from '../../context/InstagramContext';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markAllNotificationsRead,
    toggleFollowUser,
    suggestedUsers,
    posts,
    setActivePostDetail,
  } = useInstagram();

  return (
    <div className="w-full max-w-lg mx-auto py-3 sm:py-6 px-3 sm:px-4 text-white flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <h2 className="text-xl font-bold tracking-tight">Activity</h2>
        <button
          onClick={markAllNotificationsRead}
          className="text-xs text-blue-500 hover:text-blue-400 font-semibold cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {notifications.map((notif) => {
          const userState = suggestedUsers.find((u) => u.id === notif.user.id) || notif.user;
          const targetPost = posts.find((p) => p.id === notif.targetPostId);

          return (
            <div
              key={notif.id}
              className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                notif.isRead ? 'bg-black hover:bg-neutral-900/60' : 'bg-neutral-900/90 border border-neutral-800'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                {/* User avatar with type badge */}
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden ring-1 ring-neutral-700">
                    <img
                      src={notif.user.avatar}
                      alt={notif.user.username}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {notif.type === 'like' && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] ring-2 ring-black">
                      <Heart className="w-3 h-3 fill-white" />
                    </span>
                  )}
                  {notif.type === 'comment' && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] ring-2 ring-black">
                      <MessageCircle className="w-3 h-3 fill-white -scale-x-100" />
                    </span>
                  )}
                  {notif.type === 'follow' && (
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] ring-2 ring-black">
                      <UserPlus className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col text-xs leading-snug min-w-0">
                  <p className="text-neutral-200">
                    <span className="font-semibold text-white mr-1">
                      {notif.user.username}
                    </span>
                    {notif.text}
                  </p>
                  <span className="text-[11px] text-neutral-500 mt-0.5">{notif.timestamp}</span>
                </div>
              </div>

              {/* Right Action: Follow button OR Target Post Thumbnail */}
              {notif.type === 'follow' ? (
                <button
                  onClick={() => toggleFollowUser(notif.user.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                    userState.isFollowing
                      ? 'bg-neutral-800 text-neutral-300 hover:text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {userState.isFollowing ? 'Following' : 'Follow back'}
                </button>
              ) : notif.targetPostImage ? (
                <button
                  onClick={() => targetPost && setActivePostDetail(targetPost)}
                  className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-neutral-800 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <img
                    src={notif.targetPostImage}
                    alt="Post thumbnail"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
