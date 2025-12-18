/**
 * Linux.do 自动标记已读 - 工具函数模块
 */

/**
 * 工具函数集合
 */
export const Utils = {
  /**
   * 生成随机整数
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @returns {number}
   */
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * 生成随机浮点数
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @returns {number}
   */
  randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  },

  /**
   * 生成随机延迟时间
   * @param {Object} config - 配置对象 {min, max}
   * @returns {number}
   */
  randomDelay(config) {
    const base = this.random(config.min, config.max);
    const variation = base * 0.1;
    return base + this.random(-variation, variation);
  },

  /**
   * 高斯分布随机数
   * @param {number} mean - 均值
   * @param {number} stdDev - 标准差
   * @returns {number}
   */
  gaussianRandom(mean, stdDev) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * stdDev + mean;
  },

  /**
   * 睡眠函数
   * @param {number} ms - 毫秒数
   * @returns {Promise}
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  /**
   * 带取消功能的睡眠
   * @param {number} ms - 毫秒数
   * @returns {Promise}
   */
  sleepWithCancel(ms) {
    let timeoutId;
    const promise = new Promise((resolve) => {
      timeoutId = setTimeout(resolve, ms);
    });
    promise.cancel = () => clearTimeout(timeoutId);
    return promise;
  },

  /**
   * 截断字符串
   * @param {string} str - 字符串
   * @param {number} len - 最大长度
   * @returns {string}
   */
  truncate(str, len) {
    if (!str) return '';
    return str.length > len ? str.substring(0, len) + '...' : str;
  },

  /**
   * 格式化时间长度
   * @param {number} ms - 毫秒数
   * @returns {string}
   */
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },

  /**
   * 格式化数字
   * @param {number} num - 数字
   * @returns {string}
   */
  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  },

  /**
   * 检查是否在活跃时间段
   * @param {Object} settings - 设置对象
   * @returns {boolean}
   */
  isActiveHours(settings) {
    if (!settings.behavior.activeHours.enabled) return true;
    const hour = new Date().getHours();
    const { start, end } = settings.behavior.activeHours;
    if (start <= end) {
      return hour >= start && hour < end;
    } else {
      return hour >= start || hour < end;
    }
  },

  /**
   * 检查每日限制
   * @param {Object} settings - 设置对象
   * @param {Object} stats - 统计对象
   * @returns {Object}
   */
  checkDailyLimits(settings, stats) {
    const today = new Date().toDateString();
    if (stats.daily.date !== today) {
      stats.daily = { topicsMarked: 0, repliesMarked: 0, date: today };
    }

    return {
      topicsOk: stats.daily.topicsMarked < settings.safety.maxDailyTopics,
      repliesOk: stats.daily.repliesMarked < settings.safety.maxDailyReplies,
      topicsRemaining: settings.safety.maxDailyTopics - stats.daily.topicsMarked,
      repliesRemaining: settings.safety.maxDailyReplies - stats.daily.repliesMarked,
    };
  },

  /**
   * 深度合并对象
   * @param {Object} target - 目标对象
   * @param {Object} source - 源对象
   * @returns {Object}
   */
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        result[key] = this.deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  },

  /**
   * 打乱数组顺序
   * @param {Array} array - 数组
   * @returns {Array}
   */
  shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },
};

export default Utils;
