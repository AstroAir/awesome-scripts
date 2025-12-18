/**
 * GitHub Enhanced Toolbar 样式模块
 */

/**
 * 获取样式字符串
 * @returns {string} CSS样式
 */
export function getStyles() {
  return `
    /* 自定义按钮基础样式 - 与 GitHub 原生按钮保持一致 */
    .custom-github-button {
      margin: 0 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      padding: 5px 16px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      transition: all 0.2s cubic-bezier(0.3, 0, 0.5, 1);
      text-decoration: none;
      white-space: nowrap;
      cursor: pointer;
      position: relative;
      vertical-align: middle;
    }

    /* 亮色主题样式 */
    [data-color-mode="light"] .custom-github-button,
    [data-color-mode="auto"][data-light-theme] .custom-github-button {
      background: #f6f8fa;
      color: #24292f;
      border: 1px solid rgba(27, 31, 36, 0.15);
      box-shadow: 0 1px 0 rgba(27, 31, 36, 0.04);
    }

    [data-color-mode="light"] .custom-github-button:hover,
    [data-color-mode="auto"][data-light-theme] .custom-github-button:hover {
      background: #f3f4f6;
      border-color: rgba(27, 31, 36, 0.15);
      box-shadow: 0 3px 8px rgba(27, 31, 36, 0.12);
    }

    /* 暗色主题样式 */
    [data-color-mode="dark"] .custom-github-button,
    [data-color-mode="auto"][data-dark-theme] .custom-github-button {
      background: #21262d;
      color: #c9d1d9;
      border: 1px solid rgba(240, 246, 252, 0.1);
      box-shadow: 0 0 transparent;
    }

    [data-color-mode="dark"] .custom-github-button:hover,
    [data-color-mode="auto"][data-dark-theme] .custom-github-button:hover {
      background: #30363d;
      border-color: rgba(240, 246, 252, 0.2);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
    }

    /* 按钮激活状态 */
    .custom-github-button:active {
      transform: translateY(0);
      transition: none;
    }

    [data-color-mode="light"] .custom-github-button:active,
    [data-color-mode="auto"][data-light-theme] .custom-github-button:active {
      background: #ebeff3;
      box-shadow: inset 0 1px 2px rgba(27, 31, 36, 0.1);
    }

    [data-color-mode="dark"] .custom-github-button:active,
    [data-color-mode="auto"][data-dark-theme] .custom-github-button:active {
      background: #282e36;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    /* 焦点状态 - 亮色主题 */
    [data-color-mode="light"] .custom-github-button:focus-visible,
    [data-color-mode="auto"][data-light-theme] .custom-github-button:focus-visible {
      outline: 2px solid #0969da;
      outline-offset: 2px;
    }

    /* 焦点状态 - 暗色主题 */
    [data-color-mode="dark"] .custom-github-button:focus-visible,
    [data-color-mode="auto"][data-dark-theme] .custom-github-button:focus-visible {
      outline: 2px solid #58a6ff;
      outline-offset: 2px;
    }

    /* 图标样式 - 亮色主题 */
    [data-color-mode="light"] .custom-github-button .octicon,
    [data-color-mode="auto"][data-light-theme] .custom-github-button .octicon {
      margin-right: 6px;
      flex-shrink: 0;
      transition: transform 0.2s ease;
      width: 16px;
      height: 16px;
      display: inline-block;
      vertical-align: text-bottom;
      color: #57606a;
      fill: currentColor;
    }

    /* 图标样式 - 暗色主题（增强对比度） */
    [data-color-mode="dark"] .custom-github-button .octicon,
    [data-color-mode="auto"][data-dark-theme] .custom-github-button .octicon {
      margin-right: 6px;
      flex-shrink: 0;
      transition: transform 0.2s ease;
      width: 16px;
      height: 16px;
      display: inline-block;
      vertical-align: text-bottom;
      color: #8b949e;
      fill: currentColor;
      filter: brightness(1.2);
    }

    /* 图标 hover 状态 - 亮色主题 */
    [data-color-mode="light"] .custom-github-button:hover .octicon,
    [data-color-mode="auto"][data-light-theme] .custom-github-button:hover .octicon {
      transform: scale(1.1) rotate(5deg);
      color: #24292f;
    }

    /* 图标 hover 状态 - 暗色主题 */
    [data-color-mode="dark"] .custom-github-button:hover .octicon,
    [data-color-mode="auto"][data-dark-theme] .custom-github-button:hover .octicon {
      transform: scale(1.1) rotate(5deg);
      color: #c9d1d9;
      filter: brightness(1.4);
    }

    /* 图片图标额外样式 - 暗色主题优化 */
    [data-color-mode="dark"] .custom-github-button img.octicon,
    [data-color-mode="auto"][data-dark-theme] .custom-github-button img.octicon {
      opacity: 0.85;
    }

    [data-color-mode="dark"] .custom-github-button:hover img.octicon,
    [data-color-mode="auto"][data-dark-theme] .custom-github-button:hover img.octicon {
      opacity: 1;
      filter: brightness(1.1);
    }

    /* 仅图标模式 */
    .custom-github-button.icon-only {
      padding: 5px 12px;
      min-width: 28px;
    }

    .custom-github-button.icon-only .octicon {
      margin-right: 0;
    }

    /* 文本样式 */
    .custom-github-button span {
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
    }

    /* 容器样式优化 */
    .pagehead-actions > li {
      margin-right: 0 !important;
      display: flex;
      align-items: center;
    }

    /* Tooltip 样式 - 亮色主题 */
    [data-color-mode="light"] .custom-github-button[title]:hover::after,
    [data-color-mode="auto"][data-light-theme] .custom-github-button[title]:hover::after {
      content: attr(title);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 8px;
      padding: 6px 12px;
      background: #24292f;
      color: #ffffff;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 400;
      white-space: nowrap;
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      animation: tooltipFadeIn 0.2s ease 0.3s forwards;
    }

    [data-color-mode="light"] .custom-github-button[title]:hover::before,
    [data-color-mode="auto"][data-light-theme] .custom-github-button[title]:hover::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 2px;
      border: 6px solid transparent;
      border-top-color: #24292f;
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      animation: tooltipFadeIn 0.2s ease 0.3s forwards;
    }

    /* Tooltip 样式 - 暗色主题 */
    [data-color-mode="dark"] .custom-github-button[title]:hover::after,
    [data-color-mode="auto"][data-dark-theme] .custom-github-button[title]:hover::after {
      content: attr(title);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 8px;
      padding: 6px 12px;
      background: #f0f6fc;
      color: #0d1117;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 400;
      white-space: nowrap;
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      animation: tooltipFadeIn 0.2s ease 0.3s forwards;
    }

    [data-color-mode="dark"] .custom-github-button[title]:hover::before,
    [data-color-mode="auto"][data-dark-theme] .custom-github-button[title]:hover::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 2px;
      border: 6px solid transparent;
      border-top-color: #f0f6fc;
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      animation: tooltipFadeIn 0.2s ease 0.3s forwards;
    }

    @keyframes tooltipFadeIn {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
      .custom-github-button {
        padding: 3px 12px;
        margin: 0 2px;
        height: 28px;
      }

      .custom-github-button span {
        font-size: 13px;
      }

      .custom-github-button .octicon {
        width: 14px;
        height: 14px;
      }

      .custom-github-button.icon-only {
        padding: 3px 10px;
      }
    }

    /* 打印样式 */
    @media print {
      .custom-github-button {
        display: none !important;
      }
    }

    /* 高对比度模式支持 */
    @media (prefers-contrast: high) {
      .custom-github-button {
        border-width: 2px;
      }

      [data-color-mode="dark"] .custom-github-button .octicon,
      [data-color-mode="auto"][data-dark-theme] .custom-github-button .octicon {
        filter: brightness(1.5);
      }
    }

    /* 减少动画模式 */
    @media (prefers-reduced-motion: reduce) {
      .custom-github-button,
      .custom-github-button .octicon {
        transition: none !important;
        animation: none !important;
      }

      .custom-github-button:hover .octicon {
        transform: none;
      }
    }
  `;
}

export default {
  getStyles,
};
