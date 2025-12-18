/**
 * Animation 工具模块测试
 */

import { jest } from '@jest/globals';
import {
  ANIMATION_DEFAULTS,
  fadeIn,
  fadeOut,
  slideDown,
  slideUp,
  delay,
  preventReentry,
} from '@utils/animation.js';

describe('Animation 工具函数', () => {
  describe('ANIMATION_DEFAULTS', () => {
    test('应该有默认配置', () => {
      expect(ANIMATION_DEFAULTS.duration).toBeDefined();
      expect(ANIMATION_DEFAULTS.easing).toBeDefined();
      expect(ANIMATION_DEFAULTS.staggerDelay).toBeDefined();
    });
  });

  describe('fadeIn', () => {
    test('应该设置元素为可见', async () => {
      const el = document.createElement('div');
      el.style.display = 'none';
      document.body.appendChild(el);

      await fadeIn(el, { duration: 10 });
      expect(el.style.opacity).toBe('1');
    });
  });

  describe('fadeOut', () => {
    test('应该隐藏元素', async () => {
      const el = document.createElement('div');
      el.style.opacity = '1';
      document.body.appendChild(el);

      await fadeOut(el, { duration: 10 });
      expect(el.style.display).toBe('none');
    });

    test('应该支持不隐藏元素', async () => {
      const el = document.createElement('div');
      el.style.opacity = '1';
      document.body.appendChild(el);

      await fadeOut(el, { duration: 10, hide: false });
      expect(el.style.display).not.toBe('none');
    });
  });

  describe('slideDown', () => {
    test('应该执行滑入动画', async () => {
      const el = document.createElement('div');
      el.style.display = 'none';
      document.body.appendChild(el);

      await slideDown(el, { duration: 10 });
      expect(el.style.opacity).toBe('1');
    });
  });

  describe('slideUp', () => {
    test('应该执行滑出动画', async () => {
      const el = document.createElement('div');
      document.body.appendChild(el);

      await slideUp(el, { duration: 10 });
      expect(el.style.display).toBe('none');
    });
  });

  describe('delay', () => {
    test('应该等待指定时间', async () => {
      const start = Date.now();
      await delay(50);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(45);
    });
  });

  describe('preventReentry', () => {
    test('应该防止重入', async () => {
      const el = document.createElement('div');
      const mockFn = jest.fn(() => delay(50));

      const wrapped = preventReentry(el, mockFn);

      // 同时调用两次
      wrapped();
      wrapped();

      await delay(100);

      // 只应该执行一次
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('应该在完成后允许再次调用', async () => {
      const el = document.createElement('div');
      const mockFn = jest.fn(() => delay(10));

      const wrapped = preventReentry(el, mockFn);

      await wrapped();
      await wrapped();

      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });
});
