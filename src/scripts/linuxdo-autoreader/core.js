/**
 * Linux.do 自动标记已读 - 核心控制器模块
 */

import { DEFAULT_CONFIG, MODE_PRESETS } from './config.js';
import State from './state.js';
import { Utils } from './utils.js';
import Storage from './storage.js';
import API from './api.js';
import Logger from './logger.js';
import BehaviorSimulator from './behavior.js';

/**
 * 核心控制器
 */
export const Core = {
  checkTimer: null,
  heartbeatTimer: null,
  currentSleepPromise: null,
  uiRef: null,

  /**
   * 设置UI引用
   * @param {Object} ui - UI模块引用
   */
  setUI(ui) {
    this.uiRef = ui;
    BehaviorSimulator.setUI(ui);
  },

  /**
   * 获取有效设置
   * @returns {Object}
   */
  getEffectiveSettings() {
    const mode = State.settings.mode;
    if (mode === 'custom' || !MODE_PRESETS[mode]) {
      return State.settings;
    }

    const preset = MODE_PRESETS[mode];
    return Utils.deepMerge(State.settings, preset.settings || {});
  },

  /**
   * 执行检查
   */
  async doCheck() {
    if (!State.isRunning || State.isPaused) return;

    const settings = this.getEffectiveSettings();

    if (!Utils.isActiveHours(settings)) {
      Logger.info('💤 当前不在活跃时间段，等待中...');
      this.scheduleNextCheck(settings.intervals.betweenBatches);
      return;
    }

    const limits = Utils.checkDailyLimits(settings, State.stats);
    if (!limits.topicsOk) {
      Logger.warn(`⚠️ 已达到每日帖子上限 (${settings.safety.maxDailyTopics})`);
      this.stop();
      return;
    }

    if (this.uiRef) this.uiRef.updateProgress(0, '获取帖子列表...');

    try {
      const res = await API.getTopics();
      const topics = res.topic_list?.topics || [];
      let unseenTopics = topics.filter((t) => t.unseen);

      if (this.uiRef) this.uiRef.updateTopicsList(topics);

      if (unseenTopics.length === 0) {
        Logger.info(`✓ 无未读帖子 (共 ${topics.length} 个)`);
        if (this.uiRef) this.uiRef.updateProgress(100, '等待下次检查...');
      } else {
        const maxBatch = Math.min(
          settings.reading.maxTopicsPerBatch,
          limits.topicsRemaining,
        );
        unseenTopics = unseenTopics.slice(0, maxBatch);

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

      if (State.errors.consecutive >= settings.safety.maxConsecutiveErrors) {
        Logger.error('连续错误过多，暂停运行');
        this.pause();
        return;
      }

      Logger.info(`等待 ${settings.safety.cooldownAfterError / 1000}s 后重试...`);
      await Utils.sleep(settings.safety.cooldownAfterError);
    }

    State.lastCheckTime = Date.now();
    Storage.save();

    if (State.isRunning && !State.isPaused) {
      this.scheduleNextCheck(settings.intervals.betweenBatches);
    }
  },

  /**
   * 处理帖子列表
   * @param {Array} topics - 帖子列表
   * @param {Object} settings - 设置对象
   */
  async processTopics(topics, settings) {
    const { concurrency } = settings;

    if (concurrency > 1) {
      await this.processTopicsConcurrent(topics, settings, concurrency);
    } else {
      await this.processTopicsSequential(topics, settings);
    }
  },

  /**
   * 顺序处理帖子
   * @param {Array} topics - 帖子列表
   * @param {Object} settings - 设置对象
   */
  async processTopicsSequential(topics, settings) {
    for (let i = 0; i < topics.length; i++) {
      if (!State.isRunning || State.isPaused) break;

      const topic = topics[i];
      const progress = ((i + 1) / topics.length) * 100;
      if (this.uiRef) {
        this.uiRef.updateProgress(progress, `处理 ${i + 1}/${topics.length}`);
        this.uiRef.highlightCurrentTopic(topic.id);
      }

      try {
        const result = await BehaviorSimulator.simulateReading(topic, settings);

        if (!result.skipped) {
          State.stats.session.topicsMarked++;
          State.stats.daily.topicsMarked++;
          State.stats.total.topicsMarked++;

          if (result.repliesMarked) {
            State.stats.session.repliesMarked += result.repliesMarked;
            State.stats.daily.repliesMarked += result.repliesMarked;
            State.stats.total.repliesMarked += result.repliesMarked;
          }

          if (this.uiRef) this.uiRef.updateStats();
        }
      } catch (error) {
        State.stats.session.errors++;
        State.errors.consecutive++;
      }

      if (i < topics.length - 1 && State.isRunning && !State.isPaused) {
        await BehaviorSimulator.checkForPause(settings);

        const delay = Utils.randomDelay(settings.intervals.betweenTopics);
        Logger.info(`⏳ 等待 ${(delay / 1000).toFixed(1)}s`);
        await Utils.sleep(delay);
      }
    }

    State.currentTopic = null;
    if (this.uiRef) this.uiRef.updateProgress(100, '批次完成');
    Logger.success('✅ 本轮完成');
  },

  /**
   * 并发处理帖子
   * @param {Array} topics - 帖子列表
   * @param {Object} settings - 设置对象
   * @param {number} concurrency - 并发数
   */
  async processTopicsConcurrent(topics, settings, concurrency) {
    const queue = [...topics];
    const workers = [];
    let completedCount = 0;

    const worker = async (_workerId) => {
      while (queue.length > 0 && State.isRunning && !State.isPaused) {
        const topic = queue.shift();
        if (!topic) break;

        try {
          const result = await BehaviorSimulator.simulateReading(topic, settings);

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
        if (this.uiRef) {
          this.uiRef.updateProgress(progress, `处理 ${completedCount}/${topics.length}`);
          this.uiRef.updateStats();
        }

        if (queue.length > 0) {
          const delay = Utils.randomDelay(settings.intervals.betweenTopics);
          await Utils.sleep(delay / concurrency);
        }
      }
    };

    for (let i = 0; i < concurrency; i++) {
      workers.push(worker(i));
    }

    await Promise.all(workers);

    State.currentTopic = null;
    if (this.uiRef) this.uiRef.updateProgress(100, '批次完成');
    Logger.success(`✅ 本轮完成 (${concurrency}并发)`);
  },

  /**
   * 安排下次检查
   * @param {Object} intervalConfig - 间隔配置
   */
  scheduleNextCheck(intervalConfig) {
    const delay = Utils.randomDelay(intervalConfig);
    Logger.info(`⏰ ${Utils.formatDuration(delay)} 后下次检查`);
    this.checkTimer = setTimeout(() => this.doCheck(), delay);
  },

  /**
   * 开始运行
   */
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
    if (this.uiRef) this.uiRef.updateStatus();

    const mode = MODE_PRESETS[State.settings.mode];
    Logger.success(`🚀 开始运行 [${mode?.name || '自定义'}]`);

    this.doCheck();
    this.startHeartbeat();
  },

  /**
   * 停止运行
   */
  stop() {
    State.isRunning = false;
    State.isPaused = false;
    State.currentTopic = null;

    clearTimeout(this.checkTimer);
    clearTimeout(this.heartbeatTimer);

    Storage.save();
    if (this.uiRef) {
      this.uiRef.updateStatus();
      this.uiRef.updateProgress(0, '已停止');
    }
    Logger.info('⏹ 已停止');
  },

  /**
   * 暂停/恢复
   */
  pause() {
    State.isPaused = !State.isPaused;

    if (State.isPaused) {
      State.runtime.lastPauseStart = Date.now();
      clearTimeout(this.checkTimer);
      Logger.info('⏸ 已暂停');
    } else {
      if (State.runtime.lastPauseStart) {
        State.runtime.pausedTime += Date.now() - State.runtime.lastPauseStart;
      }
      Logger.info('▶ 已恢复');
      if (State.isRunning) {
        this.doCheck();
      }
    }

    if (this.uiRef) this.uiRef.updateStatus();
  },

  /**
   * 启动心跳
   */
  startHeartbeat() {
    const check = () => {
      if (!State.isRunning) return;

      const now = Date.now();
      if (now - State.lastCheckTime > DEFAULT_CONFIG.TIMEOUT_THRESHOLD && !State.isPaused) {
        Logger.warn('💓 心跳触发');
        this.doCheck();
      }

      this.heartbeatTimer = setTimeout(check, DEFAULT_CONFIG.HEARTBEAT_INTERVAL);
    };
    check();
  },

  /**
   * 立即检查
   */
  checkNow() {
    if (!State.isRunning) {
      this.start();
    } else if (!State.isPaused) {
      clearTimeout(this.checkTimer);
      this.doCheck();
    }
  },

  /**
   * 播放提示音
   */
  playSound() {
    try {
      const audio = new Audio(
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp6jn5yklomCgX19hIuVnJ+dmpeQiYOBgYSHi4+Slo+LhoOBgA==',
      );
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (_e) { /* ignore audio errors */ }
  },

  /**
   * 显示通知
   * @param {string} text - 通知文本
   */
  showNotification(text) {
    if (typeof GM_notification === 'function') {
      GM_notification({
        title: 'Linux.do 自动阅读',
        text: text,
        timeout: 3000,
      });
    }
  },
};

export default Core;
