import React, { useState } from 'react';
import {
  Grid3X3,
  Film,
  Bookmark,
  UserCheck,
  Settings,
  Heart,
  MessageCircle,
  ExternalLink,
  Plus,
  Smartphone,
} from 'lucide-react';
import { useInstagram } from '../../context/InstagramContext';
import { EditProfileModal } from './EditProfileModal';
import { PostDetailModal } from '../Modals/PostDetailModal';
import { Post } from '../../types/instagram';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    posts,
    reels,
    activePostDetail,
    setActivePostDetail,
    setIsExpoModalOpen,
  } = useInstagram();
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved' | 'tagged'>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter posts
  const userPosts = posts.filter(
    (p) => p.user.id === currentUser.id || p.user.username === currentUser.username
  );
  // Also display sample posts if user hasn't posted many yet
  const displayPosts = userPosts.length > 0 ? userPosts : posts;
  const savedPosts = posts.filter((p) => p.isSaved);

  const highlights = [
    { title: 'Travel ✈️', image: '/src/assets/images/ig_post_travel_1791398818015.jpg' },
    { title: 'Arch 🏛️', image: '/src/assets/images/ig_post_architecture_1791398832896.jpg' },
    { title: 'Tokyo ☕', image: '/src/assets/images/ig_post_coffee_cafe_1791398844558.jpg' },
    { title: 'Fashion 🕶️', image: '/src/assets/images/ig_post_portrait_1791398854844.jpg' },
  ];

  return (
    <div className="w-full py-3 px-3 text-white flex flex-col gap-4 pb-12">
      {/* Profile Header */}
      <div className="flex flex-col gap-3 pb-3 border-b border-neutral-800/80">
        {/* Row 1: Avatar + Stats side-by-side */}
        <div className="flex items-center justify-between gap-4">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <div className="w-18 h-18 rounded-full overflow-hidden ring-2 ring-neutral-700 p-0.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white rounded-full p-1 shadow-md transition-colors cursor-pointer"
              title="Change Avatar"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stats Counters */}
          <div className="flex-1 flex items-center justify-around text-center">
            <div className="flex flex-col">
              <span className="font-bold text-base tabular-nums">{currentUser.postsCount}</span>
              <span className="text-[11px] text-neutral-400">Posts</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tabular-nums">
                {currentUser.followersCount.toLocaleString()}
              </span>
              <span className="text-[11px] text-neutral-400">Followers</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tabular-nums">
                {currentUser.followingCount.toLocaleString()}
              </span>
              <span className="text-[11px] text-neutral-400">Following</span>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="flex flex-col text-xs leading-relaxed">
          <span className="font-bold text-white text-sm">{currentUser.name}</span>
          <p className="whitespace-pre-line text-neutral-200 mt-0.5">{currentUser.bio}</p>
          {currentUser.website && (
            <a
              href={`https://${currentUser.website}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:underline font-medium mt-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{currentUser.website}</span>
            </a>
          )}
        </div>

        {/* Profile Action Buttons */}
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs border border-neutral-800 transition-colors cursor-pointer text-center"
          >
            Edit profile
          </button>
          <button
            onClick={() => setIsExpoModalOpen(true)}
            className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/40 hover:border-pink-500/60 text-pink-300 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            title="Expo.dev Native App Export"
          >
            <Smartphone className="w-3.5 h-3.5 text-pink-400" />
            <span>Expo Code</span>
          </button>
        </div>
      </div>

      {/* Story Highlights Bar */}
      <div className="flex items-center gap-5 overflow-x-auto no-scrollbar py-2">
        {highlights.map((h, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
            <div className="w-16 h-16 rounded-full p-[2px] ring-1 ring-neutral-700 group-hover:ring-neutral-500 transition-all">
              <img
                src={h.image}
                alt={h.title}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="text-xs text-neutral-300 truncate max-w-[70px]">{h.title}</span>
          </div>
        ))}
        {/* Add New Highlight */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
          <div className="w-16 h-16 rounded-full border border-dashed border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-all">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-xs text-neutral-400">New</span>
        </div>
      </div>

      {/* Profile Tabs Navigation */}
      <div className="flex items-center justify-center border-t border-neutral-800 text-xs sm:text-sm font-semibold tracking-wider uppercase text-neutral-400">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 px-4 border-t-2 transition-colors cursor-pointer ${
            activeTab === 'posts'
              ? 'border-white text-white'
              : 'border-transparent hover:text-neutral-200'
          }`}
        >
          <Grid3X3 className="w-4 h-4" />
          <span className="hidden xs:inline">Posts</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 py-3 px-4 border-t-2 transition-colors cursor-pointer ${
            activeTab === 'reels'
              ? 'border-white text-white'
              : 'border-transparent hover:text-neutral-200'
          }`}
        >
          <Film className="w-4 h-4" />
          <span className="hidden xs:inline">Reels</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 py-3 px-4 border-t-2 transition-colors cursor-pointer ${
            activeTab === 'saved'
              ? 'border-white text-white'
              : 'border-transparent hover:text-neutral-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="hidden xs:inline">Saved</span>
        </button>

        <button
          onClick={() => setActiveTab('tagged')}
          className={`flex items-center gap-2 py-3 px-4 border-t-2 transition-colors cursor-pointer ${
            activeTab === 'tagged'
              ? 'border-white text-white'
              : 'border-transparent hover:text-neutral-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span className="hidden xs:inline">Tagged</span>
        </button>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-3 gap-1 sm:gap-4">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setActivePostDetail(post)}
              className="relative aspect-square bg-neutral-900 overflow-hidden cursor-pointer group"
            >
              <img
                src={post.images[0]}
                alt={post.caption}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  post.filter || ''
                }`}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-semibold text-sm">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5 fill-white text-white" />
                  <span className="tabular-nums">{post.likesCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 fill-white text-white -scale-x-100" />
                  <span className="tabular-nums">{post.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="grid grid-cols-3 gap-1 sm:gap-4">
          {reels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => setActivePostDetail({
                id: reel.id,
                user: reel.user,
                images: [reel.thumbnailUrl],
                caption: reel.caption,
                likesCount: reel.likesCount,
                isLiked: reel.isLiked,
                comments: [],
                savesCount: 0,
                isSaved: reel.isSaved,
                createdAt: 'Reel',
              })}
              className="relative aspect-[9/16] bg-neutral-900 rounded-lg overflow-hidden cursor-pointer group"
            >
              <img
                src={reel.thumbnailUrl}
                alt={reel.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold drop-shadow-md">
                <Film className="w-3.5 h-3.5" />
                <span className="tabular-nums">{reel.likesCount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'saved' && (
        <div>
          {savedPosts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 sm:gap-4">
              {savedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setActivePostDetail(post)}
                  className="relative aspect-square bg-neutral-900 overflow-hidden cursor-pointer group"
                >
                  <img
                    src={post.images[0]}
                    alt={post.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-semibold text-sm">
                    <Heart className="w-5 h-5 fill-white" />
                    <span>{post.likesCount}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-neutral-500">
              <Bookmark className="w-12 h-12 stroke-1 mx-auto mb-2 text-neutral-600" />
              <h3 className="font-semibold text-white text-base">Save posts</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                Save photos and videos that you want to see again. No one is notified, and only you can see what you've saved.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tagged' && (
        <div className="text-center py-16 text-neutral-500">
          <UserCheck className="w-12 h-12 stroke-1 mx-auto mb-2 text-neutral-600" />
          <h3 className="font-semibold text-white text-base">Photos of you</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
            When people tag you in photos, they will appear here.
          </p>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal onClose={() => setIsEditModalOpen(false)} />
      )}

      {/* Post Detail Modal */}
      {activePostDetail && (
        <PostDetailModal
          post={activePostDetail}
          onClose={() => setActivePostDetail(null)}
        />
      )}
    </div>
  );
};
