import React, { useState } from 'react';
import { X, Search, Check, Send, Link } from 'lucide-react';
import { Post } from '../../types/instagram';
import { useInstagram } from '../../context/InstagramContext';

interface ShareModalProps {
  post: Post;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ post, onClose }) => {
  const { suggestedUsers, sendMessage, showToast } = useInstagram();
  const [search, setSearch] = useState('');
  const [sentUsers, setSentUsers] = useState<Record<string, boolean>>({});

  const handleSendToUser = (username: string) => {
    sendMessage(`chat_${username}`, `Shared a post by @${post.user.username}`);
    setSentUsers((prev) => ({ ...prev, [username]: true }));
    showToast(`Sent post to @${username}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `#post-${post.id}`);
    showToast('Link copied to clipboard');
    onClose();
  };

  const filtered = suggestedUsers.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl text-white flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div className="w-5" />
          <h3 className="font-semibold text-base">Share</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 bg-neutral-950 rounded-lg px-3 py-1.5 border border-neutral-800">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people..."
              className="bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Users list */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 max-h-64">
          {filtered.map((user) => {
            const isSent = sentUsers[user.username];
            return (
              <div
                key={user.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-800/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-neutral-700">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-xs sm:text-sm">{user.username}</span>
                    <span className="text-[11px] text-neutral-400">{user.name}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleSendToUser(user.username)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isSent
                      ? 'bg-neutral-800 text-neutral-400'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {isSent ? 'Sent' : 'Send'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Copy Link Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <Link className="w-4 h-4 text-blue-500" />
            <span>Copy Link</span>
          </button>

          <span className="text-[11px] text-neutral-500">Instagram Direct</span>
        </div>
      </div>
    </div>
  );
};
