/**
 * Linux.do 自动标记已读 Ultimate
 * 自动将 Linux.do 论坛的帖子及回复标记为已读 - 真实行为模拟版
 */

import { MODE_PRESETS } from './config.js';
import State from './state.js';
import Storage from './storage.js';
import Logger from './logger.js';
import Core from './core.js';
import UI from './ui.js';

/**
 * 初始化脚本
 */
function init() {
  Storage.load();

  Logger.setUI(UI);
  Core.setUI(UI);
  UI.setCore(Core);

  UI.init();

  if (State.settings.autoStart || State.isRunning) {
    setTimeout(() => Core.start(), 2000);
  }

  Logger.success('🎉 Linux.do Auto Reader Ultimate 已加载');
  Logger.info(`📖 模式: ${MODE_PRESETS[State.settings.mode]?.name || '自定义'}`);
  Logger.info(`⚡ 并发: ${State.settings.concurrency} | 每帖回复: ${State.settings.reading.maxRepliesPerTopic}`);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export default {
  init,
  Core,
  UI,
  Logger,
  State,
  Storage,
};
