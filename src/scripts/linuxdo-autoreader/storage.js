/**
 * Linux.do 自动标记已读 - 存储管理模块
 */

import { DEFAULT_CONFIG, DEFAULT_SETTINGS } from './config.js';
import State from './state.js';
import { Utils } from './utils.js';

/**
 * 存储管理器
 */
export const Storage = {
  /**
   * 保存状态到本地存储
   */
  save() {
    const data = {
      isRunning: State.isRunning,
      lastCheckTime: Date.now(),
      stats: State.stats,
      settings: State.settings,
    };
    try {
      localStorage.setItem(DEFAULT_CONFIG.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('保存状态失败:', e);
    }
  },

  /**
   * 从本地存储加载状态
   */
  load() {
    try {
      const saved = localStorage.getItem(DEFAULT_CONFIG.STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        State.isRunning = data.isRunning || false;
        State.lastCheckTime = data.lastCheckTime || 0;
        State.stats = Utils.deepMerge(State.stats, data.stats || {});
        State.settings = Utils.deepMerge(DEFAULT_SETTINGS, data.settings || {});
      }
    } catch (e) {
      console.error('加载状态失败:', e);
    }
  },

  /**
   * 清除存储数据
   * @param {Object} UI - UI模块引用
   * @param {Object} Logger - Logger模块引用
   */
  clear(UI, Logger) {
    localStorage.removeItem(DEFAULT_CONFIG.STORAGE_KEY);
    State.stats = {
      session: {
        topicsMarked: 0,
        repliesMarked: 0,
        topicsSkipped: 0,
        errors: 0,
        startTime: null,
      },
      daily: { topicsMarked: 0, repliesMarked: 0, date: null },
      total: { topicsMarked: 0, repliesMarked: 0 },
    };
    if (UI) UI.updateStats();
    if (Logger) Logger.info('📊 统计数据已重置');
  },

  /**
   * 导出设置
   * @returns {string}
   */
  exportSettings() {
    return JSON.stringify(State.settings, null, 2);
  },

  /**
   * 导入设置
   * @param {string} json - JSON字符串
   * @returns {boolean}
   */
  importSettings(json) {
    try {
      const settings = JSON.parse(json);
      State.settings = Utils.deepMerge(DEFAULT_SETTINGS, settings);
      this.save();
      return true;
    } catch (e) {
      return false;
    }
  },
};

export default Storage;
