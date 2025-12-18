# 🚀 快速开始

本指南将帮助你快速安装和使用 Awesome Scripts 油猴脚本。

## 📋 前置要求

### 浏览器扩展

你需要安装以下任一用户脚本管理器：

| 扩展名称 | 支持浏览器 | 推荐度 |
|---------|-----------|--------|
| [Tampermonkey](https://www.tampermonkey.net/) | Chrome, Firefox, Edge, Safari, Opera | ⭐⭐⭐⭐⭐ |
| [Violentmonkey](https://violentmonkey.github.io/) | Chrome, Firefox, Edge, Opera | ⭐⭐⭐⭐ |
| [Greasemonkey](https://www.greasespot.net/) | Firefox | ⭐⭐⭐ |

> **推荐使用 Tampermonkey**，兼容性最好，功能最完善。

## 📥 安装脚本

### 方法一：一键安装（推荐）

1. 确保已安装用户脚本管理器
2. 访问 [dist 目录](https://github.com/AstroAir/awesome-scripts/tree/main/dist)
3. 点击想要安装的 `.user.js` 文件
4. 点击 **Raw** 按钮
5. 在弹出的安装页面点击 **安装**

### 方法二：从源码构建

```bash
# 克隆仓库
git clone https://github.com/AstroAir/awesome-scripts.git
cd awesome-scripts

# 安装依赖
pnpm install

# 构建脚本
pnpm build

# 构建完成后，脚本位于 dist/ 目录
```

### 方法三：开发模式

适合需要修改或调试脚本的用户：

```bash
# 启动开发模式（监听文件变化自动重新构建）
pnpm dev

# 在 Tampermonkey 中安装 dist/*.proxy.user.js
# 代理脚本会自动加载本地构建的脚本
```

## ✅ 验证安装

安装成功后：

1. **GitHub 脚本**：访问 [GitHub](https://github.com)，检查页面是否显示新增的按钮或功能
2. **Linux.do 脚本**：访问 [Linux.do](https://linux.do)，检查是否显示脚本界面

## 🔧 基本配置

大多数脚本支持通过油猴菜单进行配置：

1. 点击浏览器工具栏的 Tampermonkey 图标
2. 找到对应脚本
3. 点击脚本名称旁的菜单选项进行配置

## 📚 下一步

- [GitHub 脚本详细说明](./scripts/github.md)
- [Linux.do 脚本详细说明](./scripts/linuxdo.md)
- [常见问题](./faq.md)
