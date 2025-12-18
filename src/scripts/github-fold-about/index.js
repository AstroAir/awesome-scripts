/**
 * GitHub Fold About Sidebar
 * 折叠/展开 GitHub 仓库侧边栏的 About 区域
 */

import { injectStyles } from '@core/styles.js';
import { createPageObserver } from '@core/observer.js';

import aboutFoldStyles from './styles.js';
import { getStateKey, isCollapsed, setCollapsed } from './state.js';
import {
  createAboutFoldButton,
  createButtonWrapper,
  findAboutHeading,
  getFoldableContent,
  updateButtonState,
} from './components.js';
import { applyFoldAnimation, applyFoldStateImmediate } from './animation.js';

/**
 * 处理 About 区域
 */
function processAboutSection() {
  // 查找 About 标题
  const aboutHeading = findAboutHeading();
  if (!aboutHeading) return;

  // 检查是否已处理
  if (aboutHeading.hasAttribute('data-fold-processed')) return;
  aboutHeading.setAttribute('data-fold-processed', 'true');

  // 获取 About 容器
  const aboutContainer = aboutHeading.closest('.BorderGrid-cell');
  if (!aboutContainer) return;

  // 查找可折叠的内容
  const foldableContent = getFoldableContent(aboutContainer, aboutHeading);
  if (foldableContent.length === 0) return;

  // 生成状态键
  const stateKey = getStateKey();

  // 创建折叠按钮
  const button = createAboutFoldButton(stateKey, () => {
    handleToggle(button, foldableContent, stateKey);
  });

  // 创建按钮容器并插入到标题旁边
  const buttonWrapper = createButtonWrapper(button);
  aboutHeading.appendChild(buttonWrapper);

  // 恢复之前的折叠状态
  const savedState = isCollapsed(stateKey);
  if (savedState) {
    applyFoldStateImmediate(foldableContent, true);
    updateButtonState(button, true);
  }
}

/**
 * 处理折叠切换
 * @param {HTMLButtonElement} button - 按钮元素
 * @param {HTMLElement[]} foldableContent - 可折叠内容
 * @param {string} stateKey - 状态键
 */
async function handleToggle(button, foldableContent, stateKey) {
  const currentlyFolded = button.classList.contains('x-folded');
  const newFoldedState = !currentlyFolded;

  // 更新按钮状态
  updateButtonState(button, newFoldedState);

  // 应用动画
  await applyFoldAnimation(foldableContent, newFoldedState);

  // 保存状态
  setCollapsed(stateKey, newFoldedState);
}

/**
 * 初始化脚本
 */
function init() {
  // 注入样式
  injectStyles(aboutFoldStyles);

  // 创建页面观察器
  createPageObserver(() => {
    // 延迟处理以确保 DOM 完全加载
    setTimeout(processAboutSection, 100);
  }, {
    debounce: 100,
    observeBody: true,
  });
}

// 启动脚本
init();
