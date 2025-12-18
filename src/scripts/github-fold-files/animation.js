/**
 * GitHub Fold Files 动画模块
 * 使用共享动画工具
 */

import { CONFIG } from './config.js';
import { preventReentry } from '@utils/animation.js';

/**
 * 执行折叠/展开动画（内部实现）
 * @param {HTMLElement} tbody - 表格主体元素
 * @param {HTMLElement[]} rows - 行元素数组
 * @param {boolean} collapse - 是否折叠
 * @returns {Promise} 动画完成的 Promise
 */
async function _toggleFoldAnimation(tbody, rows, collapse) {
  const { animationDuration, expandStaggerDelay, collapseStaggerDelay } = CONFIG;

  return new Promise((resolve) => {
    if (collapse) {
      rows.forEach((row, index) => {
        row.style.transition = `opacity ${animationDuration}ms ease-out, transform ${animationDuration}ms ease-out`;
        setTimeout(() => {
          row.style.opacity = '0';
          row.style.transform = 'translateY(-8px)';
        }, index * collapseStaggerDelay);
      });

      const totalTime = animationDuration + rows.length * collapseStaggerDelay;
      setTimeout(() => {
        tbody.classList.add('x-folded');
        rows.forEach((row) => {
          row.style.transition = '';
          row.style.opacity = '';
          row.style.transform = '';
        });
        resolve();
      }, totalTime);
    } else {
      rows.forEach((row) => {
        row.style.display = 'table-row';
        row.style.opacity = '0';
        row.style.transform = 'translateY(-8px)';
      });

      tbody.offsetHeight;
      tbody.classList.remove('x-folded');

      rows.forEach((row, index) => {
        setTimeout(() => {
          row.style.transition = `opacity ${animationDuration}ms ease-out, transform ${animationDuration}ms ease-out`;
          row.style.opacity = '1';
          row.style.transform = 'translateY(0)';
        }, index * expandStaggerDelay);
      });

      const totalTime = animationDuration + rows.length * expandStaggerDelay;
      setTimeout(() => {
        rows.forEach((row) => {
          row.style.transition = '';
          row.style.opacity = '';
          row.style.transform = '';
          row.style.display = '';
        });
        resolve();
      }, totalTime);
    }
  });
}

/**
 * 执行折叠/展开动画（防止重入）
 * @param {HTMLElement} tbody - 表格主体元素
 * @param {HTMLElement[]} rows - 行元素数组
 * @param {boolean} collapse - 是否折叠
 * @returns {Promise} 动画完成的 Promise
 */
export function toggleFoldAnimation(tbody, rows, collapse) {
  const wrappedFn = preventReentry(tbody, () => _toggleFoldAnimation(tbody, rows, collapse));
  return wrappedFn();
}

/**
 * 立即应用折叠状态（无动画）
 * @param {HTMLElement} tbody - 表格主体元素
 * @param {boolean} collapsed - 是否折叠
 */
export function applyFoldStateImmediate(tbody, collapsed) {
  tbody.classList.toggle('x-folded', collapsed);
}

export default {
  toggleFoldAnimation,
  applyFoldStateImmediate,
};
