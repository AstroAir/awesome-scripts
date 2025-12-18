/**
 * GitHub Enhanced Toolbar 观察者模块
 */

import { getCurrentTheme } from './utils.js';

/**
 * 设置主题观察者
 * @returns {MutationObserver} 观察者实例
 */
export function setupThemeObserver() {
  const htmlElement = document.documentElement;
  const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' &&
          (mutation.attributeName === 'data-color-mode' ||
           mutation.attributeName === 'data-light-theme' ||
           mutation.attributeName === 'data-dark-theme')) {
        const newTheme = getCurrentTheme();
        console.log(`[GitHub增强] 主题已切换至: ${newTheme}`);
      }
    });
  });

  themeObserver.observe(htmlElement, {
    attributes: true,
    attributeFilter: ['data-color-mode', 'data-light-theme', 'data-dark-theme'],
  });

  return themeObserver;
}

/**
 * 设置URL变化观察者
 * @param {Function} callback - URL变化时的回调函数
 * @returns {MutationObserver} 观察者实例
 */
export function setupUrlObserver(callback) {
  let currentUrl = location.href;
  
  const urlObserver = new MutationObserver(() => {
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      callback();
    }
  });

  urlObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return urlObserver;
}

export default {
  setupThemeObserver,
  setupUrlObserver,
};
