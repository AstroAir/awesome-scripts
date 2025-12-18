/**
 * GitHub Fold Files 状态管理模块
 */

import { LocalStorageManager } from '@core/storage.js';
import { CONFIG, STORAGE_KEY } from './config.js';

/**
 * 创建存储实例
 */
const storage = new LocalStorageManager();

/**
 * 折叠状态管理器 (使用 Set 存储已折叠的路径)
 */
class FoldState {
  constructor() {
    this.collapsed = new Set();
    this.init();
  }

  /**
   * 初始化，从存储加载状态
   */
  init() {
    if (CONFIG.rememberState) {
      const saved = storage.get(STORAGE_KEY);
      if (Array.isArray(saved)) {
        this.collapsed = new Set(saved);
      }
    }
  }

  /**
   * 保存状态到存储
   */
  save() {
    if (CONFIG.rememberState) {
      storage.set(STORAGE_KEY, [...this.collapsed]);
    }
  }

  /**
   * 切换折叠状态
   * @param {string} key - 路径键
   * @returns {boolean} 切换后是否为折叠状态
   */
  toggle(key) {
    if (this.collapsed.has(key)) {
      this.collapsed.delete(key);
      this.save();
      return false;
    } else {
      this.collapsed.add(key);
      this.save();
      return true;
    }
  }

  /**
   * 检查是否已折叠
   * @param {string} key - 路径键
   * @returns {boolean} 是否已折叠
   */
  isCollapsed(key) {
    return this.collapsed.has(key);
  }

  /**
   * 设置折叠状态
   * @param {string} key - 路径键
   * @param {boolean} collapsed - 是否折叠
   */
  setCollapsed(key, collapsed) {
    if (collapsed) {
      this.collapsed.add(key);
    } else {
      this.collapsed.delete(key);
    }
    this.save();
  }

  /**
   * 清空所有状态
   */
  clear() {
    this.collapsed.clear();
    this.save();
  }
}

/**
 * 导出状态实例
 */
export const state = new FoldState();

export default state;
