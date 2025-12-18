# 🛠️ 开发新脚本

本指南将帮助你在 Awesome Scripts 项目中开发新的用户脚本。

## 快速开始

### 1. 创建脚本目录

在 `src/scripts/` 下创建新目录：

```bash
mkdir src/scripts/my-new-script
```

### 2. 创建基本文件结构

```text
src/scripts/my-new-script/
├── index.js        # 入口文件（必需）
├── config.js       # 配置常量
├── styles.js       # CSS 样式
├── state.js        # 状态管理
├── components.js   # UI 组件
└── utils.js        # 工具函数
```

### 3. 编写入口文件

```javascript
// src/scripts/my-new-script/index.js
import { Observer, Styles } from '@core';
import { CONFIG } from './config';
import { styles } from './styles';
import { initUI } from './components';

// 注入样式
Styles.inject(styles);

// 初始化观察器
const observer = new Observer();

// 主函数
async function main() {
  // 等待目标元素
  const container = await observer.waitFor(CONFIG.SELECTORS.CONTAINER);
  
  // 初始化 UI
  initUI(container);
  
  console.log(`${CONFIG.SCRIPT_NAME} v${CONFIG.VERSION} 已加载`);
}

// 启动
main();
```

### 4. 添加 Webpack 配置

在 `webpack.config.js` 的 `scriptsMetadata` 中添加：

```javascript
'my-new-script': {
  name: 'My New Script',
  version: '1.0.0',
  description: '脚本描述',
  icon: 'https://example.com/icon.png',
  author: 'Your Name',
  namespace: 'http://tampermonkey.net/',
  license: 'MIT',
  match: ['https://example.com/*'],
  grant: ['GM_addStyle', 'GM_setValue', 'GM_getValue'],
  runAt: 'document-end',
},
```

### 5. 构建测试

```bash
pnpm build
```

## 详细指南

### 配置文件 (config.js)

```javascript
// src/scripts/my-new-script/config.js

export const CONFIG = {
  // 脚本信息
  SCRIPT_NAME: 'My New Script',
  VERSION: '1.0.0',
  STORAGE_KEY: 'my-new-script',
  
  // CSS 选择器
  SELECTORS: {
    CONTAINER: '.main-container',
    TARGET: '.target-element',
    BUTTON: '.action-button',
  },
  
  // 默认设置
  DEFAULTS: {
    enabled: true,
    theme: 'auto',
    showNotifications: true,
  },
  
  // 其他常量
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
};
```

### 样式文件 (styles.js)

