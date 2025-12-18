/**
 * Jest 测试环境设置
 * 模拟浏览器环境和 Tampermonkey API
 */

import { jest, beforeEach } from '@jest/globals';

// 模拟 localStorage
let localStorageStore = {};
const localStorageMock = {
  getItem: jest.fn((key) => localStorageStore[key] || null),
  setItem: jest.fn((key, value) => {
    localStorageStore[key] = String(value);
  }),
  removeItem: jest.fn((key) => {
    delete localStorageStore[key];
  }),
  clear: jest.fn(() => {
    localStorageStore = {};
  }),
  get length() {
    return Object.keys(localStorageStore).length;
  },
  key: jest.fn((index) => Object.keys(localStorageStore)[index] || null),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// 模拟 Tampermonkey GM_* API
const gmStorage = {};

global.GM_getValue = jest.fn((key, defaultValue) => {
  return gmStorage[key] !== undefined ? gmStorage[key] : defaultValue;
});

global.GM_setValue = jest.fn((key, value) => {
  gmStorage[key] = value;
});

global.GM_deleteValue = jest.fn((key) => {
  delete gmStorage[key];
});

global.GM_addStyle = jest.fn((css) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  return style;
});

global.GM_notification = jest.fn((details) => {
  console.log('[GM_notification]', details);
});

global.GM_registerMenuCommand = jest.fn((name, _callback) => {
  console.log('[GM_registerMenuCommand]', name);
});

// 模拟 requestAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  return setTimeout(callback, 16);
});

global.cancelAnimationFrame = jest.fn((id) => {
  clearTimeout(id);
});

// 模拟 MutationObserver
class MockMutationObserver {
  constructor(callback) {
    this.callback = callback;
    this.observing = false;
  }

  observe(target, options) {
    this.target = target;
    this.options = options;
    this.observing = true;
  }

  disconnect() {
    this.observing = false;
  }

  takeRecords() {
    return [];
  }

  // 辅助方法：手动触发变化
  trigger(mutations) {
    if (this.observing) {
      this.callback(mutations, this);
    }
  }
}

global.MutationObserver = MockMutationObserver;

// 模拟 getComputedStyle
window.getComputedStyle = jest.fn((element) => {
  return {
    getPropertyValue: jest.fn((prop) => {
      return element.style[prop] || '';
    }),
    display: element.style.display || 'block',
    visibility: element.style.visibility || 'visible',
    opacity: element.style.opacity || '1',
  };
});

// 清理函数
beforeEach(() => {
  // 清理 localStorage
  localStorageStore = {};
  
  // 清理 GM storage
  Object.keys(gmStorage).forEach((key) => delete gmStorage[key]);
  
  // 清理 DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  
  // 重置所有 mock
  jest.clearAllMocks();
});

// 辅助测试工具
global.testUtils = {
  /**
   * 等待一段时间
   * @param {number} ms - 毫秒数
   */
  wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  /**
   * 创建模拟 DOM 元素
   * @param {string} html - HTML 字符串
   * @returns {Element} 创建的元素
   */
  createDOM: (html) => {
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    return container;
  },

  /**
   * 模拟 URL
   * @param {string} url - URL 字符串
   */
  mockUrl: (url) => {
    delete window.location;
    window.location = new URL(url);
  },

  /**
   * 获取 GM storage 内容
   */
  getGMStorage: () => ({ ...gmStorage }),

  /**
   * 设置 GM storage 内容
   */
  setGMStorage: (data) => {
    Object.assign(gmStorage, data);
  },
};

// 导出清理函数
export const cleanup = () => {
  localStorageMock.clear();
  Object.keys(gmStorage).forEach((key) => delete gmStorage[key]);
  document.body.innerHTML = '';
  document.head.innerHTML = '';
};
