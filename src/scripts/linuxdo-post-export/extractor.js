/**
 * Linux.do Forum Post Exporter - 数据提取模块
 */

import i18n from './i18n.js';

/**
 * 将图片URL转换为base64
 * @param {string} url - 图片URL
 * @returns {Promise<string>}
 */
export async function imageToBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to convert image:', url, error);
    return url;
  }
}

/**
 * 等待帖子加载完成
 * @param {number} timeout - 超时时间（毫秒），默认30秒
 * @returns {Promise<void>}
 */
export function waitForPosts(timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      const posts = document.querySelectorAll('article[data-post-id]');
      if (posts.length > 0) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error(i18n.t('noPostsFound')));
      }
    }, 500);
  });
}

/**
 * 提取单个帖子数据
 * @param {HTMLElement} postElement - 帖子元素
 * @returns {Object}
 */
export function extractPostData(postElement) {
  const postId = postElement.getAttribute('data-post-id');
  const postNumber = postElement.closest('.topic-post').getAttribute('data-post-number');

  const authorLink = postElement.querySelector('.names a');
  const authorUsername = authorLink ? authorLink.textContent.trim() : '';
  const authorHref = authorLink ? authorLink.getAttribute('href') : '';

  const avatarImg = postElement.querySelector('.post-avatar img');
  const avatarUrl = avatarImg ? avatarImg.getAttribute('src') : '';

  const dateElement = postElement.querySelector('.post-date .relative-date');
  const postDate = dateElement ? dateElement.getAttribute('data-time') : '';
  const postDateFormatted = dateElement ? dateElement.textContent.trim() : '';

  const contentElement = postElement.querySelector('.cooked');
  const content = contentElement ? contentElement.innerHTML : '';
  const contentText = contentElement ? contentElement.textContent.trim() : '';

  const quotes = [];
  const quoteElements = postElement.querySelectorAll('aside.quote');
  quoteElements.forEach((quote) => {
    const quotedUser = quote.getAttribute('data-username');
    const quotedPost = quote.getAttribute('data-post');
    const quotedContent = quote.querySelector('blockquote');
    quotes.push({
      username: quotedUser,
      postNumber: quotedPost,
      content: quotedContent ? quotedContent.innerHTML : '',
    });
  });

  const replyToElement = postElement.querySelector('.reply-to-tab');
  let replyTo = null;
  if (replyToElement) {
    const replyToUser = replyToElement.querySelector('span');
    const replyToAvatar = replyToElement.querySelector('img');
    replyTo = {
      username: replyToUser ? replyToUser.textContent.trim() : '',
      avatarUrl: replyToAvatar ? replyToAvatar.getAttribute('src') : '',
    };
  }

  const reactions = [];
  const reactionElements = postElement.querySelectorAll('.discourse-reactions-counter button');
  reactionElements.forEach((reaction) => {
    const count = reaction.querySelector('.count');
    const emoji = reaction.querySelector('.emoji');
    if (count && emoji) {
      reactions.push({
        emoji: emoji.textContent.trim(),
        count: parseInt(count.textContent.trim()),
      });
    }
  });

  return {
    postId,
    postNumber: parseInt(postNumber),
    author: {
      username: authorUsername,
      profileUrl: authorHref,
      avatarUrl: avatarUrl,
    },
    timestamp: postDate,
    dateFormatted: postDateFormatted,
    content: content,
    contentText: contentText,
    quotes: quotes,
    replyTo: replyTo,
    reactions: reactions,
  };
}

/**
 * 提取主题元数据
 * @returns {Object}
 */
export function extractTopicData() {
  const topicTitle = document.querySelector('h1[data-topic-id] .fancy-title span');
  const topicId = document.querySelector('h1[data-topic-id]')?.getAttribute('data-topic-id');
  const category = document.querySelector('.badge-category__name');
  const tags = [...new Set(
    Array.from(document.querySelectorAll('.discourse-tag')).map((tag) => tag.textContent.trim()),
  )];

  return {
    topicId: topicId,
    title: topicTitle ? topicTitle.textContent.trim() : '',
    category: category ? category.textContent.trim() : '',
    tags: tags,
    url: window.location.href,
  };
}

/**
 * 处理内容中的图片转换为base64
 * @param {string} content - 内容HTML
 * @returns {Promise<string>}
 */
export async function processContentImages(content) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const images = tempDiv.querySelectorAll('img');

  for (const img of images) {
    const src = img.getAttribute('src');
    if (src) {
      const fullUrl = src.startsWith('http') ? src : `https://linux.do${src}`;
      const base64 = await imageToBase64(fullUrl);
      img.setAttribute('src', base64);
    }
  }

  return tempDiv.innerHTML;
}

/**
 * 清理内容用于HTML显示
 * @param {string} content - 内容HTML
 * @returns {string}
 */
export function cleanContentForHTML(content) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  const selectorsToRemove = ['.cooked-selection-barrier', 'div:empty', '[aria-hidden="true"]'];

  selectorsToRemove.forEach((selector) => {
    tempDiv.querySelectorAll(selector).forEach((el) => el.remove());
  });

  const cleaned = tempDiv.innerHTML
    .replace(/\s*<br>\s*<\/div>/g, '</div>')
    .replace(/<div>\s*<\/div>/g, '')
    .replace(/\n\s*\n/g, '\n')
    .trim();

  return cleaned;
}

/**
 * 提取所有帖子
 * @param {boolean} convertImages - 是否转换图片为base64
 * @returns {Promise<Object>}
 */
export async function extractAllPosts(convertImages = false) {
  const posts = document.querySelectorAll('article[data-post-id]');
  const postData = [];

  for (const post of posts) {
    const data = extractPostData(post);

    if (convertImages) {
      if (data.author.avatarUrl) {
        const fullUrl = data.author.avatarUrl.startsWith('http')
          ? data.author.avatarUrl
          : `https://linux.do${data.author.avatarUrl}`;
        data.author.avatarUrl = await imageToBase64(fullUrl);
      }

      data.content = await processContentImages(data.content);

      for (const quote of data.quotes) {
        quote.content = await processContentImages(quote.content);
      }

      if (data.replyTo && data.replyTo.avatarUrl) {
        const fullUrl = data.replyTo.avatarUrl.startsWith('http')
          ? data.replyTo.avatarUrl
          : `https://linux.do${data.replyTo.avatarUrl}`;
        data.replyTo.avatarUrl = await imageToBase64(fullUrl);
      }
    }

    postData.push(data);
  }

  const topicData = extractTopicData();

  return {
    topic: topicData,
    posts: postData,
    exportDate: new Date().toISOString(),
    postCount: postData.length,
    language: i18n.currentLang,
  };
}

export default {
  imageToBase64,
  waitForPosts,
  extractPostData,
  extractTopicData,
  processContentImages,
  cleanContentForHTML,
  extractAllPosts,
};
