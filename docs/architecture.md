# 🏗️ 架构设计

本文档介绍 Awesome Scripts 项目的架构设计和核心理念。

## 设计原则

### 1. 模块化设计

项目采用高度模块化的设计，每个功能都被拆分为独立的模块：

- **核心模块** (`src/core/`)：提供通用的基础功能
- **工具模块** (`src/utils/`)：提供可复用的工具函数
- **组件模块** (`src/components/`)：提供可复用的 UI 组件
- **脚本模块** (`src/scripts/`)：各个独立的用户脚本

### 2. 关注点分离

每个脚本都遵循关注点分离原则：

```text
script/
├── index.js        # 入口：初始化和协调
├── config.js       # 配置：常量和默认值
├── state.js        # 状态：状态管理
├── styles.js       # 样式：CSS 样式定义
├── components.js   # 组件：UI 组件
├── utils.js        # 工具：脚本专用工具函数
└── ...             # 其他特定模块
```

### 3. 可复用性

公共功能被提取到共享模块中，避免代码重复：

- 存储管理、DOM 观察器、样式注入等核心功能
- 按钮、下拉菜单、可拖动面板等 UI 组件
- DOM 操作、动画等工具函数

## 目录结构

```text
awesome-scripts/
├── src/                          # 源代码
│   ├── core/                     # 核心模块
│   │   ├── storage.js            # 统一存储 API
│   │   ├── observer.js           # DOM 变化观察
│   │   ├── styles.js             # 样式注入系统
│   │   └── index.js              # 导出入口
│   │
│   ├── utils/                    # 工具函数
│   │   ├── dom.js                # DOM 操作
│   │   ├── animation.js          # 动画工具
│   │   └── index.js              # 导出入口
│   │
│   ├── components/               # 公共组件
│   │   ├── button.js             # 按钮组件
│   │   ├── dropdown.js           # 下拉菜单
│   │   ├── fold-button.js        # 折叠按钮
│   │   ├── draggable-panel.js    # 可拖动面板
│   │   ├── progress-toast.js     # 进度提示
│   │   ├── icons.js              # SVG 图标
│   │   └── index.js              # 导出入口
│   │
│   └── scripts/                  # 用户脚本
│       ├── github-*/             # GitHub 相关脚本
│       └── linuxdo-*/            # Linux.do 相关脚本
│
├── tests/                        # 单元测试
├── e2e/                          # E2E 测试
├── dist/                         # 构建输出
└── docs/                         # 文档
```

## 核心模块详解

### Storage（存储管理）

提供统一的存储 API，自动选择合适的存储后端：

```javascript
import { Storage } from '@core';

// 创建存储实例
const storage = new Storage('my-script');

// 存储数据
await storage.set('key', value);

// 读取数据
const value = await storage.get('key', defaultValue);

// 删除数据
await storage.remove('key');
```

支持的存储后端：

- `GM_setValue/GM_getValue`（油猴 API）
- `localStorage`（浏览器本地存储）

### Observer（DOM 观察器）

提供 DOM 变化观察功能，用于处理动态加载的内容：

```javascript
import { Observer } from '@core';

// 创建观察器
const observer = new Observer();

// 观察 DOM 变化
observer.watch(selector, (elements) => {
  // 处理新出现的元素
});

// 等待元素出现
const element = await observer.waitFor(selector, timeout);

// 停止观察
observer.disconnect();
```

### Styles（样式注入）

提供样式注入功能：

```javascript
import { Styles } from '@core';

// 注入 CSS
Styles.inject(`
  .my-class {
    color: red;
  }
`);

// 注入带 ID 的样式（可更新/删除）
Styles.inject(css, 'my-style-id');

// 删除样式
Styles.remove('my-style-id');
```

## 组件系统

### 组件设计原则

1. **声明式 API**：通过配置对象创建组件
2. **事件驱动**：通过回调函数处理事件
3. **可组合**：组件可以嵌套组合
4. **主题适配**：自动适配亮暗色主题

### 组件示例

```javascript
import { Button, Dropdown, DraggablePanel } from '@components';

// 创建按钮
const button = Button.create({
  text: '点击我',
  icon: '<svg>...</svg>',
  onClick: () => console.log('clicked')
});

// 创建下拉菜单
const dropdown = Dropdown.create({
  trigger: button,
  items: [
    { label: '选项1', onClick: () => {} },
    { label: '选项2', onClick: () => {} }
  ]
});

// 创建可拖动面板
const panel = DraggablePanel.create({
  title: '控制面板',
  content: panelContent,
  position: { x: 100, y: 100 }
});
```

## 构建系统

### Webpack 配置

项目使用 Webpack 构建，主要配置：

- **入口点**：每个脚本有独立入口
- **UserScript 插件**：自动生成元数据头
- **路径别名**：简化导入路径
- **代理脚本**：开发模式支持热重载

### 路径别名

```javascript
import { Storage } from '@core';      // src/core/
import { debounce } from '@utils';    // src/utils/
import { Button } from '@components'; // src/components/
import { config } from '@scripts/my-script/config';
```

### 构建命令

```bash
pnpm build      # 生产构建（压缩）
pnpm build:dev  # 开发构建（不压缩）
pnpm dev        # 开发模式（监听变化）
```

## 测试架构

### 单元测试

使用 Jest 进行单元测试：

```javascript
// tests/core/storage.test.js
describe('Storage', () => {
  it('should store and retrieve values', async () => {
    const storage = new Storage('test');
    await storage.set('key', 'value');
    expect(await storage.get('key')).toBe('value');
  });
});
```

### E2E 测试

使用 Playwright 进行端到端测试：

```javascript
// e2e/github-fold-about.spec.js
test('should fold about section', async ({ page }) => {
  await page.goto('https://github.com/owner/repo');
  await page.click('.fold-button');
  await expect(page.locator('.about-section')).toBeHidden();
});
```

## 扩展指南

### 添加新脚本

1. 在 `src/scripts/` 创建新目录
2. 创建模块文件（index.js, config.js, styles.js 等）
3. 在 `webpack.config.js` 添加元数据配置
4. 编写测试用例
5. 构建并测试

### 添加新组件

1. 在 `src/components/` 创建组件文件
2. 在 `src/components/index.js` 导出组件
3. 编写组件测试
4. 更新组件文档

详见 [开发新脚本](./development.md) 和 [组件 API](./api/components.md)。
