/**
 * Linux.do Forum Post Exporter - 生成器模块
 */

import i18n from './i18n.js';
import { cleanContentForHTML } from './extractor.js';
import { getHTMLStyles } from './styles.js';

/**
 * 转义HTML属性中的特殊字符
 * @param {string} str - 原始字符串
 * @returns {string}
 */
function escapeHTMLAttribute(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * 生成JSON导出
 * @param {Object} data - 数据对象
 * @returns {string}
 */
export function generateJSON(data) {
  return JSON.stringify(data, null, 2);
}

/**
 * 生成HTML导出
 * @param {Object} data - 数据对象
 * @returns {string}
 */
export function generateHTML(data) {
  const cleanedPosts = data.posts.map((post) => ({
    ...post,
    content: cleanContentForHTML(post.content),
    quotes: post.quotes.map((quote) => ({
      ...quote,
      content: cleanContentForHTML(quote.content),
    })),
  }));

  const i18nStrings = {
    searchPlaceholder: i18n.t('searchPlaceholder'),
    noResults: i18n.t('noResults'),
    showAll: i18n.t('showAll'),
    lightTheme: i18n.t('lightTheme'),
    darkTheme: i18n.t('darkTheme'),
    autoTheme: i18n.t('autoTheme'),
  };

  const html = `<!DOCTYPE html>
<html lang="${i18n.currentLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.topic.title} - Linux.do</title>
    <style>${getHTMLStyles()}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${data.topic.title}</h1>
            <div class="topic-meta">
                ${data.topic.category ? `<span class="category">${data.topic.category}</span>` : ''}
                ${data.topic.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="topic-info">
                <div class="topic-info-item">
                    <span class="topic-info-label">${i18n.t('topicID')}:</span>
                    <span>${data.topic.topicId}</span>
                </div>
                <div class="topic-info-item">
                    <span class="topic-info-label">${i18n.t('posts')}:</span>
                    <span>${data.postCount}</span>
                </div>
                <div class="topic-info-item">
                    <span class="topic-info-label">${i18n.t('source')}:</span>
                    <a href="${data.topic.url}" target="_blank">linux.do</a>
                </div>
            </div>
        </div>

        <div class="toolbar">
            <div class="search-wrapper">
                <input type="text" class="search-input" id="searchInput" placeholder="${i18nStrings.searchPlaceholder}">
                <button class="search-clear" id="searchClear">&times;</button>
            </div>
            <div class="theme-toggle">
                <button class="theme-btn" data-theme="light" title="${i18nStrings.lightTheme}">☀️ ${i18nStrings.lightTheme}</button>
                <button class="theme-btn active" data-theme="auto" title="${i18nStrings.autoTheme}">🌗 ${i18nStrings.autoTheme}</button>
                <button class="theme-btn" data-theme="dark" title="${i18nStrings.darkTheme}">🌙 ${i18nStrings.darkTheme}</button>
            </div>
        </div>

        <div class="no-results" id="noResults">
            <div class="no-results-icon">🔍</div>
            <div class="no-results-text">${i18nStrings.noResults}</div>
            <button class="show-all-btn" id="showAllBtn">${i18nStrings.showAll}</button>
        </div>

        ${cleanedPosts.map((post) => `
        <div class="post" id="post-${post.postNumber}" data-author="${post.author.username}" data-content="${escapeHTMLAttribute(post.contentText.substring(0, 1000))}">
            <div class="post-header">
                ${post.author.avatarUrl ? `<img src="${post.author.avatarUrl}" alt="${post.author.username}" class="avatar">` : ''}
                <div class="author-info">
                    <a href="https://linux.do${post.author.profileUrl}" class="author-name">${post.author.username}</a>
                    <div class="post-date">${post.dateFormatted}</div>
                </div>
                <span class="post-number">#${post.postNumber}</span>
            </div>

            ${post.replyTo ? `
            <div class="reply-to">
                ↩ ${i18n.t('replyTo')} @${post.replyTo.username}
            </div>
            ` : ''}

            <div class="post-content">
                ${post.content}
            </div>
        </div>
        `).join('')}

        <div class="export-info">
            ${i18n.t('exportedFrom')} ${i18n.formatDate(data.exportDate)}
        </div>
    </div>

    <script>
        (function() {
            // Theme switching
            const themeButtons = document.querySelectorAll('.theme-btn');
            const htmlElement = document.documentElement;
            
            function setTheme(theme) {
                themeButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelector('[data-theme="' + theme + '"]').classList.add('active');
                
                if (theme === 'auto') {
                    htmlElement.removeAttribute('data-theme');
                } else {
                    htmlElement.setAttribute('data-theme', theme);
                }
                
                localStorage.setItem('theme', theme);
            }
            
            // Load saved theme
            const savedTheme = localStorage.getItem('theme') || 'auto';
            setTheme(savedTheme);
            
            themeButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    setTheme(this.getAttribute('data-theme'));
                });
            });
            
            // Search functionality
            const searchInput = document.getElementById('searchInput');
            const searchClear = document.getElementById('searchClear');
            const noResults = document.getElementById('noResults');
            const showAllBtn = document.getElementById('showAllBtn');
            const posts = document.querySelectorAll('.post');
            
            let searchTimeout;
            
            function performSearch(query) {
                const normalizedQuery = query.toLowerCase().trim();
                let visibleCount = 0;
                
                posts.forEach(post => {
                    const author = (post.getAttribute('data-author') || '').toLowerCase();
                    const content = (post.getAttribute('data-content') || '').toLowerCase();
                    const postContent = post.querySelector('.post-content');
                    const originalContent = postContent.getAttribute('data-original') || postContent.innerHTML;
                    
                    if (!postContent.getAttribute('data-original')) {
                        postContent.setAttribute('data-original', postContent.innerHTML);
                    }
                    
                    if (!normalizedQuery) {
                        post.classList.remove('hidden');
                        postContent.innerHTML = originalContent;
                        visibleCount++;
                        return;
                    }
                    
                    const matches = author.includes(normalizedQuery) || content.includes(normalizedQuery);
                    
                    if (matches) {
                        post.classList.remove('hidden');
                        visibleCount++;
                    } else {
                        post.classList.add('hidden');
                    }
                });
                
                if (visibleCount === 0 && normalizedQuery) {
                    noResults.classList.add('visible');
                } else {
                    noResults.classList.remove('visible');
                }
                
                if (query) {
                    searchClear.classList.add('visible');
                } else {
                    searchClear.classList.remove('visible');
                }
            }
            
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    performSearch(this.value);
                }, 200);
            });
            
            searchClear.addEventListener('click', function() {
                searchInput.value = '';
                performSearch('');
                searchInput.focus();
            });
            
            showAllBtn.addEventListener('click', function() {
                searchInput.value = '';
                performSearch('');
            });
            
            // Keyboard shortcut: Ctrl/Cmd + F to focus search
            document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                    e.preventDefault();
                    searchInput.focus();
                    searchInput.select();
                }
            });
        })();
    </script>
</body>
</html>`;

  return html;
}

/**
 * 下载文件
 * @param {string} content - 文件内容
 * @param {string} filename - 文件名
 * @param {string} type - MIME类型
 */
export function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type: type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default {
  generateJSON,
  generateHTML,
  downloadFile,
};
