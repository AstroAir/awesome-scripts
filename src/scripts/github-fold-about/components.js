/**
 * GitHub Fold About 组件模块
 */

import { createElement, $$ } from '@utils/dom.js';

/**
 * 创建折叠按钮
 * @param {string} stateKey - 状态键
 * @param {Function} onClick - 点击回调
 * @returns {HTMLButtonElement} 按钮元素
 */
export function createAboutFoldButton(stateKey, onClick) {
  const button = createElement('button', {
    className: 'x-about-fold-button',
    attrs: {
      type: 'button',
      'aria-label': 'Toggle About section',
      'data-state-key': stateKey,
      title: 'Toggle About section',
    },
    html: `
      <svg aria-hidden="true" class="x-about-chevron"
           viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
      </svg>
    `,
    events: {
      click: (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) onClick(e);
      },
    },
  });

  return button;
}

/**
 * 创建按钮包装器
 * @param {HTMLButtonElement} button - 按钮元素
 * @returns {HTMLSpanElement} 包装器元素
 */
export function createButtonWrapper(button) {
  const wrapper = createElement('span', {
    className: 'x-about-fold-wrapper',
  });
  wrapper.appendChild(button);
  return wrapper;
}

/**
 * 查找 About 标题元素
 * @returns {HTMLElement|null} About 标题元素
 */
export function findAboutHeading() {
  const headings = $$('h2.mb-3.h4');
  return headings.find((h) => h.textContent.trim() === 'About') || null;
}

/**
 * 获取可折叠的内容元素
 * @param {HTMLElement} container - 容器元素
 * @param {HTMLElement} heading - 标题元素
 * @returns {HTMLElement[]} 可折叠元素数组
 */
export function getFoldableContent(container, heading) {
  const elements = [];
  let currentElement = heading.nextElementSibling;

  while (currentElement) {
    // 跳过编辑按钮的 details 元素
    if (!currentElement.matches('details.details-reset')) {
      elements.push(currentElement);
    }
    currentElement = currentElement.nextElementSibling;
  }

  return elements;
}

/**
 * 更新按钮状态
 * @param {HTMLButtonElement} button - 按钮元素
 * @param {boolean} isFolded - 是否折叠
 */
export function updateButtonState(button, isFolded) {
  button.classList.toggle('x-folded', isFolded);
  button.setAttribute('aria-expanded', (!isFolded).toString());
  button.setAttribute(
    'aria-label',
    isFolded ? 'Expand About section' : 'Collapse About section',
  );
}

export default {
  createAboutFoldButton,
  createButtonWrapper,
  findAboutHeading,
  getFoldableContent,
  updateButtonState,
};
