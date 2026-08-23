export type ActivePage = 'home' | 'explore' | 'profile' | 'settings';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ToastNotification {
  id: string;
  type?: 'default' | 'success' | 'info' | 'warning';
  title?: string;
  message: string;
  avatar?: string;
  duration?: number;
}
