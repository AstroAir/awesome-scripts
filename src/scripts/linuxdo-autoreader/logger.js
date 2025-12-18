/**
 * Linux.do 自动标记已读 - 日志模块
 */

import { DEFAULT_CONFIG } from './config.js';

/**
 * 日志管理器
 */
export const Logger = {
  logs: [],
  uiRef: null,

  /**
   * 设置UI引用
   * @param {Object} ui - UI模块引用
   */
  setUI(ui) {
    this.uiRef = ui;
  },

  /**
   * 添加日志
   * @param {string} message - 日志消息
   * @param {string} type - 日志类型
   */
  add(message, type) {
    const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    const log = { time, message, type };

    this.logs.push(log);
    if (this.logs.length > DEFAULT_CONFIG.MAX_LOGS) {
      this.logs.shift();
    }

    if (this.uiRef) {
      this.uiRef.appendLog(log);
    }
    console.log(`[${type.toUpperCase()}] ${time} ${message}`);
  },

  /**
   * 信息日志
   * @param {string} msg - 消息
   */
  info(msg) {
    this.add(msg, 'info');
  },

  /**
   * 成功日志
   * @param {string} msg - 消息
   */
  success(msg) {
    this.add(msg, 'success');
  },

  /**
   * 警告日志
   * @param {string} msg - 消息
   */
  warn(msg) {
    this.add(msg, 'warning');
  },

  /**
   * 错误日志
   * @param {string} msg - 消息
   */
  error(msg) {
    this.add(msg, 'error');
  },

  /**
   * 清除日志
   */
  clear() {
    this.logs = [];
    const container = document.getElementById('ar-logs');
    if (container) {
      container.innerHTML = `
        <div class="ar-empty">
          <div class="ar-empty-icon">📭</div>
          <div class="ar-empty-text">暂无日志</div>
        </div>
      `;
    }
  },
};

export default Logger;
