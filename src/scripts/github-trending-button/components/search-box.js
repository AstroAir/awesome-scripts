/**
 * 搜索框组件
 */

import { createElement } from '@utils/dom.js';

/**
 * 创建搜索框
 * @param {Object} options - 选项
 * @returns {HTMLElement} 搜索框容器元素
 */
export function createSearchBox(options = {}) {
  const {
    id = 'trending-search',
    placeholder = 'Search languages...',
    onInput = null,
  } = options;

  const container = createElement('div', {
    className: 'x-trending-search',
  });

  const input = createElement('input', {
    className: 'x-trending-search__input',
    attrs: {
      type: 'text',
      id,
      placeholder,
    },
  });

  // 键盘事件
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  // 输入事件
  if (onInput) {
    input.addEventListener('input', onInput);
  }

  container.appendChild(input);
  return container;
}

/**
 * 获取搜索框输入元素
 * @param {HTMLElement} container - 容器元素
 * @returns {HTMLInputElement|null} 输入元素
 */
export function getSearchInput(container) {
  return container.querySelector('.x-trending-search__input');
}

export default {
  createSearchBox,
  getSearchInput,
};
