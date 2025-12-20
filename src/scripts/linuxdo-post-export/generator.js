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
 * 将HTML转换为Markdown
 * @param {string} html - HTML内容
 * @returns {string}
 */
function htmlToMarkdown(html) {
  if (!html) return '';

  let md = html;

  // 处理代码块 (pre > code)
  md = md.replace(/<pre[^>]*>\s*<code[^>]*class="[^"]*lang-([^"\s]+)[^"]*"[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi, (match, lang, code) => {
    const decodedCode = decodeHTMLEntities(code.trim());
    return `\n\n\`\`\`${lang}\n${decodedCode}\n\`\`\`\n\n`;
  });
  md = md.replace(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi, (match, code) => {
    const decodedCode = decodeHTMLEntities(code.trim());
    return `\n\n\`\`\`\n${decodedCode}\n\`\`\`\n\n`;
  });
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (match, code) => {
    const decodedCode = decodeHTMLEntities(code.trim());
    return `\n\n\`\`\`\n${decodedCode}\n\`\`\`\n\n`;
  });

  // 处理行内代码
  md = md.replace(/<code[^>]*>([^<]*)<\/code>/gi, '`$1`');

  // 处理标题
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n##### $1\n');
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '\n###### $1\n');

  // 处理粗体和斜体
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');

  // 处理删除线
  md = md.replace(/<del[^>]*>([\s\S]*?)<\/del>/gi, '~~$1~~');
  md = md.replace(/<s[^>]*>([\s\S]*?)<\/s>/gi, '~~$1~~');
  md = md.replace(/<strike[^>]*>([\s\S]*?)<\/strike>/gi, '~~$1~~');

  // 处理链接
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // 处理图片
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

  // 处理引用块 (blockquote)
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, content) => {
    const lines = content.trim().split('\n');
    return '\n' + lines.map((line) => `> ${line.trim()}`).join('\n') + '\n';
  });

  // 处理无序列表
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
    return '\n' + content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n') + '\n';
  });

  // 处理有序列表
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
    let index = 1;
    return '\n' + content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, () => {
      return `${index++}. $1\n`;
    }).replace(/\$1/g, (m, offset, _str) => {
      const liMatch = content.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
      if (liMatch) {
        const idx = Math.floor(offset / 10);
        if (liMatch[idx]) {
          return liMatch[idx].replace(/<li[^>]*>([\s\S]*?)<\/li>/i, '$1');
        }
      }
      return '';
    }) + '\n';
  });

  // 重新处理有序列表（更简单的方式）
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
    let index = 1;
    const result = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, text) => {
      return `${index++}. ${text.trim()}\n`;
    });
    return '\n' + result + '\n';
  });

  // 处理无序列表（更简单的方式）
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
    const result = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, text) => {
      return `- ${text.trim()}\n`;
    });
    return '\n' + result + '\n';
  });

  // 处理水平线
  md = md.replace(/<hr[^>]*\/?>/gi, '\n---\n');

  // 处理换行
  md = md.replace(/<br[^>]*\/?>/gi, '\n');

  // 处理段落
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');

  // 处理div
  md = md.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1\n');

  // 处理span
  md = md.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1');

  // 处理表格
  md = md.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (match, tableContent) => {
    let result = '\n';
    const rows = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    let isFirstRow = true;

    rows.forEach((row) => {
      const cells = row.match(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi) || [];
      const cellContents = cells.map((cell) => {
        return cell.replace(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/i, '$1').trim();
      });

      if (cellContents.length > 0) {
        result += '| ' + cellContents.join(' | ') + ' |\n';

        if (isFirstRow) {
          result += '| ' + cellContents.map(() => '---').join(' | ') + ' |\n';
          isFirstRow = false;
        }
      }
    });

    return result + '\n';
  });

  // 移除aside.quote的特殊处理（论坛引用）
  md = md.replace(/<aside[^>]*class="[^"]*quote[^"]*"[^>]*>([\s\S]*?)<\/aside>/gi, (match, content) => {
    const blockquote = content.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
    if (blockquote) {
      const lines = blockquote[1].trim().split('\n');
      return '\n' + lines.map((line) => `> ${line.trim()}`).join('\n') + '\n';
    }
    return '';
  });

  // 清理剩余的HTML标签
  md = md.replace(/<[^>]+>/g, '');

  // 解码HTML实体
  md = decodeHTMLEntities(md);

  // 清理多余的空行
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();

  return md;
}

