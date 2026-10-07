import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post, StoryGroup, Reel, Chat, NotificationItem, ActiveTab, Comment, Message } from '../types/instagram';
import { CURRENT_USER, INITIAL_POSTS, INITIAL_STORIES, INITIAL_REELS, INITIAL_CHATS, INITIAL_NOTIFICATIONS, MOCK_USERS } from '../data/mockData';

interface InstagramContextType {
  currentUser: User;
  updateProfile: (updated: Partial<User>) => void;
  posts: Post[];
  likePost: (postId: string) => void;
  savePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  createPost: (image: string, caption: string, filter?: string, location?: string) => void;
  stories: StoryGroup[];
  markStorySeen: (storyGroupId: string) => void;
  reels: Reel[];
  likeReel: (reelId: string) => void;
  saveReel: (reelId: string) => void;
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (chatId: string | null) => void;
  sendMessage: (chatId: string, text: string) => void;
  likeMessage: (chatId: string, messageId: string) => void;
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  suggestedUsers: User[];
  toggleFollowUser: (userId: string) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  // Modals
  activeStoryModal: StoryGroup | null;
  setActiveStoryModal: (story: StoryGroup | null) => void;
  activePostDetail: Post | null;
  setActivePostDetail: (post: Post | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isExpoModalOpen: boolean;
  setIsExpoModalOpen: (open: boolean) => void;
  deviceFrameMode: 'responsive' | 'mobile_frame';
  setDeviceFrameMode: (mode: 'responsive' | 'mobile_frame') => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const InstagramContext = createContext<InstagramContextType | undefined>(undefined);

export const InstagramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage persisted state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('ig_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('ig_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [stories, setStories] = useState<StoryGroup[]>(() => {
    const saved = localStorage.getItem('ig_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [reels, setReels] = useState<Reel[]>(() => {
    const saved = localStorage.getItem('ig_reels');
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('ig_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ig_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [suggestedUsers, setSuggestedUsers] = useState<User[]>(Object.values(MOCK_USERS));
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Modals
  const [activeStoryModal, setActiveStoryModal] = useState<StoryGroup | null>(null);
  const [activePostDetail, setActivePostDetail] = useState<Post | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isExpoModalOpen, setIsExpoModalOpen] = useState(false);
  const [deviceFrameMode, setDeviceFrameMode] = useState<'responsive' | 'mobile_frame'>('responsive');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ig_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ig_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('ig_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('ig_reels', JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem('ig_chats', JSON.stringify(chats));
  }, [chats]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const updateProfile = (updated: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
    showToast('Profile saved successfully');
  };

  const likePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      })
    );
  };

  const savePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isSaved = !post.isSaved;
          const msg = isSaved ? 'Post saved to your collection' : 'Post removed from saved';
          showToast(msg);
          return {
            ...post,
            isSaved,
            savesCount: isSaved ? post.savesCount + 1 : Math.max(0, post.savesCount - 1),
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text: text.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );

    // If active post detail modal is viewing this post, update it too
    if (activePostDetail && activePostDetail.id === postId) {
      setActivePostDetail((prev) =>
        prev ? { ...prev, comments: [...prev.comments, newComment] } : null
      );
    }
    showToast('Comment posted');
  };

  const createPost = (image: string, caption: string, filter: string = 'filter-normal', location?: string) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      user: currentUser,
      images: [image],
      caption,
      likesCount: 0,
      isLiked: false,
      comments: [],
      savesCount: 0,
      isSaved: false,
      location: location || 'Tokyo, Japan',
      music: 'Original Audio · ' + currentUser.username,
      createdAt: 'Just now',
      filter,
    };

    setPosts((prev) => [newPost, ...prev]);
    setCurrentUser((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));
    showToast('Your post was shared to Feed!');
    setActiveTab('feed');
  };

  const markStorySeen = (storyGroupId: string) => {
    setStories((prev) =>
      prev.map((item) => (item.id === storyGroupId ? { ...item, seen: true } : item))
    );
  };

  const likeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          const isLiked = !reel.isLiked;
          return {
            ...reel,
            isLiked,
            likesCount: isLiked ? reel.likesCount + 1 : reel.likesCount - 1,
          };
        }
        return reel;
      })
    );
  };

  const saveReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          const isSaved = !reel.isSaved;
          showToast(isSaved ? 'Reel saved' : 'Reel removed from saved');
          return { ...reel, isSaved };
        }
        return reel;
      })
    );
  };

  const sendMessage = (chatId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: 'Now',
      isRead: true,
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMsg],
          };
        }
        return chat;
      })
    );

    // Simulate friendly automatic response after 1.5 seconds!
    setTimeout(() => {
      const autoResponses = [
        'Awesome, totally agree! 🙌',
        'Sounds good, let me check that out!',
        'Love this! Talk soon ✨',
        'Haha definitely! Let’s link up soon 🚀',
      ];
      const randomReply = autoResponses[Math.floor(Math.random() * autoResponses.length)];
      const replyMsg: Message = {
        id: `reply_${Date.now()}`,
        senderId: 'friend',
        text: randomReply,
        timestamp: 'Just now',
        isRead: false,
      };

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, replyMsg],
              unreadCount: chat.unreadCount + 1,
            };
          }
          return chat;
        })
      );
    }, 1500);
  };

  const likeMessage = (chatId: string, messageId: string) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages.map((m) =>
              m.id === messageId ? { ...m, isLiked: !m.isLiked } : m
            ),
          };
        }
        return chat;
      })
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleFollowUser = (userId: string) => {
    setSuggestedUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const isFollowing = !u.isFollowing;
          const msg = isFollowing ? `Following @${u.username}` : `Unfollowed @${u.username}`;
          showToast(msg);
          return {
            ...u,
            isFollowing,
            followersCount: isFollowing ? u.followersCount + 1 : u.followersCount - 1,
          };
        }
        return u;
      })
    );
  };

  return (
    <InstagramContext.Provider
      value={{
        currentUser,
        updateProfile,
        posts,
        likePost,
        savePost,
        addComment,
        createPost,
        stories,
        markStorySeen,
        reels,
        likeReel,
        saveReel,
        chats,
        activeChatId,
        setActiveChatId,
        sendMessage,
        likeMessage,
        notifications,
        markAllNotificationsRead,
        suggestedUsers,
        toggleFollowUser,
        activeTab,
        setActiveTab,
        activeStoryModal,
        setActiveStoryModal,
        activePostDetail,
        setActivePostDetail,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isExpoModalOpen,
        setIsExpoModalOpen,
        deviceFrameMode,
        setDeviceFrameMode,
        theme,
        setTheme,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </InstagramContext.Provider>
  );
};

export const useInstagram = () => {
  const context = useContext(InstagramContext);
  if (!context) {
    throw new Error('useInstagram must be used within an InstagramProvider');
  }
  return context;
};
