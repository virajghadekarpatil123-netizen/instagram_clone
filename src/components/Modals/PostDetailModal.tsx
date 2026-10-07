import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Smile,
} from 'lucide-react';
import { Post } from '../../types/instagram';
import { useInstagram } from '../../context/InstagramContext';
import { PostOptionsModal } from './PostOptionsModal';
import { ShareModal } from './ShareModal';

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const { likePost, savePost, addComment, currentUser } = useInstagram();
  const [commentInput, setCommentInput] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput);
    setCommentInput('');
  };

  const toggleCommentLike = (commentId: string) => {
    setCommentLikes((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 select-none"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white p-2 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
        aria-label="Close post"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Modal Box */}
      <div
        className="w-full max-w-4xl h-[90vh] max-h-[720px] bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Image Media */}
        <div className="w-full md:w-3/5 h-64 md:h-full bg-black flex items-center justify-center overflow-hidden">
          <img
            src={post.images[0]}
            alt={post.caption}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-contain ${post.filter || ''}`}
          />
        </div>

        {/* Right Column: Details & Comments */}
        <div className="w-full md:w-2/5 flex-1 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-800 bg-neutral-900">
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-neutral-700">
                <img
                  src={post.user.avatar}
                  alt={post.user.username}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-sm">{post.user.username}</span>
                  {post.user.isVerified && <span className="text-blue-500 text-xs">●</span>}
                </div>
                {post.location && (
                  <span className="text-[11px] text-neutral-400 truncate max-w-[150px]">
                    {post.location}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowOptions(true)}
              className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Comments Stream */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-xs sm:text-sm">
            {/* Caption */}
            <div className="flex items-start gap-3 pb-3 border-b border-neutral-800">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                <img
                  src={post.user.avatar}
                  alt={post.user.username}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-white mr-1.5">{post.user.username}</span>
                <span className="text-neutral-200">{post.caption}</span>
                <div className="text-[11px] text-neutral-500 mt-1">{post.createdAt}</div>
              </div>
            </div>

            {/* List of comments */}
            {post.comments.map((comment) => {
              const isLiked = commentLikes[comment.id] || comment.isLiked;
              return (
                <div key={comment.id} className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 flex-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                      <img
                        src={comment.userAvatar}
                        alt={comment.username}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-white mr-1.5">{comment.username}</span>
                      <span className="text-neutral-200">{comment.text}</span>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                        <span>{comment.createdAt}</span>
                        <span className="tabular-nums">
                          {comment.likesCount + (isLiked ? 1 : 0)} likes
                        </span>
                        <button
                          onClick={() => setCommentInput(`@${comment.username} `)}
                          className="hover:text-white cursor-pointer font-medium"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleCommentLike(comment.id)}
                    className="p-1 text-neutral-400 hover:text-red-500 cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Action Row & Footer */}
          <div className="p-3.5 border-t border-neutral-800 bg-neutral-950 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => likePost(post.id)}
                  className="hover:opacity-75 transition-transform active:scale-125 cursor-pointer"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      post.isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                    }`}
                  />
                </button>
                <button
                  onClick={() => {}}
                  className="hover:opacity-75 cursor-pointer"
                >
                  <MessageCircle className="w-6 h-6 -scale-x-100 text-white" />
                </button>
                <button
                  onClick={() => setShowShare(true)}
                  className="hover:opacity-75 cursor-pointer"
                >
                  <Send className="w-6 h-6 -rotate-12 text-white" />
                </button>
              </div>

              <button
                onClick={() => savePost(post.id)}
                className="hover:opacity-75 transition-transform active:scale-125 cursor-pointer"
              >
                <Bookmark
                  className={`w-6 h-6 ${post.isSaved ? 'fill-white text-white' : 'text-white'}`}
                />
              </button>
            </div>

            <div className="text-xs font-semibold text-white tabular-nums">
              {post.likesCount.toLocaleString()} likes
            </div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
              {post.createdAt}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 flex-1 mr-2">
                <button
                  type="button"
                  onClick={() => setCommentInput((prev) => prev + '✨ ')}
                  className="text-neutral-400 hover:text-white"
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
        </div>
      </div>

      {showOptions && (
        <PostOptionsModal post={post} onClose={() => setShowOptions(false)} />
      )}

      {showShare && (
        <ShareModal post={post} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
};
