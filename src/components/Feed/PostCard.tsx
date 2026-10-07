import React, { useState, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Music,
  MapPin,
  Smile,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Post } from '../../types/instagram';
import { useInstagram } from '../../context/InstagramContext';

interface PostCardProps {
  post: Post;
  onOptionsClick?: (post: Post) => void;
  onCommentsClick?: (post: Post) => void;
  onShareClick?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onOptionsClick,
  onCommentsClick,
  onShareClick,
}) => {
  const { likePost, savePost, addComment, setActivePostDetail, stories, setActiveStoryModal } = useInstagram();
  const [commentInput, setCommentInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const lastTapRef = useRef<number>(0);

  // Handle double tap on image to like
  const handleImageTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!post.isLiked) {
        likePost(post.id);
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 900);
    }
    lastTapRef.current = now;
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput);
    setCommentInput('');
  };

  const handleAvatarClick = () => {
    const userStory = stories.find((s) => s.user.id === post.user.id || s.user.username === post.user.username);
    if (userStory) {
      setActiveStoryModal(userStory);
    }
  };

  const images = post.images && post.images.length > 0 ? post.images : ['/src/assets/images/ig_post_travel_1791398818015.jpg'];

  return (
    <article className="w-full bg-black border border-neutral-800/80 rounded-xl mb-4 overflow-hidden text-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleAvatarClick}
            className="relative cursor-pointer group"
            aria-label={`View story of ${post.user.username}`}
          >
            <div className={`w-9 h-9 rounded-full p-[2px] ${post.user.storyAvailable ? 'story-ring-gradient' : 'bg-neutral-800'}`}>
              <img
                src={post.user.avatar}
                alt={post.user.username}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </button>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight hover:text-neutral-300 transition-colors cursor-pointer">
                {post.user.username}
              </span>
              {post.user.isVerified && (
                <span className="text-blue-500 font-bold text-xs" title="Verified">
                  ●
                </span>
              )}
              <span className="text-neutral-500 text-xs">· {post.createdAt}</span>
            </div>

            {post.location && (
              <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                <MapPin className="w-2.5 h-2.5 text-neutral-500" />
                <span className="truncate max-w-[200px]">{post.location}</span>
              </div>
            )}
            {post.music && !post.location && (
              <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                <Music className="w-2.5 h-2.5 text-neutral-500" />
                <span className="truncate max-w-[200px]">{post.music}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onOptionsClick && onOptionsClick(post)}
          className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer transition-colors"
          aria-label="Post options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Media Container */}
      <div
        className="relative w-full aspect-square bg-neutral-950 overflow-hidden cursor-pointer select-none group/media"
        onClick={handleImageTap}
      >
        <img
          src={images[currentImageIndex]}
          alt={post.caption || 'Instagram Post'}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-transform duration-200 ${post.filter || ''}`}
        />

        {/* Carousel Prev/Next Buttons */}
        {images.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => prev - 1);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {currentImageIndex < images.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => prev + 1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {/* Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-blue-500 scale-125' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Double-tap animated heart pop */}
        {showHeartPop && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart className="w-24 h-24 fill-white text-white drop-shadow-xl animate-bounce scale-125" />
          </div>
        )}
      </div>

      {/* Action Bar (Like, Comment, Share, Save) */}
      <div className="px-3.5 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Heart */}
            <button
              onClick={() => likePost(post.id)}
              className="text-white hover:opacity-75 transition-transform active:scale-125 cursor-pointer"
              aria-label={post.isLiked ? 'Unlike' : 'Like'}
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  post.isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                }`}
              />
            </button>

            {/* Comment */}
            <button
              onClick={() => onCommentsClick ? onCommentsClick(post) : setActivePostDetail(post)}
              className="text-white hover:opacity-75 transition-colors cursor-pointer"
              aria-label="Comment"
            >
              <MessageCircle className="w-6 h-6 -scale-x-100" />
            </button>

            {/* Share / Direct */}
            <button
              onClick={() => onShareClick ? onShareClick(post) : null}
              className="text-white hover:opacity-75 transition-colors cursor-pointer"
              aria-label="Share"
            >
              <Send className="w-6 h-6 -rotate-12" />
            </button>
          </div>

          {/* Bookmark */}
          <button
            onClick={() => savePost(post.id)}
            className="text-white hover:opacity-75 transition-transform active:scale-125 cursor-pointer"
            aria-label={post.isSaved ? 'Unsave' : 'Save'}
          >
            <Bookmark
              className={`w-6 h-6 ${post.isSaved ? 'fill-white text-white' : 'text-white'}`}
            />
          </button>
        </div>

        {/* Likes Count */}
        <div className="mt-2.5">
          <span className="text-sm font-semibold tracking-tight tabular-nums">
            {post.likesCount.toLocaleString()} likes
          </span>
        </div>

        {/* Caption & Hashtags */}
        <div className="mt-1.5 text-sm leading-relaxed text-neutral-200">
          <span className="font-semibold text-white mr-2">{post.user.username}</span>
          <span>
            {isExpanded || post.caption.length <= 110
              ? post.caption
              : `${post.caption.slice(0, 110)}...`}
          </span>
          {post.caption.length > 110 && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-neutral-400 hover:text-white text-xs ml-1 font-medium cursor-pointer"
            >
              more
            </button>
          )}
        </div>

        {/* Comments Link */}
        {post.comments.length > 0 && (
          <button
            onClick={() => onCommentsClick ? onCommentsClick(post) : setActivePostDetail(post)}
            className="mt-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors block text-left cursor-pointer"
          >
            View all {post.comments.length} comments
          </button>
        )}

        {/* Preview of latest comment */}
        {post.comments.length > 0 && (
          <div className="mt-1 text-xs text-neutral-300">
            <span className="font-semibold text-white mr-1.5">
              {post.comments[post.comments.length - 1].username}
            </span>
            <span>{post.comments[post.comments.length - 1].text}</span>
          </div>
        )}

        {/* Inline Comment Input */}
        <form
          onSubmit={handleCommentSubmit}
          className="mt-3 pt-2.5 border-t border-neutral-900 flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2 flex-1 mr-2">
            <button
              type="button"
              onClick={() => setCommentInput((prev) => prev + '❤️ ')}
              className="text-neutral-400 hover:text-red-400 transition-colors"
              title="Add heart"
            >
              <Smile className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-transparent text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>
          {commentInput.trim() && (
            <button
              type="submit"
              className="text-blue-500 hover:text-blue-400 font-semibold cursor-pointer"
            >
              Post
            </button>
          )}
        </form>
      </div>
    </article>
  );
};
