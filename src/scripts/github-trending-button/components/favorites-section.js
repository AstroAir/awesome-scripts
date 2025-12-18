/**
 * 收藏夹区域组件
 */

import { createElement, empty } from '@utils/dom.js';
import { POPULAR_LANGUAGES } from '../config.js';
import { createLanguageItem } from './language-list.js';

/**
 * 创建收藏夹区域
 * @param {Object} options - 选项
 * @returns {HTMLElement|null} 区域元素或 null
 */
export function createFavoritesSection(options = {}) {
  const {
    favorites = [],
    period = 'daily',
    onFavoriteClick = null,
    onClick = null,
  } = options;

  if (favorites.length === 0) return null;

  const section = createElement('div', {
    className: 'x-trending-section',
  });

  // 标题
  const title = createElement('div', {
    className: 'x-trending-section__title',
    text: '⭐ Favorites',
  });
  section.appendChild(title);

  // 列表容器
  const list = createElement('div', {
    attrs: { id: 'favorites-list' },
  });

  favorites.forEach((langValue) => {
    const lang = POPULAR_LANGUAGES.find((l) => l.value === langValue);
    if (!lang) return;

    const item = createLanguageItem({
      lang,
      isFavorite: true,
      period,
      onFavoriteClick,
      onClick,
    });
    list.appendChild(item);
  });

  section.appendChild(list);

  return section;
}

/**
 * 更新收藏夹列表
 * @param {HTMLElement} listElement - 列表元素
 * @param {Object} options - 选项
 */
export function updateFavoritesList(listElement, options = {}) {
  const {
    favorites = [],
    period = 'daily',
    onFavoriteClick = null,
    onClick = null,
  } = options;

  // 清空现有内容
  empty(listElement);

  favorites.forEach((langValue) => {
    const lang = POPULAR_LANGUAGES.find((l) => l.value === langValue);
    if (!lang) return;

    const item = createLanguageItem({
      lang,
      isFavorite: true,
      period,
      onFavoriteClick,
      onClick,
    });
    listElement.appendChild(item);
  });
}

export default {
  createFavoritesSection,
  updateFavoritesList,
};
