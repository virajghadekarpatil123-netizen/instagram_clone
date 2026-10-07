import React, { useState } from 'react';
import { X, Heart, Send, Smile } from 'lucide-react';
import { Post } from '../../types/instagram';
import { useInstagram } from '../../context/InstagramContext';

interface CommentsModalProps {
  post: Post;
  onClose: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({ post, onClose }) => {
  const { addComment, currentUser } = useInstagram();
  const [commentText, setCommentText] = useState('');
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const toggleCommentLike = (commentId: string) => {
    setCommentLikes((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 select-none"
    >
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-t-2xl sm:rounded-2xl max-h-[85vh] h-[550px] flex flex-col text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 shrink-0">
          <div className="w-5" />
          <h3 className="font-semibold text-sm sm:text-base">Comments</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white cursor-pointer"
            aria-label="Close comments"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Caption & Comments List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Post Caption as first item */}
          <div className="flex items-start gap-3 pb-3 border-b border-neutral-800/80">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-neutral-700">
              <img
                src={post.user.avatar}
                alt={post.user.username}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-xs sm:text-sm">
              <span className="font-semibold text-white mr-1.5">{post.user.username}</span>
              <span className="text-neutral-200">{post.caption}</span>
              <div className="text-[11px] text-neutral-500 mt-1">{post.createdAt}</div>
            </div>
          </div>

          {/* Comments Stream */}
          {post.comments.length > 0 ? (
            post.comments.map((comment) => {
              const isLiked = commentLikes[comment.id] || comment.isLiked;
              return (
                <div key={comment.id} className="flex items-start justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-neutral-800">
                      <img
                        src={comment.userAvatar}
                        alt={comment.username}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-white">
                        <span className="font-semibold mr-1.5">{comment.username}</span>
                        <span className="text-neutral-200">{comment.text}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                        <span>{comment.createdAt}</span>
                        <span className="tabular-nums">
                          {(comment.likesCount + (isLiked ? 1 : 0))} likes
                        </span>
                        <button
                          onClick={() => setCommentText(`@${comment.username} `)}
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
                    aria-label="Like comment"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-neutral-500">
              <p className="text-sm">No comments yet.</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          )}
        </div>

        {/* Add comment input footer */}
        <form
          onSubmit={handlePostComment}
          className="p-3 border-t border-neutral-800 bg-neutral-950 flex items-center gap-3 shrink-0"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 flex items-center gap-2 bg-neutral-900 rounded-full px-3 py-1.5 border border-neutral-800">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Comment as ${currentUser.username}...`}
              className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setCommentText((prev) => prev + '🔥 ')}
              className="text-neutral-400 hover:text-white"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!commentText.trim()}
            className="text-blue-500 hover:text-blue-400 font-semibold text-xs sm:text-sm disabled:opacity-40 cursor-pointer"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};
