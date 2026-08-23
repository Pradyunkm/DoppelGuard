export interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon?: 'globe' | 'twitter' | 'github' | 'linkedin' | 'link' | 'mail';
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  followers: number;
  following: number;
  accountAgeDays: number;
  verified: boolean;
  links: SocialLink[];
  joinedDate?: string;
  location?: string;
  categoryTag?: string;
  badgeType?: 'verified' | 'business' | 'official' | 'none';
  isPrivate?: boolean;
}

export interface StorySlide {
  id: string;
  mediaUrl: string;
  caption?: string;
  timestamp: string;
  durationMs?: number;
}

export interface UserStory {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  userAvatar: string;
  hasUnseen: boolean;
  slides: StorySlide[];
}
