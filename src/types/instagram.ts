export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio?: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified?: boolean;
  isFollowing?: boolean;
  storyAvailable?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  user: User;
  images: string[];
  caption: string;
  likesCount: number;
  isLiked: boolean;
  comments: Comment[];
  savesCount: number;
  isSaved: boolean;
  location?: string;
  music?: string;
  createdAt: string;
  filter?: string;
}

export interface StoryItem {
  id: string;
  mediaUrl: string;
  type: 'image' | 'video';
  duration: number; // in seconds
  timestamp: string;
  caption?: string;
}

export interface StoryGroup {
  id: string;
  user: User;
  items: StoryItem[];
  seen: boolean;
}

export interface Reel {
  id: string;
  user: User;
  videoUrl?: string;
  thumbnailUrl: string;
  caption: string;
  music: string;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  sharesCount: number;
  isSaved: boolean;
  filter?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  isLiked?: boolean;
}

export interface Chat {
  id: string;
  user: User;
  messages: Message[];
  unreadCount: number;
  isOnline: boolean;
  lastSeen?: string;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow';
  user: User;
  targetPostId?: string;
  targetPostImage?: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export type ActiveTab = 'feed' | 'explore' | 'reels' | 'messages' | 'notifications' | 'profile';
