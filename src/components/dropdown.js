/**
 * 下拉菜单组件模块
 * 提供可复用的下拉菜单组件
 */

import { createElement } from '@utils/dom.js';
import { css } from '@core/styles.js';

/**
 * 下拉菜单样式
 */
export const dropdownStyles = css`
  /* 下拉菜单容器 */
  .x-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: var(--overlay-bgColor, #ffffff);
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 12px;
    box-shadow: var(--shadow-floating-large, 0 8px 24px rgba(140,149,159,0.2));
    min-width: 200px;
    max-height: 80vh;
    overflow-y: auto;
    z-index: 9999;
    display: none;
  }

  .x-dropdown--visible {
    display: block;
  }

  .x-dropdown--left {
    right: auto;
    left: 0;
  }

  /* 下拉菜单头部 */
  .x-dropdown__header {
    padding: 16px;
    border-bottom: 1px solid var(--borderColor-default, #d0d7de);
  }

  .x-dropdown__title {
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* 下拉菜单内容 */
  .x-dropdown__content {
    padding: 12px 16px;
  }

  /* 下拉菜单分隔区域 */
  .x-dropdown__section {
    padding: 12px 16px;
    border-bottom: 1px solid var(--borderColor-default, #d0d7de);
  }

  .x-dropdown__section:last-child {
    border-bottom: none;
  }

  .x-dropdown__section-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--fgColor-muted, #656d76);
    margin-bottom: 8px;
  }

  /* 下拉菜单项 */
  .x-dropdown__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    margin: 2px 0;
    border-radius: 6px;
    text-decoration: none;
    color: var(--fgColor-default, #1f2328);
    font-size: 13px;
    transition: background 0.2s;
    cursor: pointer;
  }

  .x-dropdown__item:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  .x-dropdown__item--active {
    background: var(--bgColor-accent-muted, rgba(9, 105, 218, 0.1));
    color: var(--fgColor-accent, #0969da);
  }

  /* 下拉菜单底部 */
  .x-dropdown__footer {
    border-top: 1px solid var(--borderColor-default, #d0d7de);
    padding: 10px 16px;
    font-size: 11px;
    color: var(--fgColor-muted, #656d76);
  }

  /* 搜索框 */
  .x-dropdown__search {
    padding: 12px 16px;
    border-bottom: 1px solid var(--borderColor-default, #d0d7de);
  }

  .x-dropdown__search-input {
    width: 100%;
    padding: 6px 12px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 6px;
    background: var(--bgColor-default, #ffffff);
    color: var(--fgColor-default, #1f2328);
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .x-dropdown__search-input:focus {
    border-color: var(--focus-outlineColor, #0969da);
    box-shadow: 0 0 0 3px var(--focus-outlineColor-alpha, rgba(9, 105, 218, 0.3));
  }

  /* 空状态 */
  .x-dropdown__empty {
    padding: 20px;
    text-align: center;
    color: var(--fgColor-muted, #656d76);
    font-size: 13px;
  }

  .x-dropdown__empty-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  /* 标签组 */
  .x-dropdown__tabs {
    display: inline-flex;
    gap: 4px;
    overflow-x: auto;
    white-space: nowrap;
  }

  .x-dropdown__tab {
    padding: 4px 12px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 6px;
    background: transparent;
    color: var(--fgColor-default, #1f2328);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .x-dropdown__tab:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  .x-dropdown__tab--active {
    background: var(--bgColor-emphasis, #0969da);
    color: var(--fgColor-onEmphasis, #ffffff);
    border-color: transparent;
  }

  /* 芯片组 */
  .x-dropdown__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .x-dropdown__chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 12px;
    text-decoration: none;
    color: var(--fgColor-default, #1f2328);
    font-size: 12px;
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
    transition: all 0.2s;
  }

  .x-dropdown__chip:hover {
    background: var(--bgColor-emphasis, #0969da);
    color: var(--fgColor-onEmphasis, #ffffff);
    border-color: transparent;
  }
`;

/**
 * 创建下拉菜单
 * @param {Object} options - 选项
 * @returns {HTMLElement} 下拉菜单元素
 */
export function createDropdown(options = {}) {
  const {
    id = null,
    className = '',
    position = 'right', // right, left
    header = null,
    content = null,
    footer = null,
    visible = false,
  } = options;

  const classNames = ['x-dropdown'];
  if (position === 'left') classNames.push('x-dropdown--left');
  if (visible) classNames.push('x-dropdown--visible');
  if (className) classNames.push(className);

  const dropdown = createElement('div', {
    id,
    className: classNames.join(' '),
  });

  if (header) {
    const headerEl = createElement('div', {
      className: 'x-dropdown__header',
      html: typeof header === 'string' ? header : '',
    });
    if (header instanceof Element) headerEl.appendChild(header);
    dropdown.appendChild(headerEl);
  }

  if (content) {
    const contentEl = createElement('div', {
      className: 'x-dropdown__content',
      html: typeof content === 'string' ? content : '',
    });
    if (content instanceof Element) contentEl.appendChild(content);
    dropdown.appendChild(contentEl);
  }

  if (footer) {
    const footerEl = createElement('div', {
      className: 'x-dropdown__footer',
      html: typeof footer === 'string' ? footer : '',
    });
    if (footer instanceof Element) footerEl.appendChild(footer);
    dropdown.appendChild(footerEl);
  }

  return dropdown;
}

