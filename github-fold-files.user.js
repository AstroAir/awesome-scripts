// ==UserScript==
// @name         Github Fold Files Enhanced
// @version      1.0.1
// @description  Enhanced file/folder collapsing for GitHub with smooth animations
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @author       You
// @namespace    http://tampermonkey.net/
// @license      MIT
// @match        https://github.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  "use strict";

  // 配置选项
  const CONFIG = {
    animationDuration: 200, // 动画持续时间(ms)
    rememberState: true, // 记住折叠状态
    collapseAll: true, // 启用全部折叠/展开按钮
    hoverPreview: true, // 鼠标悬停预览
  };

  // 状态管理
  const state = {
    collapsed: new Set(),
    init() {
      if (CONFIG.rememberState) {
        const saved = localStorage.getItem("github-fold-state");
        if (saved) {
          this.collapsed = new Set(JSON.parse(saved));
        }
      }
    },
    save() {
      if (CONFIG.rememberState) {
        localStorage.setItem(
          "github-fold-state",
          JSON.stringify([...this.collapsed])
        );
      }
    },
    toggle(key) {
      if (this.collapsed.has(key)) {
        this.collapsed.delete(key);
      } else {
        this.collapsed.add(key);
      }
      this.save();
    },
    isCollapsed(key) {
      return this.collapsed.has(key);
    },
  };

  state.init();

  // 添加全局折叠/展开按钮
  function addGlobalToggle() {
    if (!CONFIG.collapseAll) return;

    const actionsBar = document.querySelector("div[data-hpc] .Box-sc-g0xbh4-0");
    if (!actionsBar || actionsBar.querySelector(".x-global-toggle")) return;

    const container = document.createElement("div");
    container.className = "x-global-toggle";
    container.innerHTML = `
            <button class="x-global-btn types__StyledButton-sc-ws60qy-0" title="折叠所有文件夹">
                <svg class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                    <path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H13a1 1 0 0 1 1 1v.5H2.75a.75.75 0 0 0 0 1.5h11.978a1 1 0 0 1 .994 1.117L15 13.25A1.75 1.75 0 0 1 13.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.184-.909.513-1.237Z"></path>
                </svg>
                <span class="x-global-text">全部折叠</span>
            </button>
        `;

    const btn = container.querySelector("button");
    let allCollapsed = false;

    btn.addEventListener("click", () => {
      const buttons = document.querySelectorAll(".x-fold-button");
      allCollapsed = !allCollapsed;

      buttons.forEach((button) => {
        const tbody = button.closest("tbody");
        const isCurrentlyCollapsed = tbody.classList.contains("x-folded");

        if (allCollapsed && !isCurrentlyCollapsed) {
          button.click();
        } else if (!allCollapsed && isCurrentlyCollapsed) {
          button.click();
        }
      });

      btn.querySelector(".x-global-text").textContent = allCollapsed
        ? "全部展开"
        : "全部折叠";
    });

    actionsBar.prepend(container);
  }

  // 创建折叠按钮
  function createFoldButton(element) {
    const tbody = element.closest("tbody");
    if (!tbody || tbody.querySelector(".x-fold-button")) return;

    // 获取文件夹路径作为唯一标识
    const pathElement = tbody.querySelector("a[data-pjax]");
    const folderPath = pathElement ? pathElement.getAttribute("href") : "";

    const div = document.createElement("div");
    div.className = "x-button-container";
    div.innerHTML = `
            <button class="x-fold-button Button--iconOnly Button--invisible"
                    aria-label="折叠/展开文件夹"
                    title="点击折叠/展开文件夹">
                <svg class="x-chevron" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                    <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>
                </svg>
            </button>
        `;

    const button = div.querySelector("button");

    // 恢复之前的状态
    if (state.isCollapsed(folderPath)) {
      tbody.classList.add("x-folded");
      button.classList.add("x-collapsed");
    }

    // 添加点击事件
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFold(tbody, button, folderPath);
    });

    // 悬停预览
    if (CONFIG.hoverPreview) {
      let hoverTimeout;
      button.addEventListener("mouseenter", () => {
        if (tbody.classList.contains("x-folded")) {
          hoverTimeout = setTimeout(() => {
            tbody.classList.add("x-hover-preview");
          }, 500);
        }
      });

      button.addEventListener("mouseleave", () => {
        clearTimeout(hoverTimeout);
        tbody.classList.remove("x-hover-preview");
      });
    }

    element.appendChild(div);
  }

  // 切换折叠状态（修复抖动问题）
  function toggleFold(tbody, button, folderPath) {
    const rows = Array.from(tbody.querySelectorAll("tr:not(:first-child)"));
    const isCollapsed = tbody.classList.contains("x-folded");

    // 防止重复动画
    if (tbody.dataset.animating === "true") return;
    tbody.dataset.animating = "true";

    if (isCollapsed) {
      // 展开动画
      button.classList.remove("x-collapsed");

      // 先显示元素但保持透明
      rows.forEach((row) => {
        row.style.display = "table-row";
        row.style.opacity = "0";
        row.style.transform = "translateY(-8px)";
      });

      // 强制重排
      tbody.offsetHeight;

      // 移除折叠类
      tbody.classList.remove("x-folded");

      // 错开动画
      rows.forEach((row, index) => {
        setTimeout(() => {
          row.style.transition = `opacity ${CONFIG.animationDuration}ms ease-out, transform ${CONFIG.animationDuration}ms ease-out`;
          row.style.opacity = "1";
          row.style.transform = "translateY(0)";
        }, index * 30);
      });

      // 动画结束后清理
      setTimeout(() => {
        rows.forEach((row) => {
          row.style.transition = "";
          row.style.opacity = "";
          row.style.transform = "";
          row.style.display = "";
        });
        tbody.dataset.animating = "false";
      }, CONFIG.animationDuration + rows.length * 30);
    } else {
      // 折叠动画
      button.classList.add("x-collapsed");

      // 添加过渡效果
      rows.forEach((row, index) => {
        row.style.transition = `opacity ${CONFIG.animationDuration}ms ease-out, transform ${CONFIG.animationDuration}ms ease-out`;
        setTimeout(() => {
          row.style.opacity = "0";
          row.style.transform = "translateY(-8px)";
        }, index * 20);
      });

      // 动画结束后隐藏
      setTimeout(() => {
        tbody.classList.add("x-folded");
        rows.forEach((row) => {
          row.style.transition = "";
          row.style.opacity = "";
          row.style.transform = "";
        });
        tbody.dataset.animating = "false";
      }, CONFIG.animationDuration + rows.length * 20);
    }

    state.toggle(folderPath);
  }

  // 监听元素
  waitForElement(
    'tr[class*="DirectoryContent"] td > div[class*="LatestCommit"]',
    (element) => {
      createFoldButton(element);
      addGlobalToggle();
    }
  );

  // 添加样式
  GM_addStyle(`
        /* 折叠状态 */
        .x-folded > tr:not(:first-child) {
            display: none !important;
        }

        /* 悬停预览 */
        .x-hover-preview > tr:not(:first-child) {
            display: table-row !important;
            opacity: 0.6 !important;
            pointer-events: none;
        }

        /* 按钮容器 */
        .x-button-container {
            display: inline-flex;
            margin-left: auto;
        }

        /* 折叠按钮 */
        .x-fold-button {
            width: 2em;
            height: 2em;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            border: none;
            background: transparent;
            cursor: pointer;
            transition: all 0.2s ease;
            color: var(--fgColor-muted, #656d76);
        }

        .x-fold-button:hover {
            background-color: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
            color: var(--fgColor-default, #1f2328);
        }

        .x-fold-button:active {
            transform: scale(0.95);
        }

        /* 图标旋转动画 */
        .x-chevron {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .x-collapsed .x-chevron {
            transform: rotate(-90deg);
        }

        /* 确保按钮在右侧 */
        div:has(+ .x-button-container) {
            margin-left: auto;
        }

        /* 全局按钮样式 */
        .x-global-toggle {
            display: inline-flex;
            margin-right: 8px;
        }

        .x-global-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 12px;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            border-radius: 6px;
            border: 1px solid var(--borderColor-default, rgba(27, 31, 36, 0.15));
            background-color: var(--button-default-bgColor-rest, #f6f8fa);
            color: var(--fgColor-default, #24292f);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .x-global-btn:hover {
            background-color: var(--button-default-bgColor-hover, #f3f4f6);
            border-color: var(--button-default-borderColor-hover, rgba(27, 31, 36, 0.15));
        }

        .x-global-btn:active {
            background-color: var(--button-default-bgColor-active, hsla(220, 14%, 93%, 1));
        }

        .x-global-btn svg {
            flex-shrink: 0;
        }

        /* 行动画优化 - 移除可能导致抖动的样式 */
        tbody[data-animating="true"] tr {
            will-change: opacity, transform;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .x-global-text {
                display: none;
            }
            .x-global-btn {
                padding: 5px 8px;
            }
        }

        /* 性能优化 */
        .x-fold-button,
        .x-chevron {
            will-change: transform;
        }
    `);

  // 工具函数
  function waitForElement(selector, callback, startNode = document) {
    const uid = "_" + Math.random().toString().slice(2);

    startNode
      .querySelectorAll(`:is(${selector}):not([${uid}])`)
      .forEach((child) => {
        child.setAttribute(uid, "");
        callback(child);
      });

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            if (node.matches(selector)) {
              node.setAttribute(uid, "");
              callback(node);
            } else {
              node
                .querySelectorAll(`:is(${selector}):not([${uid}])`)
                .forEach((child) => {
                  child.setAttribute(uid, "");
                  callback(child);
                });
            }
          }
        }
      }
    });

    observer.observe(startNode, {
      childList: true,
      subtree: true,
    });
  }
})();
