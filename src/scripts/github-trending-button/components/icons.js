/**
 * GitHub Trending Button 图标组件
 */

/**
 * 趋势图标 SVG
 * @returns {string} SVG HTML 字符串
 */
export function trendingIcon() {
  return `
    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-graph">
      <path d="M1.5 1.75V13.5h13.75a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75V1.75a.75.75 0 0 1 1.5 0Zm14.28 2.53-5.25 5.25a.75.75 0 0 1-1.06 0L7 7.06 4.28 9.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.06 0L10 7.94l4.72-4.72a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
    </svg>
  `;
}

/**
 * 设置图标
 * @returns {string} emoji
 */
export function settingsIcon() {
  return '⚙️';
}

/**
 * 时钟图标
 * @returns {string} emoji
 */
export function clockIcon() {
  return '🕐';
}

/**
 * 星星图标
 * @param {boolean} filled - 是否填充
 * @returns {string} emoji
 */
export function starIcon(filled = false) {
  return filled ? '⭐' : '☆';
}

/**
 * 搜索图标
 * @returns {string} emoji
 */
export function searchIcon() {
  return '🔍';
}

export default {
  trendingIcon,
  settingsIcon,
  clockIcon,
  starIcon,
  searchIcon,
};
