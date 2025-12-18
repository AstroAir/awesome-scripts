/**
 * GitHub Fold About 动画模块测试
 */

import {
  applyFoldAnimation,
  applyFoldStateImmediate,
  ANIMATION_CONFIG,
} from '@scripts/github-fold-about/animation.js';

describe('GitHub Fold About 动画模块', () => {
  let elements;

  beforeEach(() => {
    elements = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div'),
    ];
    elements.forEach((el) => document.body.appendChild(el));
  });

  describe('ANIMATION_CONFIG', () => {
    test('应该有 duration 配置', () => {
      expect(ANIMATION_CONFIG.duration).toBeDefined();
      expect(typeof ANIMATION_CONFIG.duration).toBe('number');
    });

    test('应该有 staggerDelay 配置', () => {
      expect(ANIMATION_CONFIG.staggerDelay).toBeDefined();
      expect(typeof ANIMATION_CONFIG.staggerDelay).toBe('number');
    });

    test('应该有 easing 配置', () => {
      expect(ANIMATION_CONFIG.easing).toBeDefined();
      expect(typeof ANIMATION_CONFIG.easing).toBe('string');
    });
  });

  describe('applyFoldAnimation', () => {
    test('应该返回 Promise', () => {
      const result = applyFoldAnimation(elements, true);
      expect(result).toBeInstanceOf(Promise);
    });

    test('折叠动画应该隐藏元素', async () => {
      await applyFoldAnimation(elements, true);
      elements.forEach((el) => {
        expect(el.style.display).toBe('none');
      });
    });

    test('展开动画应该显示元素', async () => {
      // 先隐藏
      elements.forEach((el) => {
        el.style.display = 'none';
      });

      await applyFoldAnimation(elements, false);
      elements.forEach((el) => {
        expect(el.style.display).toBe('');
      });
    });
  });

  describe('applyFoldStateImmediate', () => {
    test('折叠应该立即隐藏元素', () => {
      applyFoldStateImmediate(elements, true);
      elements.forEach((el) => {
        expect(el.style.display).toBe('none');
        expect(el.style.opacity).toBe('0');
      });
    });

    test('展开应该立即显示元素', () => {
      applyFoldStateImmediate(elements, true);
      applyFoldStateImmediate(elements, false);
      elements.forEach((el) => {
        expect(el.style.display).toBe('');
        expect(el.style.opacity).toBe('1');
      });
    });
  });
});
