/**
 * Linux.do 自动标记已读 - 状态管理模块
 */

import { DEFAULT_SETTINGS } from './config.js';

/**
 * 全局状态对象
 */
export const State = {
  isRunning: false,
  isPaused: false,
  lastCheckTime: 0,
  csrfToken: null,
  currentTopic: null,

  runtime: {
    startTime: null,
    pausedTime: 0,
    lastPauseStart: null,
  },

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

  queue: {
    topics: [],
    currentIndex: 0,
    processing: false,
  },

  errors: {
    consecutive: 0,
    lastError: null,
  },

  settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
};

/**
 * 重置会话统计
 */
export function resetSessionStats() {
  State.stats.session = {
    topicsMarked: 0,
    repliesMarked: 0,
    topicsSkipped: 0,
    errors: 0,
    startTime: Date.now(),
  };
}

/**
 * 重置运行时状态
 */
export function resetRuntime() {
  State.runtime = {
    startTime: null,
    pausedTime: 0,
    lastPauseStart: null,
  };
}

/**
 * 重置错误追踪
 */
export function resetErrors() {
  State.errors = {
    consecutive: 0,
    lastError: null,
  };
}

export default State;
