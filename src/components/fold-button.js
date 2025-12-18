/**
 * 折叠按钮组件
 * 用于 GitHub 相关脚本的折叠功能
 */

import { createElement } from '@utils/dom.js';

/**
 * 创建折叠按钮
 * @param {Object} options - 配置选项
 * @returns {HTMLButtonElement} 按钮元素
 */
export function createFoldButton(options = {}) {
  const {
    className = 'x-fold-button',
    collapsedIcon = '▶',
    expandedIcon = '▼',
    collapsed = false,
    title = '折叠/展开',
    onClick = () => {},
  } = options;

  const button = createElement('button', {
    className,
    text: collapsed ? collapsedIcon : expandedIcon,
    attrs: {
      type: 'button',
      title,
      'aria-expanded': String(!collapsed),
    },
    events: {
      click: (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      },
    },
  });

  return button;
}

/**
 * 更新折叠按钮状态
 * @param {HTMLButtonElement} button - 按钮元素
 * @param {boolean} collapsed - 是否折叠
 * @param {Object} options - 图标配置
 */
export function updateFoldButton(button, collapsed, options = {}) {
  const {
    collapsedIcon = '▶',
    expandedIcon = '▼',
    collapsedClass = 'x-collapsed',
  } = options;

  button.textContent = collapsed ? collapsedIcon : expandedIcon;
  button.classList.toggle(collapsedClass, collapsed);
  button.setAttribute('aria-expanded', String(!collapsed));
}

/**
 * 获取折叠按钮的通用样式
 * @param {Object} options - 样式配置
 * @returns {string} CSS样式字符串
 */
export function getFoldButtonStyles(options = {}) {
  const {
    className = '.x-fold-button',
    size = '24px',
    fontSize = '10px',
    bgColor = 'transparent',
    hoverBgColor = 'var(--bgColor-muted, rgba(175, 184, 193, 0.2))',
    textColor = 'var(--fgColor-muted, #656d76)',
  } = options;

  return `
    ${className} {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: ${size};
      height: ${size};
      padding: 0;
      border: none;
      border-radius: 4px;
      background: ${bgColor};
      color: ${textColor};
      font-size: ${fontSize};
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.2s ease;
      flex-shrink: 0;
    }

    ${className}:hover {
      background: ${hoverBgColor};
    }

    ${className}:active {
      transform: scale(0.95);
    }

    ${className}.x-collapsed {
      transform: rotate(-90deg);
    }

    ${className}.x-collapsed:active {
      transform: rotate(-90deg) scale(0.95);
    }
  `;
}

export default {
  createFoldButton,
  updateFoldButton,
  getFoldButtonStyles,
};
