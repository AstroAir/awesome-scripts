// ==UserScript==
// @name         GitHub 增强工具栏
// @namespace    https://github.com/txy-sky
// @icon         https://github.com/favicons/favicon.svg
// @version      2.1.1
// @description  在 Github 网站顶部显示 Github.dev、DeepWiki 和 ZreadAi 按钮，完美支持亮暗色主题自动适配
// @author       Txy-Sky
// @match        https://github.com/*
// @run-at       document-end
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // ===== 配置 =====
    const CONFIG = {
        BUTTON_THRESHOLD: 3,
        DEBOUNCE_DELAY: 300,
        INIT_DELAY: 100,
        URL_CHANGE_DELAY: 500,
        OBSERVER_TIMEOUT: 10000,
    };

    // ===== 主题检测 =====
    function getCurrentTheme() {
        const htmlElement = document.documentElement;
        const colorMode = htmlElement.getAttribute('data-color-mode');
        return colorMode || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    // ===== 样式定义 =====
    const STYLES = `
        /* 自定义按钮基础样式 - 与 GitHub 原生按钮保持一致 */
        .custom-github-button {
            margin: 0 4px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 28px;  /* 修改：匹配 GitHub 原生按钮高度 */
            padding: 5px 16px;  /* 修改：匹配 GitHub 原生按钮 padding */
            border-radius: 6px;
            font-weight: 500;
            font-size: 14px;
            line-height: 20px;
            transition: all 0.2s cubic-bezier(0.3, 0, 0.5, 1);
            text-decoration: none;
            white-space: nowrap;
            cursor: pointer;
            position: relative;
            vertical-align: middle;  /* 新增：确保垂直对齐 */
        }

        /* 亮色主题样式 */
        [data-color-mode="light"] .custom-github-button,
        [data-color-mode="auto"][data-light-theme] .custom-github-button {
            background: #f6f8fa;
            color: #24292f;
            border: 1px solid rgba(27, 31, 36, 0.15);
            box-shadow: 0 1px 0 rgba(27, 31, 36, 0.04);
        }

        [data-color-mode="light"] .custom-github-button:hover,
        [data-color-mode="auto"][data-light-theme] .custom-github-button:hover {
            background: #f3f4f6;
            border-color: rgba(27, 31, 36, 0.15);
            box-shadow: 0 3px 8px rgba(27, 31, 36, 0.12);
        }

        /* 暗色主题样式 */
        [data-color-mode="dark"] .custom-github-button,
        [data-color-mode="auto"][data-dark-theme] .custom-github-button {
            background: #21262d;
            color: #c9d1d9;
            border: 1px solid rgba(240, 246, 252, 0.1);
            box-shadow: 0 0 transparent;
        }

        [data-color-mode="dark"] .custom-github-button:hover,
        [data-color-mode="auto"][data-dark-theme] .custom-github-button:hover {
            background: #30363d;
            border-color: rgba(240, 246, 252, 0.2);
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
        }

        /* 按钮激活状态 */
        .custom-github-button:active {
            transform: translateY(0);
            transition: none;
        }

        [data-color-mode="light"] .custom-github-button:active,
        [data-color-mode="auto"][data-light-theme] .custom-github-button:active {
            background: #ebeff3;
            box-shadow: inset 0 1px 2px rgba(27, 31, 36, 0.1);
        }

        [data-color-mode="dark"] .custom-github-button:active,
        [data-color-mode="auto"][data-dark-theme] .custom-github-button:active {
            background: #282e36;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        /* 焦点状态 - 亮色主题 */
        [data-color-mode="light"] .custom-github-button:focus-visible,
        [data-color-mode="auto"][data-light-theme] .custom-github-button:focus-visible {
            outline: 2px solid #0969da;
            outline-offset: 2px;
        }

        /* 焦点状态 - 暗色主题 */
        [data-color-mode="dark"] .custom-github-button:focus-visible,
        [data-color-mode="auto"][data-dark-theme] .custom-github-button:focus-visible {
            outline: 2px solid #58a6ff;
            outline-offset: 2px;
        }

        /* 图标样式 - 亮色主题 */
        [data-color-mode="light"] .custom-github-button .octicon,
        [data-color-mode="auto"][data-light-theme] .custom-github-button .octicon {
            margin-right: 6px;
            flex-shrink: 0;
            transition: transform 0.2s ease;
            width: 16px;
            height: 16px;
            display: inline-block;
            vertical-align: text-bottom;
            color: #57606a;  /* 修改：亮色主题图标颜色 */
            fill: currentColor;
        }

        /* 图标样式 - 暗色主题（增强对比度） */
        [data-color-mode="dark"] .custom-github-button .octicon,
        [data-color-mode="auto"][data-dark-theme] .custom-github-button .octicon {
            margin-right: 6px;
            flex-shrink: 0;
            transition: transform 0.2s ease;
            width: 16px;
            height: 16px;
            display: inline-block;
            vertical-align: text-bottom;
            color: #8b949e;  /* 修改：暗色主题图标颜色，更明显 */
            fill: currentColor;
            filter: brightness(1.2);  /* 新增：增加亮度 */
        }

        /* 图标 hover 状态 - 亮色主题 */
        [data-color-mode="light"] .custom-github-button:hover .octicon,
        [data-color-mode="auto"][data-light-theme] .custom-github-button:hover .octicon {
            transform: scale(1.1) rotate(5deg);
            color: #24292f;  /* hover 时图标颜色加深 */
        }

        /* 图标 hover 状态 - 暗色主题 */
        [data-color-mode="dark"] .custom-github-button:hover .octicon,
        [data-color-mode="auto"][data-dark-theme] .custom-github-button:hover .octicon {
            transform: scale(1.1) rotate(5deg);
            color: #c9d1d9;  /* hover 时图标颜色变亮 */
            filter: brightness(1.4);  /* hover 时进一步增加亮度 */
        }

        /* 图片图标额外样式 - 暗色主题优化 */
        [data-color-mode="dark"] .custom-github-button img.octicon,
        [data-color-mode="auto"][data-dark-theme] .custom-github-button img.octicon {
            opacity: 0.85;  /* 新增：图片图标在暗色模式下的透明度 */
        }

        [data-color-mode="dark"] .custom-github-button:hover img.octicon,
        [data-color-mode="auto"][data-dark-theme] .custom-github-button:hover img.octicon {
            opacity: 1;  /* hover 时完全不透明 */
            filter: brightness(1.1);  /* 增加亮度 */
        }

        /* 仅图标模式 */
        .custom-github-button.icon-only {
            padding: 5px 12px;  /* 修改：匹配 GitHub 原生仅图标按钮 */
            min-width: 28px;  /* 修改：匹配高度 */
        }

        .custom-github-button.icon-only .octicon {
            margin-right: 0;
        }

        /* 文本样式 */
        .custom-github-button span {
            font-size: 14px;
            line-height: 20px;
            font-weight: 500;
        }

        /* 容器样式优化 */
        .pagehead-actions > li {
            margin-right: 0 !important;
            display: flex;
            align-items: center;
        }

        /* Tooltip 样式 - 亮色主题 */
        [data-color-mode="light"] .custom-github-button[title]:hover::after,
        [data-color-mode="auto"][data-light-theme] .custom-github-button[title]:hover::after {
            content: attr(title);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 8px;
            padding: 6px 12px;
            background: #24292f;
            color: #ffffff;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 400;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            animation: tooltipFadeIn 0.2s ease 0.3s forwards;
        }

        [data-color-mode="light"] .custom-github-button[title]:hover::before,
        [data-color-mode="auto"][data-light-theme] .custom-github-button[title]:hover::before {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 2px;
            border: 6px solid transparent;
            border-top-color: #24292f;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            animation: tooltipFadeIn 0.2s ease 0.3s forwards;
        }

        /* Tooltip 样式 - 暗色主题 */
        [data-color-mode="dark"] .custom-github-button[title]:hover::after,
        [data-color-mode="auto"][data-dark-theme] .custom-github-button[title]:hover::after {
            content: attr(title);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 8px;
            padding: 6px 12px;
            background: #f0f6fc;
            color: #0d1117;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 400;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            animation: tooltipFadeIn 0.2s ease 0.3s forwards;
        }

        [data-color-mode="dark"] .custom-github-button[title]:hover::before,
        [data-color-mode="auto"][data-dark-theme] .custom-github-button[title]:hover::before {
            content: '';
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 2px;
            border: 6px solid transparent;
            border-top-color: #f0f6fc;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            animation: tooltipFadeIn 0.2s ease 0.3s forwards;
        }

        @keyframes tooltipFadeIn {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-4px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .custom-github-button {
                padding: 3px 12px;
                margin: 0 2px;
                height: 28px;
            }

            .custom-github-button span {
                font-size: 13px;
            }

            .custom-github-button .octicon {
                width: 14px;
                height: 14px;
            }

            .custom-github-button.icon-only {
                padding: 3px 10px;
            }
        }

        /* 打印样式 */
        @media print {
            .custom-github-button {
                display: none !important;
            }
        }

        /* 高对比度模式支持 */
        @media (prefers-contrast: high) {
            .custom-github-button {
                border-width: 2px;
            }

            [data-color-mode="dark"] .custom-github-button .octicon,
            [data-color-mode="auto"][data-dark-theme] .custom-github-button .octicon {
                filter: brightness(1.5);
            }
        }

        /* 减少动画模式 */
        @media (prefers-reduced-motion: reduce) {
            .custom-github-button,
            .custom-github-button .octicon {
                transition: none !important;
                animation: none !important;
            }

            .custom-github-button:hover .octicon {
                transform: none;
            }
        }
    `;

    // ===== 工具函数 =====

    function buildSafeUrl(baseUrl) {
        try {
            const url = new URL(baseUrl);
            url.pathname = location.pathname;
            url.search = location.search;
            url.hash = location.hash;
            return url.href;
        } catch (error) {
            console.error('[GitHub增强] 构建 URL 失败:', error);
            return baseUrl;
        }
    }

    function createSVGIcon(svgContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svgElement = doc.documentElement;

        svgElement.classList.add('octicon');
        if (!svgElement.hasAttribute('width')) svgElement.setAttribute('width', '16');
        if (!svgElement.hasAttribute('height')) svgElement.setAttribute('height', '16');

        // 新增：确保 SVG 继承颜色
        if (!svgElement.hasAttribute('fill')) {
            svgElement.setAttribute('fill', 'currentColor');
        }

        return svgElement;
    }

    function createImageIcon(src) {
        const img = document.createElement('img');
        img.className = 'octicon';
        img.width = 16;
        img.height = 16;
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        return img;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ===== 按钮配置 =====
    const BUTTONS = [
        {
            id: 'githubdevButton',
            baseUrl: 'https://github.dev',
            text: 'Github.dev',
            iconType: 'image',
            iconSrc: 'https://github.com/favicons/favicon-codespaces.svg',
        },
        {
            id: 'zreadaiButton',
            baseUrl: 'https://zread.ai',
            text: 'ZreadAi',
            iconType: 'svg',
            iconContent: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="128px" height="128px" viewBox="0 0 128 128" enable-background="new 0 0 128 128" xml:space="preserve"><script xmlns=""/>  <image id="image0" width="128" height="128" x="0" y="0" xlink:href="data:image/png;base64,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"/>
<script xmlns=""/></svg>`,
        },
        {
            id: 'deepwikiButton',
            baseUrl: 'https://deepwiki.com',
            text: 'DeepWiki',
            iconType: 'svg',
            iconContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="110 110 460 500" width="16" height="16" fill="currentColor">
                <path d="M418.73,332.37c9.84-5.68,22.07-5.68,31.91,0l25.49,14.71c.82.48,1.69.8,2.58,1.06.19.06.37.11.55.16.87.21,1.76.34,2.65.35.04,0,.08.02.13.02.1,0,.19-.03.29-.04.83-.02,1.64-.13,2.45-.32.14-.03.28-.05.42-.09.87-.24,1.7-.59,2.5-1.03.08-.04.17-.06.25-.1l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22l-50.97-29.43c-3.65-2.11-8.15-2.11-11.81,0l-50.97,29.43c-.08.04-.13.11-.2.16-.78.48-1.51,1.02-2.15,1.66-.1.1-.18.21-.28.31-.57.6-1.08,1.26-1.51,1.97-.07.12-.15.22-.22.34-.44.77-.77,1.6-1.03,2.47-.05.19-.1.37-.14.56-.22.89-.37,1.81-.37,2.76v29.43c0,11.36-6.11,21.95-15.95,27.63-9.84,5.68-22.06,5.68-31.91,0l-25.49-14.71c-.82-.48-1.69-.8-2.57-1.06-.19-.06-.37-.11-.56-.16-.88-.21-1.76-.34-2.65-.34-.13,0-.26.02-.4.02-.84.02-1.66.13-2.47.32-.13.03-.27.05-.4.09-.87.24-1.71.6-2.51,1.04-.08.04-.16.06-.24.1l-50.97,29.43c-3.65,2.11-5.9,6.01-5.9,10.22v58.86c0,4.22,2.25,8.11,5.9,10.22l50.97,29.43c.08.04.17.06.24.1.8.44,1.64.79,2.5,1.03.14.04.28.06.42.09.81.19,1.62.3,2.45.32.1,0,.19.04.29.04.04,0,.08-.02.13-.02.89,0,1.77-.13,2.65-.35.19-.04.37-.1.56-.16.88-.26,1.75-.59,2.58-1.06l25.49-14.71c9.84-5.68,22.06-5.68,31.91,0,9.84,5.68,15.95,16.27,15.95,27.63v29.43c0,.95.15,1.87.37,2.76.05.19.09.37.14.56.25.86.59,1.69,1.03,2.47.07.12.15.22.22.34.43.71.94,1.37,1.51,1.97.1.1.18.21.28.31.65.63,1.37,1.18,2.15,1.66.07.04.13.11.2.16l50.97,29.43c1.83,1.05,3.86,1.58,5.9,1.58s4.08-.53,5.9-1.58l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22l-50.97-29.43c-.08-.04-.16-.06-.24-.1-.8-.44-1.64-.8-2.51-1.04-.13-.04-.26-.05-.39-.09-.82-.2-1.65-.31-2.49-.33-.13,0-.25-.02-.38-.02-.89,0-1.78.13-2.66.35-.18.04-.36.1-.54.15-.88.26-1.75.59-2.58,1.07l-25.49,14.72c-9.84,5.68-22.07,5.68-31.9,0-9.84-5.68-15.95-16.27-15.95-27.63s6.11-21.95,15.95-27.63Z" fill="#21c19a"></path>
                <path d="M141.09,317.65l50.97,29.43c1.83,1.05,3.86,1.58,5.9,1.58s4.08-.53,5.9-1.58l50.97-29.43c.08-.04.13-.11.2-.16.78-.48,1.51-1.02,2.15-1.66.1-.1.18-.21.28-.31.57-.6,1.08-1.26,1.51-1.97.07-.12.15-.22.22-.34.44-.77.77-1.6,1.03-2.47.05-.19.1-.37.14-.56.22-.89.37-1.81.37-2.76v-29.43c0-11.36,6.11-21.95,15.96-27.63s22.06-5.68,31.91,0l25.49,14.71c.82.48,1.69.8,2.57,1.06.19.06.37.11.56.16.87.21,1.76.34,2.64.35.04,0,.09.02.13.02.1,0,.19-.04.29-.04.83-.02,1.65-.13,2.45-.32.14-.03.28-.05.41-.09.87-.24,1.71-.6,2.51-1.04.08-.04.16-.06.24-.1l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22l-50.97-29.43c-3.65-2.11-8.15-2.11-11.81,0l-50.97,29.43c-.08.04-.13.11-.2.16-.78.48-1.51,1.02-2.15,1.66-.1.1-.18.21-.28.31-.57.6-1.08,1.26-1.51,1.97-.07.12-.15.22-.22.34-.44.77-.77,1.6-1.03,2.47-.05.19-.1.37-.14.56-.22.89-.37,1.81-.37,2.76v29.43c0,11.36-6.11,21.95-15.95,27.63-9.84,5.68-22.07,5.68-31.91,0l-25.49-14.71c-.82-.48-1.69-.8-2.58-1.06-.19-.06-.37-.11-.55-.16-.88-.21-1.76-.34-2.65-.35-.13,0-.26.02-.4.02-.83.02-1.66.13-2.47.32-.13.03-.27.05-.4.09-.87.24-1.71.6-2.51,1.04-.08.04-.16.06-.24.1l-50.97,29.43c-3.65,2.11-5.9,6.01-5.9,10.22v58.86c0,4.22,2.25,8.11,5.9,10.22Z" fill="#3969ca"></path>
                <path d="M396.88,484.35l-50.97-29.43c-.08-.04-.17-.06-.24-.1-.8-.44-1.64-.79-2.51-1.03-.14-.04-.27-.06-.41-.09-.81-.19-1.64-.3-2.47-.32-.13,0-.26-.02-.39-.02-.89,0-1.78.13-2.66.35-.18.04-.36.1-.54.15-.88.26-1.76.59-2.58,1.07l-25.49,14.72c-9.84,5.68-22.06,5.68-31.9,0-9.84-5.68-15.96-16.27-15.96-27.63v-29.43c0-.95-.15-1.87-.37-2.76-.05-.19-.09-.37-.14-.56-.25-.86-.59-1.69-1.03-2.47-.07-.12-.15-.22-.22-.34-.43-.71-.94-1.37-1.51-1.97-.1-.1-.18-.21-.28-.31-.65-.63-1.37-1.18-2.15-1.66-.07-.04-.13-.11-.2-.16l-50.97-29.43c-3.65-2.11-8.15-2.11-11.81,0l-50.97,29.43c-3.65,2.11-5.9,6.01-5.9,10.22v58.86c0,4.22,2.25,8.11,5.9,10.22l50.97,29.43c.08.04.17.06.25.1.8.44,1.63.79,2.5,1.03.14.04.29.06.43.09.8.19,1.61.3,2.43.32.1,0,.2.04.3.04.04,0,.09-.02.13-.02.88,0,1.77-.13,2.64-.34.19-.04.37-.1.56-.16.88-.26,1.75-.59,2.57-1.06l25.49-14.71c9.84-5.68,22.06-5.68,31.91,0,9.84,5.68,15.95,16.27,15.95,27.63v29.43c0,.95.15,1.87.37,2.76.05.19.09.37.14.56.25.86.59,1.69,1.03,2.47.07.12.15.22.22.34.43.71.94,1.37,1.51,1.97.1.1.18.21.28.31.65.63,1.37,1.18,2.15,1.66.07.04.13.11.2.16l50.97,29.43c1.83,1.05,3.86,1.58,5.9,1.58s4.08-.53,5.9-1.58l50.97-29.43c3.65-2.11,5.9-6.01,5.9-10.22v-58.86c0-4.22-2.25-8.11-5.9-10.22Z" fill="#0294de"></path>
            </svg>`,
        },
    ];

    // ===== 核心功能 =====

    async function findButtonContainer() {
        const selectors = [
            'ul.pagehead-actions',
            '.pagehead-actions',
            '.file-navigation .d-flex',
            'nav[aria-label="Repository"] .d-flex'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) return element;
        }

        return null;
    }

    function countExistingButtons(container) {
        if (!container) return 0;

        const buttonIds = BUTTONS.map(btn => `#${btn.id}`).join(',');
        const existingButtons = container.querySelectorAll(`li:not(${buttonIds})`);
        return existingButtons.length;
    }

    function createCustomButton(config, iconOnly = false) {
        const { id, baseUrl, text, iconType, iconSrc, iconContent } = config;

        const li = document.createElement('li');
        li.id = id;
        li.className = 'd-flex';

        const a = document.createElement('a');
        a.href = buildSafeUrl(baseUrl);
        a.className = iconOnly
            ? 'btn btn-sm custom-github-button icon-only'
            : 'btn btn-sm custom-github-button';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', text);

        if (iconOnly) {
            a.title = text;
        }

        let iconElement;
        if (iconType === 'image') {
            iconElement = createImageIcon(iconSrc);
        } else if (iconType === 'svg') {
            iconElement = createSVGIcon(iconContent);
        }

        if (iconElement) {
            a.appendChild(iconElement);
        }

        if (!iconOnly) {
            const span = document.createElement('span');
            span.textContent = text;
            a.appendChild(span);
        }

        li.appendChild(a);
        return li;
    }

    async function addButtons() {
        try {
            const buttonContainer = await findButtonContainer();
            if (!buttonContainer) {
                console.log('[GitHub增强] 未找到按钮容器');
                return;
            }

            BUTTONS.forEach(({ id }) => {
                const existing = document.getElementById(id);
                if (existing) existing.remove();
            });

            const existingCount = countExistingButtons(buttonContainer);
            const iconOnly = existingCount > CONFIG.BUTTON_THRESHOLD;

            BUTTONS.slice().reverse().forEach(config => {
                const button = createCustomButton(config, iconOnly);
                buttonContainer.insertBefore(button, buttonContainer.firstChild);
            });

            const theme = getCurrentTheme();
            console.log(`[GitHub增强] 成功添加 ${BUTTONS.length} 个按钮 (${iconOnly ? '图标' : '文本'}模式, ${theme}主题)`);
        } catch (error) {
            console.error('[GitHub增强] 添加按钮失败:', error);
        }
    }

    // ===== 初始化 =====

    function injectStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = STYLES;
        styleElement.setAttribute('data-github-enhancer', 'true');
        document.head.appendChild(styleElement);
    }

    function setupThemeObserver() {
        const htmlElement = document.documentElement;
        const themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'data-color-mode' ||
                     mutation.attributeName === 'data-light-theme' ||
                     mutation.attributeName === 'data-dark-theme')) {
                    const newTheme = getCurrentTheme();
                    console.log(`[GitHub增强] 主题已切换至: ${newTheme}`);
                }
            });
        });

        themeObserver.observe(htmlElement, {
            attributes: true,
            attributeFilter: ['data-color-mode', 'data-light-theme', 'data-dark-theme']
        });

        return themeObserver;
    }

    function init() {
        injectStyles();
        setupThemeObserver();

        const debouncedAddButtons = debounce(addButtons, CONFIG.DEBOUNCE_DELAY);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', debouncedAddButtons);
        } else {
            setTimeout(debouncedAddButtons, CONFIG.INIT_DELAY);
        }

        document.addEventListener('pjax:end', debouncedAddButtons);
        document.addEventListener('turbo:load', debouncedAddButtons);

        let currentUrl = location.href;
        const urlObserver = new MutationObserver(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(debouncedAddButtons, CONFIG.URL_CHANGE_DELAY);
            }
        });

        urlObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log(`[GitHub增强] 脚本已初始化 (当前主题: ${getCurrentTheme()})`);
    }

    init();
})();