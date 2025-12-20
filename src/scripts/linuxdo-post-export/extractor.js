/**
 * Linux.do Forum Post Exporter - 数据提取模块
 */

import i18n from './i18n.js';

/**
 * 滚动加载并收集所有评论
 * @param {Function} onProgress - 进度回调函数
 * @param {boolean} convertImages - 是否转换图片为base64
 * @returns {Promise<Map>} - 返回收集到的评论Map
 */
export async function scrollAndCollectComments(onProgress, convertImages = false) {
  const collectedComments = new Map();
  const scrollDelay = 300;
  const scrollStep = window.innerHeight * 0.8;
  let lastScrollTop = -1;
  let noChangeCount = 0;
  const maxNoChange = 10;

  window.scrollTo(0, 0);
  await new Promise((resolve) => setTimeout(resolve, scrollDelay));

  while (noChangeCount < maxNoChange) {
    const currentPosts = document.querySelectorAll('.topic-post');
    for (const post of currentPosts) {
      const postNumberAttr = post.getAttribute('data-post-number');
      if (!postNumberAttr) continue;
      
      const postNumber = parseInt(postNumberAttr);
      if (postNumber <= 1) continue;
      
      if (!collectedComments.has(postNumber)) {
        const data = extractCommentData(post);
        if (data) {
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
          }
          collectedComments.set(postNumber, data);
        }
      }
    }

    if (onProgress) {
      onProgress(collectedComments.size);
    }

    window.scrollBy(0, scrollStep);
    await new Promise((resolve) => setTimeout(resolve, scrollDelay));

    const currentScrollTop = window.scrollY;
    if (currentScrollTop === lastScrollTop) {
      noChangeCount++;
    } else {
      noChangeCount = 0;
      lastScrollTop = currentScrollTop;
    }

    if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 100) {
      await new Promise((resolve) => setTimeout(resolve, scrollDelay * 2));
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 100) {
        noChangeCount = maxNoChange;
      }
    }
  }

  window.scrollTo(0, 0);
  return collectedComments;
}

/**
 * 提取单个评论数据
 * @param {HTMLElement} postElement - 评论元素 (.topic-post)
 * @returns {Object}
 */
export function extractCommentData(postElement) {
  const postNumberAttr = postElement.getAttribute('data-post-number');
  if (!postNumberAttr) {
    return null;
  }
  const postNumber = postNumberAttr;
  const article = postElement.querySelector('article[data-post-id]');
  
  if (!article) {
    return null;
  }

  const postId = article.getAttribute('data-post-id');
  const userId = article.getAttribute('data-user-id');

  const authorLink = article.querySelector('.names a');
  const authorUsername = authorLink ? authorLink.textContent.trim() : '';
  const authorHref = authorLink ? authorLink.getAttribute('href') : '';

  const userTitle = article.querySelector('.user-title');
  const userTitleText = userTitle ? userTitle.textContent.trim() : '';

  const avatarImg = article.querySelector('.post-avatar img.avatar');
  const avatarUrl = avatarImg ? avatarImg.getAttribute('src') : '';

  const dateElement = article.querySelector('.post-date .relative-date');
  const postDate = dateElement ? dateElement.getAttribute('data-time') : '';
  const postDateTitle = dateElement ? dateElement.getAttribute('title') : '';
  const postDateFormatted = dateElement ? dateElement.textContent.trim() : '';

  const contentElement = article.querySelector('.cooked');
  const content = contentElement ? contentElement.innerHTML : '';
  const contentText = contentElement ? contentElement.textContent.trim() : '';

  const quotes = [];
  const quoteElements = article.querySelectorAll('aside.quote');
  quoteElements.forEach((quote) => {
    const quotedUser = quote.getAttribute('data-username');
    const quotedPost = quote.getAttribute('data-post');
    const quotedTopic = quote.getAttribute('data-topic');
    const quotedContent = quote.querySelector('blockquote');
    quotes.push({
      username: quotedUser,
      postNumber: quotedPost,
      topicId: quotedTopic,
      content: quotedContent ? quotedContent.innerHTML : '',
    });
  });

  return {
    postId,
    postNumber: parseInt(postNumber),
    userId,
    author: {
      username: authorUsername,
      profileUrl: authorHref,
      avatarUrl: avatarUrl,
      title: userTitleText,
    },
    timestamp: postDate,
    dateTitle: postDateTitle,
    dateFormatted: postDateFormatted,
    content: content,
    contentText: contentText,
    quotes: quotes,
  };
}

