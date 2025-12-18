/**
 * GitHub Trending Button Enhanced
 * 增强版 Trending 按钮，支持语言筛选、收藏夹和快捷访问
 */

import { injectStyles } from '@core/styles.js';
import { createElement, $ } from '@utils/dom.js';
import { observeDOM } from '@core/observer.js';

import trendingStyles from './styles.js';
import { CONFIG, SELECTORS } from './config.js';
import { trendingIcon } from './components/icons.js';
import { createDropdown, toggleDropdown, setupClickOutside, setupEscClose } from './dropdown.js';
import { setupKeyboardShortcuts } from './keyboard.js';
import { setupMenuCommands } from './menu.js';

/**
 * 添加 Trending 按钮
 * @returns {boolean} 是否成功添加
 */
function addTrendingButton() {
  const actionsContainer = $(SELECTORS.actionsContainer);
  if (!actionsContainer) return false;

  // 检查是否已存在
  if (document.getElementById(CONFIG.BUTTON_ID)) return true;

  // 创建容器
  const container = createElement('div', {
    className: 'x-trending-container',
  });

  // 创建按钮
  const button = createElement('button', {
    className: 'x-trending-btn Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted',
    attrs: {
      id: CONFIG.BUTTON_ID,
      'aria-label': 'Trending repositories',
      type: 'button',
    },
    html: trendingIcon(),
  });

  // 刷新下拉菜单的函数
  const refreshDropdown = () => {
    const oldDropdown = container.querySelector('.x-trending-dropdown');
    const wasVisible = oldDropdown?.classList.contains('x-trending-dropdown--visible');

    if (oldDropdown) oldDropdown.remove();

    const newDropdown = createDropdown({ onRefresh: refreshDropdown });
    container.appendChild(newDropdown);

    if (wasVisible) {
      toggleDropdown(newDropdown, true);
    }
  };

  // 创建下拉菜单
  const dropdown = createDropdown({ onRefresh: refreshDropdown });

  // 按钮点击事件
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(dropdown);
  });

  // 组装元素
  container.appendChild(button);
  container.appendChild(dropdown);

  // 设置点击外部关闭
  setupClickOutside(container, dropdown);

  // 设置 ESC 键关闭
  setupEscClose(dropdown);

  // 插入到导航栏
  const refNode = $(SELECTORS.notificationIndicator, actionsContainer) ||
                  $(SELECTORS.appHeaderUser, actionsContainer);

  if (refNode) {
    actionsContainer.insertBefore(container, refNode);
  } else {
    actionsContainer.appendChild(container);
  }

  return true;
}

/**
 * 主函数
 */
function main() {
  if (!addTrendingButton()) {
    // 如果按钮添加失败，观察 DOM 变化
    const observer = observeDOM((_mutations) => {
      if (addTrendingButton()) {
        observer.disconnect();
      }
    });

    // 5 秒后停止观察
    setTimeout(() => observer.disconnect(), 5000);
  }
}

/**
 * 初始化脚本
 */
function init() {
  // 注入样式
  injectStyles(trendingStyles);

  // 执行主函数
  main();

  // 设置键盘快捷键
  setupKeyboardShortcuts();

  // 设置菜单命令
  setupMenuCommands();

  // Turbo 支持（GitHub 使用）
  document.addEventListener('turbo:load', main);
  document.addEventListener('turbo:render', main);
}

// 启动脚本
init();
