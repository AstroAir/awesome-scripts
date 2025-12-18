# 🚀 Awesome Scripts

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-green.svg)](https://www.tampermonkey.net/)
[![pnpm](https://img.shields.io/badge/pnpm-8.14.0-orange.svg)](https://pnpm.io/)
[![Webpack](https://img.shields.io/badge/Webpack-5.89.0-blue.svg)](https://webpack.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-≥18.0.0-339933.svg)](https://nodejs.org/)

English | **[简体中文](./README.md)**

A collection of practical userscripts for GitHub enhancement and Linux.do forum tools. Built with modular architecture using pnpm + webpack.

## ✨ Features

- 🏗️ **Modular Architecture** - Separated core modules, utilities, and UI components for high code reusability
- 📦 **Modern Build System** - Webpack 5 + Babel with ES6+ syntax support
- 🧪 **Comprehensive Testing** - Jest unit tests + Playwright E2E tests
- 🎨 **Theme Adaptation** - Auto-adapts to light/dark themes
- 🌐 **i18n Support** - Multi-language interface for some scripts
- ⌨️ **Keyboard Shortcuts** - Convenient keyboard shortcuts

## 📦 Script List

### GitHub Related

| Script Name | Version | Description |
|-------------|---------|-------------|
| [GitHub Trending Button Enhanced](./dist/github-trending-button.user.js) | v2.0.0 | Enhanced Trending button with language filter, favorites, and quick access |
| [GitHub Fold Files Enhanced](./dist/github-fold-files.user.js) | v1.0.1 | File/folder collapsing with smooth animations |
| [GitHub Fold About Sidebar](./dist/github-fold-about.user.js) | v1.0.0 | Fold/unfold the About section in GitHub repository sidebar |
| [GitHub Enhanced Toolbar](./dist/github-enhanced-toolbar.user.js) | v2.1.1 | Add Github.dev, DeepWiki, and ZreadAi buttons to GitHub header |

### Linux.do Forum Related

| Script Name | Version | Description |
|-------------|---------|-------------|
| [Linux.do Auto Reader](./dist/linuxdo-autoreader.user.js) | v4.0 | Auto-mark forum posts and replies as read with realistic behavior simulation |
| [Linux.do Post Exporter](./dist/linuxdo-post-export.user.js) | v2.1.0 | Export forum posts to JSON or HTML format with i18n support |

## 🏗️ Project Architecture

```text
awesome-scripts/
├── src/                          # Source code
│   ├── core/                     # Core modules
│   │   ├── storage.js            # Storage management (localStorage/GM_setValue)
│   │   ├── observer.js           # DOM observer
│   │   ├── styles.js             # Style injection
│   │   └── index.js              # Core module exports
│   ├── utils/                    # Utility functions
│   │   ├── dom.js                # DOM utilities
│   │   ├── animation.js          # Animation utilities
│   │   └── index.js              # Utils module exports
│   ├── components/               # Shared UI components
│   │   ├── icons.js              # SVG icons
│   │   ├── button.js             # Button component
│   │   ├── dropdown.js           # Dropdown component
│   │   ├── fold-button.js        # Fold button component
│   │   ├── draggable-panel.js    # Draggable panel component
│   │   ├── progress-toast.js     # Progress toast component
│   │   └── index.js              # Components module exports
│   └── scripts/                  # Script directory
│       ├── github-fold-about/    # GitHub Fold About script
│       ├── github-fold-files/    # GitHub Fold Files script
│       ├── github-trending-button/ # GitHub Trending Button script
│       ├── github-enhanced-toolbar/ # GitHub Enhanced Toolbar script
│       ├── linuxdo-autoreader/   # Linux.do Auto Reader script
│       └── linuxdo-post-export/  # Linux.do Post Exporter script
├── tests/                        # Unit tests
├── e2e/                          # E2E tests
├── dist/                         # Build output
├── package.json                  # Project config
├── webpack.config.js             # Webpack config
├── babel.config.json             # Babel config
├── jest.config.js                # Jest test config
├── playwright.config.js          # Playwright config
└── .eslintrc.json                # ESLint config
```

## 🔧 Development Guide

### Requirements

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Install Dependencies

```bash
# Install pnpm (if not installed)
npm install -g pnpm

# Install project dependencies
pnpm install
```

### Development Commands

```bash
# Development mode (watch files)
pnpm dev

# Production build
pnpm build

# Development build (no minification)
pnpm build:dev

# Lint code
pnpm lint

# Lint and fix
pnpm lint:fix

# Clean build directory
pnpm clean

# Unit tests
pnpm test

# Unit tests (watch mode)
pnpm test:watch

# Unit tests (coverage report)
pnpm test:coverage

# E2E tests
pnpm test:e2e

# E2E tests (UI mode)
pnpm test:e2e:ui

# E2E tests (headed mode)
pnpm test:e2e:headed
```

### Adding New Scripts

1. Create a new directory under `src/scripts/`
2. Create necessary module files (index.js, styles.js, etc.)
3. Add configuration to `scriptsMetadata` in `webpack.config.js`
4. Run `pnpm build` to build

## 📥 Installation

### Method 1: Direct Install (Recommended)

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/)
2. Click on a `.user.js` file in the `dist/` directory
3. Click the "Raw" button
4. Confirm installation

### Method 2: Build from Source

```bash
# Clone repository
git clone https://github.com/AstroAir/awesome-scripts.git
cd awesome-scripts

# Install dependencies and build
pnpm install
pnpm build

# Scripts are located in dist/ directory
```

### Method 3: Development Mode

```bash
# Start development mode
pnpm dev

# Install dist/*.proxy.user.js in Tampermonkey
# The proxy script will automatically load locally built scripts
```

## 📖 Usage

### GitHub Trending Button Enhanced

Adds an enhanced Trending button to the GitHub navigation bar.

**Features:**

- 🔥 Trending quick access button in navigation bar
- 🗂️ Filter by programming language category (Web, Mobile, Systems, General)
- ⭐ Favorite languages for quick access
- 🕐 Time period switching (Today/This Week/This Month)
- 🔍 Search box to find languages quickly
- 📜 Recent access history
- ⚙️ Configurable default language, period, new tab opening, etc.

**Keyboard Shortcuts:**

| Shortcut | Function |
|----------|----------|
| `Alt+T` | Open Trending page directly |
| `Alt+Shift+T` | Toggle dropdown menu |

---

### GitHub Fold Files Enhanced

Provides folder collapsing functionality on repository file list pages.

**Features:**

- 📁 Click the arrow next to folder icons to collapse
- 🔄 Collapse/expand all button support
- 💾 Fold state auto-saved, persists after refresh
- 👁️ Hover preview of collapsed content
- ✨ Smooth expand/collapse animations

---

### GitHub Fold About Sidebar

Fold/unfold the About section in GitHub repository sidebar.

**Features:**

- 🔽 Click the arrow next to About heading to collapse
- 💾 Fold state auto-saved per repository
- ✨ Smooth animation effects
- 🎨 Seamlessly integrates with GitHub's native UI

---

### GitHub Enhanced Toolbar

Adds quick tool buttons to the top of GitHub repository pages.

**Features:**

- 🔗 One-click jump to Github.dev (online editor)
- 📚 One-click jump to DeepWiki (AI documentation)
- 🤖 One-click jump to ZreadAi (AI code reading)
- 🌓 Auto-adapts to light/dark themes
- 📱 Responsive design, auto-switches to icon mode on narrow screens

---

### Linux.do Auto Reader

Automatically marks Linux.do forum posts and replies as read.

**Operating Modes:**

| Mode | Description |
|------|-------------|
| ⚡ Turbo | Fastest speed, marks main posts only |
| 🚀 Fast | Faster speed, marks some replies |
| 📖 Normal | Balance between speed and safety |
| 🧑 Human | Simulates real user behavior |
| 🥷 Stealth | Maximum human-like simulation |
| ⚙️ Custom | Fully customizable parameters |

**Features:**

- 🎭 Realistic user behavior simulation to reduce detection risk
- ⚙️ Configurable concurrency, replies per topic, batch size, etc.
- 🖱️ Draggable floating control panel
- 🌓 Light/dark theme support
- 📊 Real-time progress and statistics display
- 🔔 Optional sound and notification alerts

**Keyboard Shortcuts:**

| Shortcut | Function |
|----------|----------|
| `Alt+S` | Start/Stop |
| `Alt+P` | Pause/Resume |

---

### Linux.do Post Exporter

Export Linux.do forum posts to various formats.

**Features:**

- 📄 Export to JSON format (structured data)
- 🌐 Export to HTML format (beautifully formatted)
- 🖼️ Optional image embedding as Base64
- 🌍 9 language interfaces supported:
  - 简体中文, 繁體中文, English, 日本語
  - 한국어, Español, Français, Deutsch, Русский
- 📱 HTML export with responsive layout and print optimization

## 📚 Documentation

See the [docs directory](./docs/README.md) for detailed documentation:

- [Getting Started](./docs/getting-started.md) - Installation and basic usage
- [GitHub Scripts](./docs/scripts/github.md) - GitHub script details
- [Linux.do Scripts](./docs/scripts/linuxdo.md) - Linux.do forum script details
- [Architecture](./docs/architecture.md) - Project architecture and design
- [Development](./docs/development.md) - How to develop new scripts
- [API Reference](./docs/api/core.md) - Core module API documentation
- [FAQ](./docs/faq.md) - Frequently Asked Questions
- [Changelog](./docs/changelog.md) - Version history

## 🤝 Contributing

Issues and Pull Requests are welcome!

See [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Standards

- Use ES6+ syntax
- Follow ESLint configuration
- Add corresponding module files for new features
- Maintain consistent code style

## 📄 License

This project is open-sourced under the [MIT License](./LICENSE).

## 🙏 Acknowledgments

Thanks to all contributors and users for your support!

---

⭐ If these scripts are helpful, please give us a Star!
