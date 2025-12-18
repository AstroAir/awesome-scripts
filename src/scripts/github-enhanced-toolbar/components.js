/**
 * GitHub Enhanced Toolbar 组件模块
 */

import { BUTTONS, SELECTORS, CONFIG } from './config.js';
import { buildSafeUrl, createSVGIcon, createImageIcon, getCurrentTheme } from './utils.js';

/**
 * 查找按钮容器
 * @returns {HTMLElement|null} 按钮容器元素
 */
export async function findButtonContainer() {
  for (const selector of SELECTORS) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  return null;
}

/**
 * 统计已存在的按钮数量
 * @param {HTMLElement} container - 按钮容器
 * @returns {number} 按钮数量
 */
export function countExistingButtons(container) {
  if (!container) return 0;

  const buttonIds = BUTTONS.map((btn) => `#${btn.id}`).join(',');
  const existingButtons = container.querySelectorAll(`li:not(${buttonIds})`);
  return existingButtons.length;
}

/**
 * 创建自定义按钮
 * @param {Object} config - 按钮配置
 * @param {boolean} iconOnly - 是否仅显示图标
 * @returns {HTMLElement} 按钮元素
 */
export function createCustomButton(config, iconOnly = false) {
  const { id, baseUrl, text, iconType, iconSrc, iconContent } = config;

  const li = document.createElement('li');
  li.id = id;
  li.className = 'd-flex';

  const a = document.createElement('a');
  a.href = buildSafeUrl(baseUrl);
  a.className = iconOnly
    ? 'btn btn-sm custom-github-button icon-only'
    : 'btn btn-sm custom-github-button';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.setAttribute('aria-label', text);

  if (iconOnly) {
    a.title = text;
  }

  let iconElement;
  if (iconType === 'image') {
    iconElement = createImageIcon(iconSrc);
  } else if (iconType === 'svg') {
    iconElement = createSVGIcon(iconContent);
  }

  if (iconElement) {
    a.appendChild(iconElement);
  }

  if (!iconOnly) {
    const span = document.createElement('span');
    span.textContent = text;
    a.appendChild(span);
  }

  li.appendChild(a);
  return li;
}

/**
 * 添加所有按钮到页面
 * @returns {Promise<void>}
 */
export async function addButtons() {
  try {
    const buttonContainer = await findButtonContainer();
    if (!buttonContainer) {
      console.log('[GitHub增强] 未找到按钮容器');
      return;
    }

    BUTTONS.forEach(({ id }) => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    });

    const existingCount = countExistingButtons(buttonContainer);
    const isNarrowWidth = window.innerWidth < CONFIG.WIDTH_THRESHOLD;
    const iconOnly = existingCount > CONFIG.BUTTON_THRESHOLD || isNarrowWidth;

    BUTTONS.slice().reverse().forEach((config) => {
      const button = createCustomButton(config, iconOnly);
      buttonContainer.insertBefore(button, buttonContainer.firstChild);
    });

    const theme = getCurrentTheme();
    console.log(`[GitHub增强] 成功添加 ${BUTTONS.length} 个按钮 (${iconOnly ? '图标' : '文本'}模式, ${theme}主题)`);
  } catch (error) {
    console.error('[GitHub增强] 添加按钮失败:', error);
  }
}

export default {
  findButtonContainer,
  countExistingButtons,
  createCustomButton,
  addButtons,
};
