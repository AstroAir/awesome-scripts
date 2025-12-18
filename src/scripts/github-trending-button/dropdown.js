/**
 * GitHub Trending Button 下拉菜单模块
 */

import { createElement } from '@utils/dom.js';
import { CONFIG } from './config.js';
import storage from './storage.js';
import { trendingIcon } from './components/icons.js';
import { createSearchBox, getSearchInput } from './components/search-box.js';
import { createPeriodSelector, getActivePeriod } from './components/period-selector.js';
import { createCategoryTabs } from './components/category-tabs.js';
import {
  createLanguageList,
  filterLanguages,
  updateLanguageUrls,
  updateFavoriteStars,
} from './components/language-list.js';
import { createRecentSection } from './components/recent-section.js';
import { createFavoritesSection, updateFavoritesList } from './components/favorites-section.js';
import { showSettingsDialog } from './components/settings-dialog.js';

/**
 * 创建下拉菜单
 * @param {Object} options - 选项
 * @returns {HTMLElement} 下拉菜单元素
 */
export function createDropdown(options = {}) {
  const { onRefresh = null } = options;

  const settings = storage.getSettings();
  const favorites = storage.getFavorites();
  const recent = storage.getRecent();

  const dropdown = createElement('div', {
    className: 'x-trending-dropdown',
    attrs: { id: CONFIG.DROPDOWN_ID },
  });

  // ========== 头部区域 ==========
  const header = createElement('div', {
    className: 'x-trending-header',
  });

  // 标题栏
  const headerTop = createElement('div', {
    className: 'x-trending-header__top',
  });

  const title = createElement('strong', {
    className: 'x-trending-header__title',
    html: `${trendingIcon()}<span>Trending</span>`,
  });
  headerTop.appendChild(title);

  // 设置按钮
  const settingsBtn = createElement('button', {
    className: 'x-trending-settings-btn',
    attrs: {
      type: 'button',
      title: 'Settings',
    },
    text: '⚙️',
  });
  settingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleSettingsClick(dropdown, onRefresh);
  });
  headerTop.appendChild(settingsBtn);

  header.appendChild(headerTop);

  // 时间段选择器
  const periodSelector = createPeriodSelector({
    activePeriod: settings.defaultPeriod,
    onChange: (period) => handlePeriodChange(dropdown, period),
  });
  header.appendChild(periodSelector);

  dropdown.appendChild(header);

  // ========== 搜索框 ==========
  const searchBox = createSearchBox({
    onInput: (e) => handleSearchInput(dropdown, e.target.value),
  });
  dropdown.appendChild(searchBox);

  // ========== 最近访问 ==========
  if (settings.showRecent && recent.length > 0) {
    const recentSection = createRecentSection({
      recent,
      period: settings.defaultPeriod,
      onClear: () => handleClearRecent(dropdown, onRefresh),
      onClick: (e, lang) => handleLanguageClick(e, lang, settings),
    });
    if (recentSection) dropdown.appendChild(recentSection);
  }

  // ========== 收藏夹 ==========
  if (favorites.length > 0) {
    const favoritesSection = createFavoritesSection({
      favorites,
      period: settings.defaultPeriod,
      onFavoriteClick: (langValue) => handleFavoriteClick(dropdown, langValue),
      onClick: (e, lang) => handleLanguageClick(e, lang, settings),
    });
    if (favoritesSection) dropdown.appendChild(favoritesSection);
  }

  // ========== 分类标签 ==========
  const categoryTabs = createCategoryTabs({
    onChange: (category) => handleCategoryChange(dropdown, category),
  });
  dropdown.appendChild(categoryTabs);

  // ========== 语言列表 ==========
  const languageList = createLanguageList({
    favorites,
    period: settings.defaultPeriod,
    onFavoriteClick: (langValue) => handleFavoriteClick(dropdown, langValue),
    onClick: (e, lang) => handleLanguageClick(e, lang, settings),
  });
  dropdown.appendChild(languageList);

  // ========== 底部提示 ==========
  const footer = createElement('div', {
    className: 'x-trending-footer',
    html: `
      <div class="x-trending-footer__inner">
        <span>💡 <kbd class="x-trending-kbd">Alt+T</kbd> Quick open</span>
        <span><kbd class="x-trending-kbd">ESC</kbd> Close</span>
      </div>
    `,
  });
  dropdown.appendChild(footer);

  return dropdown;
}

