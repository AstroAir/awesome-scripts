/**
 * GitHub Enhanced Toolbar 工具函数模块
 */

/**
 * 获取当前主题
 * @returns {string} 'light' 或 'dark'
 */
export function getCurrentTheme() {
  const htmlElement = document.documentElement;
  const colorMode = htmlElement.getAttribute('data-color-mode');
  return colorMode || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

/**
 * 构建安全的URL
 * @param {string} baseUrl - 基础URL
 * @returns {string} 完整URL
 */
export function buildSafeUrl(baseUrl) {
  try {
    const url = new URL(baseUrl);
    url.pathname = location.pathname;
    url.search = location.search;
    url.hash = location.hash;
    return url.href;
  } catch (error) {
    console.error('[GitHub增强] 构建 URL 失败:', error);
    return baseUrl;
  }
}

/**
 * 创建SVG图标元素
 * @param {string} svgContent - SVG内容字符串
 * @returns {SVGElement} SVG元素
 */
export function createSVGIcon(svgContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svgElement = doc.documentElement;

  svgElement.classList.add('octicon');
  if (!svgElement.hasAttribute('width')) svgElement.setAttribute('width', '16');
  if (!svgElement.hasAttribute('height')) svgElement.setAttribute('height', '16');

  if (!svgElement.hasAttribute('fill')) {
    svgElement.setAttribute('fill', 'currentColor');
  }

  return svgElement;
}

/**
 * 创建图片图标元素
 * @param {string} src - 图片源地址
 * @returns {HTMLImageElement} img元素
 */
export function createImageIcon(src) {
  const img = document.createElement('img');
  img.className = 'octicon';
  img.width = 16;
  img.height = 16;
  img.src = src;
  img.alt = '';
  img.loading = 'lazy';
  return img;
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间(毫秒)
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default {
  getCurrentTheme,
  buildSafeUrl,
  createSVGIcon,
  createImageIcon,
  debounce,
};
