/**
 * Linux.do Forum Post Exporter - 样式模块
 */

/**
 * 获取HTML导出样式
 * @returns {string}
 */
export function getHTMLStyles() {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f8f9fa;
      --bg-tertiary: #f1f3f5;
      --text-primary: #1a1a1a;
      --text-secondary: #6c757d;
      --text-tertiary: #adb5bd;
      --border-color: #e9ecef;
      --accent-color: #495057;
      --hover-bg: #f8f9fa;
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
      --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.06);
      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 12px;
    }

    [data-theme="dark"] {
      --bg-primary: #1a1a1a;
      --bg-secondary: #242424;
      --bg-tertiary: #2d2d2d;
      --text-primary: #e9ecef;
      --text-secondary: #adb5bd;
      --text-tertiary: #6c757d;
      --border-color: #3d3d3d;
      --accent-color: #adb5bd;
      --hover-bg: #2d2d2d;
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2);
      --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        --bg-primary: #1a1a1a;
        --bg-secondary: #242424;
        --bg-tertiary: #2d2d2d;
        --text-primary: #e9ecef;
        --text-secondary: #adb5bd;
        --text-tertiary: #6c757d;
        --border-color: #3d3d3d;
        --accent-color: #adb5bd;
        --hover-bg: #2d2d2d;
        --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2);
        --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.3);
      }
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
      line-height: 1.6;
      color: var(--text-primary);
      background: var(--bg-secondary);
      padding: 20px;
      font-size: 15px;
    }

    .container { max-width: 860px; margin: 0 auto; }

    .header {
      background: var(--bg-primary);
      padding: 32px;
      border-radius: var(--radius-lg);
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
    }

    .header h1 {
      font-size: 26px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 16px;
      line-height: 1.3;
    }

    .topic-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }

    .category {
      display: inline-flex;
      align-items: center;
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      padding: 4px 12px;
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 500;
      border: 1px solid var(--border-color);
    }

    .tag {
      display: inline-flex;
      align-items: center;
      background: var(--bg-secondary);
      color: var(--text-secondary);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      border: 1px solid var(--border-color);
    }

    .topic-info {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
      font-size: 13px;
      color: var(--text-secondary);
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .topic-info-item { display: flex; align-items: center; gap: 4px; }
    .topic-info-label { font-weight: 500; color: var(--text-secondary); }

    .topic-info a {
      color: var(--text-secondary);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: all 0.2s;
    }

    .topic-info a:hover { color: var(--text-primary); border-bottom-color: var(--text-primary); }

    .post {
      background: var(--bg-primary);
      padding: 24px;
      margin-bottom: 16px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      transition: box-shadow 0.2s;
    }

    .post:hover { box-shadow: var(--shadow-md); }

    .post-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--border-color);
      flex-shrink: 0;
    }

    .author-info { flex: 1; min-width: 0; }

    .author-name {
      font-weight: 600;
      color: var(--text-primary);
      text-decoration: none;
      font-size: 14px;
      display: inline-block;
      transition: color 0.2s;
    }

    .author-name:hover { color: var(--accent-color); }
    .post-date { color: var(--text-tertiary); font-size: 13px; margin-top: 2px; }

    .post-number {
      background: var(--bg-tertiary);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      color: var(--text-secondary);
      font-weight: 500;
      border: 1px solid var(--border-color);
      flex-shrink: 0;
    }

    .reply-to {
      background: var(--bg-secondary);
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      margin-bottom: 16px;
      font-size: 13px;
      color: var(--text-secondary);
      border-left: 2px solid var(--border-color);
    }

    .post-content { color: var(--text-primary); line-height: 1.7; }
    .post-content p { margin: 0 0 16px 0; }
    .post-content p:last-child { margin-bottom: 0; }

    .post-content h1, .post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6 {
      margin: 24px 0 16px 0;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.3;
    }

    .post-content h1 { font-size: 24px; }
    .post-content h2 { font-size: 20px; }
    .post-content h3 { font-size: 18px; }
    .post-content h4 { font-size: 16px; }

    .post-content img {
      max-width: 100%;
      height: auto;
      margin: 16px 0;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      display: block;
    }

    .post-content a {
      color: var(--text-primary);
      text-decoration: none;
      border-bottom: 1px solid var(--border-color);
      transition: all 0.2s;
    }

    .post-content a:hover { border-bottom-color: var(--text-primary); }
    .post-content ul, .post-content ol { margin: 16px 0; padding-left: 24px; }
    .post-content li { margin: 8px 0; }

    .post-content blockquote, .post-content aside.quote {
      background: var(--bg-secondary);
      border-left: 3px solid var(--border-color);
      padding: 12px 16px;
      margin: 16px 0;
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .post-content pre {
      background: var(--bg-tertiary);
      padding: 16px;
      border-radius: var(--radius-sm);
      overflow-x: auto;
      margin: 16px 0;
      border: 1px solid var(--border-color);
      font-size: 13px;
      line-height: 1.5;
    }

    .post-content code {
      background: var(--bg-tertiary);
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      border: 1px solid var(--border-color);
    }

    .post-content pre code { background: transparent; padding: 0; border: none; }

    .post-content table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
    .post-content table th, .post-content table td { padding: 10px 12px; text-align: left; border: 1px solid var(--border-color); }
    .post-content table th { background: var(--bg-tertiary); font-weight: 600; }
    .post-content table tr:nth-child(even) { background: var(--bg-secondary); }
    .post-content hr { border: none; border-top: 1px solid var(--border-color); margin: 24px 0; }

    .export-info {
      margin-top: 32px;
      padding: 16px;
      background: var(--bg-primary);
      border-radius: var(--radius-md);
      text-align: center;
      font-size: 13px;
      color: var(--text-tertiary);
      border: 1px solid var(--border-color);
    }

    @media (max-width: 768px) {
      body { padding: 12px; }
      .header { padding: 20px; }
      .header h1 { font-size: 22px; }
      .post { padding: 16px; }
      .post-header { flex-wrap: wrap; }
      .avatar { width: 36px; height: 36px; }
      .topic-info { flex-direction: column; gap: 8px; }
    }

    @media (max-width: 480px) {
      body { font-size: 14px; }
      .header h1 { font-size: 20px; }
      .post-content { font-size: 14px; }
    }

    @media print {
      body { background: white; padding: 0; }
      .post { box-shadow: none; border: 1px solid #ddd; page-break-inside: avoid; }
      .post-content a { color: var(--text-primary); text-decoration: none; border-bottom: none; }
      .toolbar { display: none !important; }
    }

    /* Toolbar Styles */
    .toolbar {
      background: var(--bg-primary);
      padding: 16px;
      border-radius: var(--radius-md);
      margin-bottom: 16px;
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
    }

    .search-wrapper {
      flex: 1;
      min-width: 200px;
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 10px 40px 10px 14px;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      font-size: 14px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      outline: none;
      transition: all 0.2s;
    }

    .search-input::placeholder { color: var(--text-tertiary); }
    .search-input:focus { border-color: var(--accent-color); box-shadow: 0 0 0 2px rgba(73, 80, 87, 0.1); }

    .search-clear {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      font-size: 18px;
      padding: 4px;
      line-height: 1;
      display: none;
    }

    .search-clear.visible { display: block; }
    .search-clear:hover { color: var(--text-secondary); }

    .theme-selector {
      position: relative;
    }

    .theme-select {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 8px 36px 8px 12px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      cursor: pointer;
      outline: none;
      transition: all 0.2s;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236c757d' d='M2 4l4 4 4-4'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      min-width: 120px;
    }

    .theme-select:hover {
      border-color: var(--accent-color);
      background-color: var(--hover-bg);
    }

    .theme-select:focus {
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px rgba(73, 80, 87, 0.1);
    }

    .theme-select option {
      background: var(--bg-primary);
      color: var(--text-primary);
      padding: 8px;
    }

    .no-results {
      background: var(--bg-primary);
      padding: 40px 20px;
      text-align: center;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      display: none;
    }

    .no-results.visible { display: block; }
    .no-results-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.5; }
    .no-results-text { font-size: 16px; margin-bottom: 16px; }

    .show-all-btn {
      padding: 8px 16px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .show-all-btn:hover { background: var(--hover-bg); }
    .post.hidden { display: none; }

    .search-highlight { background: #fff3cd; padding: 1px 2px; border-radius: 2px; }
    [data-theme="dark"] .search-highlight { background: #5a4b00; }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) .search-highlight { background: #5a4b00; }
    }

    @media (max-width: 768px) {
      .toolbar { flex-direction: column; align-items: stretch; }
      .search-wrapper { width: 100%; }
      .theme-toggle { justify-content: center; }
    }
  `;
}

/**
 * 获取UI样式
 * @returns {string}
 */
export function getUIStyles() {
  return `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Theme-adaptive CSS variables - Light theme default */
    #export-controls {
      --export-btn-bg: #1a1a1a;
      --export-btn-bg-hover: #2d2d2d;
      --export-btn-text: #ffffff;
      --export-panel-bg: #ffffff;
      --export-panel-text: #1a1a1a;
      --export-panel-border: #e9ecef;
      --export-panel-hover: #f8f9fa;
      --export-shadow: rgba(0, 0, 0, 0.15);
      --export-shadow-hover: rgba(0, 0, 0, 0.2);
    }

    /* Dark theme detection - Discourse/Linux.do uses various class names */
    html.dark-theme #export-controls,
    html.dark #export-controls,
    html[data-color-scheme="dark"] #export-controls,
    html[data-theme="dark"] #export-controls,
    html.scheme-dark #export-controls,
    body.dark-theme #export-controls,
    body.dark #export-controls,
    .dark-theme #export-controls,
    .dark #export-controls,
    #export-controls.dark-mode {
      --export-btn-bg: #ffffff;
      --export-btn-bg-hover: #f0f0f0;
      --export-btn-text: #1a1a1a;
      --export-panel-bg: #2d2d2d;
      --export-panel-text: #e9ecef;
      --export-panel-border: #404040;
      --export-panel-hover: #3d3d3d;
      --export-shadow: rgba(0, 0, 0, 0.3);
      --export-shadow-hover: rgba(0, 0, 0, 0.4);
    }

    /* Fallback: prefers-color-scheme for system dark mode */
    @media (prefers-color-scheme: dark) {
      #export-controls:not(.light-forced) {
        --export-btn-bg: #ffffff;
        --export-btn-bg-hover: #f0f0f0;
        --export-btn-text: #1a1a1a;
        --export-panel-bg: #2d2d2d;
        --export-panel-text: #e9ecef;
        --export-panel-border: #404040;
        --export-panel-hover: #3d3d3d;
        --export-shadow: rgba(0, 0, 0, 0.3);
        --export-shadow-hover: rgba(0, 0, 0, 0.4);
      }
    }

    /* Override for explicit light theme on site */
    html.light-theme #export-controls,
    html.light #export-controls,
    html[data-color-scheme="light"] #export-controls,
    html[data-theme="light"] #export-controls,
    html.scheme-light #export-controls {
      --export-btn-bg: #1a1a1a;
      --export-btn-bg-hover: #2d2d2d;
      --export-btn-text: #ffffff;
      --export-panel-bg: #ffffff;
      --export-panel-text: #1a1a1a;
      --export-panel-border: #e9ecef;
      --export-panel-hover: #f8f9fa;
      --export-shadow: rgba(0, 0, 0, 0.15);
      --export-shadow-hover: rgba(0, 0, 0, 0.2);
    }

    #export-controls {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .export-btn {
      background: var(--export-btn-bg);
      color: var(--export-btn-text);
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 2px 8px var(--export-shadow);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      min-width: 160px;
      justify-content: center;
    }

    .export-btn:hover {
      background: var(--export-btn-bg-hover);
      box-shadow: 0 4px 12px var(--export-shadow-hover);
      transform: translateY(-1px);
    }

    .export-btn:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px var(--export-shadow);
    }

    .export-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .checkbox-wrapper {
      background: var(--export-panel-bg);
      padding: 10px 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px var(--export-shadow);
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--export-panel-text);
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--export-panel-border);
    }

    .checkbox-wrapper:hover { background: var(--export-panel-hover); box-shadow: 0 4px 12px var(--export-shadow-hover); }
    .checkbox-wrapper input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; margin: 0; accent-color: var(--export-btn-bg); }
    .checkbox-wrapper label { cursor: pointer; user-select: none; font-weight: 500; }

    .language-selector {
      background: var(--export-panel-bg);
      padding: 8px 12px;
      border-radius: 8px;
      box-shadow: 0 2px 8px var(--export-shadow);
      border: 1px solid var(--export-panel-border);
    }

    .language-selector select {
      width: 100%;
      border: none;
      background: transparent;
      font-size: 13px;
      font-weight: 500;
      color: var(--export-panel-text);
      cursor: pointer;
      outline: none;
      font-family: inherit;
    }

    .language-selector select option {
      background: var(--export-panel-bg);
      color: var(--export-panel-text);
    }

    /* Toggle button - always visible */
    .export-toggle-btn {
      background: var(--export-btn-bg);
      color: var(--export-btn-text);
      border: none;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      box-shadow: 0 2px 12px var(--export-shadow);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: flex-end;
    }

    .export-toggle-btn:hover {
      background: var(--export-btn-bg-hover);
      box-shadow: 0 4px 16px var(--export-shadow-hover);
      transform: scale(1.05);
    }

    .export-toggle-btn:active {
      transform: scale(0.95);
    }

    .export-toggle-btn .icon {
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #export-controls.collapsed .export-toggle-btn .icon {
      transform: rotate(180deg);
    }

    /* Panel container */
    .export-panel {
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      max-height: 300px;
      opacity: 1;
      transform: translateY(0);
    }

    #export-controls.collapsed .export-panel {
      max-height: 0;
      opacity: 0;
      transform: translateY(10px);
      pointer-events: none;
    }

    /* Staggered animation for panel items */
    .export-panel > * {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateX(0);
      opacity: 1;
    }

    #export-controls.collapsed .export-panel > * {
      transform: translateX(20px);
      opacity: 0;
    }

    .export-panel > *:nth-child(1) { transition-delay: 0.05s; }
    .export-panel > *:nth-child(2) { transition-delay: 0.1s; }
    .export-panel > *:nth-child(3) { transition-delay: 0.15s; }
    .export-panel > *:nth-child(4) { transition-delay: 0.2s; }

    #export-controls.collapsed .export-panel > *:nth-child(1) { transition-delay: 0.15s; }
    #export-controls.collapsed .export-panel > *:nth-child(2) { transition-delay: 0.1s; }
    #export-controls.collapsed .export-panel > *:nth-child(3) { transition-delay: 0.05s; }
    #export-controls.collapsed .export-panel > *:nth-child(4) { transition-delay: 0s; }

    @media (max-width: 768px) {
      #export-controls { bottom: 16px; right: 16px; }
      .export-btn { padding: 10px 16px; font-size: 12px; min-width: 140px; }
      .checkbox-wrapper { padding: 8px 12px; font-size: 12px; }
      .language-selector { padding: 6px 10px; }
      .language-selector select { font-size: 12px; }
      .export-toggle-btn { width: 44px; height: 44px; font-size: 18px; }
    }
  `;
}

export default {
  getHTMLStyles,
  getUIStyles,
};
