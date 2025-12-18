// ==UserScript==
// @name         Linux.do 自动标记已读 Ultimate
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  自动将 Linux.do 论坛的帖子及回复标记为已读 - 真实行为模拟版
// @author       by.三文鱼 (Ultimate版)
// @match        https://linux.do/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @run-at       document-end
// ==/UserScript==

(function () {
  "use strict";

  // ==================== 配置系统 ====================
  const DEFAULT_CONFIG = {
    // 存储
    STORAGE_KEY: "linux_do_auto_reader_ultimate",

    // UI
    MAX_LOGS: 150,
    MAX_TOPICS_DISPLAY: 25,

    // 心跳
    HEARTBEAT_INTERVAL: 5000,
    TIMEOUT_THRESHOLD: 60000,
  };

  // 用户可调设置的默认值
  const DEFAULT_SETTINGS = {
    // 主题与显示
    theme: "dark",
    minimized: false,
    position: { x: null, y: null },

    // 通知
    sound: false,
    notifications: true,

    // 自动化
    autoStart: false,

    // 阅读模式
    mode: "human",

    // === 核心参数 ===
    // 并发设置
    concurrency: 1, // 并发数（1-5）

    // 间隔设置（毫秒）
    intervals: {
      betweenTopics: {
        // 帖子之间的间隔
        min: 8000,
        max: 25000,
      },
      betweenReplies: {
        // 回复之间的间隔
        min: 1500,
        max: 5000,
      },
      betweenBatches: {
        // 批次之间的间隔
        min: 30000,
        max: 90000,
      },
      pageStay: {
        // 页面停留时间
        min: 5000,
        max: 20000,
      },
      scrollPause: {
        // 滚动暂停时间
        min: 500,
        max: 2000,
      },
    },

    // 阅读设置
    reading: {
      maxRepliesPerTopic: 50, // 每个帖子最大阅读回复数
      maxTopicsPerBatch: 10, // 每批次最大帖子数
      scrollSimulation: true, // 模拟滚动
      randomOrder: true, // 随机顺序阅读
      skipLongTopics: false, // 跳过回复过多的帖子
      longTopicThreshold: 100, // 长帖子阈值
    },

    // 行为模拟
    behavior: {
      randomSkip: true, // 随机跳过某些帖子
      skipProbability: 0.1, // 跳过概率 (0-1)
      readingSpeedVariation: 0.3, // 阅读速度变化幅度
      occasionalPause: true, // 偶尔暂停
      pauseProbability: 0.05, // 暂停概率
      pauseDuration: {
        // 暂停时长
        min: 30000,
        max: 120000,
      },
      activeHours: {
        // 活跃时间段
        enabled: false,
        start: 8,
        end: 23,
      },
    },

    // 安全设置
    safety: {
      maxDailyTopics: 200, // 每日最大帖子数
      maxDailyReplies: 2000, // 每日最大回复数
      cooldownAfterError: 60000, // 错误后冷却时间
      maxConsecutiveErrors: 5, // 最大连续错误数
    },
  };

  // 预设模式
  const MODE_PRESETS = {
    turbo: {
      name: "⚡ 极速模式",
      desc: "最快速度，仅标记主帖",
      icon: "⚡",
      settings: {
        concurrency: 3,
        intervals: {
          betweenTopics: { min: 2000, max: 5000 },
          betweenReplies: { min: 500, max: 1000 },
          betweenBatches: { min: 10000, max: 20000 },
          pageStay: { min: 1000, max: 3000 },
          scrollPause: { min: 200, max: 500 },
        },
        reading: {
          maxRepliesPerTopic: 0,
          maxTopicsPerBatch: 20,
          scrollSimulation: false,
          randomOrder: false,
        },
        behavior: {
          randomSkip: false,
          occasionalPause: false,
        },
      },
    },
    fast: {
      name: "🚀 快速模式",
      desc: "较快速度，标记部分回复",
      icon: "🚀",
      settings: {
        concurrency: 2,
        intervals: {
          betweenTopics: { min: 4000, max: 10000 },
          betweenReplies: { min: 800, max: 2000 },
          betweenBatches: { min: 20000, max: 40000 },
          pageStay: { min: 2000, max: 5000 },
          scrollPause: { min: 300, max: 800 },
        },
        reading: {
          maxRepliesPerTopic: 20,
          maxTopicsPerBatch: 15,
          scrollSimulation: true,
          randomOrder: false,
        },
        behavior: {
          randomSkip: false,
          occasionalPause: false,
        },
      },
    },
    normal: {
      name: "📖 标准模式",
      desc: "平衡速度与安全",
      icon: "📖",
      settings: {
        concurrency: 1,
        intervals: {
          betweenTopics: { min: 8000, max: 20000 },
          betweenReplies: { min: 1500, max: 4000 },
          betweenBatches: { min: 45000, max: 90000 },
          pageStay: { min: 5000, max: 15000 },
          scrollPause: { min: 500, max: 1500 },
        },
        reading: {
          maxRepliesPerTopic: 50,
          maxTopicsPerBatch: 10,
          scrollSimulation: true,
          randomOrder: true,
        },
        behavior: {
          randomSkip: true,
          skipProbability: 0.1,
          occasionalPause: true,
          pauseProbability: 0.05,
        },
      },
    },
    human: {
      name: "🧑 仿真模式",
      desc: "模拟真实用户行为",
      icon: "🧑",
      settings: {
        concurrency: 1,
        intervals: {
          betweenTopics: { min: 15000, max: 45000 },
          betweenReplies: { min: 2000, max: 6000 },
          betweenBatches: { min: 60000, max: 180000 },
          pageStay: { min: 8000, max: 30000 },
          scrollPause: { min: 800, max: 3000 },
        },
        reading: {
          maxRepliesPerTopic: 30,
          maxTopicsPerBatch: 8,
          scrollSimulation: true,
          randomOrder: true,
        },
        behavior: {
          randomSkip: true,
          skipProbability: 0.15,
          occasionalPause: true,
          pauseProbability: 0.1,
          pauseDuration: { min: 60000, max: 180000 },
        },
      },
    },
    stealth: {
      name: "🥷 隐身模式",
      desc: "最大程度模拟真人",
      icon: "🥷",
      settings: {
        concurrency: 1,
        intervals: {
          betweenTopics: { min: 30000, max: 90000 },
          betweenReplies: { min: 3000, max: 10000 },
          betweenBatches: { min: 120000, max: 300000 },
          pageStay: { min: 15000, max: 60000 },
          scrollPause: { min: 1000, max: 5000 },
        },
        reading: {
          maxRepliesPerTopic: 20,
          maxTopicsPerBatch: 5,
          scrollSimulation: true,
          randomOrder: true,
        },
        behavior: {
          randomSkip: true,
          skipProbability: 0.2,
          occasionalPause: true,
          pauseProbability: 0.15,
          pauseDuration: { min: 120000, max: 300000 },
          activeHours: { enabled: true, start: 9, end: 22 },
        },
      },
    },
    custom: {
      name: "⚙️ 自定义",
      desc: "完全自定义参数",
      icon: "⚙️",
      settings: null, // 使用用户设置
    },
  };

  // ==================== 状态管理 ====================
  const State = {
    isRunning: false,
    isPaused: false,
    lastCheckTime: 0,
    csrfToken: null,
    currentTopic: null,

    // 运行状态
    runtime: {
      startTime: null,
      pausedTime: 0,
      lastPauseStart: null,
    },

    // 统计数据
    stats: {
      session: {
        topicsMarked: 0,
        repliesMarked: 0,
        topicsSkipped: 0,
        errors: 0,
        startTime: null,
      },
      daily: {
        topicsMarked: 0,
        repliesMarked: 0,
        date: null,
      },
      total: {
        topicsMarked: 0,
        repliesMarked: 0,
      },
    },

    // 队列
    queue: {
      topics: [],
      currentIndex: 0,
      processing: false,
    },

    // 错误追踪
    errors: {
      consecutive: 0,
      lastError: null,
    },

    // 设置
    settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
  };

  // ==================== 工具函数 ====================
  const Utils = {
    // 随机数生成
    random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomFloat(min, max) {
      return Math.random() * (max - min) + min;
    },

    // 随机延迟
    randomDelay(config) {
      const base = this.random(config.min, config.max);
      // 添加微小随机波动
      const variation = base * 0.1;
      return base + this.random(-variation, variation);
    },

    // 高斯分布随机数（更自然的分布）
    gaussianRandom(mean, stdDev) {
      let u = 0,
        v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      return num * stdDev + mean;
    },

    // 睡眠
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    // 带取消的睡眠
    sleepWithCancel(ms) {
      let timeoutId;
      const promise = new Promise((resolve, reject) => {
        timeoutId = setTimeout(resolve, ms);
      });
      promise.cancel = () => clearTimeout(timeoutId);
      return promise;
    },

    // 截断字符串
    truncate(str, len) {
      if (!str) return "";
      return str.length > len ? str.substring(0, len) + "..." : str;
    },

    // 格式化时间
    formatDuration(ms) {
      const seconds = Math.floor(ms / 1000);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")}`;
      }
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    },

    // 格式化数字
    formatNumber(num) {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
      if (num >= 1000) return (num / 1000).toFixed(1) + "K";
      return num.toString();
    },

    // 检查是否在活跃时间段
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

    // 检查每日限制
    checkDailyLimits(settings, stats) {
      const today = new Date().toDateString();
      if (stats.daily.date !== today) {
        stats.daily = { topicsMarked: 0, repliesMarked: 0, date: today };
      }

      return {
        topicsOk: stats.daily.topicsMarked < settings.safety.maxDailyTopics,
        repliesOk: stats.daily.repliesMarked < settings.safety.maxDailyReplies,
        topicsRemaining:
          settings.safety.maxDailyTopics - stats.daily.topicsMarked,
        repliesRemaining:
          settings.safety.maxDailyReplies - stats.daily.repliesMarked,
      };
    },

    // 深度合并对象
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

    // 打乱数组
    shuffle(array) {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    },
  };

  // ==================== 存储管理 ====================
  const Storage = {
    save() {
      const data = {
        isRunning: State.isRunning,
        lastCheckTime: Date.now(),
        stats: State.stats,
        settings: State.settings,
      };
      try {
        localStorage.setItem(DEFAULT_CONFIG.STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error("保存状态失败:", e);
      }
    },

    load() {
      try {
        const saved = localStorage.getItem(DEFAULT_CONFIG.STORAGE_KEY);
        if (saved) {
          const data = JSON.parse(saved);
          State.isRunning = data.isRunning || false;
          State.lastCheckTime = data.lastCheckTime || 0;
          State.stats = Utils.deepMerge(State.stats, data.stats || {});
          State.settings = Utils.deepMerge(
            DEFAULT_SETTINGS,
            data.settings || {}
          );
        }
      } catch (e) {
        console.error("加载状态失败:", e);
      }
    },

    clear() {
      localStorage.removeItem(DEFAULT_CONFIG.STORAGE_KEY);
      State.stats = {
        session: {
          topicsMarked: 0,
          repliesMarked: 0,
          topicsSkipped: 0,
          errors: 0,
          startTime: null,
        },
        daily: { topicsMarked: 0, repliesMarked: 0, date: null },
        total: { topicsMarked: 0, repliesMarked: 0 },
      };
      UI.updateStats();
      Logger.info("📊 统计数据已重置");
    },

    exportSettings() {
      return JSON.stringify(State.settings, null, 2);
    },

    importSettings(json) {
      try {
        const settings = JSON.parse(json);
        State.settings = Utils.deepMerge(DEFAULT_SETTINGS, settings);
        Storage.save();
        return true;
      } catch (e) {
        return false;
      }
    },
  };

  // ==================== API 请求 ====================
  const API = {
    requestCount: 0,
    lastRequestTime: 0,

    async getCSRFToken() {
      if (!State.csrfToken) {
        const meta = document.querySelector("meta[name=csrf-token]");
        if (!meta) throw new Error("无法获取 CSRF Token");
        State.csrfToken = meta.content;
      }
      return State.csrfToken;
    },

    async request(url, options = {}) {
      // 请求频率限制
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < 500) {
        await Utils.sleep(500 - timeSinceLastRequest);
      }

      this.lastRequestTime = Date.now();
      this.requestCount++;

      const response = await fetch(url, {
        credentials: "include",
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    },

    async getTopics(page = 0) {
      const response = await this.request(
        `https://linux.do/latest.json?no_definitions=true&page=${page}`
      );
      return response.json();
    },

    async getTopicDetails(topicId) {
      const response = await this.request(`https://linux.do/t/${topicId}.json`);
      return response.json();
    },

    async getMorePosts(topicId, postIds) {
      const idsParam = postIds.map((id) => `post_ids[]=${id}`).join("&");
      const response = await this.request(
        `https://linux.do/t/${topicId}/posts.json?${idsParam}`
      );
      return response.json();
    },

    async markAsRead(topicId, postNumbers, topicTime) {
      const csrfToken = await this.getCSRFToken();

      // 构建请求体
      let body = `topic_time=${topicTime}&topic_id=${topicId}`;

      if (Array.isArray(postNumbers)) {
        postNumbers.forEach((num) => {
          // 为每个帖子生成略微不同的阅读时间
          const readTime = Math.floor(topicTime * Utils.randomFloat(0.8, 1.2));
          body += `&timings%5B${num}%5D=${readTime}`;
        });
      } else {
        body += `&timings%5B${postNumbers}%5D=${topicTime}`;
      }

      await this.request("https://linux.do/topics/timings", {
        method: "POST",
        headers: {
          accept: "*/*",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-csrf-token": csrfToken,
          "x-requested-with": "XMLHttpRequest",
        },
        body,
      });

      return true;
    },

    async updateReadProgress(topicId, lastReadPostNumber, highestPostNumber) {
      const csrfToken = await this.getCSRFToken();

      await this.request(`https://linux.do/topics/topic/${topicId}/read.json`, {
        method: "POST",
        headers: {
          accept: "*/*",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-csrf-token": csrfToken,
          "x-requested-with": "XMLHttpRequest",
        },
        body: `last_read_post_number=${lastReadPostNumber}&highest_post_number=${highestPostNumber}`,
      });

      return true;
    },
  };

  // ==================== 行为模拟器 ====================
  const BehaviorSimulator = {
    // 模拟阅读一个帖子
    async simulateReading(topic, settings) {
      const { intervals, reading, behavior } = settings;

      // 检查是否应该跳过
      if (behavior.randomSkip && Math.random() < behavior.skipProbability) {
        Logger.info(`⏭️ 随机跳过: ${Utils.truncate(topic.title, 30)}`);
        State.stats.session.topicsSkipped++;
        return { skipped: true };
      }

      // 检查是否是长帖子
      if (
        reading.skipLongTopics &&
        topic.posts_count > reading.longTopicThreshold
      ) {
        Logger.info(
          `⏭️ 跳过长帖(${topic.posts_count}回复): ${Utils.truncate(
            topic.title,
            25
          )}`
        );
        State.stats.session.topicsSkipped++;
        return { skipped: true };
      }

      Logger.info(`📖 阅读: ${Utils.truncate(topic.title, 35)}`);
      State.currentTopic = topic;
      UI.updateProgress(0, `阅读中...`);

      try {
        // 获取帖子详情
        const details = await API.getTopicDetails(topic.id);
        const posts = details.post_stream?.posts || [];
        const allPostIds = details.post_stream?.stream || [];

        // 计算要阅读的回复数
        let maxReplies = reading.maxRepliesPerTopic;
        if (maxReplies === 0) {
          // 仅标记主帖
          await this.markWithDelay(topic.id, [1], intervals);
          return { topicsMarked: 1, repliesMarked: 1 };
        }

        // 模拟页面停留
        const stayTime = Utils.randomDelay(intervals.pageStay);
        Logger.info(`   └─ 停留 ${(stayTime / 1000).toFixed(1)}s`);
        await Utils.sleep(stayTime);

        // 收集要标记的帖子
        let postNumbersToMark = posts.map((p) => p.post_number);

        // 加载更多回复
        if (
          allPostIds.length > posts.length &&
          postNumbersToMark.length < maxReplies
        ) {
          const loadedIds = new Set(posts.map((p) => p.id));
          const remainingIds = allPostIds.filter((id) => !loadedIds.has(id));
          const idsToLoad = remainingIds.slice(
            0,
            maxReplies - postNumbersToMark.length
          );

          if (idsToLoad.length > 0) {
            Logger.info(`   └─ 加载更多回复 (${idsToLoad.length}个)`);

            const batchSize = 20;
            for (let i = 0; i < idsToLoad.length; i += batchSize) {
              if (!State.isRunning || State.isPaused) break;

              const batch = idsToLoad.slice(i, i + batchSize);
              try {
                const morePosts = await API.getMorePosts(topic.id, batch);
                const newNumbers =
                  morePosts.post_stream?.posts?.map((p) => p.post_number) || [];
                postNumbersToMark.push(...newNumbers);

                // 模拟滚动
                if (reading.scrollSimulation) {
                  await Utils.sleep(Utils.randomDelay(intervals.scrollPause));
                }
              } catch (e) {
                Logger.warn(`   └─ 加载回复失败: ${e.message}`);
              }
            }
          }
        }

        // 限制回复数量
        postNumbersToMark = postNumbersToMark.slice(0, maxReplies);

        // 模拟逐个阅读并标记
        let repliesMarked = 0;
        const markBatchSize = 5; // 每次标记5个

        for (let i = 0; i < postNumbersToMark.length; i += markBatchSize) {
          if (!State.isRunning || State.isPaused) break;

          const batch = postNumbersToMark.slice(i, i + markBatchSize);
          const progress =
            ((i + batch.length) / postNumbersToMark.length) * 100;

          UI.updateProgress(
            progress,
            `阅读回复 ${i + 1}-${i + batch.length}/${postNumbersToMark.length}`
          );

          // 模拟阅读时间
          const readTime = Utils.random(
            intervals.betweenReplies.min * batch.length * 0.3,
            intervals.betweenReplies.max * batch.length * 0.5
          );

          await API.markAsRead(topic.id, batch, readTime);
          repliesMarked += batch.length;

          // 回复之间的间隔
          if (i + markBatchSize < postNumbersToMark.length) {
            const delay = Utils.randomDelay(intervals.betweenReplies);
            await Utils.sleep(delay);
          }
        }

        // 更新阅读进度
        if (postNumbersToMark.length > 0) {
          const lastPostNumber = Math.max(...postNumbersToMark);
          await API.updateReadProgress(
            topic.id,
            lastPostNumber,
            topic.highest_post_number || lastPostNumber
          );
        }

        Logger.success(`   └─ ✓ 已读 ${repliesMarked} 个回复`);

        return { topicsMarked: 1, repliesMarked };
      } catch (error) {
        Logger.error(`   └─ ✗ 失败: ${error.message}`);
        throw error;
      }
    },

    async markWithDelay(topicId, postNumbers, intervals) {
      const readTime = Utils.random(1000, 3000);
      await API.markAsRead(topicId, postNumbers, readTime);
    },

    // 检查是否需要暂停
    async checkForPause(settings) {
      const { behavior } = settings;

      if (
        behavior.occasionalPause &&
        Math.random() < behavior.pauseProbability
      ) {
        const pauseDuration = Utils.randomDelay(behavior.pauseDuration);
        Logger.info(`☕ 随机休息 ${Utils.formatDuration(pauseDuration)}`);
        UI.updateProgress(0, `休息中...`);
        await Utils.sleep(pauseDuration);
        return true;
      }

      return false;
    },
  };

  // ==================== 核心控制器 ====================
  const Core = {
    checkTimer: null,
    heartbeatTimer: null,
    currentSleepPromise: null,

    getEffectiveSettings() {
      const mode = State.settings.mode;
      if (mode === "custom" || !MODE_PRESETS[mode]) {
        return State.settings;
      }

      const preset = MODE_PRESETS[mode];
      return Utils.deepMerge(State.settings, preset.settings || {});
    },

    async doCheck() {
      if (!State.isRunning || State.isPaused) return;

      const settings = this.getEffectiveSettings();

      // 检查活跃时间
      if (!Utils.isActiveHours(settings)) {
        Logger.info("💤 当前不在活跃时间段，等待中...");
        this.scheduleNextCheck(settings.intervals.betweenBatches);
        return;
      }

      // 检查每日限制
      const limits = Utils.checkDailyLimits(settings, State.stats);
      if (!limits.topicsOk) {
        Logger.warn(
          `⚠️ 已达到每日帖子上限 (${settings.safety.maxDailyTopics})`
        );
        this.stop();
        return;
      }

      UI.updateProgress(0, "获取帖子列表...");

      try {
        const res = await API.getTopics();
        const topics = res.topic_list?.topics || [];
        let unseenTopics = topics.filter((t) => t.unseen);

        UI.updateTopicsList(topics);

        if (unseenTopics.length === 0) {
          Logger.info(`✓ 无未读帖子 (共 ${topics.length} 个)`);
          UI.updateProgress(100, "等待下次检查...");
        } else {
          // 限制每批次数量
          const maxBatch = Math.min(
            settings.reading.maxTopicsPerBatch,
            limits.topicsRemaining
          );
          unseenTopics = unseenTopics.slice(0, maxBatch);

          // 随机顺序
          if (settings.reading.randomOrder) {
            unseenTopics = Utils.shuffle(unseenTopics);
          }

          Logger.success(`📬 发现 ${unseenTopics.length} 个未读帖子`);

          if (State.settings.sound) this.playSound();
          if (State.settings.notifications) {
            this.showNotification(`发现 ${unseenTopics.length} 个未读帖子`);
          }

          await this.processTopics(unseenTopics, settings);
        }

        State.errors.consecutive = 0;
      } catch (error) {
        Logger.error(`检查失败: ${error.message}`);
        State.stats.session.errors++;
        State.errors.consecutive++;
        State.errors.lastError = error.message;

        // 连续错误处理
        if (State.errors.consecutive >= settings.safety.maxConsecutiveErrors) {
          Logger.error(`连续错误过多，暂停运行`);
          this.pause();
          return;
        }

        // 错误后冷却
        Logger.info(
          `等待 ${settings.safety.cooldownAfterError / 1000}s 后重试...`
        );
        await Utils.sleep(settings.safety.cooldownAfterError);
      }

      State.lastCheckTime = Date.now();
      Storage.save();

      if (State.isRunning && !State.isPaused) {
        this.scheduleNextCheck(settings.intervals.betweenBatches);
      }
    },

    async processTopics(topics, settings) {
      const { concurrency } = settings;

      if (concurrency > 1) {
        await this.processTopicsConcurrent(topics, settings, concurrency);
      } else {
        await this.processTopicsSequential(topics, settings);
      }
    },

    async processTopicsSequential(topics, settings) {
      for (let i = 0; i < topics.length; i++) {
        if (!State.isRunning || State.isPaused) break;

        const topic = topics[i];
        const progress = ((i + 1) / topics.length) * 100;
        UI.updateProgress(progress, `处理 ${i + 1}/${topics.length}`);
        UI.highlightCurrentTopic(topic.id);

        try {
          const result = await BehaviorSimulator.simulateReading(
            topic,
            settings
          );

          if (!result.skipped) {
            State.stats.session.topicsMarked++;
            State.stats.daily.topicsMarked++;
            State.stats.total.topicsMarked++;

            if (result.repliesMarked) {
              State.stats.session.repliesMarked += result.repliesMarked;
              State.stats.daily.repliesMarked += result.repliesMarked;
              State.stats.total.repliesMarked += result.repliesMarked;
            }

            UI.updateStats();
          }
        } catch (error) {
          State.stats.session.errors++;
          State.errors.consecutive++;
        }

        // 帖子之间的间隔
        if (i < topics.length - 1 && State.isRunning && !State.isPaused) {
          // 检查随机暂停
          await BehaviorSimulator.checkForPause(settings);

          const delay = Utils.randomDelay(settings.intervals.betweenTopics);
          Logger.info(`⏳ 等待 ${(delay / 1000).toFixed(1)}s`);
          await Utils.sleep(delay);
        }
      }

      State.currentTopic = null;
      UI.updateProgress(100, "批次完成");
      Logger.success(`✅ 本轮完成`);
    },

    async processTopicsConcurrent(topics, settings, concurrency) {
      const queue = [...topics];
      const workers = [];
      let completedCount = 0;

      const worker = async (workerId) => {
        while (queue.length > 0 && State.isRunning && !State.isPaused) {
          const topic = queue.shift();
          if (!topic) break;

          try {
            const result = await BehaviorSimulator.simulateReading(
              topic,
              settings
            );

            if (!result.skipped) {
              State.stats.session.topicsMarked++;
              State.stats.daily.topicsMarked++;
              State.stats.total.topicsMarked++;

              if (result.repliesMarked) {
                State.stats.session.repliesMarked += result.repliesMarked;
                State.stats.daily.repliesMarked += result.repliesMarked;
                State.stats.total.repliesMarked += result.repliesMarked;
              }
            }
          } catch (error) {
            State.stats.session.errors++;
          }

          completedCount++;
          const progress = (completedCount / topics.length) * 100;
          UI.updateProgress(
            progress,
            `处理 ${completedCount}/${topics.length}`
          );
          UI.updateStats();

          // 工作间隔
          if (queue.length > 0) {
            const delay = Utils.randomDelay(settings.intervals.betweenTopics);
            await Utils.sleep(delay / concurrency); // 并发时缩短间隔
          }
        }
      };

      // 启动工作线程
      for (let i = 0; i < concurrency; i++) {
        workers.push(worker(i));
      }

      await Promise.all(workers);

      State.currentTopic = null;
      UI.updateProgress(100, "批次完成");
      Logger.success(`✅ 本轮完成 (${concurrency}并发)`);
    },

    scheduleNextCheck(intervalConfig) {
      const delay = Utils.randomDelay(intervalConfig);
      Logger.info(`⏰ ${Utils.formatDuration(delay)} 后下次检查`);
      this.checkTimer = setTimeout(() => this.doCheck(), delay);
    },

    start() {
      if (State.isRunning) return;

      State.isRunning = true;
      State.isPaused = false;
      State.runtime.startTime = Date.now();
      State.stats.session = {
        topicsMarked: 0,
        repliesMarked: 0,
        topicsSkipped: 0,
        errors: 0,
        startTime: Date.now(),
      };
      State.errors.consecutive = 0;

      Storage.save();
      UI.updateStatus();

      const mode = MODE_PRESETS[State.settings.mode];
      Logger.success(`🚀 开始运行 [${mode?.name || "自定义"}]`);

      this.doCheck();
      this.startHeartbeat();
    },

    stop() {
      State.isRunning = false;
      State.isPaused = false;
      State.currentTopic = null;

      clearTimeout(this.checkTimer);
      clearTimeout(this.heartbeatTimer);

      Storage.save();
      UI.updateStatus();
      UI.updateProgress(0, "已停止");
      Logger.info("⏹ 已停止");
    },

    pause() {
      State.isPaused = !State.isPaused;

      if (State.isPaused) {
        State.runtime.lastPauseStart = Date.now();
        clearTimeout(this.checkTimer);
        Logger.info("⏸ 已暂停");
      } else {
        if (State.runtime.lastPauseStart) {
          State.runtime.pausedTime += Date.now() - State.runtime.lastPauseStart;
        }
        Logger.info("▶ 已恢复");
        if (State.isRunning) {
          this.doCheck();
        }
      }

      UI.updateStatus();
    },

    startHeartbeat() {
      const check = () => {
        if (!State.isRunning) return;

        const now = Date.now();
        if (
          now - State.lastCheckTime > DEFAULT_CONFIG.TIMEOUT_THRESHOLD &&
          !State.isPaused
        ) {
          Logger.warn("💓 心跳触发");
          this.doCheck();
        }

        this.heartbeatTimer = setTimeout(
          check,
          DEFAULT_CONFIG.HEARTBEAT_INTERVAL
        );
      };
      check();
    },

    checkNow() {
      if (!State.isRunning) {
        this.start();
      } else if (!State.isPaused) {
        clearTimeout(this.checkTimer);
        this.doCheck();
      }
    },

    playSound() {
      try {
        const audio = new Audio(
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp6jn5yklomCgX19hIuVnJ+dmpeQiYOBgYSHi4+Slo+LhoOBgA=="
        );
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch (e) {}
    },

    showNotification(text) {
      if (typeof GM_notification === "function") {
        GM_notification({
          title: "Linux.do 自动阅读",
          text: text,
          timeout: 3000,
        });
      }
    },
  };

  // ==================== 日志系统 ====================
  const Logger = {
    logs: [],

    add(message, type) {
      const time = new Date().toLocaleTimeString("zh-CN", { hour12: false });
      const log = { time, message, type };

      this.logs.push(log);
      if (this.logs.length > DEFAULT_CONFIG.MAX_LOGS) {
        this.logs.shift();
      }

      UI.appendLog(log);
      console.log(`[${type.toUpperCase()}] ${time} ${message}`);
    },

    info(msg) {
      this.add(msg, "info");
    },
    success(msg) {
      this.add(msg, "success");
    },
    warn(msg) {
      this.add(msg, "warning");
    },
    error(msg) {
      this.add(msg, "error");
    },

    clear() {
      this.logs = [];
      const container = document.getElementById("ar-logs");
      if (container) {
        container.innerHTML = `
                    <div class="ar-empty">
                        <div class="ar-empty-icon">📭</div>
                        <div class="ar-empty-text">暂无日志</div>
                    </div>
                `;
      }
    },
  };

  // ==================== UI 系统 ====================
  const UI = {
    container: null,
    isDragging: false,
    dragOffset: { x: 0, y: 0 },

    init() {
      this.injectStyles();
      this.createPanel();
      this.bindEvents();
      this.restorePosition();
      this.updateStatus();
      this.updateStats();
      this.updateModeDisplay();
    },

    injectStyles() {
      GM_addStyle(`
                /* ===== CSS 变量 ===== */
                :root {
                    --ar-bg: rgba(13, 17, 23, 0.98);
                    --ar-bg-secondary: rgba(22, 27, 34, 0.95);
                    --ar-bg-tertiary: rgba(33, 38, 45, 0.9);
                    --ar-bg-hover: rgba(48, 54, 61, 0.8);
                    --ar-border: rgba(48, 54, 61, 0.6);
                    --ar-border-light: rgba(48, 54, 61, 0.3);
                    --ar-text: #e6edf3;
                    --ar-text-secondary: #8b949e;
                    --ar-text-muted: #6e7681;
                    --ar-accent: #58a6ff;
                    --ar-accent-dim: rgba(88, 166, 255, 0.15);
                    --ar-success: #3fb950;
                    --ar-success-dim: rgba(63, 185, 80, 0.15);
                    --ar-warning: #d29922;
                    --ar-warning-dim: rgba(210, 153, 34, 0.15);
                    --ar-error: #f85149;
                    --ar-error-dim: rgba(248, 81, 73, 0.15);
                    --ar-purple: #a371f7;
                    --ar-cyan: #39d4d4;
                    --ar-shadow: 0 16px 70px rgba(0, 0, 0, 0.5);
                    --ar-radius: 16px;
                    --ar-radius-md: 12px;
                    --ar-radius-sm: 8px;
                    --ar-radius-xs: 6px;
                    --ar-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .ar-light {
                    --ar-bg: rgba(255, 255, 255, 0.98);
                    --ar-bg-secondary: rgba(246, 248, 250, 0.95);
                    --ar-bg-tertiary: rgba(234, 238, 242, 0.9);
                    --ar-bg-hover: rgba(208, 215, 222, 0.6);
                    --ar-border: rgba(208, 215, 222, 0.8);
                    --ar-border-light: rgba(208, 215, 222, 0.4);
                    --ar-text: #24292f;
                    --ar-text-secondary: #57606a;
                    --ar-text-muted: #8c959f;
                    --ar-shadow: 0 16px 70px rgba(0, 0, 0, 0.12);
                }

                /* ===== 主容器 ===== */
                #ar-panel {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 400px;
                    background: var(--ar-bg);
                    color: var(--ar-text);
                    border-radius: var(--ar-radius);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC', sans-serif;
                    font-size: 13px;
                    z-index: 99999;
                    box-shadow: var(--ar-shadow);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--ar-border);
                    transition: var(--ar-transition);
                    overflow: hidden;
                    max-height: 90vh;
                }

                #ar-panel.minimized {
                    width: 240px;
                }

                #ar-panel.minimized #ar-body {
                    display: none;
                }

                /* ===== 头部 ===== */
                #ar-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 16px;
                    background: var(--ar-bg-secondary);
                    cursor: move;
                    user-select: none;
                    border-bottom: 1px solid var(--ar-border);
                }

                #ar-title-section {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                #ar-status-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: var(--ar-text-muted);
                    transition: var(--ar-transition);
                    flex-shrink: 0;
                }

                #ar-status-dot.running {
                    background: var(--ar-success);
                    box-shadow: 0 0 0 3px var(--ar-success-dim);
                    animation: statusPulse 2s ease-in-out infinite;
                }

                #ar-status-dot.paused {
                    background: var(--ar-warning);
                    box-shadow: 0 0 0 3px var(--ar-warning-dim);
                }

                @keyframes statusPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }

                #ar-title {
                    font-weight: 600;
                    font-size: 14px;
                }

                #ar-mode-badge {
                    font-size: 11px;
                    padding: 3px 10px;
                    background: var(--ar-accent-dim);
                    color: var(--ar-accent);
                    border-radius: 20px;
                    font-weight: 500;
                    border: 1px solid var(--ar-accent);
                }

                #ar-header-controls {
                    display: flex;
                    gap: 4px;
                }

                .ar-icon-btn {
                    background: transparent;
                    border: none;
                    color: var(--ar-text-secondary);
                    cursor: pointer;
                    padding: 6px;
                    border-radius: var(--ar-radius-xs);
                    font-size: 14px;
                    transition: var(--ar-transition);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                }

                .ar-icon-btn:hover {
                    background: var(--ar-bg-hover);
                    color: var(--ar-text);
                }

                /* ===== 主体 ===== */
                #ar-body {
                    padding: 16px;
                    max-height: calc(90vh - 60px);
                    overflow-y: auto;
                }

                #ar-body::-webkit-scrollbar {
                    width: 6px;
                }

                #ar-body::-webkit-scrollbar-thumb {
                    background: var(--ar-border);
                    border-radius: 3px;
                }

                /* ===== 统计卡片 ===== */
                #ar-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                    margin-bottom: 16px;
                }

                .ar-stat-card {
                    background: var(--ar-bg-secondary);
                    padding: 12px 8px;
                    border-radius: var(--ar-radius-sm);
                    text-align: center;
                    border: 1px solid var(--ar-border-light);
                    transition: var(--ar-transition);
                }

                .ar-stat-card:hover {
                    border-color: var(--ar-border);
                    transform: translateY(-1px);
                }

                .ar-stat-value {
                    font-size: 18px;
                    font-weight: 700;
                    line-height: 1.2;
                    font-family: 'SF Mono', 'Consolas', monospace;
                }

                .ar-stat-card:nth-child(1) .ar-stat-value { color: var(--ar-accent); }
                .ar-stat-card:nth-child(2) .ar-stat-value { color: var(--ar-purple); }
                .ar-stat-card:nth-child(3) .ar-stat-value { color: var(--ar-success); }
                .ar-stat-card:nth-child(4) .ar-stat-value { color: var(--ar-cyan); }

                .ar-stat-label {
                    font-size: 10px;
                    color: var(--ar-text-muted);
                    margin-top: 4px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                /* ===== 进度区域 ===== */
                #ar-progress-container {
                    margin-bottom: 16px;
                    background: var(--ar-bg-secondary);
                    padding: 12px;
                    border-radius: var(--ar-radius-sm);
                    border: 1px solid var(--ar-border-light);
                }

                #ar-progress-bar {
                    height: 6px;
                    background: var(--ar-bg-tertiary);
                    border-radius: 3px;
                    overflow: hidden;
                }

                #ar-progress-fill {
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, var(--ar-accent), var(--ar-purple), var(--ar-success));
                    background-size: 200% 100%;
                    border-radius: 3px;
                    transition: width 0.3s ease;
                    animation: progressGradient 3s ease infinite;
                }

                @keyframes progressGradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                #ar-progress-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 8px;
                    font-size: 11px;
                }

                #ar-progress-text {
                    color: var(--ar-text-secondary);
                }

                #ar-current-topic {
                    color: var(--ar-text-muted);
                    max-width: 180px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* ===== 控制按钮 ===== */
                #ar-controls {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                    margin-bottom: 16px;
                }

                .ar-btn {
                    padding: 10px 8px;
                    border: none;
                    border-radius: var(--ar-radius-sm);
                    cursor: pointer;
                    font-size: 11px;
                    font-weight: 600;
                    transition: var(--ar-transition);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    position: relative;
                    overflow: hidden;
                }

                .ar-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%);
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .ar-btn:hover::before {
                    opacity: 1;
                }

                .ar-btn-icon {
                    font-size: 16px;
                }

                .ar-btn-primary {
                    background: linear-gradient(135deg, var(--ar-success), #2ea043);
                    color: white;
                }

                .ar-btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px var(--ar-success-dim);
                }

                .ar-btn-secondary {
                    background: var(--ar-bg-secondary);
                    color: var(--ar-text);
                    border: 1px solid var(--ar-border);
                }

                .ar-btn-secondary:hover:not(:disabled) {
                    background: var(--ar-bg-tertiary);
                    border-color: var(--ar-text-muted);
                }

                .ar-btn-warning {
                    background: linear-gradient(135deg, var(--ar-warning), #bf8700);
                    color: white;
                }

                .ar-btn-danger {
                    background: linear-gradient(135deg, var(--ar-error), #da3633);
                    color: white;
                }

                .ar-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    transform: none !important;
                    box-shadow: none !important;
                }

                /* ===== 标签页 ===== */
                #ar-tabs {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 12px;
                    background: var(--ar-bg-secondary);
                    padding: 4px;
                    border-radius: var(--ar-radius-sm);
                    border: 1px solid var(--ar-border-light);
                }

                .ar-tab {
                    flex: 1;
                    padding: 8px 6px;
                    border: none;
                    background: transparent;
                    color: var(--ar-text-secondary);
                    cursor: pointer;
                    border-radius: var(--ar-radius-xs);
                    font-size: 11px;
                    font-weight: 500;
                    transition: var(--ar-transition);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                }

                .ar-tab:hover {
                    color: var(--ar-text);
                    background: var(--ar-bg-tertiary);
                }

                .ar-tab.active {
                    background: var(--ar-bg);
                    color: var(--ar-accent);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }

                /* ===== 内容区域 ===== */
                .ar-tab-content {
                    display: none;
                    max-height: 280px;
                    overflow-y: auto;
                    background: var(--ar-bg-secondary);
                    border-radius: var(--ar-radius-sm);
                    border: 1px solid var(--ar-border-light);
                }

                .ar-tab-content.active {
                    display: block;
                }

                .ar-tab-content::-webkit-scrollbar {
                    width: 6px;
                }

                .ar-tab-content::-webkit-scrollbar-thumb {
                    background: var(--ar-border);
                    border-radius: 3px;
                }

                /* ===== 日志 ===== */
                #ar-logs {
                    padding: 8px;
                }

                .ar-log-item {
                    padding: 8px 10px;
                    border-radius: var(--ar-radius-xs);
                    margin-bottom: 4px;
                    font-size: 11px;
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    line-height: 1.5;
                    background: var(--ar-bg-tertiary);
                    border-left: 3px solid transparent;
                    animation: logSlideIn 0.2s ease;
                }

                @keyframes logSlideIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .ar-log-item.info { border-left-color: var(--ar-accent); }
                .ar-log-item.success { border-left-color: var(--ar-success); }
                .ar-log-item.warning { border-left-color: var(--ar-warning); }
                .ar-log-item.error { border-left-color: var(--ar-error); }

                .ar-log-time {
                    color: var(--ar-text-muted);
                    font-size: 10px;
                    font-family: 'SF Mono', monospace;
                    flex-shrink: 0;
                }

                .ar-log-msg {
                    flex: 1;
                    word-break: break-word;
                }

                .ar-log-item.info .ar-log-msg { color: var(--ar-text); }
                .ar-log-item.success .ar-log-msg { color: var(--ar-success); }
                .ar-log-item.warning .ar-log-msg { color: var(--ar-warning); }
                .ar-log-item.error .ar-log-msg { color: var(--ar-error); }

                /* ===== 帖子列表 ===== */
                #ar-topics {
                    padding: 6px;
                }

                .ar-topic-item {
                    padding: 10px 12px;
                    border-radius: var(--ar-radius-xs);
                    margin-bottom: 4px;
                    transition: var(--ar-transition);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: var(--ar-bg-tertiary);
                }

                .ar-topic-item:hover {
                    background: var(--ar-bg-hover);
                }

                .ar-topic-item.current {
                    background: var(--ar-accent-dim);
                    border: 1px solid var(--ar-accent);
                }

                .ar-topic-badge {
                    font-size: 9px;
                    padding: 2px 6px;
                    border-radius: 4px;
                    flex-shrink: 0;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .ar-topic-badge.unseen {
                    background: var(--ar-success-dim);
                    color: var(--ar-success);
                    border: 1px solid var(--ar-success);
                }

                .ar-topic-badge.read {
                    background: var(--ar-bg-hover);
                    color: var(--ar-text-muted);
                }

                .ar-topic-item a {
                    color: var(--ar-text);
                    text-decoration: none;
                    flex: 1;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 12px;
                }

                .ar-topic-item a:hover {
                    color: var(--ar-accent);
                }

                .ar-topic-replies {
                    font-size: 10px;
                    color: var(--ar-text-muted);
                    flex-shrink: 0;
                    background: var(--ar-bg-secondary);
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                /* ===== 设置面板 ===== */
                #ar-settings {
                    padding: 12px;
                }

                .ar-setting-section {
                    margin-bottom: 20px;
                }

                .ar-setting-section:last-child {
                    margin-bottom: 0;
                }

                .ar-setting-section-title {
                    font-size: 11px;
                    color: var(--ar-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid var(--ar-border-light);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                /* 模式选择器 */
                .ar-mode-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                    margin-bottom: 12px;
                }

                .ar-mode-card {
                    padding: 12px 8px;
                    border: 2px solid var(--ar-border);
                    border-radius: var(--ar-radius-sm);
                    cursor: pointer;
                    transition: var(--ar-transition);
                    text-align: center;
                    background: var(--ar-bg-tertiary);
                }

                .ar-mode-card:hover {
                    border-color: var(--ar-text-muted);
                    background: var(--ar-bg-hover);
                }

                .ar-mode-card.active {
                    border-color: var(--ar-accent);
                    background: var(--ar-accent-dim);
                }

                .ar-mode-card-icon {
                    font-size: 20px;
                    margin-bottom: 4px;
                }

                .ar-mode-card-name {
                    font-size: 11px;
                    font-weight: 600;
                    color: var(--ar-text);
                    margin-bottom: 2px;
                }

                .ar-mode-card-desc {
                    font-size: 9px;
                    color: var(--ar-text-muted);
                }

                /* 设置项 */
                .ar-setting-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid var(--ar-border-light);
                }

                .ar-setting-item:last-child {
                    border-bottom: none;
                }

                .ar-setting-label {
                    font-size: 12px;
                    color: var(--ar-text);
                    font-weight: 500;
                }

                .ar-setting-desc {
                    font-size: 10px;
                    color: var(--ar-text-muted);
                    margin-top: 2px;
                }

                /* 开关 */
                .ar-switch {
                    position: relative;
                    width: 40px;
                    height: 22px;
                    flex-shrink: 0;
                }

                .ar-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .ar-switch-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: var(--ar-border);
                    border-radius: 11px;
                    transition: 0.3s;
                }

                .ar-switch-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 3px;
                    bottom: 3px;
                    background: white;
                    border-radius: 50%;
                    transition: 0.3s;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .ar-switch input:checked + .ar-switch-slider {
                    background: var(--ar-accent);
                }

                .ar-switch input:checked + .ar-switch-slider:before {
                    transform: translateX(18px);
                }

                /* 滑块 */
                .ar-slider-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .ar-slider {
                    -webkit-appearance: none;
                    width: 100px;
                    height: 6px;
                    border-radius: 3px;
                    background: var(--ar-border);
                    outline: none;
                }

                .ar-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--ar-accent);
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                    transition: transform 0.2s;
                }

                .ar-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                }

                .ar-slider-value {
                    font-size: 11px;
                    color: var(--ar-accent);
                    font-weight: 600;
                    min-width: 30px;
                    text-align: right;
                    font-family: monospace;
                }

                /* 输入框 */
                .ar-input {
                    padding: 6px 10px;
                    border: 1px solid var(--ar-border);
                    border-radius: var(--ar-radius-xs);
                    background: var(--ar-bg);
                    color: var(--ar-text);
                    font-size: 12px;
                    width: 80px;
                    outline: none;
                    transition: var(--ar-transition);
                }

                .ar-input:focus {
                    border-color: var(--ar-accent);
                }

                /* 范围输入 */
                .ar-range-input {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .ar-range-input .ar-input {
                    width: 60px;
                    text-align: center;
                }

                .ar-range-separator {
                    color: var(--ar-text-muted);
                    font-size: 11px;
                }

                /* 按钮组 */
                .ar-btn-row {
                    display: flex;
                    gap: 8px;
                    margin-top: 12px;
                }

                .ar-btn-row .ar-btn {
                    flex: 1;
                    flex-direction: row;
                    padding: 10px 12px;
                }

                /* 空状态 */
                .ar-empty {
                    text-align: center;
                    padding: 40px 20px;
                    color: var(--ar-text-muted);
                }

                .ar-empty-icon {
                    font-size: 40px;
                    margin-bottom: 12px;
                    opacity: 0.5;
                }

                .ar-empty-text {
                    font-size: 12px;
                }

                /* 折叠区域 */
                .ar-collapsible {
                    margin-top: 12px;
                }

                .ar-collapsible-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 12px;
                    background: var(--ar-bg-tertiary);
                    border-radius: var(--ar-radius-xs);
                    cursor: pointer;
                    transition: var(--ar-transition);
                }

                .ar-collapsible-header:hover {
                    background: var(--ar-bg-hover);
                }

                .ar-collapsible-title {
                    font-size: 11px;
                    font-weight: 600;
                    color: var(--ar-text);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .ar-collapsible-icon {
                    transition: transform 0.2s;
                }

                .ar-collapsible.open .ar-collapsible-icon {
                    transform: rotate(180deg);
                }

                .ar-collapsible-content {
                    display: none;
                    padding: 12px;
                    border: 1px solid var(--ar-border-light);
                    border-top: none;
                    border-radius: 0 0 var(--ar-radius-xs) var(--ar-radius-xs);
                    background: var(--ar-bg-secondary);
                }

                .ar-collapsible.open .ar-collapsible-content {
                    display: block;
                }

                /* 快捷键弹窗 */
                #ar-shortcuts {
                    position: absolute;
                    bottom: 100%;
                    right: 0;
                    width: 220px;
                    background: var(--ar-bg);
                    border: 1px solid var(--ar-border);
                    border-radius: var(--ar-radius-md);
                    padding: 12px;
                    margin-bottom: 8px;
                    display: none;
                    box-shadow: var(--ar-shadow);
                }

                #ar-shortcuts.show {
                    display: block;
                    animation: fadeIn 0.2s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .ar-shortcuts-title {
                    font-size: 11px;
                    font-weight: 600;
                    color: var(--ar-text);
                    margin-bottom: 10px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid var(--ar-border-light);
                }

                .ar-shortcut-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 5px 0;
                    font-size: 11px;
                    color: var(--ar-text-secondary);
                }

                .ar-shortcut-key {
                    background: var(--ar-bg-secondary);
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-family: monospace;
                    border: 1px solid var(--ar-border);
                    font-size: 10px;
                    color: var(--ar-text);
                }

                /* 工具提示 */
                .ar-tooltip {
                    position: relative;
                }

                .ar-tooltip::after {
                    content: attr(data-tooltip);
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 6px 10px;
                    background: var(--ar-bg);
                    color: var(--ar-text);
                    font-size: 11px;
                    border-radius: var(--ar-radius-xs);
                    white-space: nowrap;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s;
                    border: 1px solid var(--ar-border);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    z-index: 1000;
                    margin-bottom: 6px;
                }

                .ar-tooltip:hover::after {
                    opacity: 1;
                    visibility: visible;
                }
            `);
    },

    createPanel() {
      const currentMode = MODE_PRESETS[State.settings.mode];
      const panel = document.createElement("div");
      panel.id = "ar-panel";
      panel.className = State.settings.theme === "light" ? "ar-light" : "";
      if (State.settings.minimized) panel.classList.add("minimized");

      panel.innerHTML = `
                <div id="ar-header">
                    <div id="ar-title-section">
                        <span id="ar-status-dot"></span>
                        <span id="ar-title">Auto Reader</span>
                        <span id="ar-mode-badge">${currentMode?.icon || "⚙️"} ${
        currentMode?.name?.replace(/^[^\s]+\s/, "") || "自定义"
      }</span>
                    </div>
                    <div id="ar-header-controls">
                        <button class="ar-icon-btn" id="ar-btn-theme" title="切换主题">🌓</button>
                        <button class="ar-icon-btn" id="ar-btn-help" title="快捷键">⌨️</button>
                        <button class="ar-icon-btn" id="ar-btn-minimize" title="最小化">➖</button>
                    </div>
                </div>
                <div id="ar-body">
                    <!-- 统计 -->
                    <div id="ar-stats">
                        <div class="ar-stat-card ar-tooltip" data-tooltip="本次会话已标记的帖子数">
                            <div class="ar-stat-value" id="ar-stat-topics">0</div>
                            <div class="ar-stat-label">帖子</div>
                        </div>
                        <div class="ar-stat-card ar-tooltip" data-tooltip="本次会话已标记的回复数">
                            <div class="ar-stat-value" id="ar-stat-replies">0</div>
                            <div class="ar-stat-label">回复</div>
                        </div>
                        <div class="ar-stat-card ar-tooltip" data-tooltip="运行时长">
                            <div class="ar-stat-value" id="ar-stat-time">0:00</div>
                            <div class="ar-stat-label">时长</div>
                        </div>
                        <div class="ar-stat-card ar-tooltip" data-tooltip="今日/每日上限">
                            <div class="ar-stat-value" id="ar-stat-daily">0</div>
                            <div class="ar-stat-label">今日</div>
                        </div>
                    </div>

                    <!-- 进度 -->
                    <div id="ar-progress-container">
                        <div id="ar-progress-bar">
                            <div id="ar-progress-fill"></div>
                        </div>
                        <div id="ar-progress-info">
                            <span id="ar-progress-text">就绪</span>
                            <span id="ar-current-topic"></span>
                        </div>
                    </div>

                    <!-- 控制按钮 -->
                    <div id="ar-controls">
                        <button class="ar-btn ar-btn-primary" id="ar-btn-start">
                            <span class="ar-btn-icon">▶</span>
                            <span>开始</span>
                        </button>
                        <button class="ar-btn ar-btn-warning" id="ar-btn-pause" disabled>
                            <span class="ar-btn-icon">⏸</span>
                            <span>暂停</span>
                        </button>
                        <button class="ar-btn ar-btn-danger" id="ar-btn-stop" disabled>
                            <span class="ar-btn-icon">⏹</span>
                            <span>停止</span>
                        </button>
                        <button class="ar-btn ar-btn-secondary" id="ar-btn-check">
                            <span class="ar-btn-icon">🔄</span>
                            <span>检查</span>
                        </button>
                    </div>

                    <!-- 标签页 -->
                    <div id="ar-tabs">
                        <button class="ar-tab active" data-tab="logs">📋 日志</button>
                        <button class="ar-tab" data-tab="topics">📑 帖子</button>
                        <button class="ar-tab" data-tab="settings">⚙️ 设置</button>
                    </div>

                    <!-- 日志 -->
                    <div id="ar-logs" class="ar-tab-content active">
                        <div class="ar-empty">
                            <div class="ar-empty-icon">📭</div>
                            <div class="ar-empty-text">暂无日志</div>
                        </div>
                    </div>

                    <!-- 帖子列表 -->
                    <div id="ar-topics" class="ar-tab-content">
                        <div class="ar-empty">
                            <div class="ar-empty-icon">📑</div>
                            <div class="ar-empty-text">点击开始获取帖子</div>
                        </div>
                    </div>

                    <!-- 设置 -->
                    <div id="ar-settings" class="ar-tab-content">
                        <!-- 模式选择 -->
                        <div class="ar-setting-section">
                            <div class="ar-setting-section-title">🎮 阅读模式</div>
                            <div class="ar-mode-grid">
                                ${Object.entries(MODE_PRESETS)
                                  .map(
                                    ([key, mode]) => `
                                    <div class="ar-mode-card ${
                                      State.settings.mode === key
                                        ? "active"
                                        : ""
                                    }" data-mode="${key}">
                                        <div class="ar-mode-card-icon">${
                                          mode.icon
                                        }</div>
                                        <div class="ar-mode-card-name">${mode.name.replace(
                                          /^[^\s]+\s/,
                                          ""
                                        )}</div>
                                        <div class="ar-mode-card-desc">${
                                          mode.desc
                                        }</div>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                        </div>

                        <!-- 快捷设置 -->
                        <div class="ar-setting-section">
                            <div class="ar-setting-section-title">⚡ 快捷设置</div>

                            <div class="ar-setting-item">
                                <div>
                                    <div class="ar-setting-label">并发数量</div>
                                    <div class="ar-setting-desc">同时处理的帖子数</div>
                                </div>
                                <div class="ar-slider-container">
                                    <input type="range" class="ar-slider" id="ar-setting-concurrency"
                                           min="1" max="5" value="${
                                             State.settings.concurrency
                                           }">
                                    <span class="ar-slider-value" id="ar-concurrency-value">${
                                      State.settings.concurrency
                                    }</span>
                                </div>
                            </div>

                            <div class="ar-setting-item">
                                <div>
                                    <div class="ar-setting-label">每帖回复数</div>
                                    <div class="ar-setting-desc">每个帖子最多阅读回复数 (0=仅主帖)</div>
                                </div>
                                <div class="ar-slider-container">
                                    <input type="range" class="ar-slider" id="ar-setting-replies"
                                           min="0" max="100" step="5" value="${
                                             State.settings.reading
                                               ?.maxRepliesPerTopic || 50
                                           }">
                                    <span class="ar-slider-value" id="ar-replies-value">${
                                      State.settings.reading
                                        ?.maxRepliesPerTopic || 50
                                    }</span>
                                </div>
                            </div>

                            <div class="ar-setting-item">
                                <div>
                                    <div class="ar-setting-label">批次大小</div>
                                    <div class="ar-setting-desc">每次检查处理的帖子数</div>
                                </div>
                                <div class="ar-slider-container">
                                    <input type="range" class="ar-slider" id="ar-setting-batch"
                                           min="1" max="20" value="${
                                             State.settings.reading
                                               ?.maxTopicsPerBatch || 10
                                           }">
                                    <span class="ar-slider-value" id="ar-batch-value">${
                                      State.settings.reading
                                        ?.maxTopicsPerBatch || 10
                                    }</span>
                                </div>
                            </div>
                        </div>

                        <!-- 高级设置 -->
                        <div class="ar-collapsible" id="ar-advanced-settings">
                            <div class="ar-collapsible-header">
                                <span class="ar-collapsible-title">🔧 高级设置</span>
                                <span class="ar-collapsible-icon">▼</span>
                            </div>
                            <div class="ar-collapsible-content">
                                <div class="ar-setting-item">
                                    <div>
                                        <div class="ar-setting-label">帖子间隔 (秒)</div>
                                    </div>
                                    <div class="ar-range-input">
                                        <input type="number" class="ar-input" id="ar-interval-topic-min"
                                               value="${Math.floor(
                                                 State.settings.intervals
                                                   .betweenTopics.min / 1000
                                               )}">
                                        <span class="ar-range-separator">~</span>
                                        <input type="number" class="ar-input" id="ar-interval-topic-max"
                                               value="${Math.floor(
                                                 State.settings.intervals
                                                   .betweenTopics.max / 1000
                                               )}">
                                    </div>
                                </div>

                                <div class="ar-setting-item">
                                    <div>
                                        <div class="ar-setting-label">回复间隔 (秒)</div>
                                    </div>
                                    <div class="ar-range-input">
                                        <input type="number" class="ar-input" id="ar-interval-reply-min"
                                               value="${(
                                                 State.settings.intervals
                                                   .betweenReplies.min / 1000
                                               ).toFixed(1)}">
                                        <span class="ar-range-separator">~</span>
                                        <input type="number" class="ar-input" id="ar-interval-reply-max"
                                               value="${(
                                                 State.settings.intervals
                                                   .betweenReplies.max / 1000
                                               ).toFixed(1)}">
                                    </div>
                                </div>

                                <div class="ar-setting-item">
                                    <div>
                                        <div class="ar-setting-label">批次间隔 (秒)</div>
                                    </div>
                                    <div class="ar-range-input">
                                        <input type="number" class="ar-input" id="ar-interval-batch-min"
                                               value="${Math.floor(
                                                 State.settings.intervals
                                                   .betweenBatches.min / 1000
                                               )}">
                                        <span class="ar-range-separator">~</span>
                                        <input type="number" class="ar-input" id="ar-interval-batch-max"
                                               value="${Math.floor(
                                                 State.settings.intervals
                                                   .betweenBatches.max / 1000
                                               )}">
                                    </div>
                                </div>

                                <div class="ar-setting-item">
                                    <div>
                                        <div class="ar-setting-label">随机跳过概率</div>
                                    </div>
                                    <div class="ar-slider-container">
                                        <input type="range" class="ar-slider" id="ar-setting-skip"
                                               min="0" max="50" value="${
                                                 (State.settings.behavior
                                                   ?.skipProbability || 0.1) *
                                                 100
                                               }">
                                        <span class="ar-slider-value" id="ar-skip-value">${Math.round(
                                          (State.settings.behavior
                                            ?.skipProbability || 0.1) * 100
                                        )}%</span>
                                    </div>
                                </div>

                                <div class="ar-setting-item">
                                    <div>
                                        <div class="ar-setting-label">每日帖子上限</div>
                                    </div>
                                    <input type="number" class="ar-input" id="ar-setting-daily-limit"
                                           value="${
                                             State.settings.safety
                                               ?.maxDailyTopics || 200
                                           }" style="width: 80px;">
                                </div>
                            </div>
                        </div>

                        <!-- 通知设置 -->
                        <div class="ar-setting-section" style="margin-top: 16px;">
                            <div class="ar-setting-section-title">🔔 通知与行为</div>

                            <div class="ar-setting-item">
                                <div>
                                    <div class="ar-setting-label">声音提醒</div>
                                </div>
                                <label class="ar-switch">
                                    <input type="checkbox" id="ar-setting-sound" ${
                                      State.settings.sound ? "checked" : ""
                                    }>
                                    <span class="ar-switch-slider"></span>
                                </label>
                            </div>

                            <div class="ar-setting-item">
                                <div>
                                    <div class="ar-setting-label">桌面通知</div>
                                </div>
                                <label class="ar-switch">
                                    <input type="checkbox" id="ar-setting-notifications" ${
                                      State.settings.notifications
                                        ? "checked"
                                        : ""
                                    }>
                                    <span class="ar-switch-slider"></span>
                                </label>
                            </div>

                            <div class="ar-setting-item">
                                <div>
                                    <div class="ar-setting-label">自动启动</div>
                                </div>
                                <label class="ar-switch">
                                    <input type="checkbox" id="ar-setting-autostart" ${
                                      State.settings.autoStart ? "checked" : ""
                                    }>
                                    <span class="ar-switch-slider"></span>
                                </label>
                            </div>

                            <div class="ar-setting-item">
                                <div>
                                    <div class="ar-setting-label">随机顺序</div>
                                </div>
                                <label class="ar-switch">
                                    <input type="checkbox" id="ar-setting-random" ${
                                      State.settings.reading?.randomOrder
                                        ? "checked"
                                        : ""
                                    }>
                                    <span class="ar-switch-slider"></span>
                                </label>
                            </div>

                            <div class="ar-setting-item">
                                <div>
                                    <div class="ar-setting-label">偶尔暂停</div>
                                </div>
                                <label class="ar-switch">
                                    <input type="checkbox" id="ar-setting-pause" ${
                                      State.settings.behavior?.occasionalPause
                                        ? "checked"
                                        : ""
                                    }>
                                    <span class="ar-switch-slider"></span>
                                </label>
                            </div>
                        </div>

                        <!-- 操作按钮 -->
                        <div class="ar-btn-row">
                            <button class="ar-btn ar-btn-secondary" id="ar-btn-clear-logs">
                                🗑️ 清除日志
                            </button>
                            <button class="ar-btn ar-btn-secondary" id="ar-btn-reset-stats">
                                📊 重置统计
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 快捷键 -->
                <div id="ar-shortcuts">
                    <div class="ar-shortcuts-title">⌨️ 快捷键</div>
                    <div class="ar-shortcut-item">
                        <span>开始/停止</span>
                        <span class="ar-shortcut-key">Alt + S</span>
                    </div>
                    <div class="ar-shortcut-item">
                        <span>暂停/恢复</span>
                        <span class="ar-shortcut-key">Alt + P</span>
                    </div>
                    <div class="ar-shortcut-item">
                        <span>立即检查</span>
                        <span class="ar-shortcut-key">Alt + C</span>
                    </div>
                    <div class="ar-shortcut-item">
                        <span>最小化</span>
                        <span class="ar-shortcut-key">Alt + M</span>
                    </div>
                    <div class="ar-shortcut-item">
                        <span>切换主题</span>
                        <span class="ar-shortcut-key">Alt + T</span>
                    </div>
                </div>
            `;

      document.body.appendChild(panel);
      this.container = panel;
    },

    bindEvents() {
      // 控制按钮
      document
        .getElementById("ar-btn-start")
        .addEventListener("click", () => Core.start());
      document
        .getElementById("ar-btn-pause")
        .addEventListener("click", () => Core.pause());
      document
        .getElementById("ar-btn-stop")
        .addEventListener("click", () => Core.stop());
      document
        .getElementById("ar-btn-check")
        .addEventListener("click", () => Core.checkNow());

      // 头部按钮
      document
        .getElementById("ar-btn-theme")
        .addEventListener("click", () => this.toggleTheme());
      document
        .getElementById("ar-btn-minimize")
        .addEventListener("click", () => this.toggleMinimize());
      document
        .getElementById("ar-btn-help")
        .addEventListener("click", () => this.toggleShortcuts());

      // 标签页
      document.querySelectorAll(".ar-tab").forEach((tab) => {
        tab.addEventListener("click", () => this.switchTab(tab.dataset.tab));
      });

      // 模式选择
      document.querySelectorAll(".ar-mode-card").forEach((card) => {
        card.addEventListener("click", () => {
          document
            .querySelectorAll(".ar-mode-card")
            .forEach((c) => c.classList.remove("active"));
          card.classList.add("active");
          State.settings.mode = card.dataset.mode;
          this.updateModeDisplay();
          Storage.save();
          Logger.info(
            `✓ 已切换到 ${
              MODE_PRESETS[State.settings.mode]?.name || "自定义模式"
            }`
          );
        });
      });

      // 折叠面板
      document
        .querySelector(".ar-collapsible-header")
        .addEventListener("click", () => {
          document
            .getElementById("ar-advanced-settings")
            .classList.toggle("open");
        });

      // 滑块设置
      this.bindSlider(
        "ar-setting-concurrency",
        "ar-concurrency-value",
        (val) => {
          State.settings.concurrency = parseInt(val);
        }
      );

      this.bindSlider("ar-setting-replies", "ar-replies-value", (val) => {
        State.settings.reading.maxRepliesPerTopic = parseInt(val);
      });

      this.bindSlider("ar-setting-batch", "ar-batch-value", (val) => {
        State.settings.reading.maxTopicsPerBatch = parseInt(val);
      });

      this.bindSlider(
        "ar-setting-skip",
        "ar-skip-value",
        (val) => {
          State.settings.behavior.skipProbability = parseInt(val) / 100;
        },
        (val) => val + "%"
      );

      // 数字输入
      ["ar-interval-topic-min", "ar-interval-topic-max"].forEach((id) => {
        document.getElementById(id).addEventListener("change", (e) => {
          const isMin = id.includes("min");
          State.settings.intervals.betweenTopics[isMin ? "min" : "max"] =
            parseFloat(e.target.value) * 1000;
          Storage.save();
        });
      });

      ["ar-interval-reply-min", "ar-interval-reply-max"].forEach((id) => {
        document.getElementById(id).addEventListener("change", (e) => {
          const isMin = id.includes("min");
          State.settings.intervals.betweenReplies[isMin ? "min" : "max"] =
            parseFloat(e.target.value) * 1000;
          Storage.save();
        });
      });

      ["ar-interval-batch-min", "ar-interval-batch-max"].forEach((id) => {
        document.getElementById(id).addEventListener("change", (e) => {
          const isMin = id.includes("min");
          State.settings.intervals.betweenBatches[isMin ? "min" : "max"] =
            parseFloat(e.target.value) * 1000;
          Storage.save();
        });
      });

      document
        .getElementById("ar-setting-daily-limit")
        .addEventListener("change", (e) => {
          State.settings.safety.maxDailyTopics = parseInt(e.target.value);
          Storage.save();
        });

      // 开关设置
      const switches = {
        "ar-setting-sound": "sound",
        "ar-setting-notifications": "notifications",
        "ar-setting-autostart": "autoStart",
      };

      Object.entries(switches).forEach(([id, key]) => {
        document.getElementById(id).addEventListener("change", (e) => {
          State.settings[key] = e.target.checked;
          Storage.save();
        });
      });

      document
        .getElementById("ar-setting-random")
        .addEventListener("change", (e) => {
          State.settings.reading.randomOrder = e.target.checked;
          Storage.save();
        });

      document
        .getElementById("ar-setting-pause")
        .addEventListener("change", (e) => {
          State.settings.behavior.occasionalPause = e.target.checked;
          Storage.save();
        });

      // 功能按钮
      document
        .getElementById("ar-btn-clear-logs")
        .addEventListener("click", () => Logger.clear());
      document
        .getElementById("ar-btn-reset-stats")
        .addEventListener("click", () => Storage.clear());

      // 拖拽
      const header = document.getElementById("ar-header");
      header.addEventListener("mousedown", (e) => this.startDrag(e));
      document.addEventListener("mousemove", (e) => this.onDrag(e));
      document.addEventListener("mouseup", () => this.endDrag());

      // 快捷键
      document.addEventListener("keydown", (e) => {
        if (e.altKey) {
          switch (e.key.toLowerCase()) {
            case "s":
              e.preventDefault();
              State.isRunning ? Core.stop() : Core.start();
              break;
            case "p":
              e.preventDefault();
              if (State.isRunning) Core.pause();
              break;
            case "c":
              e.preventDefault();
              Core.checkNow();
              break;
            case "m":
              e.preventDefault();
              this.toggleMinimize();
              break;
            case "t":
              e.preventDefault();
              this.toggleTheme();
              break;
          }
        }
      });

      // 页面可见性
      document.addEventListener("visibilitychange", () => {
        if (
          document.visibilityState === "visible" &&
          State.isRunning &&
          !State.isPaused
        ) {
          const now = Date.now();
          if (now - State.lastCheckTime > DEFAULT_CONFIG.TIMEOUT_THRESHOLD) {
            Core.doCheck();
          }
        }
      });

      window.addEventListener("beforeunload", () => Storage.save());

      // 定时更新
      setInterval(() => {
        this.updateRuntime();
        this.updateDailyStats();
      }, 1000);
    },

    bindSlider(sliderId, valueId, onChange, formatter = (v) => v) {
      const slider = document.getElementById(sliderId);
      const valueEl = document.getElementById(valueId);

      slider.addEventListener("input", (e) => {
        valueEl.textContent = formatter(e.target.value);
      });

      slider.addEventListener("change", (e) => {
        onChange(e.target.value);
        Storage.save();
      });
    },

    // 拖拽
    startDrag(e) {
      if (e.target.closest(".ar-icon-btn")) return;
      this.isDragging = true;
      const rect = this.container.getBoundingClientRect();
      this.dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      this.container.style.transition = "none";
    },

    onDrag(e) {
      if (!this.isDragging) return;
      const x = e.clientX - this.dragOffset.x;
      const y = e.clientY - this.dragOffset.y;
      const maxX = window.innerWidth - this.container.offsetWidth;
      const maxY = window.innerHeight - this.container.offsetHeight;
      this.container.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
      this.container.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
      this.container.style.right = "auto";
      this.container.style.bottom = "auto";
    },

    endDrag() {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.container.style.transition = "";
      State.settings.position = {
        x: this.container.style.left,
        y: this.container.style.top,
      };
      Storage.save();
    },

    restorePosition() {
      if (State.settings.position.x !== null) {
        this.container.style.left = State.settings.position.x;
        this.container.style.top = State.settings.position.y;
        this.container.style.right = "auto";
        this.container.style.bottom = "auto";
      }
    },

    toggleTheme() {
      State.settings.theme = State.settings.theme === "dark" ? "light" : "dark";
      this.container.classList.toggle("ar-light");
      Storage.save();
    },

    toggleMinimize() {
      State.settings.minimized = !State.settings.minimized;
      this.container.classList.toggle("minimized");
      document.getElementById("ar-btn-minimize").textContent = State.settings
        .minimized
        ? "➕"
        : "➖";
      Storage.save();
    },

    toggleShortcuts() {
      const shortcuts = document.getElementById("ar-shortcuts");
      shortcuts.classList.toggle("show");

      if (shortcuts.classList.contains("show")) {
        setTimeout(() => {
          const handler = (e) => {
            if (
              !shortcuts.contains(e.target) &&
              !e.target.closest("#ar-btn-help")
            ) {
              shortcuts.classList.remove("show");
              document.removeEventListener("click", handler);
            }
          };
          document.addEventListener("click", handler);
        }, 0);
      }
    },

    switchTab(tabName) {
      document
        .querySelectorAll(".ar-tab")
        .forEach((t) => t.classList.remove("active"));
      document
        .querySelectorAll(".ar-tab-content")
        .forEach((c) => c.classList.remove("active"));
      document
        .querySelector(`.ar-tab[data-tab="${tabName}"]`)
        .classList.add("active");
      document.getElementById(`ar-${tabName}`).classList.add("active");
    },

    updateModeDisplay() {
      const mode = MODE_PRESETS[State.settings.mode];
      const badge = document.getElementById("ar-mode-badge");
      badge.innerHTML = `${mode?.icon || "⚙️"} ${
        mode?.name?.replace(/^[^\s]+\s/, "") || "自定义"
      }`;
    },

    updateStatus() {
      const dot = document.getElementById("ar-status-dot");
      const startBtn = document.getElementById("ar-btn-start");
      const pauseBtn = document.getElementById("ar-btn-pause");
      const stopBtn = document.getElementById("ar-btn-stop");

      dot.className = "";
      if (State.isRunning) {
        dot.classList.add(State.isPaused ? "paused" : "running");
      }

      startBtn.disabled = State.isRunning;
      pauseBtn.disabled = !State.isRunning;
      stopBtn.disabled = !State.isRunning;

      const pauseIcon = pauseBtn.querySelector(".ar-btn-icon");
      const pauseText = pauseBtn.querySelector("span:last-child");
      pauseIcon.textContent = State.isPaused ? "▶" : "⏸";
      pauseText.textContent = State.isPaused ? "恢复" : "暂停";
    },

    updateStats() {
      document.getElementById("ar-stat-topics").textContent =
        Utils.formatNumber(State.stats.session.topicsMarked);
      document.getElementById("ar-stat-replies").textContent =
        Utils.formatNumber(State.stats.session.repliesMarked);
    },

    updateDailyStats() {
      const today = new Date().toDateString();
      if (State.stats.daily.date !== today) {
        State.stats.daily = { topicsMarked: 0, repliesMarked: 0, date: today };
      }
      document.getElementById(
        "ar-stat-daily"
      ).textContent = `${State.stats.daily.topicsMarked}/${State.settings.safety.maxDailyTopics}`;
    },

    updateRuntime() {
      if (!State.isRunning || !State.runtime.startTime) return;

      let elapsed =
        Date.now() - State.runtime.startTime - State.runtime.pausedTime;
      if (State.isPaused && State.runtime.lastPauseStart) {
        elapsed -= Date.now() - State.runtime.lastPauseStart;
      }

      document.getElementById("ar-stat-time").textContent =
        Utils.formatDuration(elapsed);
    },

    updateProgress(percent, text) {
      document.getElementById("ar-progress-fill").style.width = `${percent}%`;
      document.getElementById("ar-progress-text").textContent = text;

      const currentTopicEl = document.getElementById("ar-current-topic");
      if (State.currentTopic) {
        currentTopicEl.textContent = Utils.truncate(
          State.currentTopic.title,
          25
        );
      } else {
        currentTopicEl.textContent = "";
      }
    },

    appendLog(log) {
      const container = document.getElementById("ar-logs");
      const empty = container.querySelector(".ar-empty");
      if (empty) empty.remove();

      const item = document.createElement("div");
      item.className = `ar-log-item ${log.type}`;
      item.innerHTML = `
                <span class="ar-log-time">${log.time}</span>
                <span class="ar-log-msg">${log.message}</span>
            `;

      container.appendChild(item);
      container.scrollTop = container.scrollHeight;

      while (container.children.length > DEFAULT_CONFIG.MAX_LOGS) {
        container.removeChild(container.firstChild);
      }
    },

    updateTopicsList(topics) {
      const container = document.getElementById("ar-topics");
      container.innerHTML = "";

      const displayTopics = topics.slice(0, DEFAULT_CONFIG.MAX_TOPICS_DISPLAY);

      if (displayTopics.length === 0) {
        container.innerHTML = `
                    <div class="ar-empty">
                        <div class="ar-empty-icon">📑</div>
                        <div class="ar-empty-text">暂无帖子数据</div>
                    </div>
                `;
        return;
      }

      displayTopics.forEach((topic) => {
        const item = document.createElement("div");
        item.className = `ar-topic-item ${topic.unseen ? "unseen" : ""}`;
        item.dataset.topicId = topic.id;

        item.innerHTML = `
                    <span class="ar-topic-badge ${
                      topic.unseen ? "unseen" : "read"
                    }">${topic.unseen ? "未读" : "已读"}</span>
                    <a href="https://linux.do/t/topic/${
                      topic.id
                    }" target="_blank" title="${topic.title}">
                        ${topic.title}
                    </a>
                    <span class="ar-topic-replies">${
                      topic.posts_count || 0
                    }</span>
                `;
        container.appendChild(item);
      });
    },

    highlightCurrentTopic(topicId) {
      document.querySelectorAll(".ar-topic-item").forEach((item) => {
        item.classList.toggle("current", item.dataset.topicId == topicId);
      });
    },
  };

  // ==================== 初始化 ====================
  function init() {
    Storage.load();
    UI.init();

    if (State.settings.autoStart || State.isRunning) {
      setTimeout(() => Core.start(), 2000);
    }

    Logger.success("🎉 Linux.do Auto Reader Ultimate 已加载");
    Logger.info(
      `📖 模式: ${MODE_PRESETS[State.settings.mode]?.name || "自定义"}`
    );
    Logger.info(
      `⚡ 并发: ${State.settings.concurrency} | 每帖回复: ${State.settings.reading.maxRepliesPerTopic}`
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
