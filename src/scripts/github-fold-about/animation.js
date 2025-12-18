/**
 * GitHub Fold About 动画模块
 * 使用共享动画工具
 */

import { collapseElements, ANIMATION_DEFAULTS } from '@utils/animation.js';

/**
 * 动画配置
 */
export const ANIMATION_CONFIG = {
  duration: ANIMATION_DEFAULTS.duration,
  staggerDelay: ANIMATION_DEFAULTS.staggerDelay,
  easing: ANIMATION_DEFAULTS.easing,
};

/**
 * 应用折叠状态动画
 * @param {HTMLElement[]} elements - 元素数组
 * @param {boolean} isFolded - 是否折叠
 * @returns {Promise} 动画完成的 Promise
 */
export function applyFoldAnimation(elements, isFolded) {
  return collapseElements(elements, isFolded, ANIMATION_CONFIG);
}

/**
 * 立即应用折叠状态（无动画）
 * @param {HTMLElement[]} elements - 元素数组
 * @param {boolean} isFolded - 是否折叠
 */
export function applyFoldStateImmediate(elements, isFolded) {
  elements.forEach((element) => {
    if (isFolded) {
      element.style.display = 'none';
      element.style.opacity = '0';
      element.style.transform = 'translateY(-10px)';
    } else {
      element.style.display = '';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
}

export default {
  applyFoldAnimation,
  applyFoldStateImmediate,
  ANIMATION_CONFIG,
};
