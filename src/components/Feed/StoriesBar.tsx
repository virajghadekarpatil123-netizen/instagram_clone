import React, { useRef } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInstagram } from '../../context/InstagramContext';
import { StoryGroup } from '../../types/instagram';

export const StoriesBar: React.FC = () => {
  const { currentUser, stories, setActiveStoryModal, setIsCreateModalOpen } = useInstagram();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -240 : 240;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const openStory = (storyGroup: StoryGroup) => {
    setActiveStoryModal(storyGroup);
  };

  return (
    <div className="relative w-full bg-black border border-neutral-800/60 rounded-xl py-3 px-2 mb-4 group/stories">
      {/* Desktop Left/Right Scroll Arrows */}
      <button
        onClick={() => handleScroll('left')}
        className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-neutral-900/90 text-white items-center justify-center opacity-0 group-hover/stories:opacity-100 hover:bg-neutral-800 transition-opacity shadow-md cursor-pointer"
        aria-label="Scroll stories left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleScroll('right')}
        className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-neutral-900/90 text-white items-center justify-center opacity-0 group-hover/stories:opacity-100 hover:bg-neutral-800 transition-opacity shadow-md cursor-pointer"
        aria-label="Scroll stories right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Stories Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth px-1"
      >
        {/* Current User: Your Story */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 select-none">
          <div className="relative cursor-pointer" onClick={() => setIsCreateModalOpen(true)}>
            <div className="w-16 h-16 rounded-full p-[2px] bg-neutral-800">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCreateModalOpen(true);
              }}
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-blue-500 border-2 border-black flex items-center justify-center text-white text-xs hover:bg-blue-600 transition-colors cursor-pointer"
              aria-label="Add to story"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
          <span className="text-xs text-neutral-300 truncate max-w-[72px]">
            Your story
          </span>
        </div>

        {/* Other Users' Stories */}
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => openStory(story)}
            className="flex flex-col items-center gap-1.5 shrink-0 select-none cursor-pointer group"
          >
            <div
              className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                story.seen ? 'bg-neutral-700' : 'story-ring-gradient animate-pulse'
              }`}
            >
              <div className="w-full h-full rounded-full bg-black p-[2px]">
                <img
                  src={story.user.avatar}
                  alt={story.user.username}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs text-neutral-300 truncate max-w-[72px]">
              {story.user.username}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
