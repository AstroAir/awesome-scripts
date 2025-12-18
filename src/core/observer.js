/**
 * DOM 观察器模块
 * 提供 MutationObserver 的封装和常用观察模式
 */

/**
 * 等待元素出现
 * @param {string} selector - CSS 选择器
 * @param {Function} callback - 回调函数
 * @param {Element} startNode - 起始节点
 * @param {Object} options - 配置选项
 * @returns {MutationObserver} 观察器实例
 */
export function waitForElement(selector, callback, startNode = document, options = {}) {
  const {
    once = false,
    timeout = 0,
    subtree = true,
  } = options;

  // 生成唯一标识，避免重复处理
  const uid = '_wfe_' + Math.random().toString(36).slice(2);
  let timeoutId = null;
  let observer = null;

  // 处理已存在的元素
  const processExisting = () => {
    const elements = startNode.querySelectorAll(`:is(${selector}):not([${uid}])`);
    elements.forEach((element) => {
      element.setAttribute(uid, '');
      callback(element);
      if (once && observer) {
        observer.disconnect();
        if (timeoutId) clearTimeout(timeoutId);
      }
    });
    return elements.length > 0;
  };

  // 先处理已存在的元素
  const found = processExisting();
  if (once && found) return null;

  // 创建观察器
  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;

        // 检查节点本身
        if (node.matches && node.matches(selector) && !node.hasAttribute(uid)) {
          node.setAttribute(uid, '');
          callback(node);
          if (once) {
            observer.disconnect();
            if (timeoutId) clearTimeout(timeoutId);
            return;
          }
        }

        // 检查子节点
        if (node.querySelectorAll) {
          const children = node.querySelectorAll(`:is(${selector}):not([${uid}])`);
          for (const child of children) {
            child.setAttribute(uid, '');
            callback(child);
            if (once) {
              observer.disconnect();
              if (timeoutId) clearTimeout(timeoutId);
              return;
            }
          }
        }
      }
    }
  });

  observer.observe(startNode, {
    childList: true,
    subtree,
  });

  // 设置超时
  if (timeout > 0) {
    timeoutId = setTimeout(() => {
      observer.disconnect();
    }, timeout);
  }

  return observer;
}

/**
 * 观察 URL 变化（适用于 SPA 应用如 GitHub）
 * @param {Function} callback - URL 变化时的回调函数
 * @param {Object} options - 配置选项
 * @returns {Function} 停止观察的函数
 */
export function observeUrlChange(callback, options = {}) {
  const {
    immediate = true,
    watchTitle = true,
    watchPopstate = true,
  } = options;

  let lastUrl = location.href;
  let observer = null;

  const checkUrlChange = () => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      const oldUrl = lastUrl;
      lastUrl = currentUrl;
      callback(currentUrl, oldUrl);
    }
  };

  // 立即执行一次
  if (immediate) {
    callback(location.href, null);
  }

  // 监听 popstate 事件
  if (watchPopstate) {
    window.addEventListener('popstate', checkUrlChange);
  }

  // 监听 title 变化（GitHub 使用这种方式）
  if (watchTitle) {
    const titleElement = document.querySelector('title');
    if (titleElement) {
      observer = new MutationObserver(checkUrlChange);
      observer.observe(titleElement, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }

  // 返回停止函数
  return () => {
    if (observer) observer.disconnect();
    if (watchPopstate) {
      window.removeEventListener('popstate', checkUrlChange);
    }
  };
}

/**
 * 观察 DOM 变化并在变化时执行回调
 * @param {Function} callback - 回调函数
 * @param {Element} target - 观察目标
 * @param {Object} options - MutationObserver 选项
 * @returns {MutationObserver} 观察器实例
 */
export function observeDOM(callback, target = document.body, options = {}) {
  const defaultOptions = {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const observer = new MutationObserver((mutations) => {
    callback(mutations);
  });

  observer.observe(target, mergedOptions);

  return observer;
}

/**
 * 防抖观察器
 * 合并短时间内的多次变化为一次回调
 * @param {Function} callback - 回调函数
 * @param {number} delay - 防抖延迟（毫秒）
 * @param {Element} target - 观察目标
 * @param {Object} options - MutationObserver 选项
 * @returns {MutationObserver} 观察器实例
 */
export function observeDOMDebounced(callback, delay = 100, target = document.body, options = {}) {
  let timeoutId = null;
  let pendingMutations = [];

  const observer = observeDOM((mutations) => {
    pendingMutations.push(...mutations);

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(pendingMutations);
      pendingMutations = [];
      timeoutId = null;
    }, delay);
  }, target, options);

  return observer;
}

/**
 * 创建页面加载观察器
 * 在页面加载和 SPA 导航时执行回调
 * @param {Function} callback - 回调函数
 * @param {Object} options - 配置选项
 * @returns {Function} 清理函数
 */
export function createPageObserver(callback, options = {}) {
  const {
    debounce = 100,
    observeBody = true,
  } = options;

  let domObserver = null;
  let debounceTimer = null;

  const debouncedCallback = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(callback, debounce);
  };

  // 初始化
  const init = () => {
    callback();

    if (observeBody) {
      domObserver = observeDOM(() => {
        debouncedCallback();
      });
    }
  };

  // 页面加载时初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 监听 URL 变化
  const stopUrlObserver = observeUrlChange(() => {
    debouncedCallback();
  }, { immediate: false });

  // Turbo 支持（GitHub 使用）
  const turboLoadHandler = () => debouncedCallback();
  document.addEventListener('turbo:load', turboLoadHandler);
  document.addEventListener('turbo:render', turboLoadHandler);

  // 返回清理函数
  return () => {
    if (domObserver) domObserver.disconnect();
    if (debounceTimer) clearTimeout(debounceTimer);
    stopUrlObserver();
    document.removeEventListener('turbo:load', turboLoadHandler);
    document.removeEventListener('turbo:render', turboLoadHandler);
  };
}

export default {
  waitForElement,
  observeUrlChange,
  observeDOM,
  observeDOMDebounced,
  createPageObserver,
};
