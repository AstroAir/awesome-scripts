/**
 * GitHub Fold Files Enhanced
 * 增强版文件/文件夹折叠功能
 */

import { injectStyles } from '@core/styles.js';
import { waitForElement } from '@core/observer.js';
import { $, $$ } from '@utils/dom.js';

import foldFilesStyles from './styles.js';
import { CONFIG, SELECTORS } from './config.js';
import state from './state.js';
import {
  createFoldButton,
  createGlobalToggleButton,
  getFolderPath,
  getFoldableRows,
  updateButtonState,
  setupHoverPreview,
} from './components.js';
import { toggleFoldAnimation, applyFoldStateImmediate } from './animation.js';

/**
 * 添加全局折叠/展开按钮
 */
function addGlobalToggle() {
  if (!CONFIG.collapseAll) return;

  const actionsBar = $(SELECTORS.actionsBar);
  if (!actionsBar || actionsBar.querySelector('.x-global-toggle')) return;

  const globalButton = createGlobalToggleButton((allCollapsed) => {
    const buttons = $$('.x-fold-button');

    buttons.forEach((button) => {
      const tbody = button.closest('tbody');
      if (!tbody) return;

      const isCurrentlyCollapsed = tbody.classList.contains('x-folded');

      if (allCollapsed && !isCurrentlyCollapsed) {
        button.click();
      } else if (!allCollapsed && isCurrentlyCollapsed) {
        button.click();
      }
    });
  });

  actionsBar.prepend(globalButton);
}

/**
 * 处理单个文件夹元素
 * @param {HTMLElement} element - 文件夹元素
 */
function processFolder(element) {
  const tbody = element.closest('tbody');
  if (!tbody || tbody.querySelector('.x-fold-button')) return;

  // 获取文件夹路径
  const folderPath = getFolderPath(tbody);

  // 检查是否已折叠
  const isCollapsed = state.isCollapsed(folderPath);

  // 创建折叠按钮
  const buttonContainer = createFoldButton(async (e, button) => {
    const rows = getFoldableRows(tbody);
    const currentlyCollapsed = tbody.classList.contains('x-folded');

    // 更新按钮状态
    updateButtonState(button, !currentlyCollapsed);

    // 执行动画
    await toggleFoldAnimation(tbody, rows, !currentlyCollapsed);

    // 更新状态
    state.toggle(folderPath);
  }, isCollapsed);

  const button = buttonContainer.querySelector('.x-fold-button');

  // 恢复之前的状态
  if (isCollapsed) {
    applyFoldStateImmediate(tbody, true);
  }

  // 设置悬停预览
  setupHoverPreview(tbody, button);

  // 添加按钮到元素
  element.appendChild(buttonContainer);
}

/**
 * 初始化脚本
 */
function init() {
  // 注入样式
  injectStyles(foldFilesStyles);

  // 监听文件夹元素
  waitForElement(SELECTORS.fileRow, (element) => {
    processFolder(element);
    addGlobalToggle();
  });
}

// 启动脚本
init();
