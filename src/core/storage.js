/**
 * 统一存储管理模块
 * 提供 localStorage 和 GM_setValue/GM_getValue 的封装
 */

/**
 * LocalStorage 存储类
 * 用于不需要 GM 权限的脚本
 */
export class LocalStorageManager {
  constructor(prefix = '') {
    this.prefix = prefix;
  }

  /**
   * 生成带前缀的键名
   * @param {string} key - 原始键名
   * @returns {string} 带前缀的键名
   */
  _getKey(key) {
    return this.prefix ? `${this.prefix}-${key}` : key;
  }

  /**
   * 获取存储的值
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {*} 存储的值或默认值
   */
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(this._getKey(key));
      if (value === null) return defaultValue;
      return JSON.parse(value);
    } catch (e) {
      console.warn(`[Storage] Failed to get "${key}":`, e);
      return defaultValue;
    }
  }

  /**
   * 设置存储的值
   * @param {string} key - 键名
   * @param {*} value - 要存储的值
   * @returns {boolean} 是否成功
   */
  set(key, value) {
    try {
      localStorage.setItem(this._getKey(key), JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[Storage] Failed to set "${key}":`, e);
      return false;
    }
  }

  /**
   * 删除存储的值
   * @param {string} key - 键名
   * @returns {boolean} 是否成功
   */
  remove(key) {
    try {
      localStorage.removeItem(this._getKey(key));
      return true;
    } catch (e) {
      console.warn(`[Storage] Failed to remove "${key}":`, e);
      return false;
    }
  }

  /**
   * 清除所有带前缀的存储
   */
  clear() {
    if (!this.prefix) {
      console.warn('[Storage] Cannot clear without prefix');
      return;
    }
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }
}

/**
 * GM 存储类
 * 使用 Tampermonkey 的 GM_setValue/GM_getValue
 */
export class GMStorageManager {
  constructor(prefix = '') {
    this.prefix = prefix;
  }

  /**
   * 生成带前缀的键名
   * @param {string} key - 原始键名
   * @returns {string} 带前缀的键名
   */
  _getKey(key) {
    return this.prefix ? `${this.prefix}_${key}` : key;
  }

  /**
   * 获取存储的值
   * @param {string} key - 键名
   * @param {*} defaultValue - 默认值
   * @returns {*} 存储的值或默认值
   */
  get(key, defaultValue = null) {
    try {
      const value = GM_getValue(this._getKey(key));
      if (value === undefined) return defaultValue;
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch (e) {
      console.warn(`[GMStorage] Failed to get "${key}":`, e);
      return defaultValue;
    }
  }

  /**
   * 设置存储的值
   * @param {string} key - 键名
   * @param {*} value - 要存储的值
   * @returns {boolean} 是否成功
   */
  set(key, value) {
    try {
      GM_setValue(this._getKey(key), JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[GMStorage] Failed to set "${key}":`, e);
      return false;
    }
  }

  /**
   * 删除存储的值
   * @param {string} key - 键名
   * @returns {boolean} 是否成功
   */
  remove(key) {
    try {
      GM_deleteValue(this._getKey(key));
      return true;
    } catch (e) {
      console.warn(`[GMStorage] Failed to remove "${key}":`, e);
      return false;
    }
  }
}

/**
 * 状态管理器
 * 用于管理 Map 或 Set 类型的状态，并自动持久化
 */
export class StateManager {
  /**
   * @param {LocalStorageManager|GMStorageManager} storage - 存储管理器实例
   * @param {string} key - 存储键名
   * @param {'map'|'set'} type - 状态类型
   */
  constructor(storage, key, type = 'map') {
    this.storage = storage;
    this.key = key;
    this.type = type;
    this.state = this._load();
  }

  /**
   * 从存储加载状态
   * @returns {Map|Set} 状态对象
   */
  _load() {
    const data = this.storage.get(this.key);
    if (this.type === 'set') {
      return new Set(Array.isArray(data) ? data : []);
    }
    if (data && typeof data === 'object') {
      return new Map(Object.entries(data));
    }
    return new Map();
  }

  /**
   * 保存状态到存储
   */
  save() {
    if (this.type === 'set') {
      this.storage.set(this.key, [...this.state]);
    } else {
      this.storage.set(this.key, Object.fromEntries(this.state));
    }
  }

  /**
   * 获取值
   * @param {string} key - 键名
   * @returns {*} 值
   */
  get(key) {
    return this.state.get(key);
  }

  /**
   * 设置值
   * @param {string} key - 键名
   * @param {*} value - 值
   */
  set(key, value) {
    this.state.set(key, value);
    this.save();
  }

  /**
   * 检查是否存在
   * @param {string} key - 键名
   * @returns {boolean} 是否存在
   */
  has(key) {
    return this.state.has(key);
  }

  /**
   * 添加（用于 Set）
   * @param {*} value - 值
   */
  add(value) {
    if (this.type === 'set') {
      this.state.add(value);
      this.save();
    }
  }

  /**
   * 删除
   * @param {string} key - 键名
   */
  delete(key) {
    this.state.delete(key);
    this.save();
  }

  /**
   * 切换（用于 Set）
   * @param {*} value - 值
   * @returns {boolean} 切换后是否存在
   */
  toggle(value) {
    if (this.type === 'set') {
      if (this.state.has(value)) {
        this.state.delete(value);
        this.save();
        return false;
      } else {
        this.state.add(value);
        this.save();
        return true;
      }
    }
    return false;
  }

  /**
   * 清空
   */
  clear() {
    this.state.clear();
    this.save();
  }

  /**
   * 获取所有条目
   * @returns {Array} 条目数组
   */
  entries() {
    return this.type === 'set' ? [...this.state] : [...this.state.entries()];
  }

  /**
   * 获取大小
   * @returns {number} 大小
   */
  get size() {
    return this.state.size;
  }
}

export default {
  LocalStorageManager,
  GMStorageManager,
  StateManager,
};
