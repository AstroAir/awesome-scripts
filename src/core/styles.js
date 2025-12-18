/**
 * 样式注入模块
 * 提供 CSS 样式注入和管理功能
 */

/**
 * 注入 CSS 样式
 * 优先使用 GM_addStyle，回退到 style 标签
 * @param {string} css - CSS 样式字符串
 * @param {string} id - 可选的样式 ID
 * @returns {HTMLStyleElement|null} 样式元素
 */
export function injectStyles(css, id = null) {
  // 如果指定了 ID，检查是否已存在
  if (id) {
    const existing = document.getElementById(id);
    if (existing) {
      existing.textContent = css;
      return existing;
    }
  }

  // 优先使用 GM_addStyle
  if (typeof GM_addStyle !== 'undefined') {
    try {
      GM_addStyle(css);
      return null;
    } catch (e) {
      console.warn('[Styles] GM_addStyle failed, falling back to style tag:', e);
    }
  }

  // 回退到 style 标签
  const style = document.createElement('style');
  style.type = 'text/css';
  if (id) style.id = id;
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
  return style;
}

/**
 * 移除注入的样式
 * @param {string} id - 样式 ID
 * @returns {boolean} 是否成功移除
 */
export function removeStyles(id) {
  const style = document.getElementById(id);
  if (style) {
    style.remove();
    return true;
  }
  return false;
}

/**
 * CSS 变量工具
 * 获取和设置 CSS 变量
 */
export const cssVars = {
  /**
   * 获取 CSS 变量值
   * @param {string} name - 变量名（不含 --）
   * @param {Element} element - 元素，默认为 document.documentElement
   * @returns {string} 变量值
   */
  get(name, element = document.documentElement) {
    return getComputedStyle(element).getPropertyValue(`--${name}`).trim();
  },

  /**
   * 设置 CSS 变量值
   * @param {string} name - 变量名（不含 --）
   * @param {string} value - 变量值
   * @param {Element} element - 元素，默认为 document.documentElement
   */
  set(name, value, element = document.documentElement) {
    element.style.setProperty(`--${name}`, value);
  },
};

/**
 * GitHub 主题相关的 CSS 变量
 * 提供常用的 GitHub 样式变量
 */
export const githubVars = {
  // 颜色
  fgDefault: 'var(--fgColor-default, #1f2328)',
  fgMuted: 'var(--fgColor-muted, #656d76)',
  fgOnEmphasis: 'var(--fgColor-onEmphasis, #ffffff)',
  bgDefault: 'var(--bgColor-default, #ffffff)',
  bgMuted: 'var(--bgColor-muted, rgba(175, 184, 193, 0.2))',
  bgEmphasis: 'var(--bgColor-emphasis, #0969da)',
  borderDefault: 'var(--borderColor-default, #d0d7de)',

  // 按钮
  buttonBgHover: 'var(--button-default-bgColor-hover, rgba(175, 184, 193, 0.2))',
  buttonBgActive: 'var(--button-default-bgColor-active, rgba(175, 184, 193, 0.3))',

  // 阴影
  shadowMedium: 'var(--shadow-medium, 0 1px 3px rgba(0,0,0,0.12))',
  shadowLarge: 'var(--shadow-floating-large, 0 8px 24px rgba(140,149,159,0.2))',

  // 焦点
  focusOutline: 'var(--focus-outlineColor, #0969da)',

  // 覆盖层
  overlayBg: 'var(--overlay-bgColor, #ffffff)',
};

/**
 * 生成动画样式
 * @param {string} name - 动画名称
 * @param {Object} keyframes - 关键帧对象
 * @param {Object} options - 动画选项
 * @returns {string} CSS 字符串
 */
export function createAnimation(name, keyframes, options = {}) {
  const {
    duration = '0.3s',
    timing = 'ease',
    fillMode = 'forwards',
  } = options;

  let keyframesCss = `@keyframes ${name} {\n`;
  for (const [key, styles] of Object.entries(keyframes)) {
    keyframesCss += `  ${key} {\n`;
    for (const [prop, value] of Object.entries(styles)) {
      const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
      keyframesCss += `    ${cssProp}: ${value};\n`;
    }
    keyframesCss += '  }\n';
  }
  keyframesCss += '}\n';

  const animationRule = `animation: ${name} ${duration} ${timing} ${fillMode};`;

  return {
    keyframes: keyframesCss,
    rule: animationRule,
    apply: (selector) => `${keyframesCss}\n${selector} { ${animationRule} }`,
  };
}

/**
 * 生成媒体查询
 * @param {string} type - 查询类型
 * @param {string} css - CSS 内容
 * @returns {string} 媒体查询 CSS
 */
export function mediaQuery(type, css) {
  const queries = {
    mobile: '@media (max-width: 768px)',
    tablet: '@media (min-width: 769px) and (max-width: 1024px)',
    desktop: '@media (min-width: 1025px)',
    dark: '@media (prefers-color-scheme: dark)',
    light: '@media (prefers-color-scheme: light)',
    reducedMotion: '@media (prefers-reduced-motion: reduce)',
    highContrast: '@media (prefers-contrast: high)',
  };

  const query = queries[type] || type;
  return `${query} {\n${css}\n}`;
}

/**
 * CSS 模板标签
 * 用于编写可读的 CSS
 * @param {TemplateStringsArray} strings - 模板字符串
 * @param  {...any} values - 插值
 * @returns {string} CSS 字符串
 */
export function css(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] || '');
  }, '');
}

export default {
  injectStyles,
  removeStyles,
  cssVars,
  githubVars,
  createAnimation,
  mediaQuery,
  css,
};
