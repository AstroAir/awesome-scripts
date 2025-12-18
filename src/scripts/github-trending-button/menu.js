/**
 * GitHub Trending Button 菜单命令模块
 */

import { POPULAR_LANGUAGES } from './config.js';
import storage from './storage.js';
import { showSettingsDialog } from './components/settings-dialog.js';

/**
 * 设置菜单命令
 */
export function setupMenuCommands() {
  // 设置
  GM_registerMenuCommand('⚙️ Settings', () => {
    const settings = storage.getSettings();
    showSettingsDialog({
      settings,
      onSave: (newSettings) => {
        storage.setSettings(newSettings);
        alert('Settings saved! Please refresh the page to apply changes.');
      },
    });
  });

  // 管理收藏
  GM_registerMenuCommand('⭐ Manage Favorites', () => {
    const favorites = storage.getFavorites();
    const favoriteNames = favorites
      .map((val) => {
        const lang = POPULAR_LANGUAGES.find((l) => l.value === val);
        return lang ? lang.name : val;
      })
      .join(', ');

    alert(
      `Favorites (${favorites.length}):\n\n${
        favoriteNames || 'No favorites yet'
      }\n\nClick the star icon next to any language to add/remove favorites.`,
    );
  });

  // 清除所有数据
  GM_registerMenuCommand('🗑️ Clear All Data', () => {
    if (confirm('Clear all data including favorites and recent languages?')) {
      storage.clearAll();
      alert('All data cleared! Please refresh the page.');
    }
  });

  // 关于
  GM_registerMenuCommand('ℹ️ About', () => {
    alert(
      'GitHub Trending Button Enhanced v2.0.0\n\n' +
      'Features:\n' +
      '• Quick access to trending repositories\n' +
      '• Filter by language and time period\n' +
      '• Favorites system\n' +
      '• Recent languages tracking\n' +
      '• Keyboard shortcuts (Alt+T, Alt+Shift+T)\n' +
      '• Search languages\n' +
      '• Category filtering\n\n' +
      'Made with ❤️',
    );
  });
}

export default {
  setupMenuCommands,
};
