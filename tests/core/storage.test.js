/**
 * Storage 模块测试
 */

import { LocalStorageManager, GMStorageManager, StateManager } from '@core/storage.js';

describe('LocalStorageManager', () => {
  let storage;

  beforeEach(() => {
    storage = new LocalStorageManager('test-prefix');
  });

  describe('get/set', () => {
    test('应该正确存储和获取值', () => {
      storage.set('key1', 'value1');
      expect(storage.get('key1')).toBe('value1');
    });

    test('应该正确存储和获取对象', () => {
      const obj = { a: 1, b: [1, 2, 3] };
      storage.set('obj', obj);
      expect(storage.get('obj')).toEqual(obj);
    });

    test('应该返回默认值当键不存在时', () => {
      expect(storage.get('nonexistent', 'default')).toBe('default');
    });

    test('应该使用前缀存储键', () => {
      storage.set('key1', 'value1');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'test-prefix-key1',
        JSON.stringify('value1')
      );
    });
  });

  describe('remove', () => {
    test('应该正确删除值', () => {
      storage.set('key1', 'value1');
      storage.remove('key1');
      expect(storage.get('key1')).toBeNull();
    });
  });

  describe('clear', () => {
    test('应该清除所有带前缀的值', () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      storage.clear();
      expect(storage.get('key1')).toBeNull();
      expect(storage.get('key2')).toBeNull();
    });
  });
});

describe('GMStorageManager', () => {
  let storage;

  beforeEach(() => {
    storage = new GMStorageManager('test');
  });

  describe('get/set', () => {
    test('应该调用 GM_setValue 和 GM_getValue', () => {
      storage.set('key1', 'value1');
      expect(GM_setValue).toHaveBeenCalledWith('test_key1', JSON.stringify('value1'));

      storage.get('key1');
      expect(GM_getValue).toHaveBeenCalledWith('test_key1');
    });

    test('应该返回默认值当键不存在时', () => {
      GM_getValue.mockReturnValueOnce(undefined);
      expect(storage.get('nonexistent', 'default')).toBe('default');
    });
  });

  describe('remove', () => {
    test('应该调用 GM_deleteValue', () => {
      storage.remove('key1');
      expect(GM_deleteValue).toHaveBeenCalledWith('test_key1');
    });
  });
});

describe('StateManager', () => {
  let localStorage;
  let stateManager;

  beforeEach(() => {
    localStorage = new LocalStorageManager('state');
  });

  describe('Map 类型', () => {
    beforeEach(() => {
      stateManager = new StateManager(localStorage, 'testMap', 'map');
    });

    test('应该正确设置和获取值', () => {
      stateManager.set('key1', 'value1');
      expect(stateManager.get('key1')).toBe('value1');
    });

    test('应该检查键是否存在', () => {
      stateManager.set('key1', 'value1');
      expect(stateManager.has('key1')).toBe(true);
      expect(stateManager.has('nonexistent')).toBe(false);
    });

    test('应该正确删除值', () => {
      stateManager.set('key1', 'value1');
      stateManager.delete('key1');
      expect(stateManager.has('key1')).toBe(false);
    });

    test('应该返回正确的大小', () => {
      stateManager.set('key1', 'value1');
      stateManager.set('key2', 'value2');
      expect(stateManager.size).toBe(2);
    });
  });

  describe('Set 类型', () => {
    beforeEach(() => {
      stateManager = new StateManager(localStorage, 'testSet', 'set');
    });

    test('应该正确添加值', () => {
      stateManager.add('item1');
      expect(stateManager.has('item1')).toBe(true);
    });

    test('应该正确切换值', () => {
      expect(stateManager.toggle('item1')).toBe(true);
      expect(stateManager.has('item1')).toBe(true);
      
      expect(stateManager.toggle('item1')).toBe(false);
      expect(stateManager.has('item1')).toBe(false);
    });

    test('应该正确清空', () => {
      stateManager.add('item1');
      stateManager.add('item2');
      stateManager.clear();
      expect(stateManager.size).toBe(0);
    });
  });
});