/**
 * 创建下拉菜单区域
 * @param {Object} options - 选项
 * @returns {HTMLElement} 区域元素
 */
export function createDropdownSection(options = {}) {
  const {
    title = '',
    content = null,
    className = '',
  } = options;

  const section = createElement('div', {
    className: `x-dropdown__section ${className}`.trim(),
  });

  if (title) {
    const titleEl = createElement('div', {
      className: 'x-dropdown__section-title',
      text: title,
    });
    section.appendChild(titleEl);
  }

  if (content) {
    if (typeof content === 'string') {
      section.innerHTML += content;
    } else if (content instanceof Element) {
      section.appendChild(content);
    }
  }

  return section;
}

/**
 * 创建搜索框
 * @param {Object} options - 选项
 * @returns {HTMLElement} 搜索框容器元素
 */
export function createSearchBox(options = {}) {
  const {
    placeholder = 'Search...',
    onInput = null,
    onKeydown = null,
  } = options;

  const container = createElement('div', {
    className: 'x-dropdown__search',
  });

  const input = createElement('input', {
    className: 'x-dropdown__search-input',
    attrs: {
      type: 'text',
      placeholder,
    },
  });

  if (onInput) {
    input.addEventListener('input', onInput);
  }

  if (onKeydown) {
    input.addEventListener('keydown', onKeydown);
  }

  container.appendChild(input);
  return container;
}

/**
 * 创建下拉菜单项
 * @param {Object} options - 选项
 * @returns {HTMLElement} 菜单项元素
 */
export function createDropdownItem(options = {}) {
  const {
    text = '',
    icon = '',
    href = null,
    active = false,
    className = '',
    attrs = {},
    onClick = null,
  } = options;

  const tag = href ? 'a' : 'div';
  const classNames = ['x-dropdown__item'];
  if (active) classNames.push('x-dropdown__item--active');
  if (className) classNames.push(className);

  const item = createElement(tag, {
    className: classNames.join(' '),
    attrs: {
      ...attrs,
      ...(href ? { href } : {}),
    },
  });

  if (icon || text) {
    const labelContainer = createElement('span', {
      styles: { display: 'flex', alignItems: 'center', gap: '8px' },
    });

    if (icon) {
      const iconSpan = createElement('span', {
        styles: { fontSize: '16px' },
        html: icon,
      });
      labelContainer.appendChild(iconSpan);
    }

    if (text) {
      const textSpan = createElement('span', { text });
      labelContainer.appendChild(textSpan);
    }

    item.appendChild(labelContainer);
  }

  if (onClick) {
    item.addEventListener('click', onClick);
  }

  return item;
}

/**
 * 切换下拉菜单可见性
 * @param {HTMLElement} dropdown - 下拉菜单元素
 * @param {boolean} visible - 是否可见
 */
export function toggleDropdown(dropdown, visible) {
  if (visible === undefined) {
    dropdown.classList.toggle('x-dropdown--visible');
  } else {
    dropdown.classList.toggle('x-dropdown--visible', visible);
  }
}

/**
 * 设置点击外部关闭
 * @param {HTMLElement} container - 容器元素
 * @param {HTMLElement} dropdown - 下拉菜单元素
 * @returns {Function} 移除监听器的函数
 */
export function setupClickOutside(container, dropdown) {
  const handler = (e) => {
    if (!container.contains(e.target)) {
      toggleDropdown(dropdown, false);
    }
  };

  document.addEventListener('click', handler);

  return () => {
    document.removeEventListener('click', handler);
  };
}

/**
 * 设置 ESC 键关闭
 * @param {HTMLElement} dropdown - 下拉菜单元素
 * @returns {Function} 移除监听器的函数
 */
export function setupEscClose(dropdown) {
  const handler = (e) => {
    if (e.key === 'Escape') {
      toggleDropdown(dropdown, false);
    }
  };

  document.addEventListener('keydown', handler);

  return () => {
    document.removeEventListener('keydown', handler);
  };
}

export default {
  dropdownStyles,
  createDropdown,
  createDropdownSection,
  createSearchBox,
  createDropdownItem,
  toggleDropdown,
  setupClickOutside,
  setupEscClose,
};
