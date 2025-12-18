/**
 * Linux.do 自动标记已读 - API请求模块
 */

import State from './state.js';
import { Utils } from './utils.js';

/**
 * API请求管理器
 */
export const API = {
  requestCount: 0,
  lastRequestTime: 0,

  /**
   * 获取CSRF Token
   * @returns {Promise<string>}
   */
  async getCSRFToken() {
    if (!State.csrfToken) {
      const meta = document.querySelector('meta[name=csrf-token]');
      if (!meta) throw new Error('无法获取 CSRF Token');
      State.csrfToken = meta.content;
    }
    return State.csrfToken;
  },

  /**
   * 发送请求
   * @param {string} url - 请求URL
   * @param {Object} options - 请求选项
   * @returns {Promise<Response>}
   */
  async request(url, options = {}) {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < 500) {
      await Utils.sleep(500 - timeSinceLastRequest);
    }

    this.lastRequestTime = Date.now();
    this.requestCount++;

    const response = await fetch(url, {
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response;
  },

  /**
   * 获取帖子列表
   * @param {number} page - 页码
   * @returns {Promise<Object>}
   */
  async getTopics(page = 0) {
    const response = await this.request(
      `https://linux.do/latest.json?no_definitions=true&page=${page}`,
    );
    return response.json();
  },

  /**
   * 获取帖子详情
   * @param {number} topicId - 帖子ID
   * @returns {Promise<Object>}
   */
  async getTopicDetails(topicId) {
    const response = await this.request(`https://linux.do/t/${topicId}.json`);
    return response.json();
  },

  /**
   * 获取更多回复
   * @param {number} topicId - 帖子ID
   * @param {Array} postIds - 回复ID列表
   * @returns {Promise<Object>}
   */
  async getMorePosts(topicId, postIds) {
    const idsParam = postIds.map((id) => `post_ids[]=${id}`).join('&');
    const response = await this.request(
      `https://linux.do/t/${topicId}/posts.json?${idsParam}`,
    );
    return response.json();
  },

  /**
   * 标记为已读
   * @param {number} topicId - 帖子ID
   * @param {number|Array} postNumbers - 回复编号
   * @param {number} topicTime - 阅读时间
   * @returns {Promise<boolean>}
   */
  async markAsRead(topicId, postNumbers, topicTime) {
    const csrfToken = await this.getCSRFToken();

    let body = `topic_time=${topicTime}&topic_id=${topicId}`;

    if (Array.isArray(postNumbers)) {
      postNumbers.forEach((num) => {
        const readTime = Math.floor(topicTime * Utils.randomFloat(0.8, 1.2));
        body += `&timings%5B${num}%5D=${readTime}`;
      });
    } else {
      body += `&timings%5B${postNumbers}%5D=${topicTime}`;
    }

    await this.request('https://linux.do/topics/timings', {
      method: 'POST',
      headers: {
        accept: '*/*',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-csrf-token': csrfToken,
        'x-requested-with': 'XMLHttpRequest',
      },
      body,
    });

    return true;
  },

  /**
   * 更新阅读进度
   * @param {number} topicId - 帖子ID
   * @param {number} lastReadPostNumber - 最后阅读的回复编号
   * @param {number} highestPostNumber - 最高回复编号
   * @returns {Promise<boolean>}
   */
  async updateReadProgress(topicId, lastReadPostNumber, highestPostNumber) {
    const csrfToken = await this.getCSRFToken();

    await this.request(`https://linux.do/topics/topic/${topicId}/read.json`, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-csrf-token': csrfToken,
        'x-requested-with': 'XMLHttpRequest',
      },
      body: `last_read_post_number=${lastReadPostNumber}&highest_post_number=${highestPostNumber}`,
    });

    return true;
  },
};

export default API;
