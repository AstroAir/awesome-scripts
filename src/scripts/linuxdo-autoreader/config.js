/**
 * Linux.do 自动标记已读 - 配置模块
 */

/**
 * 默认配置
 */
export const DEFAULT_CONFIG = {
  STORAGE_KEY: 'linux_do_auto_reader_ultimate',
  MAX_LOGS: 150,
  MAX_TOPICS_DISPLAY: 25,
  HEARTBEAT_INTERVAL: 5000,
  TIMEOUT_THRESHOLD: 60000,
};

/**
 * 用户可调设置的默认值
 */
export const DEFAULT_SETTINGS = {
  theme: 'dark',
  minimized: false,
  position: { x: null, y: null },
  sound: false,
  notifications: true,
  autoStart: false,
  mode: 'human',
  concurrency: 1,
  intervals: {
    betweenTopics: { min: 8000, max: 25000 },
    betweenReplies: { min: 1500, max: 5000 },
    betweenBatches: { min: 30000, max: 90000 },
    pageStay: { min: 5000, max: 20000 },
    scrollPause: { min: 500, max: 2000 },
  },
  reading: {
    maxRepliesPerTopic: 50,
    maxTopicsPerBatch: 10,
    scrollSimulation: true,
    randomOrder: true,
    skipLongTopics: false,
    longTopicThreshold: 100,
  },
  behavior: {
    randomSkip: true,
    skipProbability: 0.1,
    readingSpeedVariation: 0.3,
    occasionalPause: true,
    pauseProbability: 0.05,
    pauseDuration: { min: 30000, max: 120000 },
    activeHours: { enabled: false, start: 8, end: 23 },
  },
  safety: {
    maxDailyTopics: 200,
    maxDailyReplies: 2000,
    cooldownAfterError: 60000,
    maxConsecutiveErrors: 5,
  },
};

/**
 * 预设模式
 */
export const MODE_PRESETS = {
  turbo: {
    name: '⚡ 极速模式',
    desc: '最快速度，仅标记主帖',
    icon: '⚡',
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
    name: '🚀 快速模式',
    desc: '较快速度，标记部分回复',
    icon: '🚀',
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
    name: '📖 标准模式',
    desc: '平衡速度与安全',
    icon: '📖',
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
    name: '🧑 仿真模式',
    desc: '模拟真实用户行为',
    icon: '🧑',
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
    name: '🥷 隐身模式',
    desc: '最大程度模拟真人',
    icon: '🥷',
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
    name: '⚙️ 自定义',
    desc: '完全自定义参数',
    icon: '⚙️',
    settings: null,
  },
};

export default {
  DEFAULT_CONFIG,
  DEFAULT_SETTINGS,
  MODE_PRESETS,
};
