/**
 * GitHub Fold Files 样式模块
 */

import { css } from '@core/styles.js';

/**
 * 主要样式
 */
export const foldFilesStyles = css`
  /* 折叠状态 */
  .x-folded > tr:not(:first-child) {
    display: none !important;
  }

  /* 悬停预览 */
  .x-hover-preview > tr:not(:first-child) {
    display: table-row !important;
    opacity: 0.6 !important;
    pointer-events: none;
  }

  /* 按钮容器 */
  .x-button-container {
    display: inline-flex;
    margin-left: auto;
  }

  /* 折叠按钮 */
  .x-fold-button {
    width: 2em;
    height: 2em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--fgColor-muted, #656d76);
  }

  .x-fold-button:hover {
    background-color: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
    color: var(--fgColor-default, #1f2328);
  }

  .x-fold-button:active {
    transform: scale(0.95);
  }

  /* 图标旋转动画 */
  .x-chevron {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .x-collapsed .x-chevron {
    transform: rotate(-90deg);
  }

  /* 确保按钮在右侧 */
  div:has(+ .x-button-container) {
    margin-left: auto;
  }

  /* 全局按钮样式 */
  .x-global-toggle {
    display: inline-flex;
    margin-right: 8px;
  }

  .x-global-btn {
    display: inline-flex;
    align-items: center;
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
  }

  .x-global-btn:hover {
    background-color: var(--button-default-bgColor-hover, #f3f4f6);
    border-color: var(--button-default-borderColor-hover, rgba(27, 31, 36, 0.15));
  }

  .x-global-btn:active {
    background-color: var(--button-default-bgColor-active, hsla(220, 14%, 93%, 1));
  }

  .x-global-btn svg {
    flex-shrink: 0;
  }

  /* 行动画优化 - 移除可能导致抖动的样式 */
  tbody[data-animating="true"] tr {
    will-change: opacity, transform;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .x-global-text {
      display: none;
    }
    .x-global-btn {
      padding: 5px 8px;
    }
  }

  /* 性能优化 */
  .x-fold-button,
  .x-chevron {
    will-change: transform;
  }

  /* 焦点样式 */
  .x-fold-button:focus-visible,
  .x-global-btn:focus-visible {
    outline: 2px solid var(--focus-outlineColor, #0969da);
    outline-offset: 2px;
  }

  /* 减少动画 */
  @media (prefers-reduced-motion: reduce) {
    .x-fold-button,
    .x-chevron,
    .x-global-btn,
    tbody tr {
      transition: none !important;
    }
  }
`;

export default foldFilesStyles;