/**
 * 解码HTML实体
 * @param {string} str - 包含HTML实体的字符串
 * @returns {string}
 */
function decodeHTMLEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
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
  const cleanedPosts = data.posts.map((post) => {
    const cleanedQuotes = post.quotes.map((quoteItem) => {
      return {
        ...quoteItem,
        content: cleanContentForHTML(quoteItem.content),
      };
    });
    return {
      ...post,
      content: cleanContentForHTML(post.content),
      quotes: cleanedQuotes,
    };
  });

  const i18nStrings = {
    searchPlaceholder: i18n.t('searchPlaceholder'),
    noResults: i18n.t('noResults'),
    showAll: i18n.t('showAll'),
    lightTheme: i18n.t('lightTheme'),
    darkTheme: i18n.t('darkTheme'),
    autoTheme: i18n.t('autoTheme'),
    theme: i18n.t('theme'),
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
                ${data.topicStats ? `
                <div class="topic-info-item">
                    <span class="topic-info-label">${i18n.t('views')}:</span>
                    <span>${data.topicStats.views || 0}</span>
                </div>
                <div class="topic-info-item">
                    <span class="topic-info-label">${i18n.t('likes')}:</span>
                    <span>${data.topicStats.likes || 0}</span>
                </div>
                ` : ''}
                <div class="topic-info-item">
                    <span class="topic-info-label">${i18n.t('source')}:</span>
                    <a href="${data.topic.url}" target="_blank">linux.do</a>
                </div>
            </div>
            ${data.topicStats && data.topicStats.participants && data.topicStats.participants.length > 0 ? `
            <div class="topic-participants">
                <span class="topic-info-label">${i18n.t('participants')}:</span>
                <div class="participants-list">
                    ${data.topicStats.participants.map((p) => `
                    <a href="https://linux.do/u/${p.username}" class="participant" title="${p.displayName || p.username}">
                        <img src="${p.avatarUrl}" alt="${p.username}" class="participant-avatar">
                        ${p.postCount > 1 ? `<span class="participant-count">${p.postCount}</span>` : ''}
                    </a>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </div>

        <div class="toolbar">
            <div class="search-wrapper">
                <input type="text" class="search-input" id="searchInput" placeholder="${i18nStrings.searchPlaceholder}">
                <button class="search-clear" id="searchClear">&times;</button>
            </div>
            <div class="theme-selector">
                <select id="themeSelect" class="theme-select">
                    <option value="auto">🌗 ${i18nStrings.autoTheme}</option>
                    <option value="light">☀️ ${i18nStrings.lightTheme}</option>
                    <option value="dark">🌙 ${i18nStrings.darkTheme}</option>
                </select>
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

        ${data.comments && data.comments.length > 0 ? `
        <div class="comments-section">
            <h2 class="comments-header">${i18n.t('comments')} (${data.commentCount})</h2>
            ${data.comments.map((comment) => `
            <div class="comment" id="comment-${comment.postNumber}" data-author="${comment.author.username}" data-content="${escapeHTMLAttribute(comment.contentText.substring(0, 1000))}">
                <div class="post-header">
                    ${comment.author.avatarUrl ? `<img src="${comment.author.avatarUrl}" alt="${comment.author.username}" class="avatar">` : ''}
                    <div class="author-info">
                        <a href="https://linux.do${comment.author.profileUrl}" class="author-name">${comment.author.username}</a>
                        ${comment.author.title ? `<span class="user-title">${comment.author.title}</span>` : ''}
                        <div class="post-date">${comment.dateTitle || comment.dateFormatted}</div>
                    </div>
                    <span class="post-number">#${comment.postNumber}</span>
                </div>

                ${comment.quotes && comment.quotes.length > 0 ? comment.quotes.map((quote) => `
                <div class="quote-block">
                    <div class="quote-header">@${quote.username} #${quote.postNumber}</div>
                    <blockquote>${cleanContentForHTML(quote.content)}</blockquote>
                </div>
                `).join('') : ''}

                <div class="post-content">
                    ${cleanContentForHTML(comment.content)}
                </div>
            </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="export-info">
            ${i18n.t('exportedFrom')} ${i18n.formatDate(data.exportDate)}
        </div>
    </div>

    <script>
        (function() {
            // Theme switching
            const themeSelect = document.getElementById('themeSelect');
            const htmlElement = document.documentElement;
            
            function setTheme(theme) {
                themeSelect.value = theme;
                
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
            
            themeSelect.addEventListener('change', function() {
                setTheme(this.value);
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

/**
 * 生成Markdown导出
 * @param {Object} data - 数据对象
 * @returns {string}
 */
export function generateMarkdown(data) {
  let md = '';

  // 标题
  md += `# ${data.topic.title}\n\n`;

  // 元信息
  if (data.topic.category) {
    md += `**${i18n.t('topicID')}:** ${data.topic.topicId}  \n`;
    md += `**Category:** ${data.topic.category}  \n`;
  } else {
    md += `**${i18n.t('topicID')}:** ${data.topic.topicId}  \n`;
  }

  if (data.topic.tags && data.topic.tags.length > 0) {
    md += `**Tags:** ${data.topic.tags.map((tag) => `\`${tag}\``).join(', ')}  \n`;
  }

  md += `**${i18n.t('source')}:** [linux.do](${data.topic.url})  \n`;
  md += `**${i18n.t('posts')}:** ${data.postCount}  \n`;

  if (data.topicStats) {
    if (data.topicStats.views) {
      md += `**${i18n.t('views')}:** ${data.topicStats.views}  \n`;
    }
    if (data.topicStats.likes) {
      md += `**${i18n.t('likes')}:** ${data.topicStats.likes}  \n`;
    }
    if (data.topicStats.participants && data.topicStats.participants.length > 0) {
      const participantNames = data.topicStats.participants.map((p) => `@${p.username}`).join(', ');
      md += `**${i18n.t('participants')}:** ${participantNames}  \n`;
    }
  }

  md += '\n---\n\n';

  // 帖子内容
  data.posts.forEach((post, index) => {
    // 帖子头部
    md += `## #${post.postNumber} - ${post.author.username}\n\n`;
    md += `*${post.dateFormatted}*\n\n`;

    // 回复信息
    if (post.replyTo) {
      md += `> ${i18n.t('replyTo')} @${post.replyTo.username}\n\n`;
    }

    // 引用内容
    if (post.quotes && post.quotes.length > 0) {
      post.quotes.forEach((quote) => {
        const quoteContent = htmlToMarkdown(quote.content);
        md += `> **@${quote.username}** (${i18n.t('replyTo')} #${quote.postNumber}):\n`;
        quoteContent.split('\n').forEach((line) => {
          md += `> ${line}\n`;
        });
        md += '\n';
      });
    }

    // 帖子正文
    const content = htmlToMarkdown(post.content);
    md += content + '\n\n';

    // 反应/表情
    if (post.reactions && post.reactions.length > 0) {
      md += `**Reactions:** ${post.reactions.map((r) => `${r.emoji} ${r.count}`).join(' | ')}\n\n`;
    }

    // 分隔线（除了最后一个帖子）
    if (index < data.posts.length - 1) {
      md += '---\n\n';
    }
  });

  // 导出信息
  if (data.comments && data.comments.length > 0) {
    md += '\n---\n\n';
    md += `## ${i18n.t('comments')} (${data.commentCount})\n\n`;

    data.comments.forEach((comment, index) => {
      md += `### #${comment.postNumber} - ${comment.author.username}`;
      if (comment.author.title) {
        md += ` (${comment.author.title})`;
      }
      md += '\n\n';
      md += `*${comment.dateTitle || comment.dateFormatted}*\n\n`;

      if (comment.quotes && comment.quotes.length > 0) {
        comment.quotes.forEach((quote) => {
          const quoteContent = htmlToMarkdown(quote.content);
          md += `> **@${quote.username}** (#${quote.postNumber}):\n`;
          quoteContent.split('\n').forEach((line) => {
            md += `> ${line}\n`;
          });
          md += '\n';
        });
      }

      const content = htmlToMarkdown(comment.content);
      md += content + '\n\n';

      if (index < data.comments.length - 1) {
        md += '---\n\n';
      }
    });
  }

  md += '\n---\n\n';
  md += `*${i18n.t('exportedFrom')} ${i18n.formatDate(data.exportDate)}*\n`;

  return md;
}

export default {
  generateJSON,
  generateHTML,
  generateMarkdown,
  downloadFile,
};
