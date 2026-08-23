import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserProfile, UserStory } from '../types/profile';
import { Post, PostComment } from '../types/post';
import { ActivePage, ThemeMode, ToastNotification } from '../types/common';
import { INITIAL_PROFILES, CURRENT_USER } from '../data/profiles';
import { INITIAL_POSTS } from '../data/posts';
import { INITIAL_STORIES } from '../data/stories';

interface SocialContextType {
  profiles: UserProfile[];
  posts: Post[];
  stories: UserStory[];
  currentUser: UserProfile;
  activePage: ActivePage;
  viewedProfileUsername: string | null;
  selectedExploreCategory: string;
  searchQuery: string;
  followedUserIds: string[];
  likedPostIds: string[];
  savedPostIds: string[];
  seenStoryIds: string[];
  theme: ThemeMode;
  isBannerDismissed: boolean;
  activeStory: { story: UserStory; slideIndex: number } | null;
  activePostDetail: Post | null;
  activeCommentDrawerPost: Post | null;
  isSearchModalOpen: boolean;
  isCreatePostModalOpen: boolean;
  isExportJsonModalOpen: boolean;
  exportProfileData: UserProfile | null;
  toasts: ToastNotification[];
  
  // Navigation
  setActivePage: (page: ActivePage) => void;
  navigateToProfile: (username: string) => void;
  navigateToHome: () => void;
  navigateToExplore: (query?: string, category?: string) => void;
  navigateToSettings: () => void;
  setSearchQuery: (q: string) => void;
  setSelectedExploreCategory: (cat: string) => void;

  // Interactivity
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  toggleFollowUser: (userId: string) => void;
  addComment: (postId: string, content: string) => void;
  createNewPost: (newPostData: { mediaUrl: string; caption: string; location?: string; tags?: string[] }) => void;
  
  // Modals & Viewers
  openStory: (story: UserStory, slideIndex?: number) => void;
  closeStory: () => void;
  openPostDetail: (post: Post) => void;
  closePostDetail: () => void;
  openCommentDrawer: (post: Post) => void;
  closeCommentDrawer: () => void;
  setSearchModalOpen: (open: boolean) => void;
  setCreatePostModalOpen: (open: boolean) => void;
  openExportJsonModal: (profile: UserProfile) => void;
  closeExportJsonModal: () => void;

