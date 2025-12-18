/**
 * 进度提示组件
 * 用于显示操作进度和状态消息
 */

import { createElement } from '@utils/dom.js';

/**
 * 进度提示管理器
 */
export class ProgressToast {
  constructor(options = {}) {
    this.options = {
      containerId: 'progress-toast',
      position: 'top-right',
      autoHideDelay: 3000,
      ...options,
    };
    this.container = null;
    this.hideTimer = null;
  }

  /**
   * 创建容器
   */
  createContainer() {
    if (this.container) return this.container;

    const positionStyles = this.getPositionStyles();

    this.container = createElement('div', {
      id: this.options.containerId,
      styles: {
        position: 'fixed',
        zIndex: '10000',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '13px',
        maxWidth: '300px',
        ...positionStyles,
      },
    });

    document.body.appendChild(this.container);
    return this.container;
  }

  /**
   * 获取位置样式
   */
  getPositionStyles() {
    const positions = {
      'top-right': { top: '20px', right: '20px' },
      'top-left': { top: '20px', left: '20px' },
      'bottom-right': { bottom: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'top-center': { top: '20px', left: '50%', transform: 'translateX(-50%)' },
      'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
    };
    return positions[this.options.position] || positions['top-right'];
  }

  /**
   * 显示消息
   * @param {string} message - 消息内容
   * @param {Object} options - 显示选项
   */
  show(message, options = {}) {
    const {
      type = 'info',
      autoHide = true,
      duration = this.options.autoHideDelay,
    } = options;

    this.createContainer();

    const colors = {
      info: { bg: '#1a1a1a', text: '#ffffff' },
      success: { bg: '#1a7f37', text: '#ffffff' },
      warning: { bg: '#9a6700', text: '#ffffff' },
      error: { bg: '#cf222e', text: '#ffffff' },
    };

    const color = colors[type] || colors.info;

    this.container.style.background = color.bg;
    this.container.style.color = color.text;
    this.container.style.padding = '12px 20px';
    this.container.style.borderRadius = '8px';
    this.container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    this.container.style.display = 'block';
    this.container.style.opacity = '1';
    this.container.style.transition = 'opacity 0.3s ease';
    this.container.textContent = message;

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    if (autoHide) {
      this.hideTimer = setTimeout(() => this.hide(), duration);
    }
  }

  /**
   * 隐藏消息
   */
  hide() {
    if (!this.container) return;

    this.container.style.opacity = '0';
    setTimeout(() => {
      if (this.container) {
        this.container.style.display = 'none';
      }
    }, 300);
  }

  /**
   * 销毁组件
   */
  destroy() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}

/**
 * 创建全局进度提示实例
 */
let globalToast = null;

export function showProgress(message, options = {}) {
  if (!globalToast) {
    globalToast = new ProgressToast();
  }
  globalToast.show(message, options);
}

export function hideProgress() {
  if (globalToast) {
    globalToast.hide();
  }
}

export default {
  ProgressToast,
  showProgress,
  hideProgress,
};
