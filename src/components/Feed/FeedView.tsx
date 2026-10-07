import React, { useState } from 'react';
import { StoriesBar } from './StoriesBar';
import { PostCard } from './PostCard';
import { useInstagram } from '../../context/InstagramContext';
import { Post } from '../../types/instagram';
import { PostOptionsModal } from '../Modals/PostOptionsModal';
import { CommentsModal } from '../Modals/CommentsModal';
import { ShareModal } from '../Modals/ShareModal';

export const FeedView: React.FC = () => {
  const { posts } = useInstagram();
  const [selectedPostForOptions, setSelectedPostForOptions] = useState<Post | null>(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [selectedPostForShare, setSelectedPostForShare] = useState<Post | null>(null);

  return (
    <div className="w-full flex flex-col pb-6">
      {/* Stories Bar */}
      <StoriesBar />

      {/* Posts List */}
      <div className="flex flex-col gap-1 w-full" aria-label="Instagram Feed">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onOptionsClick={(p) => setSelectedPostForOptions(p)}
            onCommentsClick={(p) => setSelectedPostForComments(p)}
            onShareClick={(p) => setSelectedPostForShare(p)}
          />
        ))}

        {posts.length === 0 && (
          <div className="text-center py-16 text-neutral-500">
            <p className="text-sm">No posts yet. Tap create to publish the first post!</p>
          </div>
        )}
      </div>

      {/* Post Context Modals */}
      {selectedPostForOptions && (
        <PostOptionsModal
          post={selectedPostForOptions}
          onClose={() => setSelectedPostForOptions(null)}
        />
      )}

      {selectedPostForComments && (
        <CommentsModal
          post={selectedPostForComments}
          onClose={() => setSelectedPostForComments(null)}
        />
      )}

      {selectedPostForShare && (
        <ShareModal
          post={selectedPostForShare}
          onClose={() => setSelectedPostForShare(null)}
        />
      )}
    </div>
  );
};
