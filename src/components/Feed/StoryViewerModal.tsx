import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInstagram } from '../../context/InstagramContext';
import { StoryGroup } from '../../types/instagram';

export const StoryViewerModal: React.FC = () => {
  const { activeStoryModal, setActiveStoryModal, stories, markStorySeen, showToast, sendMessage } = useInstagram();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentGroup = activeStoryModal;
  const currentItem = currentGroup?.items[currentIndex];

  // Find index of current story group among all stories
  const currentGroupIndex = stories.findIndex((s) => s.id === currentGroup?.id);

  // Mark story as seen when viewed
  useEffect(() => {
    if (currentGroup) {
      markStorySeen(currentGroup.id);
    }
  }, [currentGroup?.id]);

  // Reset index when story group changes
  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
  }, [currentGroup?.id]);

  // Story progress timer
  useEffect(() => {
    if (!currentGroup || !currentItem || isPaused) return;

    const intervalTime = 50; // update every 50ms
    const totalDuration = (currentItem.duration || 5) * 1000;
    const increment = (intervalTime / totalDuration) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextStory();
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentGroup?.id, currentIndex, isPaused, currentItem]);

  if (!currentGroup || !currentItem) return null;

  const handleNextStory = () => {
    if (currentIndex < currentGroup.items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      // Go to next user's story if available
      if (currentGroupIndex < stories.length - 1) {
        setActiveStoryModal(stories[currentGroupIndex + 1]);
        setCurrentIndex(0);
        setProgress(0);
      } else {
        // Finished all stories
        setActiveStoryModal(null);
      }
    }
  };

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    } else {
      // Go to previous user's story if available
      if (currentGroupIndex > 0) {
        setActiveStoryModal(stories[currentGroupIndex - 1]);
        setCurrentIndex(0);
        setProgress(0);
      }
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sendMessage(`chat_${currentGroup.user.username}`, replyText);
    showToast(`Replied to @${currentGroup.user.username}'s story`);
    setReplyText('');
  };

  const handleSendHeartReaction = () => {
    sendMessage(`chat_${currentGroup.user.username}`, '❤️');
    showToast(`Sent ❤️ to @${currentGroup.user.username}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center select-none"
      onKeyDown={(e) => {
        if (e.key === 'Escape') setActiveStoryModal(null);
        if (e.key === 'ArrowRight') handleNextStory();
        if (e.key === 'ArrowLeft') handlePrevStory();
      }}
    >
      {/* Close button top right */}
      <button
        onClick={() => setActiveStoryModal(null)}
        className="absolute top-4 right-4 z-50 text-white p-2 rounded-full hover:bg-neutral-800/80 transition-colors cursor-pointer"
        aria-label="Close story viewer"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Previous Group Navigation (Desktop) */}
      {currentGroupIndex > 0 && (
        <button
          onClick={() => setActiveStoryModal(stories[currentGroupIndex - 1])}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white items-center justify-center cursor-pointer transition-colors"
          aria-label="Previous user story"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Group Navigation (Desktop) */}
      {currentGroupIndex < stories.length - 1 && (
        <button
          onClick={() => setActiveStoryModal(stories[currentGroupIndex + 1])}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white items-center justify-center cursor-pointer transition-colors"
          aria-label="Next user story"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Story Container (Instagram Aspect Ratio 9:16) */}
      <div className="relative w-full max-w-[420px] h-[92vh] max-h-[840px] bg-neutral-950 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl border border-neutral-800">
        {/* Progress Bar Segments */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {currentGroup.items.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all ease-linear"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top User Header */}
        <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full ring-2 ring-white/70 overflow-hidden">
              <img
                src={currentGroup.user.avatar}
                alt={currentGroup.user.username}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight">
                {currentGroup.user.username}
              </span>
              <span className="text-xs text-white/70">{currentItem.timestamp}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-full hover:bg-black/30 text-white/90 cursor-pointer"
              aria-label={isPaused ? 'Resume story' : 'Pause story'}
            >
              {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Story Media (Image) */}
        <div
          className="relative w-full h-full cursor-pointer flex items-center justify-center bg-black"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <img
            src={currentItem.mediaUrl}
            alt={currentItem.caption || 'Story'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* Left tap area to go back */}
          <div
            className="absolute left-0 top-0 w-1/3 h-full z-10"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevStory();
            }}
          />

          {/* Right tap area to advance */}
          <div
            className="absolute right-0 top-0 w-2/3 h-full z-10"
            onClick={(e) => {
              e.stopPropagation();
              handleNextStory();
            }}
          />

          {/* Caption Overlay */}
          {currentItem.caption && (
            <div className="absolute bottom-20 left-4 right-4 z-20 text-center pointer-events-none">
              <span className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-sm font-medium text-white shadow-md">
                {currentItem.caption}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Reply Bar */}
        <div className="relative z-30 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${currentGroup.user.username}...`}
              className="flex-1 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-full px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/60 focus:outline-none focus:border-white/50 transition-colors"
            />
            {replyText.trim() ? (
              <button
                type="submit"
                className="p-2 text-white hover:text-blue-400 transition-colors cursor-pointer"
                aria-label="Send reply"
              >
                <Send className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendHeartReaction}
                className="p-2 text-red-500 hover:scale-125 transition-transform cursor-pointer"
                aria-label="Send heart reaction"
              >
                <Heart className="w-6 h-6 fill-red-500 stroke-red-500" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
