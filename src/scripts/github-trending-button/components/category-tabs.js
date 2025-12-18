/**
 * 分类标签组件
 */

import { createElement, $$ } from '@utils/dom.js';
import { CATEGORIES } from '../config.js';

/**
 * 创建分类标签
 * @param {Object} options - 选项
 * @returns {HTMLElement} 标签容器元素
 */
export function createCategoryTabs(options = {}) {
  const {
    activeCategory = 'all',
    onChange = null,
  } = options;

  const container = createElement('div', {
    className: 'x-trending-tabs',
  });

  const inner = createElement('div', {
    className: 'x-trending-tabs__inner',
  });

  Object.entries(CATEGORIES).forEach(([key, category]) => {
    const isActive = key === activeCategory;
    const tab = createElement('button', {
      className: `x-trending-tab ${isActive ? 'x-trending-tab--active' : ''}`,
      attrs: {
        'data-category': key,
        type: 'button',
      },
      text: `${category.icon} ${category.name}`,
    });

    if (isActive) {
      tab.dataset.active = 'true';
    }

    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      setActiveCategory(container, key);
      if (onChange) onChange(key);
    });

    inner.appendChild(tab);
  });

  container.appendChild(inner);
  return container;
}

/**
 * 设置活动分类
 * @param {HTMLElement} container - 容器元素
 * @param {string} category - 分类键
 */
export function setActiveCategory(container, category) {
  const tabs = $$('.x-trending-tab', container);

  tabs.forEach((tab) => {
    const isActive = tab.dataset.category === category;
    tab.classList.toggle('x-trending-tab--active', isActive);
    tab.dataset.active = isActive ? 'true' : '';
  });
}

/**
 * 获取当前活动分类
 * @param {HTMLElement} container - 容器元素
 * @returns {string} 分类键
 */
export function getActiveCategory(container) {
  const activeTab = container.querySelector('.x-trending-tab--active');
  return activeTab ? activeTab.dataset.category : 'all';
}

export default {
  createCategoryTabs,
  setActiveCategory,
  getActiveCategory,
};
