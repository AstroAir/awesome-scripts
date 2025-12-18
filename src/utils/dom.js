/**
 * DOM 工具函数模块
 * 提供常用的 DOM 操作函数
 */

/**
 * 创建元素
 * @param {string} tag - 标签名
 * @param {Object} options - 选项
 * @returns {HTMLElement} 创建的元素
 */
export function createElement(tag, options = {}) {
  const {
    className,
    id,
    attrs = {},
    styles = {},
    text,
    html,
    children = [],
    events = {},
  } = options;

  const element = document.createElement(tag);

  if (className) {
    if (Array.isArray(className)) {
      element.classList.add(...className);
    } else {
      element.className = className;
    }
  }

  if (id) element.id = id;

  for (const [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, value);
  }

  for (const [key, value] of Object.entries(styles)) {
    element.style[key] = value;
  }

  if (text) element.textContent = text;
  if (html) element.innerHTML = html;

  for (const child of children) {
    if (child instanceof Element) {
      element.appendChild(child);
    } else if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    }
  }

  for (const [event, handler] of Object.entries(events)) {
    element.addEventListener(event, handler);
  }

  return element;
}

/**
 * 查询单个元素
 * @param {string} selector - CSS 选择器
 * @param {Element} parent - 父元素
 * @returns {Element|null} 元素或 null
 */
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * 查询多个元素
 * @param {string} selector - CSS 选择器
 * @param {Element} parent - 父元素
 * @returns {Element[]} 元素数组
 */
export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * 检查元素是否匹配选择器
 * @param {Element} element - 元素
 * @param {string} selector - CSS 选择器
 * @returns {boolean} 是否匹配
 */
export function matches(element, selector) {
  return element && element.matches && element.matches(selector);
}

/**
 * 查找最近的匹配元素
 * @param {Element} element - 起始元素
 * @param {string} selector - CSS 选择器
 * @returns {Element|null} 匹配的元素或 null
 */
export function closest(element, selector) {
  return element && element.closest ? element.closest(selector) : null;
}

/**
 * 获取元素的下一个兄弟元素
 * @param {Element} element - 元素
 * @param {string} selector - 可选的选择器过滤
 * @returns {Element|null} 下一个兄弟元素
 */
export function nextSibling(element, selector = null) {
  let sibling = element.nextElementSibling;
  if (!selector) return sibling;

  while (sibling) {
    if (matches(sibling, selector)) return sibling;
    sibling = sibling.nextElementSibling;
  }
  return null;
}

/**
 * 获取所有后续兄弟元素
 * @param {Element} element - 元素
 * @param {string} selector - 可选的选择器过滤
 * @returns {Element[]} 兄弟元素数组
 */
export function nextSiblings(element, selector = null) {
  const siblings = [];
  let sibling = element.nextElementSibling;

  while (sibling) {
    if (!selector || matches(sibling, selector)) {
      siblings.push(sibling);
    }
    sibling = sibling.nextElementSibling;
  }

  return siblings;
}

/**
 * 插入元素到目标之前
 * @param {Element} newElement - 新元素
 * @param {Element} target - 目标元素
 */
export function insertBefore(newElement, target) {
  target.parentNode.insertBefore(newElement, target);
}

/**
 * 插入元素到目标之后
 * @param {Element} newElement - 新元素
 * @param {Element} target - 目标元素
 */
export function insertAfter(newElement, target) {
  target.parentNode.insertBefore(newElement, target.nextSibling);
}

/**
 * 移除元素
 * @param {Element|string} elementOrSelector - 元素或选择器
 * @param {Element} parent - 父元素（仅当传入选择器时使用）
 * @returns {boolean} 是否成功移除
 */
export function remove(elementOrSelector, parent = document) {
  const element = typeof elementOrSelector === 'string'
    ? parent.querySelector(elementOrSelector)
    : elementOrSelector;

  if (element && element.parentNode) {
    element.remove();
    return true;
  }
  return false;
}

/**
 * 清空元素内容
 * @param {Element} element - 元素
 */
export function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * 切换类名
 * @param {Element} element - 元素
 * @param {string} className - 类名
 * @param {boolean} force - 强制添加或移除
 * @returns {boolean} 切换后的状态
 */
export function toggleClass(element, className, force) {
  return element.classList.toggle(className, force);
}

/**
 * 检查元素是否可见
 * @param {Element} element - 元素
 * @returns {boolean} 是否可见
 */
export function isVisible(element) {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0';
}

/**
 * 获取元素的数据属性
 * @param {Element} element - 元素
 * @param {string} key - 数据键名（不含 data-）
 * @returns {string|null} 数据值
 */
export function getData(element, key) {
  return element.dataset[key] ?? element.getAttribute(`data-${key}`);
}

/**
 * 设置元素的数据属性
 * @param {Element} element - 元素
 * @param {string} key - 数据键名（不含 data-）
 * @param {string} value - 数据值
 */
export function setData(element, key, value) {
  element.dataset[key] = value;
}

/**
 * 获取当前页面路径
 * @returns {string} 页面路径
 */
export function getPathname() {
  return window.location.pathname;
}

/**
 * 获取 URL 参数
 * @param {string} name - 参数名
 * @returns {string|null} 参数值
 */
export function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

export default {
  createElement,
  $,
  $$,
  matches,
  closest,
  nextSibling,
  nextSiblings,
  insertBefore,
  insertAfter,
  remove,
  empty,
  toggleClass,
  isVisible,
  getData,
  setData,
  getPathname,
  getUrlParam,
};
