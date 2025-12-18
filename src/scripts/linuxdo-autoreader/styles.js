/**
 * Linux.do 自动标记已读 - 样式模块
 */

/**
 * 获取样式字符串
 * @returns {string}
 */
export function getStyles() {
  return `
    /* ===== CSS 变量 ===== */
    :root {
      --ar-bg: rgba(13, 17, 23, 0.98);
      --ar-bg-secondary: rgba(22, 27, 34, 0.95);
      --ar-bg-tertiary: rgba(33, 38, 45, 0.9);
      --ar-bg-hover: rgba(48, 54, 61, 0.8);
      --ar-border: rgba(48, 54, 61, 0.6);
      --ar-border-light: rgba(48, 54, 61, 0.3);
      --ar-text: #e6edf3;
      --ar-text-secondary: #8b949e;
      --ar-text-muted: #6e7681;
      --ar-accent: #58a6ff;
      --ar-accent-dim: rgba(88, 166, 255, 0.15);
      --ar-success: #3fb950;
      --ar-success-dim: rgba(63, 185, 80, 0.15);
      --ar-warning: #d29922;
      --ar-warning-dim: rgba(210, 153, 34, 0.15);
      --ar-error: #f85149;
      --ar-error-dim: rgba(248, 81, 73, 0.15);
      --ar-purple: #a371f7;
      --ar-cyan: #39d4d4;
      --ar-shadow: 0 16px 70px rgba(0, 0, 0, 0.5);
      --ar-radius: 16px;
      --ar-radius-md: 12px;
      --ar-radius-sm: 8px;
      --ar-radius-xs: 6px;
      --ar-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .ar-light {
      --ar-bg: rgba(255, 255, 255, 0.98);
      --ar-bg-secondary: rgba(246, 248, 250, 0.95);
      --ar-bg-tertiary: rgba(234, 238, 242, 0.9);
      --ar-bg-hover: rgba(208, 215, 222, 0.6);
      --ar-border: rgba(208, 215, 222, 0.8);
      --ar-border-light: rgba(208, 215, 222, 0.4);
      --ar-text: #24292f;
      --ar-text-secondary: #57606a;
      --ar-text-muted: #8c959f;
      --ar-shadow: 0 16px 70px rgba(0, 0, 0, 0.12);
    }

    /* ===== 主容器 ===== */
    #ar-panel {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      background: var(--ar-bg);
      color: var(--ar-text);
      border-radius: var(--ar-radius);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC', sans-serif;
      font-size: 13px;
      z-index: 99999;
      box-shadow: var(--ar-shadow);
      backdrop-filter: blur(20px);
      border: 1px solid var(--ar-border);
      transition: var(--ar-transition);
      overflow: hidden;
      max-height: 90vh;
    }

    #ar-panel.minimized { width: 240px; }
    #ar-panel.minimized #ar-body { display: none; }

    /* ===== 头部 ===== */
    #ar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: var(--ar-bg-secondary);
      cursor: move;
      user-select: none;
      border-bottom: 1px solid var(--ar-border);
    }

    #ar-title-section { display: flex; align-items: center; gap: 10px; }

    #ar-status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--ar-text-muted);
      transition: var(--ar-transition);
      flex-shrink: 0;
    }

    #ar-status-dot.running {
      background: var(--ar-success);
      box-shadow: 0 0 0 3px var(--ar-success-dim);
      animation: statusPulse 2s ease-in-out infinite;
    }

    #ar-status-dot.paused {
      background: var(--ar-warning);
      box-shadow: 0 0 0 3px var(--ar-warning-dim);
    }

    @keyframes statusPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    #ar-title { font-weight: 600; font-size: 14px; }

    #ar-mode-badge {
      font-size: 11px;
      padding: 3px 10px;
      background: var(--ar-accent-dim);
      color: var(--ar-accent);
      border-radius: 20px;
      font-weight: 500;
      border: 1px solid var(--ar-accent);
    }

    #ar-header-controls { display: flex; gap: 4px; }

    .ar-icon-btn {
      background: transparent;
      border: none;
      color: var(--ar-text-secondary);
      cursor: pointer;
      padding: 6px;
      border-radius: var(--ar-radius-xs);
      font-size: 14px;
      transition: var(--ar-transition);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
    }

    .ar-icon-btn:hover { background: var(--ar-bg-hover); color: var(--ar-text); }

    /* ===== 主体 ===== */
    #ar-body { padding: 16px; max-height: calc(90vh - 60px); overflow-y: auto; }
    #ar-body::-webkit-scrollbar { width: 6px; }
    #ar-body::-webkit-scrollbar-thumb { background: var(--ar-border); border-radius: 3px; }

    /* ===== 统计卡片 ===== */
    #ar-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }

    .ar-stat-card {
      background: var(--ar-bg-secondary);
      padding: 12px 8px;
      border-radius: var(--ar-radius-sm);
      text-align: center;
      border: 1px solid var(--ar-border-light);
      transition: var(--ar-transition);
    }

    .ar-stat-card:hover { border-color: var(--ar-border); transform: translateY(-1px); }

    .ar-stat-value {
      font-size: 18px;
      font-weight: 700;
      line-height: 1.2;
      font-family: 'SF Mono', 'Consolas', monospace;
    }

    .ar-stat-card:nth-child(1) .ar-stat-value { color: var(--ar-accent); }
    .ar-stat-card:nth-child(2) .ar-stat-value { color: var(--ar-purple); }
    .ar-stat-card:nth-child(3) .ar-stat-value { color: var(--ar-success); }
    .ar-stat-card:nth-child(4) .ar-stat-value { color: var(--ar-cyan); }

    .ar-stat-label {
      font-size: 10px;
      color: var(--ar-text-muted);
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ===== 进度区域 ===== */
    #ar-progress-container {
      margin-bottom: 16px;
      background: var(--ar-bg-secondary);
      padding: 12px;
      border-radius: var(--ar-radius-sm);
      border: 1px solid var(--ar-border-light);
    }

    #ar-progress-bar { height: 6px; background: var(--ar-bg-tertiary); border-radius: 3px; overflow: hidden; }

    #ar-progress-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, var(--ar-accent), var(--ar-purple), var(--ar-success));
      background-size: 200% 100%;
      border-radius: 3px;
      transition: width 0.3s ease;
      animation: progressGradient 3s ease infinite;
    }

    @keyframes progressGradient {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    #ar-progress-info { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; font-size: 11px; }
    #ar-progress-text { color: var(--ar-text-secondary); }
    #ar-current-topic { color: var(--ar-text-muted); max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* ===== 控制按钮 ===== */
    #ar-controls { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }

    .ar-btn {
      padding: 10px 8px;
      border: none;
      border-radius: var(--ar-radius-sm);
      cursor: pointer;
      font-size: 11px;
      font-weight: 600;
      transition: var(--ar-transition);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      position: relative;
      overflow: hidden;
    }

    .ar-btn::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.2s;
    }

    .ar-btn:hover::before { opacity: 1; }
    .ar-btn-icon { font-size: 16px; }

    .ar-btn-primary { background: linear-gradient(135deg, var(--ar-success), #2ea043); color: white; }
    .ar-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px var(--ar-success-dim); }

    .ar-btn-secondary { background: var(--ar-bg-secondary); color: var(--ar-text); border: 1px solid var(--ar-border); }
    .ar-btn-secondary:hover:not(:disabled) { background: var(--ar-bg-tertiary); border-color: var(--ar-text-muted); }

    .ar-btn-warning { background: linear-gradient(135deg, var(--ar-warning), #bf8700); color: white; }
    .ar-btn-danger { background: linear-gradient(135deg, var(--ar-error), #da3633); color: white; }

    .ar-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

    /* ===== 标签页 ===== */
    #ar-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 12px;
      background: var(--ar-bg-secondary);
      padding: 4px;
      border-radius: var(--ar-radius-sm);
      border: 1px solid var(--ar-border-light);
    }

    .ar-tab {
      flex: 1;
      padding: 8px 6px;
      border: none;
      background: transparent;
      color: var(--ar-text-secondary);
      cursor: pointer;
      border-radius: var(--ar-radius-xs);
      font-size: 11px;
      font-weight: 500;
      transition: var(--ar-transition);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

    .ar-tab:hover { color: var(--ar-text); background: var(--ar-bg-tertiary); }
    .ar-tab.active { background: var(--ar-bg); color: var(--ar-accent); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); }

    /* ===== 内容区域 ===== */
    .ar-tab-content {
      display: none;
      max-height: 280px;
      overflow-y: auto;
      background: var(--ar-bg-secondary);
      border-radius: var(--ar-radius-sm);
      border: 1px solid var(--ar-border-light);
    }

    .ar-tab-content.active { display: block; }
    .ar-tab-content::-webkit-scrollbar { width: 6px; }
    .ar-tab-content::-webkit-scrollbar-thumb { background: var(--ar-border); border-radius: 3px; }

    /* ===== 日志 ===== */
    #ar-logs { padding: 8px; }

    .ar-log-item {
      padding: 8px 10px;
      border-radius: var(--ar-radius-xs);
      margin-bottom: 4px;
      font-size: 11px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      line-height: 1.5;
      background: var(--ar-bg-tertiary);
      border-left: 3px solid transparent;
      animation: logSlideIn 0.2s ease;
    }

    @keyframes logSlideIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .ar-log-item.info { border-left-color: var(--ar-accent); }
    .ar-log-item.success { border-left-color: var(--ar-success); }
    .ar-log-item.warning { border-left-color: var(--ar-warning); }
    .ar-log-item.error { border-left-color: var(--ar-error); }

    .ar-log-time { color: var(--ar-text-muted); font-size: 10px; font-family: 'SF Mono', monospace; flex-shrink: 0; }
    .ar-log-msg { flex: 1; word-break: break-word; }

    .ar-log-item.info .ar-log-msg { color: var(--ar-text); }
    .ar-log-item.success .ar-log-msg { color: var(--ar-success); }
    .ar-log-item.warning .ar-log-msg { color: var(--ar-warning); }
    .ar-log-item.error .ar-log-msg { color: var(--ar-error); }

    /* ===== 帖子列表 ===== */
    #ar-topics { padding: 6px; }

    .ar-topic-item {
      padding: 10px 12px;
      border-radius: var(--ar-radius-xs);
      margin-bottom: 4px;
      transition: var(--ar-transition);
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--ar-bg-tertiary);
    }

    .ar-topic-item:hover { background: var(--ar-bg-hover); }
    .ar-topic-item.current { background: var(--ar-accent-dim); border: 1px solid var(--ar-accent); }

    .ar-topic-badge {
      font-size: 9px;
      padding: 2px 6px;
      border-radius: 4px;
      flex-shrink: 0;
      font-weight: 600;
      text-transform: uppercase;
    }

    .ar-topic-badge.unseen { background: var(--ar-success-dim); color: var(--ar-success); border: 1px solid var(--ar-success); }
    .ar-topic-badge.read { background: var(--ar-bg-hover); color: var(--ar-text-muted); }

    .ar-topic-item a {
      color: var(--ar-text);
      text-decoration: none;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
    }

    .ar-topic-item a:hover { color: var(--ar-accent); }

    .ar-topic-replies {
      font-size: 10px;
      color: var(--ar-text-muted);
      flex-shrink: 0;
      background: var(--ar-bg-secondary);
      padding: 2px 6px;
      border-radius: 4px;
    }

    /* ===== 设置面板 ===== */
    #ar-settings { padding: 12px; }

    .ar-setting-section { margin-bottom: 20px; }
    .ar-setting-section:last-child { margin-bottom: 0; }

    .ar-setting-section-title {
      font-size: 11px;
      color: var(--ar-text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--ar-border-light);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* 模式选择器 */
    .ar-mode-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }

    .ar-mode-card {
      padding: 12px 8px;
      border: 2px solid var(--ar-border);
      border-radius: var(--ar-radius-sm);
      cursor: pointer;
      transition: var(--ar-transition);
      text-align: center;
      background: var(--ar-bg-tertiary);
    }

    .ar-mode-card:hover { border-color: var(--ar-text-muted); background: var(--ar-bg-hover); }
    .ar-mode-card.active { border-color: var(--ar-accent); background: var(--ar-accent-dim); }

    .ar-mode-card-icon { font-size: 20px; margin-bottom: 4px; }
    .ar-mode-card-name { font-size: 11px; font-weight: 600; color: var(--ar-text); margin-bottom: 2px; }
    .ar-mode-card-desc { font-size: 9px; color: var(--ar-text-muted); }

    /* 设置项 */
    .ar-setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--ar-border-light);
    }

    .ar-setting-item:last-child { border-bottom: none; }
    .ar-setting-label { font-size: 12px; color: var(--ar-text); font-weight: 500; }
    .ar-setting-desc { font-size: 10px; color: var(--ar-text-muted); margin-top: 2px; }

    /* 开关 */
    .ar-switch { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
    .ar-switch input { opacity: 0; width: 0; height: 0; }

    .ar-switch-slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background: var(--ar-border);
      border-radius: 11px;
      transition: 0.3s;
    }

    .ar-switch-slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      background: white;
      border-radius: 50%;
      transition: 0.3s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .ar-switch input:checked + .ar-switch-slider { background: var(--ar-accent); }
    .ar-switch input:checked + .ar-switch-slider:before { transform: translateX(18px); }

    /* 滑块 */
    .ar-slider-container { display: flex; align-items: center; gap: 10px; }

    .ar-slider {
      -webkit-appearance: none;
      width: 100px;
      height: 6px;
      border-radius: 3px;
      background: var(--ar-border);
      outline: none;
    }

    .ar-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--ar-accent);
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s;
    }

    .ar-slider::-webkit-slider-thumb:hover { transform: scale(1.1); }

    .ar-slider-value {
      font-size: 11px;
      color: var(--ar-accent);
      font-weight: 600;
      min-width: 30px;
      text-align: right;
      font-family: monospace;
    }

    /* 输入框 */
    .ar-input {
      padding: 6px 10px;
      border: 1px solid var(--ar-border);
      border-radius: var(--ar-radius-xs);
      background: var(--ar-bg);
      color: var(--ar-text);
      font-size: 12px;
      width: 80px;
      outline: none;
      transition: var(--ar-transition);
    }

    .ar-input:focus { border-color: var(--ar-accent); }

    /* 范围输入 */
    .ar-range-input { display: flex; align-items: center; gap: 6px; }
    .ar-range-input .ar-input { width: 60px; text-align: center; }
    .ar-range-separator { color: var(--ar-text-muted); font-size: 11px; }

    /* 按钮组 */
    .ar-btn-row { display: flex; gap: 8px; margin-top: 12px; }
    .ar-btn-row .ar-btn { flex: 1; flex-direction: row; padding: 10px 12px; }

    /* 空状态 */
    .ar-empty { text-align: center; padding: 40px 20px; color: var(--ar-text-muted); }
    .ar-empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.5; }
    .ar-empty-text { font-size: 12px; }

    /* 折叠区域 */
    .ar-collapsible { margin-top: 12px; }

    .ar-collapsible-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: var(--ar-bg-tertiary);
      border-radius: var(--ar-radius-xs);
      cursor: pointer;
      transition: var(--ar-transition);
    }

    .ar-collapsible-header:hover { background: var(--ar-bg-hover); }

    .ar-collapsible-title { font-size: 11px; font-weight: 600; color: var(--ar-text); display: flex; align-items: center; gap: 6px; }
    .ar-collapsible-icon { transition: transform 0.2s; }
    .ar-collapsible.open .ar-collapsible-icon { transform: rotate(180deg); }

    .ar-collapsible-content {
      display: none;
      padding: 12px;
      border: 1px solid var(--ar-border-light);
      border-top: none;
      border-radius: 0 0 var(--ar-radius-xs) var(--ar-radius-xs);
      background: var(--ar-bg-secondary);
    }

    .ar-collapsible.open .ar-collapsible-content { display: block; }

    /* 快捷键弹窗 */
    #ar-shortcuts {
      position: absolute;
      bottom: 100%;
      right: 0;
      width: 220px;
      background: var(--ar-bg);
      border: 1px solid var(--ar-border);
      border-radius: var(--ar-radius-md);
      padding: 12px;
      margin-bottom: 8px;
      display: none;
      box-shadow: var(--ar-shadow);
    }

    #ar-shortcuts.show { display: block; animation: fadeIn 0.2s ease; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .ar-shortcuts-title {
      font-size: 11px;
      font-weight: 600;
      color: var(--ar-text);
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--ar-border-light);
    }

    .ar-shortcut-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
      font-size: 11px;
      color: var(--ar-text-secondary);
    }

    .ar-shortcut-key {
      background: var(--ar-bg-secondary);
      padding: 3px 8px;
      border-radius: 4px;
      font-family: monospace;
      border: 1px solid var(--ar-border);
      font-size: 10px;
      color: var(--ar-text);
    }

    /* 工具提示 */
    .ar-tooltip { position: relative; }

    .ar-tooltip::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      padding: 6px 10px;
      background: var(--ar-bg);
      color: var(--ar-text);
      font-size: 11px;
      border-radius: var(--ar-radius-xs);
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s;
      border: 1px solid var(--ar-border);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      margin-bottom: 6px;
    }

    .ar-tooltip:hover::after { opacity: 1; visibility: visible; }
  `;
}

export default { getStyles };
