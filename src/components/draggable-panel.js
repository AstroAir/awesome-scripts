/**
 * 可拖动面板组件
 * 用于创建可拖动的浮动面板
 */

import { createElement } from '@utils/dom.js';

/**
 * 可拖动面板类
 */
export class DraggablePanel {
  constructor(options = {}) {
    this.options = {
      id: 'draggable-panel',
      className: '',
      initialPosition: { right: '20px', bottom: '20px' },
      dragHandle: null,
      onDragStart: () => {},
      onDrag: () => {},
      onDragEnd: () => {},
      savePosition: null,
      loadPosition: null,
      ...options,
    };

    this.panel = null;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  /**
   * 创建面板
   * @param {string} content - 面板内容HTML
   * @returns {HTMLElement} 面板元素
   */
  create(content = '') {
    this.panel = createElement('div', {
      id: this.options.id,
      className: this.options.className,
      html: content,
      styles: {
        position: 'fixed',
        zIndex: '9999',
        ...this.options.initialPosition,
      },
    });

    document.body.appendChild(this.panel);

    this.restorePosition();
    this.bindEvents();

    return this.panel;
  }

  /**
   * 绑定拖拽事件
   */
  bindEvents() {
    const handle = this.options.dragHandle
      ? this.panel.querySelector(this.options.dragHandle)
      : this.panel;

    if (handle) {
      handle.style.cursor = 'move';
      handle.addEventListener('mousedown', this.handleMouseDown);
    }

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  /**
   * 处理鼠标按下
   */
  handleMouseDown(e) {
    if (e.target.closest('button, input, select, textarea, a')) return;

    this.isDragging = true;
    const rect = this.panel.getBoundingClientRect();
    this.dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    this.panel.style.transition = 'none';
    this.options.onDragStart(e);
  }

  /**
   * 处理鼠标移动
   */
  handleMouseMove(e) {
    if (!this.isDragging) return;

    const x = e.clientX - this.dragOffset.x;
    const y = e.clientY - this.dragOffset.y;

    const maxX = window.innerWidth - this.panel.offsetWidth;
    const maxY = window.innerHeight - this.panel.offsetHeight;

    this.panel.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
    this.panel.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    this.panel.style.right = 'auto';
    this.panel.style.bottom = 'auto';

    this.options.onDrag(e);
  }

  /**
   * 处理鼠标松开
   */
  handleMouseUp() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.panel.style.transition = '';

    const position = {
      x: this.panel.style.left,
      y: this.panel.style.top,
    };

    if (this.options.savePosition) {
      this.options.savePosition(position);
    }

    this.options.onDragEnd(position);
  }

  /**
   * 恢复保存的位置
   */
  restorePosition() {
    if (!this.options.loadPosition) return;

    const position = this.options.loadPosition();
    if (position && position.x !== null) {
      this.panel.style.left = position.x;
      this.panel.style.top = position.y;
      this.panel.style.right = 'auto';
      this.panel.style.bottom = 'auto';
    }
  }

  /**
   * 设置内容
   * @param {string} content - HTML内容
   */
  setContent(content) {
    if (this.panel) {
      this.panel.innerHTML = content;
    }
  }

  /**
   * 显示面板
   */
  show() {
    if (this.panel) {
      this.panel.style.display = '';
    }
  }

  /**
   * 隐藏面板
   */
  hide() {
    if (this.panel) {
      this.panel.style.display = 'none';
    }
  }

  /**
   * 切换显示状态
   */
  toggle() {
    if (this.panel) {
      this.panel.style.display = this.panel.style.display === 'none' ? '' : 'none';
    }
  }

  /**
   * 销毁面板
   */
  destroy() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);

    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }
  }
}

/**
 * 获取可拖动面板的基础样式
 * @returns {string} CSS样式字符串
 */
export function getDraggablePanelStyles() {
  return `
    .draggable-panel {
      position: fixed;
      z-index: 9999;
      background: var(--bgColor-default, #ffffff);
      border: 1px solid var(--borderColor-default, #d0d7de);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      overflow: hidden;
    }

    .draggable-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: var(--bgColor-muted, #f6f8fa);
      border-bottom: 1px solid var(--borderColor-default, #d0d7de);
      cursor: move;
      user-select: none;
    }

    .draggable-panel-body {
      padding: 16px;
      max-height: 400px;
      overflow-y: auto;
    }

    .draggable-panel.minimized .draggable-panel-body {
      display: none;
    }
  `;
}

export default {
  DraggablePanel,
  getDraggablePanelStyles,
};
