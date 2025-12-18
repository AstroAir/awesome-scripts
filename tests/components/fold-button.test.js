/**
 * FoldButton 组件测试
 */

import { jest } from '@jest/globals';
import {
  createFoldButton,
  updateFoldButton,
  getFoldButtonStyles,
} from '@components/fold-button.js';

describe('FoldButton 组件', () => {
  describe('createFoldButton', () => {
    test('应该创建一个按钮元素', () => {
      const button = createFoldButton();
      expect(button.tagName).toBe('BUTTON');
    });

    test('应该使用默认类名', () => {
      const button = createFoldButton();
      expect(button.className).toBe('x-fold-button');
    });

    test('应该使用自定义类名', () => {
      const button = createFoldButton({ className: 'custom-class' });
      expect(button.className).toBe('custom-class');
    });

    test('应该设置展开图标（默认状态）', () => {
      const button = createFoldButton({ collapsed: false });
      expect(button.textContent).toBe('▼');
    });

    test('应该设置折叠图标', () => {
      const button = createFoldButton({ collapsed: true });
      expect(button.textContent).toBe('▶');
    });

    test('应该设置 aria-expanded 属性', () => {
      const button = createFoldButton({ collapsed: false });
      expect(button.getAttribute('aria-expanded')).toBe('true');
    });

    test('应该绑定点击事件', () => {
      const onClick = jest.fn();
      const button = createFoldButton({ onClick });
      button.click();
      expect(onClick).toHaveBeenCalled();
    });

    test('点击事件应该阻止默认行为', () => {
      const onClick = jest.fn();
      const button = createFoldButton({ onClick });
      const event = new Event('click');
      event.preventDefault = jest.fn();
      event.stopPropagation = jest.fn();
      button.dispatchEvent(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('updateFoldButton', () => {
    test('应该更新按钮图标为折叠状态', () => {
      const button = createFoldButton({ collapsed: false });
      updateFoldButton(button, true);
      expect(button.textContent).toBe('▶');
    });

    test('应该更新按钮图标为展开状态', () => {
      const button = createFoldButton({ collapsed: true });
      updateFoldButton(button, false);
      expect(button.textContent).toBe('▼');
    });

    test('应该更新 aria-expanded 属性', () => {
      const button = createFoldButton({ collapsed: false });
      updateFoldButton(button, true);
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    test('应该切换折叠类', () => {
      const button = createFoldButton({ collapsed: false });
      updateFoldButton(button, true);
      expect(button.classList.contains('x-collapsed')).toBe(true);
    });

    test('应该支持自定义图标', () => {
      const button = createFoldButton();
      updateFoldButton(button, true, {
        collapsedIcon: '→',
        expandedIcon: '↓',
      });
      expect(button.textContent).toBe('→');
    });
  });

  describe('getFoldButtonStyles', () => {
    test('应该返回 CSS 字符串', () => {
      const styles = getFoldButtonStyles();
      expect(typeof styles).toBe('string');
      expect(styles.length).toBeGreaterThan(0);
    });

    test('应该包含默认选择器', () => {
      const styles = getFoldButtonStyles();
      expect(styles).toContain('.x-fold-button');
    });

    test('应该支持自定义选择器', () => {
      const styles = getFoldButtonStyles({ className: '.custom-button' });
      expect(styles).toContain('.custom-button');
    });

    test('应该包含悬停样式', () => {
      const styles = getFoldButtonStyles();
      expect(styles).toContain(':hover');
    });

    test('应该包含折叠状态样式', () => {
      const styles = getFoldButtonStyles();
      expect(styles).toContain('.x-collapsed');
    });
  });
});
