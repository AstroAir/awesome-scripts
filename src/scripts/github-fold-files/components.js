/**
 * GitHub Fold Files 组件模块
 */

import { createElement, $, $$ } from '@utils/dom.js';
import { CONFIG, SELECTORS } from './config.js';

/**
 * 创建折叠按钮
 * @param {Function} onClick - 点击回调
 * @param {boolean} collapsed - 初始是否折叠
 * @returns {HTMLDivElement} 按钮容器
 */
export function createFoldButton(onClick, collapsed = false) {
  const container = createElement('div', {
    className: 'x-button-container',
  });

  const button = createElement('button', {
    className: `x-fold-button Button--iconOnly Button--invisible ${collapsed ? 'x-collapsed' : ''}`,
    attrs: {
      'aria-label': '折叠/展开文件夹',
      title: '点击折叠/展开文件夹',
    },
    html: `
      <svg class="x-chevron" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
      </svg>
    `,
    events: {
      click: (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) onClick(e, button);
      },
    },
  });

  container.appendChild(button);
  return container;
}

/**
 * 创建全局折叠/展开按钮
 * @param {Function} onClick - 点击回调
 * @returns {HTMLDivElement} 按钮容器
 */
export function createGlobalToggleButton(onClick) {
  const container = createElement('div', {
    className: 'x-global-toggle',
  });

  const button = createElement('button', {
    className: 'x-global-btn types__StyledButton-sc-ws60qy-0',
    attrs: {
      title: '折叠所有文件夹',
    },
    html: `
      <svg class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H13a1 1 0 0 1 1 1v.5H2.75a.75.75 0 0 0 0 1.5h11.978a1 1 0 0 1 .994 1.117L15 13.25A1.75 1.75 0 0 1 13.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.184-.909.513-1.237Z"></path>
      </svg>
      <span class="x-global-text">全部折叠</span>
    `,
  });

  let allCollapsed = false;

  button.addEventListener('click', () => {
    allCollapsed = !allCollapsed;
    if (onClick) onClick(allCollapsed);

    // 更新按钮文本
    const textEl = button.querySelector('.x-global-text');
    if (textEl) {
      textEl.textContent = allCollapsed ? '全部展开' : '全部折叠';
    }
  });

  container.appendChild(button);
  return container;
}

/**
 * 获取文件夹路径
 * @param {HTMLElement} tbody - 表格主体元素
 * @returns {string} 文件夹路径
 */
export function getFolderPath(tbody) {
  const pathElement = $(SELECTORS.pathLink, tbody);
  return pathElement ? pathElement.getAttribute('href') : '';
}

/**
 * 获取可折叠的行
 * @param {HTMLElement} tbody - 表格主体元素
 * @returns {HTMLElement[]} 行元素数组
 */
export function getFoldableRows(tbody) {
  return $$('tr:not(:first-child)', tbody);
}

/**
 * 更新按钮状态
 * @param {HTMLButtonElement} button - 按钮元素
 * @param {boolean} collapsed - 是否折叠
 */
export function updateButtonState(button, collapsed) {
  button.classList.toggle('x-collapsed', collapsed);
}

/**
 * 设置悬停预览
 * @param {HTMLElement} tbody - 表格主体元素
 * @param {HTMLButtonElement} button - 按钮元素
 */
export function setupHoverPreview(tbody, button) {
  if (!CONFIG.hoverPreview) return;

  let hoverTimeout = null;

  button.addEventListener('mouseenter', () => {
    if (tbody.classList.contains('x-folded')) {
      hoverTimeout = setTimeout(() => {
        tbody.classList.add('x-hover-preview');
      }, 500);
    }
  });

  button.addEventListener('mouseleave', () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    tbody.classList.remove('x-hover-preview');
  });
}

export default {
  createFoldButton,
  createGlobalToggleButton,
  getFolderPath,
  getFoldableRows,
  updateButtonState,
  setupHoverPreview,
};
