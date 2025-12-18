// ==UserScript==
// @name         GitHub Fold About Sidebar
// @version      1.0.0
// @description  Fold/unfold the About section in GitHub repository sidebar
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @author       You
// @namespace    http://tampermonkey.net/
// @license      MIT
// @match        https://github.com/*/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  // 状态管理
  const foldedState = new Map();

  // 加载状态
  function loadState() {
    try {
      const saved = localStorage.getItem("github-about-fold-states");
      if (saved) {
        const data = JSON.parse(saved);
        Object.entries(data).forEach(([key, value]) => {
          foldedState.set(key, value);
        });
      }
    } catch (e) {
      console.warn("Failed to load About fold state:", e);
    }
  }

  // 保存状态
  function saveState() {
    try {
      const data = Object.fromEntries(foldedState);
      localStorage.setItem("github-about-fold-states", JSON.stringify(data));
    } catch (e) {
      console.warn("Failed to save About fold state:", e);
    }
  }

  loadState();

  // 主处理函数
  function processAboutSection() {
    // 查找 About 标题
    const aboutHeading = Array.from(
      document.querySelectorAll("h2.mb-3.h4")
    ).find((h) => h.textContent.trim() === "About");

    if (!aboutHeading) return;

    // 检查是否已处理
    if (aboutHeading.hasAttribute("data-fold-processed")) return;
    aboutHeading.setAttribute("data-fold-processed", "true");

    // 获取 About 容器
    const aboutContainer = aboutHeading.closest(".BorderGrid-cell");
    if (!aboutContainer) return;

    // 查找可折叠的内容
    const foldableContent = getFoldableContent(aboutContainer, aboutHeading);
    if (foldableContent.length === 0) return;

    // 生成状态键
    const stateKey = `about-${window.location.pathname}`;

    // 创建折叠按钮
    const button = createFoldButton(stateKey, foldableContent);

    // 创建按钮容器并插入到标题旁边
    const buttonWrapper = document.createElement("span");
    buttonWrapper.className = "x-about-fold-wrapper";
    buttonWrapper.appendChild(button);
    aboutHeading.appendChild(buttonWrapper);

    // 恢复之前的折叠状态
    if (foldedState.get(stateKey)) {
      applyFoldState(button, foldableContent, true);
    }
  }

  // 获取可折叠的内容
  function getFoldableContent(container, heading) {
    const elements = [];
    let currentElement = heading.nextElementSibling;

    while (currentElement) {
      // 跳过编辑按钮的 details 元素
      if (!currentElement.matches("details.details-reset")) {
        elements.push(currentElement);
      }
      currentElement = currentElement.nextElementSibling;
    }

    return elements;
  }

  // 创建折叠按钮
  function createFoldButton(stateKey, foldableContent) {
    const button = document.createElement("button");
    button.className = "x-about-fold-button";
    button.setAttribute("type", "button");
    button.setAttribute("aria-label", "Toggle About section");
    button.setAttribute("data-state-key", stateKey);
    button.title = "Toggle About section";

    button.innerHTML = `
            <svg aria-hidden="true" class="x-about-chevron"
                 viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
            </svg>
        `;

    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFold(button, foldableContent, stateKey);
    });

    return button;
  }

  // 切换折叠状态
  function toggleFold(button, foldableContent, stateKey) {
    const isFolded = !button.classList.contains("x-folded");
    applyFoldState(button, foldableContent, isFolded);

    foldedState.set(stateKey, isFolded);
    saveState();
  }

  // 应用折叠状态
  function applyFoldState(button, foldableContent, isFolded) {
    button.classList.toggle("x-folded", isFolded);
    button.setAttribute("aria-expanded", !isFolded);
    button.setAttribute(
      "aria-label",
      isFolded ? "Expand About section" : "Collapse About section"
    );

    if (isFolded) {
      // 折叠动画
      foldableContent.forEach((element, index) => {
        setTimeout(() => {
          element.style.opacity = "0";
          element.style.transform = "translateY(-10px)";
          setTimeout(() => {
            element.style.display = "none";
          }, 200);
        }, index * 30);
      });
    } else {
      // 展开动画
      foldableContent.forEach((element, index) => {
        setTimeout(() => {
          element.style.display = "";
          setTimeout(() => {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
          }, 10);
        }, index * 30);
      });
    }
  }

  // 样式注入
  GM_addStyle(`
        /* About 标题样式调整 */
        h2.mb-3.h4 {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        /* 按钮包装器 */
        .x-about-fold-wrapper {
            display: inline-flex;
            align-items: center;
            margin-left: auto;
        }

        /* 折叠按钮 */
        .x-about-fold-button {
            width: 1.75rem;
            height: 1.75rem;
            padding: 0.25rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            border: none;
            background: transparent;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.3, 0, 0.5, 1);
            color: var(--fgColor-muted, #656d76);
        }

        /* 图标 */
        .x-about-chevron {
            display: block;
            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* 折叠状态 */
        .x-about-fold-button.x-folded .x-about-chevron {
            transform: rotate(-90deg);
        }

        /* 悬停效果 */
        .x-about-fold-button:hover {
            background-color: var(--button-default-bgColor-hover, rgba(175, 184, 193, 0.2));
            color: var(--fgColor-default, #1f2328);
            transform: scale(1.1);
        }

        .x-about-fold-button:active {
            background-color: var(--button-default-bgColor-active, rgba(175, 184, 193, 0.3));
            transform: scale(0.95);
        }

        /* 暗色主题 */
        [data-color-mode="dark"] .x-about-fold-button {
            color: var(--fgColor-muted, #848d97);
        }

        [data-color-mode="dark"] .x-about-fold-button:hover {
            background-color: var(--button-default-bgColor-hover, rgba(110, 118, 129, 0.4));
            color: var(--fgColor-default, #e6edf3);
        }

        [data-color-mode="dark"] .x-about-fold-button:active {
            background-color: var(--button-default-bgColor-active, rgba(110, 118, 129, 0.5));
        }

        /* 亮色主题 */
        [data-color-mode="light"] .x-about-fold-button:hover {
            background-color: var(--button-default-bgColor-hover, rgba(234, 238, 242, 1));
        }

        [data-color-mode="light"] .x-about-fold-button:active {
            background-color: var(--button-default-bgColor-active, rgba(221, 225, 230, 1));
        }

        /* 内容动画 */
        .BorderGrid-cell > *:not(h2):not(details.details-reset) {
            transition: opacity 0.2s ease-out, transform 0.2s ease-out;
        }

        /* 焦点样式 */
        .x-about-fold-button:focus-visible {
            outline: 2px solid var(--focus-outlineColor, #0969da);
            outline-offset: 2px;
            box-shadow: 0 0 0 3px var(--focus-outlineColor-alpha, rgba(9, 105, 218, 0.3));
        }

        /* 高对比度模式 */
        @media (prefers-contrast: high) {
            .x-about-fold-button {
                border: 1px solid currentColor;
            }
        }

        /* 减少动画 */
        @media (prefers-reduced-motion: reduce) {
            .x-about-fold-button,
            .x-about-chevron,
            .BorderGrid-cell > * {
                transition: none !important;
            }
        }

        /* 移动端优化 */
        @media (max-width: 768px) {
            .x-about-fold-button {
                width: 2rem;
                height: 2rem;
                padding: 0.375rem;
            }
        }

        /* 确保按钮不影响标题的点击区域 */
        .x-about-fold-wrapper {
            pointer-events: auto;
        }

        /* 防止标题换行 */
        h2.mb-3.h4 {
            flex-wrap: nowrap;
            gap: 0.5rem;
        }
    `);

  // 初始化
  function init() {
    processAboutSection();
  }

  // 监听 DOM 变化
  function observeChanges() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          // 延迟处理以确保 DOM 完全加载
          setTimeout(processAboutSection, 100);
          break;
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return observer;
  }

  // 页面加载完成后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      init();
      observeChanges();
    });
  } else {
    init();
    observeChanges();
  }

  // 监听 URL 变化（GitHub 使用 PJAX）
  let lastUrl = location.href;
  const urlObserver = new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      // URL 变化时重新初始化
      setTimeout(() => {
        init();
      }, 500);
    }
  });

  // 监听 title 变化来检测页面切换
  const titleElement = document.querySelector("title");
  if (titleElement) {
    urlObserver.observe(titleElement, {
      childList: true,
      subtree: true,
    });
  }
})();
