/**
 * 动画工具模块
 * 提供平滑动画效果
 */

/**
 * 默认动画配置
 */
export const ANIMATION_DEFAULTS = {
  duration: 200,
  easing: 'ease-out',
  staggerDelay: 30,
};

/**
 * 淡入动画
 * @param {Element} element - 元素
 * @param {Object} options - 选项
 * @returns {Promise} 动画完成的 Promise
 */
export function fadeIn(element, options = {}) {
  const {
    duration = ANIMATION_DEFAULTS.duration,
    easing = ANIMATION_DEFAULTS.easing,
    display = '',
  } = options;

  return new Promise((resolve) => {
    element.style.display = display;
    element.style.opacity = '0';

    // 强制重排
    element.offsetHeight;

    element.style.transition = `opacity ${duration}ms ${easing}`;
    element.style.opacity = '1';

    setTimeout(() => {
      element.style.transition = '';
      resolve();
    }, duration);
  });
}

/**
 * 淡出动画
 * @param {Element} element - 元素
 * @param {Object} options - 选项
 * @returns {Promise} 动画完成的 Promise
 */
export function fadeOut(element, options = {}) {
  const {
    duration = ANIMATION_DEFAULTS.duration,
    easing = ANIMATION_DEFAULTS.easing,
    hide = true,
  } = options;

  return new Promise((resolve) => {
    element.style.transition = `opacity ${duration}ms ${easing}`;
    element.style.opacity = '0';

    setTimeout(() => {
      if (hide) element.style.display = 'none';
      element.style.transition = '';
      resolve();
    }, duration);
  });
}

/**
 * 滑入动画（从上向下）
 * @param {Element} element - 元素
 * @param {Object} options - 选项
 * @returns {Promise} 动画完成的 Promise
 */
export function slideDown(element, options = {}) {
  const {
    duration = ANIMATION_DEFAULTS.duration,
    easing = ANIMATION_DEFAULTS.easing,
    display = '',
  } = options;

  return new Promise((resolve) => {
    element.style.display = display;
    element.style.opacity = '0';
    element.style.transform = 'translateY(-10px)';

    // 强制重排
    element.offsetHeight;

    element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';

    setTimeout(() => {
      element.style.transition = '';
      element.style.transform = '';
      resolve();
    }, duration);
  });
}

/**
 * 滑出动画（从下向上）
 * @param {Element} element - 元素
 * @param {Object} options - 选项
 * @returns {Promise} 动画完成的 Promise
 */
export function slideUp(element, options = {}) {
  const {
    duration = ANIMATION_DEFAULTS.duration,
    easing = ANIMATION_DEFAULTS.easing,
    hide = true,
  } = options;

  return new Promise((resolve) => {
    element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
    element.style.opacity = '0';
    element.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      if (hide) element.style.display = 'none';
      element.style.transition = '';
      element.style.transform = '';
      resolve();
    }, duration);
  });
}

/**
 * 交错动画（对多个元素依次执行动画）
 * @param {Element[]} elements - 元素数组
 * @param {Function} animationFn - 动画函数
 * @param {Object} options - 选项
 * @returns {Promise} 所有动画完成的 Promise
 */
export function stagger(elements, animationFn, options = {}) {
  const {
    delay = ANIMATION_DEFAULTS.staggerDelay,
    reverse = false,
  } = options;

  const orderedElements = reverse ? [...elements].reverse() : elements;

  const promises = orderedElements.map((element, index) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        animationFn(element, options).then(resolve);
      }, index * delay);
    });
  });

  return Promise.all(promises);
}

/**
 * 折叠动画
 * @param {Element[]} elements - 要折叠的元素数组
 * @param {boolean} collapsed - 是否折叠
 * @param {Object} options - 选项
 * @returns {Promise} 动画完成的 Promise
 */
export function collapseElements(elements, collapsed, options = {}) {
  const {
    duration = ANIMATION_DEFAULTS.duration,
    easing = ANIMATION_DEFAULTS.easing,
    staggerDelay = ANIMATION_DEFAULTS.staggerDelay,
  } = options;

  if (collapsed) {
    // 折叠动画
    return new Promise((resolve) => {
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
          element.style.opacity = '0';
          element.style.transform = 'translateY(-8px)';
        }, index * staggerDelay);
      });

      const totalTime = duration + elements.length * staggerDelay;

      setTimeout(() => {
        elements.forEach((element) => {
          element.style.display = 'none';
          element.style.transition = '';
          element.style.opacity = '';
          element.style.transform = '';
        });
        resolve();
      }, totalTime);
    });
  } else {
    // 展开动画
    return new Promise((resolve) => {
      // 先显示但保持透明
      elements.forEach((element) => {
        element.style.display = '';
        element.style.opacity = '0';
        element.style.transform = 'translateY(-8px)';
      });

      // 强制重排
      document.body.offsetHeight;

      // 执行动画
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, index * staggerDelay);
      });

      const totalTime = duration + elements.length * staggerDelay;

      setTimeout(() => {
        elements.forEach((element) => {
          element.style.transition = '';
          element.style.opacity = '';
          element.style.transform = '';
        });
        resolve();
      }, totalTime);
    });
  }
}

/**
 * 请求动画帧包装器
 * @param {Function} callback - 回调函数
 * @returns {number} 动画帧 ID
 */
export function requestFrame(callback) {
  return requestAnimationFrame(callback);
}

/**
 * 取消动画帧
 * @param {number} id - 动画帧 ID
 */
export function cancelFrame(id) {
  cancelAnimationFrame(id);
}

/**
 * 延迟执行
 * @param {number} ms - 毫秒数
 * @returns {Promise} Promise
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 防止动画重入
 * 在动画执行期间阻止重复调用
 * @param {Element} element - 元素
 * @param {Function} animationFn - 动画函数
 * @returns {Function} 包装后的函数
 */
export function preventReentry(element, animationFn) {
  return async (...args) => {
    if (element.dataset.animating === 'true') return;

    element.dataset.animating = 'true';
    try {
      await animationFn(...args);
    } finally {
      element.dataset.animating = 'false';
    }
  };
}

export default {
  ANIMATION_DEFAULTS,
  fadeIn,
  fadeOut,
  slideDown,
  slideUp,
  stagger,
  collapseElements,
  requestFrame,
  cancelFrame,
  delay,
  preventReentry,
};
