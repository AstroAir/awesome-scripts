/**
 * Linux.do Forum Post Exporter - 生成器模块
 */

import i18n from './i18n.js';
import { cleanContentForHTML } from './extractor.js';
import { getHTMLStyles } from './styles.js';

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

        ${cleanedPosts.map((post) => `
        <div class="post" id="post-${post.postNumber}">
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
