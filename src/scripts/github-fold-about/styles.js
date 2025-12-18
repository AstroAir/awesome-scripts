/**
 * GitHub Fold About 样式模块
 */

import { css } from '@core/styles.js';

/**
 * 主要样式
 */
export const aboutFoldStyles = css`
  /* About 标题样式调整 */
  h2.mb-3.h4 {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* 按钮包装器 */
  .x-about-fold-wrapper {
    display: inline-flex;
    align-items: center;
    margin-left: auto;
    pointer-events: auto;
  }

  /* 折叠按钮 */
  .x-about-fold-button {
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

  /* 图标 */
  .x-about-chevron {
    display: block;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* 折叠状态 */
  .x-about-fold-button.x-folded .x-about-chevron {
    transform: rotate(-90deg);
  }

  /* 悬停效果 */
  .x-about-fold-button:hover {
    background-color: var(--button-default-bgColor-hover, rgba(175, 184, 193, 0.2));
    color: var(--fgColor-default, #1f2328);
    transform: scale(1.1);
  }

  .x-about-fold-button:active {
    background-color: var(--button-default-bgColor-active, rgba(175, 184, 193, 0.3));
    transform: scale(0.95);
  }

  /* 暗色主题 */
  [data-color-mode="dark"] .x-about-fold-button {
    color: var(--fgColor-muted, #848d97);
  }

  [data-color-mode="dark"] .x-about-fold-button:hover {
    background-color: var(--button-default-bgColor-hover, rgba(110, 118, 129, 0.4));
    color: var(--fgColor-default, #e6edf3);
  }

  [data-color-mode="dark"] .x-about-fold-button:active {
    background-color: var(--button-default-bgColor-active, rgba(110, 118, 129, 0.5));
  }

  /* 亮色主题 */
  [data-color-mode="light"] .x-about-fold-button:hover {
    background-color: var(--button-default-bgColor-hover, rgba(234, 238, 242, 1));
  }

  [data-color-mode="light"] .x-about-fold-button:active {
    background-color: var(--button-default-bgColor-active, rgba(221, 225, 230, 1));
  }

  /* 内容动画 */
  .BorderGrid-cell > *:not(h2):not(details.details-reset) {
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  }

  /* 焦点样式 */
  .x-about-fold-button:focus-visible {
    outline: 2px solid var(--focus-outlineColor, #0969da);
    outline-offset: 2px;
    box-shadow: 0 0 0 3px var(--focus-outlineColor-alpha, rgba(9, 105, 218, 0.3));
  }

  /* 高对比度模式 */
  @media (prefers-contrast: high) {
    .x-about-fold-button {
      border: 1px solid currentColor;
    }
  }

  /* 减少动画 */
  @media (prefers-reduced-motion: reduce) {
    .x-about-fold-button,
    .x-about-chevron,
    .BorderGrid-cell > * {
      transition: none !important;
    }
  }

  /* 移动端优化 */
  @media (max-width: 768px) {
    .x-about-fold-button {
      width: 2rem;
      height: 2rem;
      padding: 0.375rem;
    }
  }

  /* 防止标题换行 */
  h2.mb-3.h4 {
    flex-wrap: nowrap;
    gap: 0.5rem;
  }
`;

export default aboutFoldStyles;
