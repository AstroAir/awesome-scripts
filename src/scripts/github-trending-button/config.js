/**
 * GitHub Trending Button 配置模块
 */

/**
 * 基本配置
 */
export const CONFIG = {
  BUTTON_ID: 'trending-button',
  DROPDOWN_ID: 'trending-dropdown',
  SETTINGS_KEY: 'trending_settings',
  FAVORITES_KEY: 'trending_favorites',
  RECENT_KEY: 'trending_recent',
};

/**
 * 默认设置
 */
export const DEFAULT_SETTINGS = {
  defaultLanguage: '',
  defaultPeriod: 'daily',
  showRecent: true,
  maxRecent: 5,
  openInNewTab: false,
};

/**
 * 热门编程语言列表
 */
export const POPULAR_LANGUAGES = [
  { name: 'All Languages', value: '', icon: '🌐', category: 'all' },
  { name: 'JavaScript', value: 'javascript', icon: '📜', category: 'web' },
  { name: 'TypeScript', value: 'typescript', icon: '📘', category: 'web' },
  { name: 'Python', value: 'python', icon: '🐍', category: 'general' },
  { name: 'Java', value: 'java', icon: '☕', category: 'general' },
  { name: 'C++', value: 'c++', icon: '⚙️', category: 'systems' },
  { name: 'C', value: 'c', icon: '🔧', category: 'systems' },
  { name: 'C#', value: 'c%23', icon: '🎯', category: 'general' },
  { name: 'Go', value: 'go', icon: '🐹', category: 'systems' },
  { name: 'Rust', value: 'rust', icon: '🦀', category: 'systems' },
  { name: 'PHP', value: 'php', icon: '🐘', category: 'web' },
  { name: 'Ruby', value: 'ruby', icon: '💎', category: 'web' },
  { name: 'Swift', value: 'swift', icon: '🍎', category: 'mobile' },
  { name: 'Kotlin', value: 'kotlin', icon: '🤖', category: 'mobile' },
  { name: 'Dart', value: 'dart', icon: '🎯', category: 'mobile' },
  { name: 'Shell', value: 'shell', icon: '🐚', category: 'systems' },
  { name: 'Vue', value: 'vue', icon: '💚', category: 'web' },
  { name: 'React', value: 'javascript', icon: '⚛️', category: 'web', search: 'react' },
  { name: 'HTML', value: 'html', icon: '🌐', category: 'web' },
  { name: 'CSS', value: 'css', icon: '🎨', category: 'web' },
];

/**
 * 时间段列表
 */
export const TIME_PERIODS = [
  { name: 'Today', value: 'daily', icon: '📅' },
  { name: 'This Week', value: 'weekly', icon: '📆' },
  { name: 'This Month', value: 'monthly', icon: '📊' },
];

/**
 * 分类配置
 */
export const CATEGORIES = {
  all: { name: 'Popular', icon: '⭐' },
  web: { name: 'Web', icon: '🌐' },
  mobile: { name: 'Mobile', icon: '📱' },
  systems: { name: 'Systems', icon: '⚙️' },
  general: { name: 'General', icon: '💻' },
};

/**
 * 选择器配置
 */
export const SELECTORS = {
  actionsContainer: '.AppHeader-actions',
  notificationIndicator: 'notification-indicator',
  appHeaderUser: '.AppHeader-user',
};

export default {
  CONFIG,
  DEFAULT_SETTINGS,
  POPULAR_LANGUAGES,
  TIME_PERIODS,
  CATEGORIES,
  SELECTORS,
};
