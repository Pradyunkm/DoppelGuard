export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likesCount: number;
  isLikedByUser?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userDisplayName: string;
  userAvatar: string;
  isVerified: boolean;
  mediaUrl: string;
  mediaType?: 'image' | 'carousel';
  additionalMedia?: string[];
  caption: string;
  likesCount: number;
  commentsCount: number;
  timestamp: string;
  location?: string;
  tags?: string[];
  comments?: PostComment[];
}

export type ExploreCategory = 'all' | 'trending' | 'photography' | 'tech' | 'architecture' | 'portraits' | 'nature' | 'food';