/**
 * 提取主题统计信息（视图、点赞、链接、用户）
 * @param {boolean} convertImages - 是否转换图片为base64
 * @returns {Promise<Object>}
 */
export async function extractTopicStats(convertImages = false) {
  const topicMap = document.querySelector('.topic-map');
  if (!topicMap) {
    return null;
  }

  const stats = {};

  const viewsBtn = topicMap.querySelector('.topic-map__views-trigger');
  if (viewsBtn) {
    const viewsNum = viewsBtn.querySelector('.number');
    stats.views = viewsNum ? parseInt(viewsNum.textContent.trim()) : 0;
  }

  const likesBtn = topicMap.querySelector('.topic-map__likes-trigger');
  if (likesBtn) {
    const likesNum = likesBtn.querySelector('.number');
    stats.likes = likesNum ? parseInt(likesNum.textContent.trim()) : 0;
  }

  const linksBtn = topicMap.querySelector('.topic-map__links-trigger');
  if (linksBtn) {
    const linksNum = linksBtn.querySelector('.number');
    stats.links = linksNum ? parseInt(linksNum.textContent.trim()) : 0;
  }

  const usersBtn = topicMap.querySelector('.topic-map__users-trigger');
  if (usersBtn) {
    const usersNum = usersBtn.querySelector('.number');
    stats.userCount = usersNum ? parseInt(usersNum.textContent.trim()) : 0;
  }

  const participants = [];
  const usersList = topicMap.querySelectorAll('.topic-map__users-list .poster');
  for (const user of usersList) {
    const username = user.getAttribute('data-user-card') || user.getAttribute('title') || '';
    const avatarImg = user.querySelector('img.avatar');
    let avatarUrl = avatarImg ? avatarImg.getAttribute('src') : '';
    const postCountEl = user.querySelector('.post-count');
    const postCount = postCountEl ? parseInt(postCountEl.textContent.trim()) : 1;
    const displayName = avatarImg ? avatarImg.getAttribute('title') : username;

    if (convertImages && avatarUrl) {
      const fullUrl = avatarUrl.startsWith('http')
        ? avatarUrl
        : `https://linux.do${avatarUrl}`;
      avatarUrl = await imageToBase64(fullUrl);
    }

    participants.push({
      username,
      displayName,
      avatarUrl,
      postCount,
    });
  }

  stats.participants = participants;

  return stats;
}

/**
 * 提取所有评论（不包括主帖）
 * @param {boolean} convertImages - 是否转换图片为base64
 * @returns {Promise<Array>}
 */
export async function extractAllComments(convertImages = false) {
  const allPosts = document.querySelectorAll('.topic-post');
  const comments = [];
  const seenPostNumbers = new Set();

  for (const post of allPosts) {
    const postNumber = parseInt(post.getAttribute('data-post-number'));
    
    if (postNumber <= 1 || seenPostNumbers.has(postNumber)) {
      continue;
    }
    seenPostNumbers.add(postNumber);

    const data = extractCommentData(post);
    if (!data) continue;

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
    }

    comments.push(data);
  }

  comments.sort((a, b) => a.postNumber - b.postNumber);

  return comments;
}

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
  const topicPost = postElement.closest('.topic-post');
  const postNumber = topicPost ? topicPost.getAttribute('data-post-number') : '1';

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
  const topicPosts = document.querySelectorAll('.topic-post');
  const postData = [];
  const seenPostNumbers = new Set();

  for (const topicPost of topicPosts) {
    const postNumber = parseInt(topicPost.getAttribute('data-post-number'));
    
    if (postNumber !== 1 || seenPostNumbers.has(postNumber)) {
      continue;
    }
    seenPostNumbers.add(postNumber);

    const article = topicPost.querySelector('article[data-post-id]');
    if (!article) continue;

    const data = extractPostData(article);

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
  scrollAndCollectComments,
  extractCommentData,
  extractAllComments,
  extractTopicStats,
};