/**
 * 处理时间段变化
 * @param {HTMLElement} dropdown - 下拉菜单元素
 * @param {string} period - 时间段
 */
function handlePeriodChange(dropdown, period) {
  const settings = storage.getSettings();
  storage.setSettings({ ...settings, defaultPeriod: period });

  // 更新所有链接
  updateLanguageUrls(dropdown, period);
}

/**
 * 处理搜索输入
 * @param {HTMLElement} dropdown - 下拉菜单元素
 * @param {string} query - 搜索查询
 */
function handleSearchInput(dropdown, query) {
  const languageSection = dropdown.querySelector('.x-trending-section:last-of-type');
  if (languageSection) {
    filterLanguages(languageSection, query);
  }
}

/**
 * 处理分类变化
 * @param {HTMLElement} dropdown - 下拉菜单元素
 * @param {string} category - 分类
 */
function handleCategoryChange(dropdown, category) {
  const languageSection = dropdown.querySelector('.x-trending-section:last-of-type');
  const searchInput = getSearchInput(dropdown);
  const query = searchInput ? searchInput.value : '';

  if (languageSection) {
    filterLanguages(languageSection, query, category);
  }

  // 清空搜索
  if (searchInput) searchInput.value = '';
}

/**
 * 处理收藏点击
 * @param {HTMLElement} dropdown - 下拉菜单元素
 * @param {string} langValue - 语言值
 */
function handleFavoriteClick(dropdown, langValue) {
  storage.toggleFavorite(langValue);
  const favorites = storage.getFavorites();

  // 更新收藏星标
  updateFavoriteStars(dropdown, favorites);

  // 更新收藏夹列表
  const favoritesList = dropdown.querySelector('#favorites-list');
  if (favoritesList) {
    const period = getActivePeriod(dropdown.querySelector('.x-trending-periods'));
    updateFavoritesList(favoritesList, {
      favorites,
      period,
      onFavoriteClick: (lv) => handleFavoriteClick(dropdown, lv),
    });
  }
}

/**
 * 处理语言点击
 * @param {Event} e - 事件
 * @param {Object} lang - 语言对象
 * @param {Object} settings - 设置
 */
function handleLanguageClick(e, lang, settings) {
  storage.addRecent(lang.value);

  if (settings.openInNewTab) {
    e.preventDefault();
    window.open(e.currentTarget.href, '_blank');
  }
}

/**
 * 处理清除最近访问
 * @param {HTMLElement} dropdown - 下拉菜单元素
 * @param {Function} onRefresh - 刷新回调
 */
function handleClearRecent(dropdown, onRefresh) {
  storage.clearRecent();
  if (onRefresh) onRefresh();
}

/**
 * 处理设置点击
 * @param {HTMLElement} dropdown - 下拉菜单元素
 * @param {Function} onRefresh - 刷新回调
 */
function handleSettingsClick(dropdown, onRefresh) {
  const settings = storage.getSettings();

  showSettingsDialog({
    settings,
    onSave: (newSettings) => {
      storage.setSettings(newSettings);
      if (onRefresh) onRefresh();
    },
  });
}

/**
 * 切换下拉菜单可见性
 * @param {HTMLElement} dropdown - 下拉菜单元素
 * @param {boolean} visible - 是否可见
 */
export function toggleDropdown(dropdown, visible) {
  if (visible === undefined) {
    dropdown.classList.toggle('x-trending-dropdown--visible');
  } else {
    dropdown.classList.toggle('x-trending-dropdown--visible', visible);
  }

  // 聚焦搜索框
  if (dropdown.classList.contains('x-trending-dropdown--visible')) {
    const searchInput = getSearchInput(dropdown);
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 50);
    }
  }
}

/**
 * 设置点击外部关闭
 * @param {HTMLElement} container - 容器元素
 * @param {HTMLElement} dropdown - 下拉菜单元素
 */
export function setupClickOutside(container, dropdown) {
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      toggleDropdown(dropdown, false);
    }
  });
}

/**
 * 设置 ESC 键关闭
 * @param {HTMLElement} dropdown - 下拉菜单元素
 */
export function setupEscClose(dropdown) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleDropdown(dropdown, false);
    }
  });
}

export default {
  createDropdown,
  toggleDropdown,
  setupClickOutside,
  setupEscClose,
};