  // UI state
  setTheme: (theme: ThemeMode) => void;
  dismissBanner: () => void;
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  resetDemoData: () => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

const STORAGE_KEYS = {
  FOLLOWS: 'doppelgram_followed_users_v1',
  LIKES: 'doppelgram_liked_posts_v1',
  SAVED: 'doppelgram_saved_posts_v1',
  SEEN_STORIES: 'doppelgram_seen_stories_v1',
  COMMENTS: 'doppelgram_custom_comments_v1',
  CUSTOM_POSTS: 'doppelgram_custom_posts_v1',
  THEME: 'doppelgram_theme_mode_v1',
  BANNER: 'doppelgram_banner_dismissed_v1'
};

export const SocialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [currentUser] = useState<UserProfile>(CURRENT_USER);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [viewedProfileUsername, setViewedProfileUsername] = useState<string | null>(null);
  const [selectedExploreCategory, setSelectedExploreCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Local state persisted
  const [followedUserIds, setFollowedUserIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOLLOWS);
      return saved ? JSON.parse(saved) : ['user_1', 'user_2', 'user_6'];
    } catch {
      return ['user_1', 'user_2', 'user_6'];
    }
  });

  const [likedPostIds, setLikedPostIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIKES);
      return saved ? JSON.parse(saved) : ['post_1', 'post_3'];
    } catch {
      return ['post_1', 'post_3'];
    }
  });

  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED);
      return saved ? JSON.parse(saved) : ['post_2'];
    } catch {
      return ['post_2'];
    }
  });

  const [seenStoryIds, setSeenStoryIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SEEN_STORIES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customComments, setCustomComments] = useState<Record<string, PostComment[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [customPosts, setCustomPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_POSTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
      return saved || 'light';
    } catch {
      return 'light';
    }
  });

  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.BANNER) === 'true';
    } catch {
      return false;
    }
  });

  // Modal / overlay states
  const [activeStory, setActiveStory] = useState<{ story: UserStory; slideIndex: number } | null>(null);
  const [activePostDetail, setActivePostDetail] = useState<Post | null>(null);
  const [activeCommentDrawerPost, setActiveCommentDrawerPost] = useState<Post | null>(null);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [isExportJsonModalOpen, setIsExportJsonModalOpen] = useState(false);
  const [exportProfileData, setExportProfileData] = useState<UserProfile | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Theme Sync
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      document.body.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOLLOWS, JSON.stringify(followedUserIds));
    } catch {
      // ignore
    }
  }, [followedUserIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likedPostIds));
    } catch {
      // ignore
    }
  }, [likedPostIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedPostIds));
    } catch {
      // ignore
    }
  }, [savedPostIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SEEN_STORIES, JSON.stringify(seenStoryIds));
    } catch {
      // ignore
    }
  }, [seenStoryIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(customComments));
    } catch {
      // ignore
    }
  }, [customComments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_POSTS, JSON.stringify(customPosts));
    } catch {
      // ignore
    }
  }, [customPosts]);

  // Merge posts with custom posts and custom comments
  const allPosts = React.useMemo(() => {
    const combined = [...customPosts, ...INITIAL_POSTS];
    return combined.map(post => {
      const added = customComments[post.id] || [];
      const isLiked = likedPostIds.includes(post.id);
      const originalLiked = post.id === 'post_1' || post.id === 'post_3';
      const likeDelta = isLiked ? (originalLiked ? 0 : 1) : (originalLiked ? -1 : 0);

      return {
        ...post,
        likesCount: Math.max(0, post.likesCount + likeDelta),
        commentsCount: (post.comments?.length || 0) + added.length,
        comments: [...(post.comments || []), ...added]
      };
    });
  }, [customPosts, customComments, likedPostIds]);

  // Story updates
  const stories = React.useMemo(() => {
    return INITIAL_STORIES.map(story => ({
      ...story,
      hasUnseen: !seenStoryIds.includes(story.id)
    }));
  }, [seenStoryIds]);

  // Toast System
  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastNotification = { ...toast, id };
    setToasts(prev => [...prev.slice(-4), newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 3200);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Actions
  const toggleLikePost = useCallback((postId: string) => {
    setLikedPostIds(prev => {
      const exists = prev.includes(postId);
      const next = exists ? prev.filter(id => id !== postId) : [...prev, postId];
      if (!exists) {
        addToast({
          type: 'success',
          message: 'Added to your liked posts ❤️'
        });
      }
      return next;
    });
  }, [addToast]);

  const toggleSavePost = useCallback((postId: string) => {
    setSavedPostIds(prev => {
      const exists = prev.includes(postId);
      const next = exists ? prev.filter(id => id !== postId) : [...prev, postId];
      addToast({
        type: 'info',
        message: exists ? 'Post removed from saved collection' : 'Post saved to your private collection 🔖'
      });
      return next;
    });
  }, [addToast]);

  const toggleFollowUser = useCallback((userId: string) => {
    const profile = profiles.find(p => p.id === userId);
    setFollowedUserIds(prev => {
      const exists = prev.includes(userId);
      const next = exists ? prev.filter(id => id !== userId) : [...prev, userId];
      if (profile) {
        addToast({
          type: exists ? 'default' : 'success',
          message: exists ? `Unfollowed @${profile.username}` : `Following @${profile.username}`
        });
      }
      return next;
    });
  }, [profiles, addToast]);

  const addComment = useCallback((postId: string, content: string) => {
    if (!content.trim()) return;
    const newComment: PostComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      postId,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.profileImage,
      content: content.trim(),
      timestamp: 'Just now',
      likesCount: 0
    };

    setCustomComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    addToast({
      type: 'success',
      message: 'Comment posted'
    });
  }, [currentUser, addToast]);

  const createNewPost = useCallback((newPostData: { mediaUrl: string; caption: string; location?: string; tags?: string[] }) => {
    const newPost: Post = {
      id: `post_user_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userDisplayName: currentUser.displayName,
      userAvatar: currentUser.profileImage,
      isVerified: currentUser.verified,
      mediaUrl: newPostData.mediaUrl,
      caption: newPostData.caption,
      likesCount: 1,
      commentsCount: 0,
      timestamp: 'Just now',
      location: newPostData.location || 'Local Sandbox',
      tags: newPostData.tags || ['doppelgram', 'simulation'],
      comments: []
    };

    setCustomPosts(prev => [newPost, ...prev]);
    setLikedPostIds(prev => [...prev, newPost.id]);

    addToast({
      type: 'success',
      message: 'Your photo was published to the feed! 🎉'
    });
  }, [currentUser, addToast]);

  // Navigation handlers
  const navigateToProfile = useCallback((username: string) => {
    setViewedProfileUsername(username);
    setActivePage('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToHome = useCallback(() => {
    setViewedProfileUsername(null);
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToExplore = useCallback((query?: string, category?: string) => {
    if (query !== undefined) setSearchQuery(query);
    if (category !== undefined) setSelectedExploreCategory(category);
    setActivePage('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateToSettings = useCallback(() => {
    setActivePage('settings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Story handler
  const openStory = useCallback((story: UserStory, slideIndex = 0) => {
    setActiveStory({ story, slideIndex });
    setSeenStoryIds(prev => (prev.includes(story.id) ? prev : [...prev, story.id]));
  }, []);

  const closeStory = useCallback(() => {
    setActiveStory(null);
  }, []);

  // Post modal handlers
  const openPostDetail = useCallback((post: Post) => {
    setActivePostDetail(post);
  }, []);

  const closePostDetail = useCallback(() => {
    setActivePostDetail(null);
  }, []);

  const openCommentDrawer = useCallback((post: Post) => {
    setActiveCommentDrawerPost(post);
  }, []);

  const closeCommentDrawer = useCallback(() => {
    setActiveCommentDrawerPost(null);
  }, []);

  const openExportJsonModal = useCallback((profile: UserProfile) => {
    setExportProfileData(profile);
    setIsExportJsonModalOpen(true);
  }, []);

  const closeExportJsonModal = useCallback(() => {
    setIsExportJsonModalOpen(false);
    setExportProfileData(null);
  }, []);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  const dismissBanner = useCallback(() => {
    setIsBannerDismissed(true);
    localStorage.setItem(STORAGE_KEYS.BANNER, 'true');
  }, []);

  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.FOLLOWS);
    localStorage.removeItem(STORAGE_KEYS.LIKES);
    localStorage.removeItem(STORAGE_KEYS.SAVED);
    localStorage.removeItem(STORAGE_KEYS.SEEN_STORIES);
    localStorage.removeItem(STORAGE_KEYS.COMMENTS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_POSTS);

    setFollowedUserIds(['user_1', 'user_2', 'user_6']);
    setLikedPostIds(['post_1', 'post_3']);
    setSavedPostIds(['post_2']);
    setSeenStoryIds([]);
    setCustomComments({});
    setCustomPosts([]);

    addToast({
      type: 'info',
      message: 'Demo dataset restored to original state'
    });
  }, [addToast]);

  // Keep active post detail in sync with latest comments/likes
  useEffect(() => {
    if (activePostDetail) {
      const fresh = allPosts.find(p => p.id === activePostDetail.id);
      if (fresh) {
        setActivePostDetail(fresh);
      }
    }
  }, [allPosts, activePostDetail?.id]);

  useEffect(() => {
    if (activeCommentDrawerPost) {
      const fresh = allPosts.find(p => p.id === activeCommentDrawerPost.id);
      if (fresh) {
        setActiveCommentDrawerPost(fresh);
      }
    }
  }, [allPosts, activeCommentDrawerPost?.id]);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setActiveStory(null);
        setActivePostDetail(null);
        setActiveCommentDrawerPost(null);
        setCreatePostModalOpen(false);
        setIsExportJsonModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SocialContext.Provider
      value={{
        profiles,
        posts: allPosts,
        stories,
        currentUser,
        activePage,
        viewedProfileUsername,
        selectedExploreCategory,
        searchQuery,
        followedUserIds,
        likedPostIds,
        savedPostIds,
        seenStoryIds,
        theme,
        isBannerDismissed,
        activeStory,
        activePostDetail,
        activeCommentDrawerPost,
        isSearchModalOpen,
        isCreatePostModalOpen,
        isExportJsonModalOpen,
        exportProfileData,
        toasts,
        setActivePage,
        navigateToProfile,
        navigateToHome,
        navigateToExplore,
        navigateToSettings,
        setSearchQuery,
        setSelectedExploreCategory,
        toggleLikePost,
        toggleSavePost,
        toggleFollowUser,
        addComment,
        createNewPost,
        openStory,
        closeStory,
        openPostDetail,
        closePostDetail,
        openCommentDrawer,
        closeCommentDrawer,
        setSearchModalOpen,
        setCreatePostModalOpen,
        openExportJsonModal,
        closeExportJsonModal,
        setTheme,
        dismissBanner,
        addToast,
        removeToast,
        resetDemoData
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
