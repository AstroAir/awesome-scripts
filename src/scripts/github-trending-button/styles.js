/**
 * GitHub Trending Button 样式模块
 */

import { css } from '@core/styles.js';

/**
 * 主要样式
 */
export const trendingStyles = css`
  /* 下拉菜单容器 */
  .x-trending-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: var(--overlay-bgColor, #ffffff);
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 12px;
    box-shadow: var(--shadow-floating-large, 0 8px 24px rgba(140,149,159,0.2));
    min-width: 360px;
    max-width: 400px;
    max-height: 600px;
    overflow-y: auto;
    z-index: 9999;
    display: none;
  }

  .x-trending-dropdown--visible {
    display: block;
  }

  /* 头部区域 */
  .x-trending-header {
    padding: 16px;
    border-bottom: 1px solid var(--borderColor-default, #d0d7de);
  }

  .x-trending-header__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .x-trending-header__title {
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* 时间段按钮组 */
  .x-trending-periods {
    display: flex;
    gap: 6px;
  }

  .x-trending-period-btn {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 6px;
    background: transparent;
    color: var(--fgColor-default, #1f2328);
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .x-trending-period-btn:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  .x-trending-period-btn--active {
    background: var(--bgColor-emphasis, #0969da);
    color: var(--fgColor-onEmphasis, #ffffff);
    border-color: transparent;
    font-weight: 600;
  }

  /* 搜索框 */
  .x-trending-search {
    padding: 12px 16px;
    border-bottom: 1px solid var(--borderColor-default, #d0d7de);
  }

  .x-trending-search__input {
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

  .x-trending-search__input:focus {
    border-color: var(--focus-outlineColor, #0969da);
    box-shadow: 0 0 0 3px var(--focus-outlineColor-alpha, rgba(9, 105, 218, 0.3));
  }

  /* 区块样式 */
  .x-trending-section {
    padding: 12px 16px;
    border-bottom: 1px solid var(--borderColor-default, #d0d7de);
  }

  .x-trending-section:last-child {
    border-bottom: none;
  }

  .x-trending-section__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .x-trending-section__title {
    font-size: 12px;
    font-weight: 600;
    color: var(--fgColor-muted, #656d76);
  }

  /* 芯片样式 */
  .x-trending-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .x-trending-chip {
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

  .x-trending-chip:hover {
    background: var(--bgColor-emphasis, #0969da);
    color: var(--fgColor-onEmphasis, #ffffff);
    border-color: transparent;
  }

  /* 分类标签 */
  .x-trending-tabs {
    padding: 8px 16px;
    border-bottom: 1px solid var(--borderColor-default, #d0d7de);
    overflow-x: auto;
    white-space: nowrap;
  }

  .x-trending-tabs__inner {
    display: inline-flex;
    gap: 4px;
  }

  .x-trending-tab {
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

  .x-trending-tab:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  .x-trending-tab--active {
    background: var(--bgColor-emphasis, #0969da);
    color: var(--fgColor-onEmphasis, #ffffff);
    border-color: transparent;
  }

  /* 语言链接 */
  .x-trending-lang {
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
  }

  .x-trending-lang:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  .x-trending-lang__label {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .x-trending-lang__icon {
    font-size: 16px;
  }

  .x-trending-lang__category {
    font-size: 10px;
    color: var(--fgColor-muted, #656d76);
    opacity: 0.7;
  }

  /* 收藏星标 */
  .x-trending-star {
    cursor: pointer;
    font-size: 14px;
    opacity: 0.3;
    transition: all 0.2s;
    padding: 0 4px;
  }

  .x-trending-star:hover {
    opacity: 1;
    transform: scale(1.2);
  }

  .x-trending-star--active {
    opacity: 1;
  }

  /* 空状态 */
  .x-trending-empty {
    display: none;
    padding: 20px;
    text-align: center;
    color: var(--fgColor-muted, #656d76);
    font-size: 13px;
  }

  .x-trending-empty__icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  /* 底部提示 */
  .x-trending-footer {
    border-top: 1px solid var(--borderColor-default, #d0d7de);
    padding: 10px 16px;
    font-size: 11px;
    color: var(--fgColor-muted, #656d76);
  }

  .x-trending-footer__inner {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }

  .x-trending-kbd {
    padding: 2px 6px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 3px;
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
    font-family: monospace;
  }

  /* 设置按钮 */
  .x-trending-settings-btn {
    padding: 4px 8px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 6px;
    background: transparent;
    color: var(--fgColor-muted, #656d76);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .x-trending-settings-btn:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  /* 清除按钮 */
  .x-trending-clear-btn {
    padding: 2px 8px;
    border: none;
    background: transparent;
    color: var(--fgColor-muted, #656d76);
    font-size: 11px;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .x-trending-clear-btn:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  /* 按钮容器 */
  .x-trending-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  /* 主按钮 */
  .x-trending-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: var(--fgColor-muted, #656d76);
    cursor: pointer;
    transition: all 0.2s;
  }

  .x-trending-btn:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
    color: var(--fgColor-default, #1f2328);
  }

  /* 设置对话框 */
  .x-trending-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }

  .x-trending-dialog__content {
    background: var(--overlay-bgColor, #ffffff);
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 12px;
    padding: 24px;
    min-width: 400px;
    max-width: 500px;
    box-shadow: var(--shadow-floating-large, 0 16px 32px rgba(0,0,0,0.12));
  }

  .x-trending-dialog__title {
    margin: 0 0 20px 0;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .x-trending-dialog__field {
    margin-bottom: 16px;
  }

  .x-trending-dialog__label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .x-trending-dialog__label:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  .x-trending-dialog__input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 6px;
    background: var(--bgColor-default, #ffffff);
    color: var(--fgColor-default, #1f2328);
    font-size: 14px;
  }

  .x-trending-dialog__actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .x-trending-dialog__btn {
    padding: 8px 16px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 6px;
    background: transparent;
    color: var(--fgColor-default, #1f2328);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .x-trending-dialog__btn:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  .x-trending-dialog__btn--primary {
    border: none;
    background: var(--bgColor-emphasis, #0969da);
    color: var(--fgColor-onEmphasis, #ffffff);
    font-weight: 600;
  }

  .x-trending-dialog__btn--primary:hover {
    opacity: 0.9;
  }
`;

export default trendingStyles;
