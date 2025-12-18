/**
 * GitHub Fold Files 配置模块
 */

/**
 * 默认配置
 */
export const CONFIG = {
  // 动画持续时间(ms)
  animationDuration: 200,
  // 记住折叠状态
  rememberState: true,
  // 启用全部折叠/展开按钮
  collapseAll: true,
  // 鼠标悬停预览
  hoverPreview: true,
  // 交错动画延迟
  staggerDelay: 30,
  // 展开动画延迟
  expandStaggerDelay: 30,
  // 折叠动画延迟
  collapseStaggerDelay: 20,
};

/**
 * 选择器配置
 */
export const SELECTORS = {
  // 文件行选择器
  fileRow: 'tr[class*="DirectoryContent"] td > div[class*="LatestCommit"]',
  // 操作栏选择器
  actionsBar: 'div[data-hpc] .Box-sc-g0xbh4-0',
  // 路径链接选择器
  pathLink: 'a[data-pjax]',
};

/**
 * 存储键
 */
export const STORAGE_KEY = 'github-fold-state';

export default {
  CONFIG,
  SELECTORS,
  STORAGE_KEY,
};
