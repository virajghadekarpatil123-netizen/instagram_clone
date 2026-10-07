import React, { useState } from 'react';
import { Search, Heart, MessageCircle, Film, Copy, X } from 'lucide-react';
import { useInstagram } from '../../context/InstagramContext';
import { Post } from '../../types/instagram';
import { PostDetailModal } from '../Modals/PostDetailModal';

export const ExploreView: React.FC = () => {
  const { posts, setActivePostDetail, activePostDetail } = useInstagram();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Architecture', 'Travel', 'Fashion', 'Cafes', 'Design'];

  // Multiply or populate grid items for a full rich Explore experience
  const allExploreItems: Post[] = [
    ...posts,
    ...posts.map((p, idx) => ({
      ...p,
      id: `${p.id}_explore_${idx}`,
      likesCount: p.likesCount + 120 * (idx + 1),
    })),
  ];

  const filteredItems = allExploreItems.filter((item) => {
    const matchesSearch =
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeCategory === 'All') return true;
    return item.caption.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <div className="w-full flex flex-col gap-2.5 p-2 text-white pb-8">
      {/* Search Bar */}
      <div className="relative w-full max-w-md mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accounts, audio, locations, hashtags..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-neutral-400 hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills / Filter bar (functional buttons with handlers) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === cat
                ? 'bg-white text-black font-semibold'
                : 'bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Explore Grid */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {filteredItems.map((item, index) => {
          // Every 6 items make one larger 2x2 featured card for that classic Instagram layout
          const isFeatured = index % 7 === 1;

          return (
            <div
              key={`${item.id}-${index}`}
              onClick={() => setActivePostDetail(item)}
              className={`relative aspect-square bg-neutral-900 overflow-hidden cursor-pointer group select-none ${
                isFeatured ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
              }`}
            >
              <img
                src={item.images[0]}
                alt={item.caption}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  item.filter || ''
                }`}
              />

              {/* Type badge icon (e.g. film reel or carousel) */}
              <div className="absolute top-2 right-2 text-white drop-shadow-md z-10 pointer-events-none">
                {isFeatured ? (
                  <Film className="w-4 h-4" />
                ) : (
                  item.images.length > 1 && <Copy className="w-3.5 h-3.5" />
                )}
              </div>

              {/* Hover overlay with likes & comments */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-5 text-white font-semibold text-sm z-20">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5 fill-white text-white" />
                  <span className="tabular-nums">{item.likesCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 fill-white text-white -scale-x-100" />
                  <span className="tabular-nums">{item.comments.length}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
