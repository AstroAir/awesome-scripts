# 🚀 Awesome Scripts

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-green.svg)](https://www.tampermonkey.net/)
[![pnpm](https://img.shields.io/badge/pnpm-8.14.0-orange.svg)](https://pnpm.io/)
[![Webpack](https://img.shields.io/badge/Webpack-5.89.0-blue.svg)](https://webpack.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-≥18.0.0-339933.svg)](https://nodejs.org/)

**[English](./README_EN.md)** | 简体中文

一个实用的油猴脚本合集，包含 GitHub 增强和 Linux.do 论坛工具。采用模块化架构设计，使用 pnpm + webpack 进行构建打包。

## ✨ 特性

- 🏗️ **模块化架构** - 核心模块、工具函数、UI 组件分离，代码复用性高
- 📦 **现代化构建** - 基于 Webpack 5 + Babel，支持 ES6+ 语法
- 🧪 **完善测试** - Jest 单元测试 + Playwright E2E 测试
- 🎨 **主题适配** - 自动适配亮色/暗色主题
- 🌐 **国际化支持** - 部分脚本支持多语言界面
- ⌨️ **快捷键支持** - 提供便捷的键盘快捷键操作

## 📦 脚本列表

### GitHub 相关

| 脚本名称 | 版本 | 描述 |
|---------|------|------|
| [GitHub Trending Button Enhanced](./dist/github-trending-button.user.js) | v2.0.0 | 增强版 Trending 按钮，支持语言筛选、收藏夹和快捷访问 |
| [GitHub Fold Files Enhanced](./dist/github-fold-files.user.js) | v1.0.1 | 文件/文件夹折叠功能，支持平滑动画效果 |
| [GitHub Fold About Sidebar](./dist/github-fold-about.user.js) | v1.0.0 | 折叠/展开 GitHub 仓库侧边栏的 About 区域 |
| [GitHub 增强工具栏](./dist/github-enhanced-toolbar.user.js) | v2.1.1 | 在 GitHub 顶部显示 Github.dev、DeepWiki 和 ZreadAi 按钮 |

### Linux.do 论坛相关

| 脚本名称 | 版本 | 描述 |
|---------|------|------|
| [Linux.do 自动标记已读](./dist/linuxdo-autoreader.user.js) | v4.0 | 自动将论坛帖子及回复标记为已读，真实行为模拟 |
| [Linux.do 帖子导出器](./dist/linuxdo-post-export.user.js) | v2.1.0 | 导出论坛帖子为 JSON 或 HTML 格式，支持多语言 |

## 🏗️ 项目架构

```text
awesome-scripts/
├── src/                          # 源代码目录
│   ├── core/                     # 核心模块
│   │   ├── storage.js            # 存储管理（localStorage/GM_setValue）
│   │   ├── observer.js           # DOM 观察器
│   │   ├── styles.js             # 样式注入
│   │   └── index.js              # 核心模块导出
│   ├── utils/                    # 工具函数
│   │   ├── dom.js                # DOM 操作工具
│   │   ├── animation.js          # 动画工具
│   │   └── index.js              # 工具模块导出
│   ├── components/               # 公共 UI 组件
│   │   ├── icons.js              # SVG 图标
│   │   ├── button.js             # 按钮组件
│   │   ├── dropdown.js           # 下拉菜单组件
│   │   ├── fold-button.js        # 折叠按钮组件
│   │   ├── draggable-panel.js    # 可拖动面板组件
│   │   ├── progress-toast.js     # 进度提示组件
│   │   └── index.js              # 组件模块导出
│   └── scripts/                  # 脚本目录
│       ├── github-fold-about/    # GitHub Fold About 脚本
│       │   ├── styles.js         # 样式
│       │   ├── state.js          # 状态管理
│       │   ├── components.js     # 组件
│       │   ├── animation.js      # 动画
│       │   └── index.js          # 入口
│       ├── github-fold-files/    # GitHub Fold Files 脚本
│       │   ├── styles.js
│       │   ├── config.js
│       │   ├── state.js
│       │   ├── components.js
│       │   ├── animation.js
│       │   └── index.js
│       ├── github-trending-button/ # GitHub Trending Button 脚本
│       │   ├── config.js         # 配置
│       │   ├── storage.js        # 存储
│       │   ├── styles.js         # 样式
│       │   ├── dropdown.js       # 下拉菜单
│       │   ├── keyboard.js       # 键盘快捷键
│       │   ├── menu.js           # 菜单命令
│       │   ├── components/       # 子组件目录
│       │   │   ├── icons.js          # 图标
│       │   │   ├── search-box.js     # 搜索框
│       │   │   ├── category-tabs.js  # 分类标签
│       │   │   ├── period-selector.js # 时间选择器
│       │   │   ├── language-list.js  # 语言列表
│       │   │   ├── favorites-section.js # 收藏区域
│       │   │   ├── recent-section.js # 最近访问
│       │   │   ├── settings-dialog.js # 设置对话框
│       │   │   └── index.js
│       │   └── index.js
│       ├── github-enhanced-toolbar/ # GitHub 增强工具栏脚本
│       │   ├── config.js         # 按钮配置
│       │   ├── styles.js         # 样式
│       │   ├── utils.js          # 工具函数
│       │   ├── components.js     # 按钮组件
│       │   ├── observer.js       # 观察者
│       │   └── index.js
│       ├── linuxdo-autoreader/   # Linux.do 自动标记已读脚本
│       │   ├── config.js         # 配置和模式预设
│       │   ├── state.js          # 状态管理
│       │   ├── utils.js          # 工具函数
│       │   ├── storage.js        # 存储管理
│       │   ├── api.js            # API 请求
│       │   ├── logger.js         # 日志系统
│       │   ├── behavior.js       # 行为模拟
│       │   ├── core.js           # 核心控制器
│       │   ├── styles.js         # 样式
│       │   ├── ui.js             # UI 系统
│       │   └── index.js
│       └── linuxdo-post-export/  # Linux.do 帖子导出脚本
│           ├── i18n.js           # 国际化
│           ├── extractor.js      # 数据提取
│           ├── generator.js      # 文件生成
│           ├── styles.js         # 样式
│           ├── ui.js             # UI 组件
│           └── index.js
├── tests/                        # 单元测试目录
├── e2e/                          # E2E 测试目录
├── dist/                         # 构建输出目录
├── package.json                  # 项目配置
├── webpack.config.js             # Webpack 配置
├── babel.config.json             # Babel 配置
├── jest.config.js                # Jest 测试配置
├── playwright.config.js          # Playwright 配置
└── .eslintrc.json                # ESLint 配置
```

## 🔧 开发指南

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 安装 pnpm（如果未安装）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 开发命令

```bash
# 开发模式（监听文件变化）
pnpm dev

# 生产构建
pnpm build

# 开发构建（不压缩）
pnpm build:dev

# 代码检查
pnpm lint

# 代码检查并修复
pnpm lint:fix

# 清理构建目录
pnpm clean

# 单元测试
pnpm test

# 单元测试（监听模式）
pnpm test:watch

# 单元测试（覆盖率报告）
pnpm test:coverage

# E2E 测试
pnpm test:e2e

# E2E 测试（UI 模式）
pnpm test:e2e:ui

# E2E 测试（有头模式）
pnpm test:e2e:headed
```

### 添加新脚本

1. 在 `src/scripts/` 下创建新目录
2. 创建必要的模块文件（index.js、styles.js 等）
3. 在 `webpack.config.js` 的 `scriptsMetadata` 中添加配置
4. 运行 `pnpm build` 构建

## 📥 安装方法

### 方法一：直接安装（推荐）

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)
2. 点击 `dist/` 目录下的 `.user.js` 文件
3. 点击 "Raw" 按钮
4. 确认安装

### 方法二：从源码构建

```bash
# 克隆仓库
git clone https://github.com/AstroAir/awesome-scripts.git
cd awesome-scripts

# 安装依赖并构建
pnpm install
pnpm build

# 构建完成后，脚本位于 dist/ 目录
```

### 方法三：开发模式

```bash
# 启动开发模式
pnpm dev

# 在 Tampermonkey 中安装 dist/*.proxy.user.js
# 该代理脚本会自动加载本地构建的脚本
```

## 📖 使用说明

### GitHub Trending Button Enhanced

在 GitHub 导航栏添加增强版 Trending 按钮。

**功能特性：**

- 🔥 在导航栏显示 Trending 快捷按钮
- 🗂️ 按编程语言分类筛选（Web、Mobile、Systems、General）
- ⭐ 收藏常用语言，快速访问
- 🕐 支持 Today/This Week/This Month 时间段切换
- 🔍 搜索框快速查找语言
- 📜 最近访问记录
- ⚙️ 可配置默认语言、时间段、新标签页打开等

**快捷键：**

| 快捷键 | 功能 |
|--------|------|
| `Alt+T` | 直接打开 Trending 页面 |
| `Alt+Shift+T` | 打开/关闭下拉菜单 |

---

### GitHub Fold Files Enhanced

在仓库文件列表页面提供文件夹折叠功能。

**功能特性：**

- 📁 点击文件夹图标旁的箭头即可折叠
- 🔄 支持全部折叠/展开按钮
- 💾 折叠状态自动保存，刷新后保持
- 👁️ 鼠标悬停显示折叠内容预览
- ✨ 平滑的展开/折叠动画效果

---

### GitHub Fold About Sidebar

折叠/展开 GitHub 仓库侧边栏的 About 区域。

**功能特性：**

- 🔽 点击 About 标题旁的箭头即可折叠
- 💾 折叠状态按仓库自动保存
- ✨ 支持平滑动画效果
- 🎨 完美融入 GitHub 原生界面风格

---

### GitHub 增强工具栏

在 GitHub 仓库页面顶部添加快捷工具按钮。

**功能特性：**

- 🔗 一键跳转 Github.dev（在线编辑器）
- 📚 一键跳转 DeepWiki（AI 文档）
- 🤖 一键跳转 ZreadAi（AI 代码阅读）
- 🌓 自动适配亮色/暗色主题
- 📱 响应式设计，窄屏自动切换图标模式

---

### Linux.do 自动标记已读

自动将 Linux.do 论坛的帖子及回复标记为已读。

**运行模式：**

| 模式 | 说明 |
|------|------|
| ⚡ 极速模式 | 最快速度，仅标记主帖 |
| 🚀 快速模式 | 较快速度，标记部分回复 |
| 📖 标准模式 | 平衡速度与安全 |
| 🧑 仿真模式 | 模拟真实用户行为 |
| 🥷 隐身模式 | 最大程度模拟真人 |
| ⚙️ 自定义 | 完全自定义所有参数 |

**功能特性：**

- 🎭 真实用户行为模拟，降低检测风险
- ⚙️ 可配置并发数、回复数、批次大小等参数
- 🖱️ 可拖动的浮动控制面板
- 🌓 支持亮色/暗色主题切换
- 📊 实时显示处理进度和统计信息
- 🔔 可选声音和通知提醒

**快捷键：**

| 快捷键 | 功能 |
|--------|------|
| `Alt+S` | 开始/停止 |
| `Alt+P` | 暂停/恢复 |

---

### Linux.do 帖子导出器

导出 Linux.do 论坛帖子为多种格式。

**功能特性：**

- 📄 支持导出为 JSON 格式（结构化数据）
- 🌐 支持导出为 HTML 格式（美观排版）
- 🖼️ 可选嵌入图片为 Base64
- 🌍 支持 9 种语言界面：
  - 简体中文、繁體中文、English、日本語
  - 한국어、Español、Français、Deutsch、Русский
- 📱 HTML 导出支持响应式布局和打印优化

## 📚 文档

详细文档请查看 [docs 目录](./docs/README.md)：

- [快速开始](./docs/getting-started.md) - 安装和基本使用
- [GitHub 脚本](./docs/scripts/github.md) - GitHub 相关脚本详细说明
- [Linux.do 脚本](./docs/scripts/linuxdo.md) - Linux.do 论坛脚本详细说明
- [架构设计](./docs/architecture.md) - 项目架构和设计理念
- [开发新脚本](./docs/development.md) - 如何开发新脚本
- [API 参考](./docs/api/core.md) - 核心模块 API 文档
- [常见问题](./docs/faq.md) - FAQ
- [更新日志](./docs/changelog.md) - 版本更新记录

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

详见 [贡献指南](./CONTRIBUTING.md)

### 开发规范

- 使用 ES6+ 语法
- 遵循 ESLint 配置
- 新功能需添加对应的模块文件
- 保持代码风格一致

## 📄 许可证

本项目基于 [MIT License](./LICENSE) 开源。

## 🙏 鸣谢

感谢所有贡献者和用户的支持！

---

⭐ 如果这些脚本对你有帮助，请给个 Star 支持一下！
