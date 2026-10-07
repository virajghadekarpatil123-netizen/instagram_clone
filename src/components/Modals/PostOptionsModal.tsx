import React from 'react';
import { Post } from '../../types/instagram';
import { useInstagram } from '../../context/InstagramContext';

interface PostOptionsModalProps {
  post: Post;
  onClose: () => void;
}

export const PostOptionsModal: React.FC<PostOptionsModalProps> = ({ post, onClose }) => {
  const { showToast, savePost } = useInstagram();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `#post-${post.id}`);
    showToast('Link copied to clipboard');
    onClose();
  };

  const handleBookmark = () => {
    savePost(post.id);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl text-white divide-y divide-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            showToast('Post reported. Thank you for keeping Instagram safe.');
            onClose();
          }}
          className="w-full py-3.5 text-center text-red-500 font-semibold text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Report
        </button>

        <button
          onClick={() => {
            showToast(`Unfollowed @${post.user.username}`);
            onClose();
          }}
          className="w-full py-3.5 text-center text-red-500 font-semibold text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Unfollow
        </button>

        <button
          onClick={handleBookmark}
          className="w-full py-3.5 text-center text-white text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          {post.isSaved ? 'Remove from Saved' : 'Add to Saved'}
        </button>

        <button
          onClick={handleCopyLink}
          className="w-full py-3.5 text-center text-white text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Copy link
        </button>

        <button
          onClick={() => {
            showToast('Embed code copied');
            onClose();
          }}
          className="w-full py-3.5 text-center text-white text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Embed
        </button>

        <button
          onClick={onClose}
          className="w-full py-3.5 text-center text-neutral-400 font-medium text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
