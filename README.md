# 🚀 Awesome Scripts

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-green.svg)](https://www.tampermonkey.net/)
[![pnpm](https://img.shields.io/badge/pnpm-8.14.0-orange.svg)](https://pnpm.io/)
[![Webpack](https://img.shields.io/badge/Webpack-5.89.0-blue.svg)](https://webpack.js.org/)

一个实用的油猴脚本合集，包含 GitHub 增强和 Linux.do 论坛工具。采用模块化架构设计，使用 pnpm + webpack 进行构建打包。

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
│   ├── components/               # UI 组件
│   │   ├── icons.js              # SVG 图标
│   │   ├── button.js             # 按钮组件
│   │   ├── dropdown.js           # 下拉菜单组件
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
│       │   ├── components/       # 子组件
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
│       │   ├── api.js            # API请求
│       │   ├── logger.js         # 日志系统
│       │   ├── behavior.js       # 行为模拟
│       │   ├── core.js           # 核心控制器
│       │   ├── styles.js         # 样式
│       │   ├── ui.js             # UI系统
│       │   └── index.js
│       └── linuxdo-post-export/  # Linux.do 帖子导出脚本
│           ├── i18n.js           # 国际化
│           ├── extractor.js      # 数据提取
│           ├── generator.js      # 文件生成
│           ├── styles.js         # 样式
│           ├── ui.js             # UI组件
│           └── index.js
├── dist/                         # 构建输出目录
├── package.json                  # 项目配置
├── webpack.config.js             # Webpack 配置
├── babel.config.json             # Babel 配置
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

- 在 GitHub 导航栏显示 Trending 按钮
- 支持按编程语言筛选
- 可收藏常用语言
- 快捷键: `Alt+T` 快速打开，`Alt+Shift+T` 打开下拉菜单

### GitHub Fold Files Enhanced

- 在仓库文件列表页面可折叠文件夹
- 支持全部折叠/展开
- 折叠状态会自动保存
- 鼠标悬停可预览折叠内容

### GitHub Fold About Sidebar

- 点击 About 区域旁的箭头即可折叠
- 折叠状态会自动保存
- 支持平滑动画效果

### GitHub 增强工具栏

- 在 GitHub 顶部工具栏添加快捷按钮
- 支持 Github.dev、DeepWiki 和 ZreadAi 快速跳转
- 完美适配亮暗色主题
- 根据按钮数量自动切换图标/文本模式

### Linux.do 自动标记已读

- 多种运行模式：极速、快速、标准、仿真、隐身
- 真实用户行为模拟，降低检测风险
- 可配置并发数、回复数、批次大小等参数
- 支持快捷键操作（Alt+S 开始/停止，Alt+P 暂停/恢复）
- 可拖动的浮动面板，支持主题切换

### Linux.do 帖子导出器

- 支持导出为 JSON 和 HTML 格式
- 可选嵌入图片为 Base64
- 支持多语言界面（中/英/日/韩/西/法/德/俄）
- 美观的 HTML 导出样式，支持响应式和打印

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
