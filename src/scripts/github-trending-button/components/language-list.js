/**
 * 语言列表组件
 */

import { createElement, $$ } from '@utils/dom.js';
import { POPULAR_LANGUAGES, CATEGORIES } from '../config.js';
import { starIcon } from './icons.js';

/**
 * 生成语言链接 URL
 * @param {Object} lang - 语言对象
 * @param {string} period - 时间段
 * @returns {string} URL
 */
export function generateLanguageUrl(lang, period = 'daily') {
  const params = new URLSearchParams();
  if (period && period !== 'daily') params.set('since', period);
  if (lang.search) params.set('q', lang.search);
  const queryString = params.toString();
  return `/trending/${lang.value}${queryString ? '?' + queryString : ''}`;
}

/**
 * 创建语言链接项
 * @param {Object} options - 选项
 * @returns {HTMLElement} 链接元素
 */
export function createLanguageItem(options = {}) {
  const {
    lang,
    isFavorite = false,
    showCategory = false,
    period = 'daily',
    onFavoriteClick = null,
    onClick = null,
  } = options;

  const link = createElement('a', {
    className: 'x-trending-lang',
    attrs: {
      href: generateLanguageUrl(lang, period),
      'data-lang': lang.value,
      'data-category': lang.category,
    },
  });

  // 标签区域
  const label = createElement('span', {
    className: 'x-trending-lang__label',
  });

  const icon = createElement('span', {
    className: 'x-trending-lang__icon',
    text: lang.icon,
  });
  label.appendChild(icon);

  const name = createElement('span', { text: lang.name });
  label.appendChild(name);

  if (showCategory) {
    const category = createElement('span', {
      className: 'x-trending-lang__category',
      text: CATEGORIES[lang.category]?.name || '',
    });
    label.appendChild(category);
  }

  link.appendChild(label);

  // 收藏星标
  const star = createElement('span', {
    className: `x-trending-star ${isFavorite ? 'x-trending-star--active' : ''}`,
    attrs: {
      'data-lang': lang.value,
      title: isFavorite ? 'Remove from favorites' : 'Add to favorites',
    },
    text: starIcon(isFavorite),
  });

  star.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteClick) onFavoriteClick(lang.value, star);
  });

  link.appendChild(star);

  // 点击事件
  if (onClick) {
    link.addEventListener('click', (e) => {
      onClick(e, lang);
    });
  }

  return link;
}

/**
 * 创建语言列表
 * @param {Object} options - 选项
 * @returns {HTMLElement} 列表容器元素
 */
export function createLanguageList(options = {}) {
  const {
    favorites = [],
    period = 'daily',
    onFavoriteClick = null,
    onClick = null,
  } = options;

  const container = createElement('div', {
    className: 'x-trending-section',
  });

  const list = createElement('div', {
    attrs: { id: 'languages-list' },
  });

  POPULAR_LANGUAGES.forEach((lang) => {
    const item = createLanguageItem({
      lang,
      isFavorite: favorites.includes(lang.value),
      period,
      onFavoriteClick,
      onClick,
    });
    list.appendChild(item);
  });

  container.appendChild(list);

  // 空状态
  const empty = createElement('div', {
    className: 'x-trending-empty',
    attrs: { id: 'no-results' },
    html: `
      <div class="x-trending-empty__icon">🔍</div>
      <div>No languages found</div>
    `,
  });
  container.appendChild(empty);

  return container;
}

/**
 * 过滤语言列表
 * @param {HTMLElement} container - 容器元素
 * @param {string} query - 搜索查询
 * @param {string} category - 分类过滤
 */
export function filterLanguages(container, query = '', category = 'all') {
  const list = container.querySelector('#languages-list');
  const empty = container.querySelector('#no-results');
  if (!list) return;

  const links = $$('.x-trending-lang', list);
  let visibleCount = 0;

  links.forEach((link) => {
    const langName = link.textContent.toLowerCase();
    const langCategory = link.dataset.category;

    const matchesQuery = !query || langName.includes(query.toLowerCase());
    const matchesCategory = category === 'all' || langCategory === category;

    const visible = matchesQuery && matchesCategory;
    link.style.display = visible ? 'flex' : 'none';

    if (visible) visibleCount++;
  });

  // 显示/隐藏空状态
  if (empty) {
    empty.style.display = visibleCount === 0 && query ? 'block' : 'none';
  }
  if (list) {
    list.style.display = visibleCount === 0 && query ? 'none' : 'block';
  }
}

/**
 * 更新所有语言链接的时间段
 * @param {HTMLElement} container - 容器元素
 * @param {string} period - 时间段
 */
export function updateLanguageUrls(container, period) {
  const links = $$('.x-trending-lang', container);

  links.forEach((link) => {
    const langValue = link.dataset.lang;
    const lang = POPULAR_LANGUAGES.find((l) => l.value === langValue);
    if (lang) {
      link.href = generateLanguageUrl(lang, period);
    }
  });
}

/**
 * 更新收藏星标状态
 * @param {HTMLElement} container - 容器元素
 * @param {string[]} favorites - 收藏列表
 */
export function updateFavoriteStars(container, favorites) {
  const stars = $$('.x-trending-star', container);

  stars.forEach((star) => {
    const lang = star.dataset.lang;
    const isFavorite = favorites.includes(lang);
    star.textContent = starIcon(isFavorite);
    star.classList.toggle('x-trending-star--active', isFavorite);
    star.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';
  });
}

export default {
  generateLanguageUrl,
  createLanguageItem,
  createLanguageList,
  filterLanguages,
  updateLanguageUrls,
  updateFavoriteStars,
};
