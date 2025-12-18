/**
 * Linux.do 自动标记已读 - 行为模拟模块
 */

import State from './state.js';
import { Utils } from './utils.js';
import API from './api.js';
import Logger from './logger.js';

/**
 * 行为模拟器
 */
export const BehaviorSimulator = {
  uiRef: null,

  /**
   * 设置UI引用
   * @param {Object} ui - UI模块引用
   */
  setUI(ui) {
    this.uiRef = ui;
  },

  /**
   * 模拟阅读一个帖子
   * @param {Object} topic - 帖子对象
   * @param {Object} settings - 设置对象
   * @returns {Promise<Object>}
   */
  async simulateReading(topic, settings) {
    const { intervals, reading, behavior } = settings;

    if (behavior.randomSkip && Math.random() < behavior.skipProbability) {
      Logger.info(`⏭️ 随机跳过: ${Utils.truncate(topic.title, 30)}`);
      State.stats.session.topicsSkipped++;
      return { skipped: true };
    }

    if (reading.skipLongTopics && topic.posts_count > reading.longTopicThreshold) {
      Logger.info(`⏭️ 跳过长帖(${topic.posts_count}回复): ${Utils.truncate(topic.title, 25)}`);
      State.stats.session.topicsSkipped++;
      return { skipped: true };
    }

    Logger.info(`📖 阅读: ${Utils.truncate(topic.title, 35)}`);
    State.currentTopic = topic;
    if (this.uiRef) this.uiRef.updateProgress(0, '阅读中...');

    try {
      const details = await API.getTopicDetails(topic.id);
      const posts = details.post_stream?.posts || [];
      const allPostIds = details.post_stream?.stream || [];

      const maxReplies = reading.maxRepliesPerTopic;
      if (maxReplies === 0) {
        await this.markWithDelay(topic.id, [1], intervals);
        return { topicsMarked: 1, repliesMarked: 1 };
      }

      const stayTime = Utils.randomDelay(intervals.pageStay);
      Logger.info(`   └─ 停留 ${(stayTime / 1000).toFixed(1)}s`);
      await Utils.sleep(stayTime);

      let postNumbersToMark = posts.map((p) => p.post_number);

      if (allPostIds.length > posts.length && postNumbersToMark.length < maxReplies) {
        const loadedIds = new Set(posts.map((p) => p.id));
        const remainingIds = allPostIds.filter((id) => !loadedIds.has(id));
        const idsToLoad = remainingIds.slice(0, maxReplies - postNumbersToMark.length);

        if (idsToLoad.length > 0) {
          Logger.info(`   └─ 加载更多回复 (${idsToLoad.length}个)`);

          const batchSize = 20;
          for (let i = 0; i < idsToLoad.length; i += batchSize) {
            if (!State.isRunning || State.isPaused) break;

            const batch = idsToLoad.slice(i, i + batchSize);
            try {
              const morePosts = await API.getMorePosts(topic.id, batch);
              const newNumbers = morePosts.post_stream?.posts?.map((p) => p.post_number) || [];
              postNumbersToMark.push(...newNumbers);

              if (reading.scrollSimulation) {
                await Utils.sleep(Utils.randomDelay(intervals.scrollPause));
              }
            } catch (e) {
              Logger.warn(`   └─ 加载回复失败: ${e.message}`);
            }
          }
        }
      }

      postNumbersToMark = postNumbersToMark.slice(0, maxReplies);

      let repliesMarked = 0;
      const markBatchSize = 5;

      for (let i = 0; i < postNumbersToMark.length; i += markBatchSize) {
        if (!State.isRunning || State.isPaused) break;

        const batch = postNumbersToMark.slice(i, i + markBatchSize);
        const progress = ((i + batch.length) / postNumbersToMark.length) * 100;

        if (this.uiRef) {
          this.uiRef.updateProgress(progress, `阅读回复 ${i + 1}-${i + batch.length}/${postNumbersToMark.length}`);
        }

        const readTime = Utils.random(
          intervals.betweenReplies.min * batch.length * 0.3,
          intervals.betweenReplies.max * batch.length * 0.5,
        );

        await API.markAsRead(topic.id, batch, readTime);
        repliesMarked += batch.length;

        if (i + markBatchSize < postNumbersToMark.length) {
          const delay = Utils.randomDelay(intervals.betweenReplies);
          await Utils.sleep(delay);
        }
      }

      if (postNumbersToMark.length > 0) {
        const lastPostNumber = Math.max(...postNumbersToMark);
        await API.updateReadProgress(
          topic.id,
          lastPostNumber,
          topic.highest_post_number || lastPostNumber,
        );
      }

      Logger.success(`   └─ ✓ 已读 ${repliesMarked} 个回复`);

      return { topicsMarked: 1, repliesMarked };
    } catch (error) {
      Logger.error(`   └─ ✗ 失败: ${error.message}`);
      throw error;
    }
  },

  /**
   * 带延迟标记
   * @param {number} topicId - 帖子ID
   * @param {Array} postNumbers - 回复编号
   * @param {Object} intervals - 间隔配置
   */
  async markWithDelay(topicId, postNumbers, _intervals) {
    const readTime = Utils.random(1000, 3000);
    await API.markAsRead(topicId, postNumbers, readTime);
  },

  /**
   * 检查是否需要暂停
   * @param {Object} settings - 设置对象
   * @returns {Promise<boolean>}
   */
  async checkForPause(settings) {
    const { behavior } = settings;

    if (behavior.occasionalPause && Math.random() < behavior.pauseProbability) {
      const pauseDuration = Utils.randomDelay(behavior.pauseDuration);
      Logger.info(`☕ 随机休息 ${Utils.formatDuration(pauseDuration)}`);
      if (this.uiRef) this.uiRef.updateProgress(0, '休息中...');
      await Utils.sleep(pauseDuration);
      return true;
    }

    return false;
  },
};

export default BehaviorSimulator;
