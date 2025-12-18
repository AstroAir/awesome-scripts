/**
 * Linux.do 自动标记已读 - UI模块
 */

import { DEFAULT_CONFIG, MODE_PRESETS } from './config.js';
import State from './state.js';
import { Utils } from './utils.js';
import Storage from './storage.js';
import Logger from './logger.js';
import { getStyles } from './styles.js';

/**
 * UI管理器
 */
export const UI = {
  container: null,
  isDragging: false,
  dragOffset: { x: 0, y: 0 },
  coreRef: null,

  /**
   * 设置Core引用
   * @param {Object} core - Core模块引用
   */
  setCore(core) {
    this.coreRef = core;
  },

  /**
   * 初始化UI
   */
  init() {
    this.injectStyles();
    this.createPanel();
    this.bindEvents();
    this.restorePosition();
    this.updateStatus();
    this.updateStats();
    this.updateModeDisplay();
  },

  /**
   * 注入样式
   */
  injectStyles() {
    if (typeof GM_addStyle === 'function') {
      GM_addStyle(getStyles());
    } else {
      const style = document.createElement('style');
      style.textContent = getStyles();
      document.head.appendChild(style);
    }
  },

  /**
   * 创建面板
   */
  createPanel() {
    const currentMode = MODE_PRESETS[State.settings.mode];
    const panel = document.createElement('div');
    panel.id = 'ar-panel';
    panel.className = State.settings.theme === 'light' ? 'ar-light' : '';
    if (State.settings.minimized) panel.classList.add('minimized');

    panel.innerHTML = this.getPanelHTML(currentMode);

    document.body.appendChild(panel);
    this.container = panel;
  },

  /**
   * 获取面板HTML
   * @param {Object} currentMode - 当前模式
   * @returns {string}
   */
  getPanelHTML(currentMode) {
    return `
      <div id="ar-header">
        <div id="ar-title-section">
          <span id="ar-status-dot"></span>
          <span id="ar-title">Auto Reader</span>
          <span id="ar-mode-badge">${currentMode?.icon || '⚙️'} ${currentMode?.name?.replace(/^[^\s]+\s/, '') || '自定义'}</span>
        </div>
        <div id="ar-header-controls">
          <button class="ar-icon-btn" id="ar-btn-theme" title="切换主题">🌓</button>
          <button class="ar-icon-btn" id="ar-btn-help" title="快捷键">⌨️</button>
          <button class="ar-icon-btn" id="ar-btn-minimize" title="最小化">➖</button>
        </div>
      </div>
      <div id="ar-body">
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

        <div id="ar-progress-container">
          <div id="ar-progress-bar">
            <div id="ar-progress-fill"></div>
          </div>
          <div id="ar-progress-info">
            <span id="ar-progress-text">就绪</span>
            <span id="ar-current-topic"></span>
          </div>
        </div>

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

        <div id="ar-tabs">
          <button class="ar-tab active" data-tab="logs">📋 日志</button>
          <button class="ar-tab" data-tab="topics">📑 帖子</button>
          <button class="ar-tab" data-tab="settings">⚙️ 设置</button>
        </div>

        <div id="ar-logs" class="ar-tab-content active">
          <div class="ar-empty">
            <div class="ar-empty-icon">📭</div>
            <div class="ar-empty-text">暂无日志</div>
          </div>
        </div>

        <div id="ar-topics" class="ar-tab-content">
          <div class="ar-empty">
            <div class="ar-empty-icon">📑</div>
            <div class="ar-empty-text">点击开始获取帖子</div>
          </div>
        </div>

        <div id="ar-settings" class="ar-tab-content">
          ${this.getSettingsHTML()}
        </div>
      </div>

      <div id="ar-shortcuts">
        <div class="ar-shortcuts-title">⌨️ 快捷键</div>
        <div class="ar-shortcut-item"><span>开始/停止</span><span class="ar-shortcut-key">Alt + S</span></div>
        <div class="ar-shortcut-item"><span>暂停/恢复</span><span class="ar-shortcut-key">Alt + P</span></div>
        <div class="ar-shortcut-item"><span>立即检查</span><span class="ar-shortcut-key">Alt + C</span></div>
        <div class="ar-shortcut-item"><span>最小化</span><span class="ar-shortcut-key">Alt + M</span></div>
        <div class="ar-shortcut-item"><span>切换主题</span><span class="ar-shortcut-key">Alt + T</span></div>
      </div>
    `;
  },

  /**
   * 获取设置HTML
   * @returns {string}
   */
  getSettingsHTML() {
    return `
      <div class="ar-setting-section">
        <div class="ar-setting-section-title">🎮 阅读模式</div>
        <div class="ar-mode-grid">
          ${Object.entries(MODE_PRESETS).map(([key, mode]) => `
            <div class="ar-mode-card ${State.settings.mode === key ? 'active' : ''}" data-mode="${key}">
              <div class="ar-mode-card-icon">${mode.icon}</div>
              <div class="ar-mode-card-name">${mode.name.replace(/^[^\s]+\s/, '')}</div>
              <div class="ar-mode-card-desc">${mode.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="ar-setting-section">
        <div class="ar-setting-section-title">⚡ 快捷设置</div>
        <div class="ar-setting-item">
          <div><div class="ar-setting-label">并发数量</div><div class="ar-setting-desc">同时处理的帖子数</div></div>
          <div class="ar-slider-container">
            <input type="range" class="ar-slider" id="ar-setting-concurrency" min="1" max="5" value="${State.settings.concurrency}">
            <span class="ar-slider-value" id="ar-concurrency-value">${State.settings.concurrency}</span>
          </div>
        </div>
        <div class="ar-setting-item">
          <div><div class="ar-setting-label">每帖回复数</div><div class="ar-setting-desc">每个帖子最多阅读回复数 (0=仅主帖)</div></div>
          <div class="ar-slider-container">
            <input type="range" class="ar-slider" id="ar-setting-replies" min="0" max="100" step="5" value="${State.settings.reading?.maxRepliesPerTopic || 50}">
            <span class="ar-slider-value" id="ar-replies-value">${State.settings.reading?.maxRepliesPerTopic || 50}</span>
          </div>
        </div>
        <div class="ar-setting-item">
          <div><div class="ar-setting-label">批次大小</div><div class="ar-setting-desc">每次检查处理的帖子数</div></div>
          <div class="ar-slider-container">
            <input type="range" class="ar-slider" id="ar-setting-batch" min="1" max="20" value="${State.settings.reading?.maxTopicsPerBatch || 10}">
            <span class="ar-slider-value" id="ar-batch-value">${State.settings.reading?.maxTopicsPerBatch || 10}</span>
          </div>
        </div>
      </div>

      <div class="ar-collapsible" id="ar-advanced-settings">
        <div class="ar-collapsible-header">
          <span class="ar-collapsible-title">🔧 高级设置</span>
          <span class="ar-collapsible-icon">▼</span>
        </div>
        <div class="ar-collapsible-content">
          <div class="ar-setting-item">
            <div><div class="ar-setting-label">帖子间隔 (秒)</div></div>
            <div class="ar-range-input">
              <input type="number" class="ar-input" id="ar-interval-topic-min" value="${Math.floor(State.settings.intervals.betweenTopics.min / 1000)}">
              <span class="ar-range-separator">~</span>
              <input type="number" class="ar-input" id="ar-interval-topic-max" value="${Math.floor(State.settings.intervals.betweenTopics.max / 1000)}">
            </div>
          </div>
          <div class="ar-setting-item">
            <div><div class="ar-setting-label">回复间隔 (秒)</div></div>
            <div class="ar-range-input">
              <input type="number" class="ar-input" id="ar-interval-reply-min" value="${(State.settings.intervals.betweenReplies.min / 1000).toFixed(1)}">
              <span class="ar-range-separator">~</span>
              <input type="number" class="ar-input" id="ar-interval-reply-max" value="${(State.settings.intervals.betweenReplies.max / 1000).toFixed(1)}">
            </div>
          </div>
          <div class="ar-setting-item">
            <div><div class="ar-setting-label">批次间隔 (秒)</div></div>
            <div class="ar-range-input">
              <input type="number" class="ar-input" id="ar-interval-batch-min" value="${Math.floor(State.settings.intervals.betweenBatches.min / 1000)}">
              <span class="ar-range-separator">~</span>
              <input type="number" class="ar-input" id="ar-interval-batch-max" value="${Math.floor(State.settings.intervals.betweenBatches.max / 1000)}">
            </div>
          </div>
          <div class="ar-setting-item">
            <div><div class="ar-setting-label">随机跳过概率</div></div>
            <div class="ar-slider-container">
              <input type="range" class="ar-slider" id="ar-setting-skip" min="0" max="50" value="${(State.settings.behavior?.skipProbability || 0.1) * 100}">
              <span class="ar-slider-value" id="ar-skip-value">${Math.round((State.settings.behavior?.skipProbability || 0.1) * 100)}%</span>
            </div>
          </div>
          <div class="ar-setting-item">
            <div><div class="ar-setting-label">每日帖子上限</div></div>
            <input type="number" class="ar-input" id="ar-setting-daily-limit" value="${State.settings.safety?.maxDailyTopics || 200}" style="width: 80px;">
          </div>
        </div>
      </div>

      <div class="ar-setting-section" style="margin-top: 16px;">
        <div class="ar-setting-section-title">🔔 通知与行为</div>
        <div class="ar-setting-item">
          <div><div class="ar-setting-label">声音提醒</div></div>
          <label class="ar-switch"><input type="checkbox" id="ar-setting-sound" ${State.settings.sound ? 'checked' : ''}><span class="ar-switch-slider"></span></label>
        </div>
        <div class="ar-setting-item">
          <div><div class="ar-setting-label">桌面通知</div></div>
          <label class="ar-switch"><input type="checkbox" id="ar-setting-notifications" ${State.settings.notifications ? 'checked' : ''}><span class="ar-switch-slider"></span></label>
        </div>
        <div class="ar-setting-item">
          <div><div class="ar-setting-label">自动启动</div></div>
          <label class="ar-switch"><input type="checkbox" id="ar-setting-autostart" ${State.settings.autoStart ? 'checked' : ''}><span class="ar-switch-slider"></span></label>
        </div>
        <div class="ar-setting-item">
          <div><div class="ar-setting-label">随机顺序</div></div>
          <label class="ar-switch"><input type="checkbox" id="ar-setting-random" ${State.settings.reading?.randomOrder ? 'checked' : ''}><span class="ar-switch-slider"></span></label>
        </div>
        <div class="ar-setting-item">
          <div><div class="ar-setting-label">偶尔暂停</div></div>
          <label class="ar-switch"><input type="checkbox" id="ar-setting-pause" ${State.settings.behavior?.occasionalPause ? 'checked' : ''}><span class="ar-switch-slider"></span></label>
        </div>
      </div>

      <div class="ar-btn-row">
        <button class="ar-btn ar-btn-secondary" id="ar-btn-clear-logs">🗑️ 清除日志</button>
        <button class="ar-btn ar-btn-secondary" id="ar-btn-reset-stats">📊 重置统计</button>
      </div>
    `;
  },

  /**
   * 绑定事件
   */
  bindEvents() {
    document.getElementById('ar-btn-start').addEventListener('click', () => this.coreRef?.start());
    document.getElementById('ar-btn-pause').addEventListener('click', () => this.coreRef?.pause());
    document.getElementById('ar-btn-stop').addEventListener('click', () => this.coreRef?.stop());
    document.getElementById('ar-btn-check').addEventListener('click', () => this.coreRef?.checkNow());

    document.getElementById('ar-btn-theme').addEventListener('click', () => this.toggleTheme());
    document.getElementById('ar-btn-minimize').addEventListener('click', () => this.toggleMinimize());
    document.getElementById('ar-btn-help').addEventListener('click', () => this.toggleShortcuts());

    document.querySelectorAll('.ar-tab').forEach((tab) => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    document.querySelectorAll('.ar-mode-card').forEach((card) => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.ar-mode-card').forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        State.settings.mode = card.dataset.mode;
        this.updateModeDisplay();
        Storage.save();
        Logger.info(`✓ 已切换到 ${MODE_PRESETS[State.settings.mode]?.name || '自定义模式'}`);
      });
    });

    document.querySelector('.ar-collapsible-header')?.addEventListener('click', () => {
      document.getElementById('ar-advanced-settings').classList.toggle('open');
    });

    this.bindSlider('ar-setting-concurrency', 'ar-concurrency-value', (val) => { State.settings.concurrency = parseInt(val); });
    this.bindSlider('ar-setting-replies', 'ar-replies-value', (val) => { State.settings.reading.maxRepliesPerTopic = parseInt(val); });
    this.bindSlider('ar-setting-batch', 'ar-batch-value', (val) => { State.settings.reading.maxTopicsPerBatch = parseInt(val); });
    this.bindSlider('ar-setting-skip', 'ar-skip-value', (val) => { State.settings.behavior.skipProbability = parseInt(val) / 100; }, (val) => val + '%');

    ['ar-interval-topic-min', 'ar-interval-topic-max'].forEach((id) => {
      document.getElementById(id)?.addEventListener('change', (e) => {
        const isMin = id.includes('min');
        State.settings.intervals.betweenTopics[isMin ? 'min' : 'max'] = parseFloat(e.target.value) * 1000;
        Storage.save();
      });
    });

    ['ar-interval-reply-min', 'ar-interval-reply-max'].forEach((id) => {
      document.getElementById(id)?.addEventListener('change', (e) => {
        const isMin = id.includes('min');
        State.settings.intervals.betweenReplies[isMin ? 'min' : 'max'] = parseFloat(e.target.value) * 1000;
        Storage.save();
      });
    });

    ['ar-interval-batch-min', 'ar-interval-batch-max'].forEach((id) => {
      document.getElementById(id)?.addEventListener('change', (e) => {
        const isMin = id.includes('min');
        State.settings.intervals.betweenBatches[isMin ? 'min' : 'max'] = parseFloat(e.target.value) * 1000;
        Storage.save();
      });
    });

    document.getElementById('ar-setting-daily-limit')?.addEventListener('change', (e) => {
      State.settings.safety.maxDailyTopics = parseInt(e.target.value);
      Storage.save();
    });

    const switches = { 'ar-setting-sound': 'sound', 'ar-setting-notifications': 'notifications', 'ar-setting-autostart': 'autoStart' };
    Object.entries(switches).forEach(([id, key]) => {
      document.getElementById(id)?.addEventListener('change', (e) => {
        State.settings[key] = e.target.checked;
        Storage.save();
      });
    });

    document.getElementById('ar-setting-random')?.addEventListener('change', (e) => {
      State.settings.reading.randomOrder = e.target.checked;
      Storage.save();
    });

    document.getElementById('ar-setting-pause')?.addEventListener('change', (e) => {
      State.settings.behavior.occasionalPause = e.target.checked;
      Storage.save();
    });

    document.getElementById('ar-btn-clear-logs')?.addEventListener('click', () => Logger.clear());
    document.getElementById('ar-btn-reset-stats')?.addEventListener('click', () => Storage.clear(this, Logger));

    const header = document.getElementById('ar-header');
    header?.addEventListener('mousedown', (e) => this.startDrag(e));
    document.addEventListener('mousemove', (e) => this.onDrag(e));
    document.addEventListener('mouseup', () => this.endDrag());

    document.addEventListener('keydown', (e) => {
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 's': e.preventDefault(); State.isRunning ? this.coreRef?.stop() : this.coreRef?.start(); break;
          case 'p': e.preventDefault(); if (State.isRunning) this.coreRef?.pause(); break;
          case 'c': e.preventDefault(); this.coreRef?.checkNow(); break;
          case 'm': e.preventDefault(); this.toggleMinimize(); break;
          case 't': e.preventDefault(); this.toggleTheme(); break;
        }
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && State.isRunning && !State.isPaused) {
        const now = Date.now();
        if (now - State.lastCheckTime > DEFAULT_CONFIG.TIMEOUT_THRESHOLD) {
          this.coreRef?.doCheck();
        }
      }
    });

    window.addEventListener('beforeunload', () => Storage.save());

    setInterval(() => {
      this.updateRuntime();
      this.updateDailyStats();
    }, 1000);
  },

  bindSlider(sliderId, valueId, onChange, formatter = (v) => v) {
    const slider = document.getElementById(sliderId);
    const valueEl = document.getElementById(valueId);
    if (!slider || !valueEl) return;

    slider.addEventListener('input', (e) => { valueEl.textContent = formatter(e.target.value); });
    slider.addEventListener('change', (e) => { onChange(e.target.value); Storage.save(); });
  },

  startDrag(e) {
    if (e.target.closest('.ar-icon-btn')) return;
    this.isDragging = true;
    const rect = this.container.getBoundingClientRect();
    this.dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    this.container.style.transition = 'none';
  },

  onDrag(e) {
    if (!this.isDragging) return;
    const x = e.clientX - this.dragOffset.x;
    const y = e.clientY - this.dragOffset.y;
    const maxX = window.innerWidth - this.container.offsetWidth;
    const maxY = window.innerHeight - this.container.offsetHeight;
    this.container.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
    this.container.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
    this.container.style.right = 'auto';
    this.container.style.bottom = 'auto';
  },

  endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.container.style.transition = '';
    State.settings.position = { x: this.container.style.left, y: this.container.style.top };
    Storage.save();
  },

  restorePosition() {
    if (State.settings.position.x !== null) {
      this.container.style.left = State.settings.position.x;
      this.container.style.top = State.settings.position.y;
      this.container.style.right = 'auto';
      this.container.style.bottom = 'auto';
    }
  },

  toggleTheme() {
    State.settings.theme = State.settings.theme === 'dark' ? 'light' : 'dark';
    this.container.classList.toggle('ar-light');
    Storage.save();
  },

  toggleMinimize() {
    State.settings.minimized = !State.settings.minimized;
    this.container.classList.toggle('minimized');
    document.getElementById('ar-btn-minimize').textContent = State.settings.minimized ? '➕' : '➖';
    Storage.save();
  },

  toggleShortcuts() {
    const shortcuts = document.getElementById('ar-shortcuts');
    shortcuts.classList.toggle('show');

    if (shortcuts.classList.contains('show')) {
      setTimeout(() => {
        const handler = (e) => {
          if (!shortcuts.contains(e.target) && !e.target.closest('#ar-btn-help')) {
            shortcuts.classList.remove('show');
            document.removeEventListener('click', handler);
          }
        };
        document.addEventListener('click', handler);
      }, 0);
    }
  },

  switchTab(tabName) {
    document.querySelectorAll('.ar-tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.ar-tab-content').forEach((c) => c.classList.remove('active'));
    document.querySelector(`.ar-tab[data-tab="${tabName}"]`)?.classList.add('active');
    document.getElementById(`ar-${tabName}`)?.classList.add('active');
  },

  updateModeDisplay() {
    const mode = MODE_PRESETS[State.settings.mode];
    const badge = document.getElementById('ar-mode-badge');
    if (badge) badge.innerHTML = `${mode?.icon || '⚙️'} ${mode?.name?.replace(/^[^\s]+\s/, '') || '自定义'}`;
  },

  updateStatus() {
    const dot = document.getElementById('ar-status-dot');
    const startBtn = document.getElementById('ar-btn-start');
    const pauseBtn = document.getElementById('ar-btn-pause');
    const stopBtn = document.getElementById('ar-btn-stop');

    if (dot) {
      dot.className = '';
      if (State.isRunning) dot.classList.add(State.isPaused ? 'paused' : 'running');
    }

    if (startBtn) startBtn.disabled = State.isRunning;
    if (pauseBtn) pauseBtn.disabled = !State.isRunning;
    if (stopBtn) stopBtn.disabled = !State.isRunning;

    const pauseIcon = pauseBtn?.querySelector('.ar-btn-icon');
    const pauseText = pauseBtn?.querySelector('span:last-child');
    if (pauseIcon) pauseIcon.textContent = State.isPaused ? '▶' : '⏸';
    if (pauseText) pauseText.textContent = State.isPaused ? '恢复' : '暂停';
  },

  updateStats() {
    const topicsEl = document.getElementById('ar-stat-topics');
    const repliesEl = document.getElementById('ar-stat-replies');
    if (topicsEl) topicsEl.textContent = Utils.formatNumber(State.stats.session.topicsMarked);
    if (repliesEl) repliesEl.textContent = Utils.formatNumber(State.stats.session.repliesMarked);
  },

  updateDailyStats() {
    const today = new Date().toDateString();
    if (State.stats.daily.date !== today) {
      State.stats.daily = { topicsMarked: 0, repliesMarked: 0, date: today };
    }
    const dailyEl = document.getElementById('ar-stat-daily');
    if (dailyEl) dailyEl.textContent = `${State.stats.daily.topicsMarked}/${State.settings.safety.maxDailyTopics}`;
  },

  updateRuntime() {
    if (!State.isRunning || !State.runtime.startTime) return;

    let elapsed = Date.now() - State.runtime.startTime - State.runtime.pausedTime;
    if (State.isPaused && State.runtime.lastPauseStart) {
      elapsed -= Date.now() - State.runtime.lastPauseStart;
    }

    const timeEl = document.getElementById('ar-stat-time');
    if (timeEl) timeEl.textContent = Utils.formatDuration(elapsed);
  },

  updateProgress(percent, text) {
    const fillEl = document.getElementById('ar-progress-fill');
    const textEl = document.getElementById('ar-progress-text');
    const currentTopicEl = document.getElementById('ar-current-topic');

    if (fillEl) fillEl.style.width = `${percent}%`;
    if (textEl) textEl.textContent = text;

    if (currentTopicEl) {
      currentTopicEl.textContent = State.currentTopic ? Utils.truncate(State.currentTopic.title, 25) : '';
    }
  },

  appendLog(log) {
    const container = document.getElementById('ar-logs');
    if (!container) return;

    const empty = container.querySelector('.ar-empty');
    if (empty) empty.remove();

    const item = document.createElement('div');
    item.className = `ar-log-item ${log.type}`;
    item.innerHTML = `<span class="ar-log-time">${log.time}</span><span class="ar-log-msg">${log.message}</span>`;

    container.appendChild(item);
    container.scrollTop = container.scrollHeight;

    while (container.children.length > DEFAULT_CONFIG.MAX_LOGS) {
      container.removeChild(container.firstChild);
    }
  },

  updateTopicsList(topics) {
    const container = document.getElementById('ar-topics');
    if (!container) return;

    container.innerHTML = '';
    const displayTopics = topics.slice(0, DEFAULT_CONFIG.MAX_TOPICS_DISPLAY);

    if (displayTopics.length === 0) {
      container.innerHTML = '<div class="ar-empty"><div class="ar-empty-icon">📑</div><div class="ar-empty-text">暂无帖子数据</div></div>';
      return;
    }

    displayTopics.forEach((topic) => {
      const item = document.createElement('div');
      item.className = `ar-topic-item ${topic.unseen ? 'unseen' : ''}`;
      item.dataset.topicId = topic.id;
      item.innerHTML = `
        <span class="ar-topic-badge ${topic.unseen ? 'unseen' : 'read'}">${topic.unseen ? '未读' : '已读'}</span>
        <a href="https://linux.do/t/topic/${topic.id}" target="_blank" title="${topic.title}">${topic.title}</a>
        <span class="ar-topic-replies">${topic.posts_count || 0}</span>
      `;
      container.appendChild(item);
    });
  },

  highlightCurrentTopic(topicId) {
    document.querySelectorAll('.ar-topic-item').forEach((item) => {
      item.classList.toggle('current', item.dataset.topicId === String(topicId));
    });
  },
};

export default UI;
