/**
 * 按钮组件模块
 * 提供可复用的按钮组件
 */

import { createElement } from '@utils/dom.js';
import { css } from '@core/styles.js';

/**
 * 按钮样式
 */
export const buttonStyles = css`
  /* 基础按钮样式 */
  .x-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 5px 12px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    border-radius: 6px;
    border: 1px solid var(--borderColor-default, rgba(27, 31, 36, 0.15));
    background-color: var(--button-default-bgColor-rest, #f6f8fa);
    color: var(--fgColor-default, #24292f);
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    text-decoration: none;
  }

  .x-btn:hover {
    background-color: var(--button-default-bgColor-hover, #f3f4f6);
    border-color: var(--button-default-borderColor-hover, rgba(27, 31, 36, 0.15));
  }

  .x-btn:active {
    background-color: var(--button-default-bgColor-active, hsla(220, 14%, 93%, 1));
    transform: scale(0.98);
  }

  .x-btn:focus-visible {
    outline: 2px solid var(--focus-outlineColor, #0969da);
    outline-offset: 2px;
  }

  /* 仅图标按钮 */
  .x-btn--icon {
    width: 2rem;
    height: 2rem;
    padding: 0.25rem;
  }

  /* 小尺寸按钮 */
  .x-btn--sm {
    padding: 3px 8px;
    font-size: 12px;
  }

  /* 大尺寸按钮 */
  .x-btn--lg {
    padding: 8px 16px;
    font-size: 16px;
  }

  /* 主要按钮 */
  .x-btn--primary {
    background-color: var(--bgColor-emphasis, #0969da);
    color: var(--fgColor-onEmphasis, #ffffff);
    border-color: transparent;
  }

  .x-btn--primary:hover {
    background-color: var(--button-primary-bgColor-hover, #0860ca);
  }

  /* 透明按钮 */
  .x-btn--ghost {
    background: transparent;
    border-color: transparent;
    color: var(--fgColor-muted, #656d76);
  }

  .x-btn--ghost:hover {
    background-color: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
    color: var(--fgColor-default, #1f2328);
  }

  /* 危险按钮 */
  .x-btn--danger {
    color: var(--fgColor-danger, #d1242f);
    border-color: var(--borderColor-danger-emphasis, rgba(209, 36, 47, 0.4));
  }

  .x-btn--danger:hover {
    background-color: var(--bgColor-danger-emphasis, #d1242f);
    color: var(--fgColor-onEmphasis, #ffffff);
    border-color: transparent;
  }

  /* 禁用状态 */
  .x-btn:disabled,
  .x-btn--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* 加载状态 */
  .x-btn--loading {
    position: relative;
    color: transparent;
  }

  .x-btn--loading::after {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: x-btn-spin 0.6s linear infinite;
  }

  @keyframes x-btn-spin {
    to { transform: rotate(360deg); }
  }
`;

/**
 * 创建按钮元素
 * @param {Object} options - 按钮选项
 * @returns {HTMLButtonElement} 按钮元素
 */
export function createButton(options = {}) {
  const {
    text = '',
    icon = null,
    variant = 'default', // default, primary, ghost, danger
    size = 'md', // sm, md, lg
    iconOnly = false,
    disabled = false,
    loading = false,
    className = '',
    attrs = {},
    onClick = null,
  } = options;

  const classNames = ['x-btn'];

  if (variant !== 'default') classNames.push(`x-btn--${variant}`);
  if (size !== 'md') classNames.push(`x-btn--${size}`);
  if (iconOnly) classNames.push('x-btn--icon');
  if (disabled) classNames.push('x-btn--disabled');
  if (loading) classNames.push('x-btn--loading');
  if (className) classNames.push(className);

  const button = createElement('button', {
    className: classNames.join(' '),
    attrs: {
      type: 'button',
      ...attrs,
      ...(disabled ? { disabled: 'disabled' } : {}),
    },
  });

  if (icon) {
    const iconSpan = createElement('span', {
      className: 'x-btn__icon',
      html: icon,
    });
    button.appendChild(iconSpan);
  }

  if (text && !iconOnly) {
    const textSpan = createElement('span', {
      className: 'x-btn__text',
      text,
    });
    button.appendChild(textSpan);
  }

  if (onClick) {
    button.addEventListener('click', onClick);
  }

  return button;
}

/**
 * 创建折叠按钮
 * @param {Object} options - 选项
 * @returns {HTMLButtonElement} 按钮元素
 */
export function createFoldButton(options = {}) {
  const {
    collapsed = false,
    className = '',
    ariaLabel = 'Toggle fold',
    title = 'Click to fold/unfold',
    onClick = null,
  } = options;

  const button = createElement('button', {
    className: `x-fold-button ${collapsed ? 'x-folded' : ''} ${className}`.trim(),
    attrs: {
      type: 'button',
      'aria-label': ariaLabel,
      'aria-expanded': (!collapsed).toString(),
      title,
    },
    html: `
      <svg class="x-chevron" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
        <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
      </svg>
    `,
  });

  if (onClick) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    });
  }

  return button;
}

/**
 * 折叠按钮样式
 */
export const foldButtonStyles = css`
  /* 折叠按钮 */
  .x-fold-button {
    width: 1.75rem;
    height: 1.75rem;
    padding: 0.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.3, 0, 0.5, 1);
    color: var(--fgColor-muted, #656d76);
  }

  .x-fold-button:hover {
    background-color: var(--button-default-bgColor-hover, rgba(175, 184, 193, 0.2));
    color: var(--fgColor-default, #1f2328);
    transform: scale(1.1);
  }

  .x-fold-button:active {
    background-color: var(--button-default-bgColor-active, rgba(175, 184, 193, 0.3));
    transform: scale(0.95);
  }

  .x-fold-button:focus-visible {
    outline: 2px solid var(--focus-outlineColor, #0969da);
    outline-offset: 2px;
    box-shadow: 0 0 0 3px var(--focus-outlineColor-alpha, rgba(9, 105, 218, 0.3));
  }

  /* 图标 */
  .x-chevron {
    display: block;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* 折叠状态 */
  .x-fold-button.x-folded .x-chevron,
  .x-fold-button.x-collapsed .x-chevron {
    transform: rotate(-90deg);
  }

  /* 暗色主题 */
  [data-color-mode="dark"] .x-fold-button {
    color: var(--fgColor-muted, #848d97);
  }

  [data-color-mode="dark"] .x-fold-button:hover {
    background-color: var(--button-default-bgColor-hover, rgba(110, 118, 129, 0.4));
    color: var(--fgColor-default, #e6edf3);
  }

  /* 减少动画 */
  @media (prefers-reduced-motion: reduce) {
    .x-fold-button,
    .x-chevron {
      transition: none !important;
    }
  }

  /* 移动端优化 */
  @media (max-width: 768px) {
    .x-fold-button {
      width: 2rem;
      height: 2rem;
      padding: 0.375rem;
    }
  }
`;

export default {
  buttonStyles,
  foldButtonStyles,
  createButton,
  createFoldButton,
};
