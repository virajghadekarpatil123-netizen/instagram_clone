import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Volume2,
  VolumeX,
  Disc3,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useInstagram } from '../../context/InstagramContext';
import { Reel } from '../../types/instagram';
import { ShareModal } from '../Modals/ShareModal';

export const ReelsView: React.FC = () => {
  const { reels, likeReel, saveReel, toggleFollowUser, suggestedUsers, showToast } = useInstagram();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [shareReel, setShareReel] = useState<Reel | null>(null);

  const currentReel = reels[currentIndex] || reels[0];

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Check if reel creator is followed
  const creatorUser = suggestedUsers.find((u) => u.id === currentReel.user.id) || currentReel.user;

  return (
    <div className="w-full h-full min-h-[640px] relative bg-neutral-950 overflow-hidden flex items-center justify-center select-none">
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
        {/* Background Visual Asset / Simulated Video Clip */}
        <div className="relative w-full h-full overflow-hidden select-none">
          <img
            src={currentReel.thumbnailUrl}
            alt={currentReel.caption}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover scale-105"
          />

          {/* Contrast Scrim Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

          {/* Audio toggle button top-right */}
          <button
            onClick={() => {
              setIsMuted(!isMuted);
              showToast(isMuted ? 'Audio unmuted' : 'Audio muted');
            }}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/80 transition-colors cursor-pointer"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Up/Down Reel navigation arrows for desktop */}
          <div className="hidden sm:flex flex-col gap-2 absolute right-3 top-16 z-20">
            {currentIndex > 0 && (
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
                aria-label="Previous reel"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              aria-label="Next reel"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Left Bottom Content (Creator info, caption, music tag) */}
          <div className="absolute bottom-4 left-4 right-16 z-20 text-white flex flex-col gap-2.5">
            {/* User row */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full p-[1.5px] story-ring-gradient">
                <img
                  src={currentReel.user.avatar}
                  alt={currentReel.user.username}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-sm font-semibold tracking-tight">
                {currentReel.user.username}
              </span>
              <button
                onClick={() => toggleFollowUser(currentReel.user.id)}
                className={`text-xs px-2.5 py-1 rounded-md border font-semibold transition-colors cursor-pointer ${
                  creatorUser.isFollowing
                    ? 'border-white/30 text-white/80 bg-white/10 hover:bg-white/20'
                    : 'border-white text-black bg-white hover:bg-white/90'
                }`}
              >
                {creatorUser.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* Caption */}
            <p className="text-xs sm:text-sm text-neutral-100 line-clamp-3 leading-snug">
              {currentReel.caption}
            </p>

            {/* Music ticker */}
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Disc3 className="w-4 h-4 animate-spin text-white" />
              <span className="truncate max-w-[220px]">{currentReel.music}</span>
            </div>
          </div>

          {/* Right Bottom Action Bar */}
          <div className="absolute bottom-4 right-3 z-20 flex flex-col items-center gap-4 text-white">
            {/* Like */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => likeReel(currentReel.id)}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-125 transition-transform cursor-pointer"
                aria-label={currentReel.isLiked ? 'Unlike' : 'Like'}
              >
                <Heart
                  className={`w-7 h-7 ${
                    currentReel.isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                  }`}
                />
              </button>
              <span className="text-[11px] font-medium tabular-nums">
                {currentReel.likesCount.toLocaleString()}
              </span>
            </div>

            {/* Comment */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => showToast('Opening comments thread...')}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-110 transition-transform cursor-pointer"
                aria-label="Comments"
              >
                <MessageCircle className="w-7 h-7 -scale-x-100" />
              </button>
              <span className="text-[11px] font-medium tabular-nums">
                {currentReel.commentsCount.toLocaleString()}
              </span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => setShareReel(currentReel)}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-110 transition-transform cursor-pointer"
                aria-label="Share"
              >
                <Send className="w-7 h-7 -rotate-12" />
              </button>
              <span className="text-[11px] font-medium tabular-nums">
                {currentReel.sharesCount.toLocaleString()}
              </span>
            </div>

            {/* Save */}
            <button
              onClick={() => saveReel(currentReel.id)}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-110 transition-transform cursor-pointer"
              aria-label={currentReel.isSaved ? 'Unsave' : 'Save'}
            >
              <Bookmark
                className={`w-7 h-7 ${currentReel.isSaved ? 'fill-white text-white' : 'text-white'}`}
              />
            </button>

            {/* Spinning Vinyl Record */}
            <div className="w-8 h-8 rounded-full border-2 border-white/60 overflow-hidden animate-spin p-0.5">
              <img
                src={currentReel.thumbnailUrl}
                alt="Audio thumbnail"
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {shareReel && (
        <ShareModal
          post={{
            id: shareReel.id,
            user: shareReel.user,
            images: [shareReel.thumbnailUrl],
            caption: shareReel.caption,
            likesCount: shareReel.likesCount,
            isLiked: shareReel.isLiked,
            comments: [],
            savesCount: 0,
            isSaved: shareReel.isSaved,
            createdAt: 'Just now',
          }}
          onClose={() => setShareReel(null)}
        />
      )}
    </div>
  );
};
