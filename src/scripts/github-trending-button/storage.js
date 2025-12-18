/**
 * GitHub Trending Button 存储管理模块
 */

import { GMStorageManager } from '@core/storage.js';
import { CONFIG, DEFAULT_SETTINGS, POPULAR_LANGUAGES } from './config.js';

/**
 * GM 存储管理类
 */
class TrendingStorage {
  constructor() {
    this.storage = new GMStorageManager();
  }

  /**
   * 获取设置
   * @returns {Object} 设置对象
   */
  getSettings() {
    const saved = this.storage.get(CONFIG.SETTINGS_KEY, null);
    return { ...DEFAULT_SETTINGS, ...saved };
  }

  /**
   * 保存设置
   * @param {Object} settings - 设置对象
   */
  setSettings(settings) {
    this.storage.set(CONFIG.SETTINGS_KEY, { ...DEFAULT_SETTINGS, ...settings });
  }

  /**
   * 获取收藏列表
   * @returns {string[]} 收藏的语言值数组
   */
  getFavorites() {
    return this.storage.get(CONFIG.FAVORITES_KEY, []);
  }

  /**
   * 切换收藏状态
   * @param {string} language - 语言值
   * @returns {boolean} 切换后是否为收藏状态
   */
  toggleFavorite(language) {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(language);

    if (index > -1) {
      favorites.splice(index, 1);
      this.storage.set(CONFIG.FAVORITES_KEY, favorites);
      return false;
    } else {
      favorites.push(language);
      this.storage.set(CONFIG.FAVORITES_KEY, favorites);
      return true;
    }
  }

  /**
   * 获取最近访问列表
   * @returns {Array} 最近访问项数组
   */
  getRecent() {
    return this.storage.get(CONFIG.RECENT_KEY, []);
  }

  /**
   * 添加到最近访问
   * @param {string} language - 语言值
   */
  addRecent(language) {
    const settings = this.getSettings();
    if (!settings.showRecent) return;

    const recent = this.getRecent();
    // 移除重复项
    const filtered = recent.filter((item) => item.language !== language);
    // 添加到开头
    filtered.unshift({
      language,
      timestamp: Date.now(),
    });
    // 限制数量
    const limited = filtered.slice(0, settings.maxRecent);
    this.storage.set(CONFIG.RECENT_KEY, limited);
  }

  /**
   * 清除最近访问
   */
  clearRecent() {
    this.storage.set(CONFIG.RECENT_KEY, []);
  }

  /**
   * 清除所有数据
   */
  clearAll() {
    this.storage.set(CONFIG.FAVORITES_KEY, []);
    this.storage.set(CONFIG.RECENT_KEY, []);
    this.storage.set(CONFIG.SETTINGS_KEY, DEFAULT_SETTINGS);
  }

  /**
   * 获取语言对象
   * @param {string} value - 语言值
   * @returns {Object|null} 语言对象
   */
  getLanguageByValue(value) {
    return POPULAR_LANGUAGES.find((l) => l.value === value) || null;
  }
}

/**
 * 导出存储实例
 */
export const storage = new TrendingStorage();

export default storage;