```javascript
// src/scripts/my-new-script/styles.js

export const styles = `
  /* 容器样式 */
  .my-script-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  /* 按钮样式 */
  .my-script-button {
    padding: 6px 12px;
    border: 1px solid var(--color-border-default, #d0d7de);
    border-radius: 6px;
    background: var(--color-btn-bg, #f6f8fa);
    color: var(--color-fg-default, #24292f);
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .my-script-button:hover {
    background: var(--color-btn-hover-bg, #f3f4f6);
  }
  
  /* 暗色主题适配 */
  @media (prefers-color-scheme: dark) {
    .my-script-button {
      border-color: #30363d;
      background: #21262d;
      color: #c9d1d9;
    }
    
    .my-script-button:hover {
      background: #30363d;
    }
  }
`;
```

### 状态管理 (state.js)

```javascript
// src/scripts/my-new-script/state.js

import { Storage } from '@core';
import { CONFIG } from './config';

const storage = new Storage(CONFIG.STORAGE_KEY);

// 初始状态
let state = {
  ...CONFIG.DEFAULTS,
  isLoading: false,
  data: null,
};

// 状态监听器
const listeners = new Set();

// 获取状态
export function getState() {
  return { ...state };
}

// 更新状态
export function setState(updates) {
  state = { ...state, ...updates };
  listeners.forEach(fn => fn(state));
}

// 订阅状态变化
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// 持久化设置
export async function saveSettings() {
  const { enabled, theme, showNotifications } = state;
  await storage.set('settings', { enabled, theme, showNotifications });
}

// 加载设置
export async function loadSettings() {
  const settings = await storage.get('settings', CONFIG.DEFAULTS);
  setState(settings);
}
```

### UI 组件 (components.js)

```javascript
// src/scripts/my-new-script/components.js

import { Button, Dropdown, Icons } from '@components';
import { createElement } from '@utils/dom';
import { getState, setState, subscribe } from './state';

export function initUI(container) {
  // 创建主按钮
  const mainButton = Button.create({
    text: '功能按钮',
    icon: Icons.star,
    onClick: handleClick,
  });
  
  // 创建下拉菜单
  const dropdown = Dropdown.create({
    trigger: mainButton,
    items: [
      { label: '选项 1', onClick: () => handleOption(1) },
      { label: '选项 2', onClick: () => handleOption(2) },
      { type: 'separator' },
      { label: '设置', icon: Icons.settings, onClick: openSettings },
    ],
  });
  
  // 插入到页面
  const wrapper = createElement('div', { className: 'my-script-container' });
  wrapper.appendChild(mainButton);
  container.appendChild(wrapper);
  
  // 订阅状态变化
  subscribe((state) => {
    mainButton.disabled = !state.enabled;
  });
}

function handleClick() {
  console.log('Button clicked');
}

function handleOption(option) {
  console.log('Option selected:', option);
}

function openSettings() {
  // 打开设置对话框
}
```

## 使用核心模块

### 存储数据

```javascript
import { Storage } from '@core';

const storage = new Storage('my-script');

// 保存数据
await storage.set('favorites', ['item1', 'item2']);

// 读取数据
const favorites = await storage.get('favorites', []);

// 删除数据
await storage.remove('favorites');
```

### 观察 DOM 变化

```javascript
import { Observer } from '@core';

const observer = new Observer();

// 等待元素出现
const element = await observer.waitFor('.target', 5000);

// 观察新元素
observer.watch('.dynamic-item', (items) => {
  items.forEach(item => processItem(item));
});

// 页面卸载时清理
window.addEventListener('unload', () => {
  observer.disconnect();
});
```

### 注入样式

```javascript
import { Styles } from '@core';

// 注入样式
Styles.inject(myStyles, 'my-script-styles');

// 更新样式
Styles.update('my-script-styles', newStyles);

// 移除样式
Styles.remove('my-script-styles');
```

## 使用公共组件

```javascript
import { 
  Button, 
  Dropdown, 
  FoldButton,
  DraggablePanel,
  ProgressToast,
  Icons 
} from '@components';

// 创建按钮
const btn = Button.create({
  text: '操作',
  icon: Icons.check,
  variant: 'primary',
  onClick: handleAction
});

// 创建可拖动面板
const panel = DraggablePanel.create({
  title: '控制面板',
  content: myContent,
  minimizable: true,
  storageKey: 'my-panel-pos'
});

// 显示进度提示
const toast = ProgressToast.show({
  message: '处理中...',
  progress: 0
});
```

## 测试

### 编写单元测试

```javascript
// tests/scripts/my-new-script/state.test.js

import { getState, setState, loadSettings } from '@scripts/my-new-script/state';

describe('State Management', () => {
  beforeEach(() => {
    // 重置状态
  });
  
  test('should update state', () => {
    setState({ enabled: false });
    expect(getState().enabled).toBe(false);
  });
  
  test('should load saved settings', async () => {
    await loadSettings();
    expect(getState()).toMatchObject({
      enabled: true,
      theme: 'auto'
    });
  });
});
```

### 编写 E2E 测试

```javascript
// e2e/my-new-script.spec.js

import { test, expect } from '@playwright/test';

test.describe('My New Script', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://example.com');
  });
  
  test('should show button', async ({ page }) => {
    await expect(page.locator('.my-script-button')).toBeVisible();
  });
  
  test('should handle click', async ({ page }) => {
    await page.click('.my-script-button');
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

## 最佳实践

### 1. 遵循模块化原则

- 每个文件职责单一
- 通过导入导出共享功能
- 避免全局变量

### 2. 使用公共模块

- 优先使用 `@core`、`@utils`、`@components`
- 避免重复造轮子
- 贡献通用功能到公共模块

### 3. 适配主题

- 使用 CSS 变量适配亮暗色主题
- 测试两种主题下的显示效果
- 参考目标网站的设计风格

### 4. 性能优化

- 使用防抖/节流处理频繁事件
- 及时清理事件监听器和观察器
- 避免不必要的 DOM 操作

### 5. 错误处理

- 使用 try-catch 捕获异常
- 提供友好的错误提示
- 记录错误日志便于调试

## 发布清单

发布新脚本前，请确认：

- [ ] 功能测试通过
- [ ] 单元测试覆盖核心逻辑
- [ ] E2E 测试覆盖主要流程
- [ ] ESLint 检查通过
- [ ] 生产构建成功
- [ ] 更新 README.md 脚本列表
- [ ] 添加使用文档
