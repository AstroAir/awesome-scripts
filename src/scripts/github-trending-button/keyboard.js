/**
 * GitHub Trending Button 键盘快捷键模块
 */

import { CONFIG } from './config.js';
import storage from './storage.js';

/**
 * 设置键盘快捷键
 */
export function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const settings = storage.getSettings();

    // Alt+T 打开默认 Trending 页面
    if (e.altKey && e.key === 't' && !e.shiftKey) {
      e.preventDefault();
      const lang = settings.defaultLanguage || '';
      const period = settings.defaultPeriod || 'daily';
      const url = `/trending/${lang}${period !== 'daily' ? `?since=${period}` : ''}`;

      if (settings.openInNewTab) {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
    }

    // Alt+Shift+T 打开下拉菜单
    if (e.altKey && e.shiftKey && e.key === 'T') {
      e.preventDefault();
      const button = document.getElementById(CONFIG.BUTTON_ID);
      if (button) button.click();
    }
  });
}

export default {
  setupKeyboardShortcuts,
};
