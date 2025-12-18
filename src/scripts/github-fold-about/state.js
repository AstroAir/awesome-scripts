/**
 * GitHub Fold About 状态管理模块
 */

import { LocalStorageManager, StateManager } from '@core/storage.js';

const STORAGE_KEY = 'github-about-fold-states';

/**
 * 创建存储实例
 */
const storage = new LocalStorageManager();

/**
 * 折叠状态管理器
 */
export const foldedState = new StateManager(storage, STORAGE_KEY, 'map');

/**
 * 生成状态键
 * @param {string} pathname - 页面路径
 * @returns {string} 状态键
 */
export function getStateKey(pathname = window.location.pathname) {
  return `about-${pathname}`;
}

/**
 * 检查是否已折叠
 * @param {string} key - 状态键
 * @returns {boolean} 是否已折叠
 */
export function isCollapsed(key) {
  return foldedState.get(key) === true;
}

/**
 * 设置折叠状态
 * @param {string} key - 状态键
 * @param {boolean} collapsed - 是否折叠
 */
export function setCollapsed(key, collapsed) {
  foldedState.set(key, collapsed);
}

/**
 * 切换折叠状态
 * @param {string} key - 状态键
 * @returns {boolean} 切换后的状态
 */
export function toggleCollapsed(key) {
  const newState = !isCollapsed(key);
  setCollapsed(key, newState);
  return newState;
}

export default {
  foldedState,
  getStateKey,
  isCollapsed,
  setCollapsed,
  toggleCollapsed,
};
