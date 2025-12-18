/**
 * GitHub Enhanced Toolbar
 * 在 Github 网站顶部显示 Github.dev、DeepWiki 和 ZreadAi 按钮
 * 完美支持亮暗色主题自动适配
 */

import { CONFIG } from './config.js';
import { getStyles } from './styles.js';
import { debounce, getCurrentTheme } from './utils.js';
import { addButtons } from './components.js';
import { setupThemeObserver, setupUrlObserver } from './observer.js';

/**
 * 注入样式到页面
 */
function injectStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = getStyles();
  styleElement.setAttribute('data-github-enhancer', 'true');
  document.head.appendChild(styleElement);
}

/**
 * 初始化脚本
 */
function init() {
  injectStyles();
  setupThemeObserver();

  const debouncedAddButtons = debounce(addButtons, CONFIG.DEBOUNCE_DELAY);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', debouncedAddButtons);
  } else {
    setTimeout(debouncedAddButtons, CONFIG.INIT_DELAY);
  }

  document.addEventListener('pjax:end', debouncedAddButtons);
  document.addEventListener('turbo:load', debouncedAddButtons);
  window.addEventListener('resize', debouncedAddButtons);

  setupUrlObserver(() => {
    setTimeout(debouncedAddButtons, CONFIG.URL_CHANGE_DELAY);
  });

  console.log(`[GitHub增强] 脚本已初始化 (当前主题: ${getCurrentTheme()})`);
}

init();

export default {
  init,
  addButtons,
};
