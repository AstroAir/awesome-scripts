/**
 * DOM 工具模块测试
 */

import { jest } from '@jest/globals';
import {
  createElement,
  $,
  $$,
  matches,
  closest,
  nextSibling,
  nextSiblings,
  toggleClass,
  isVisible,
  getData,
  setData,
} from '@utils/dom.js';

describe('DOM 工具函数', () => {
  describe('createElement', () => {
    test('应该创建基本元素', () => {
      const el = createElement('div');
      expect(el.tagName).toBe('DIV');
    });

    test('应该设置 className', () => {
      const el = createElement('div', { className: 'test-class' });
      expect(el.className).toBe('test-class');
    });

    test('应该设置多个 className (数组)', () => {
      const el = createElement('div', { className: ['class1', 'class2'] });
      expect(el.classList.contains('class1')).toBe(true);
      expect(el.classList.contains('class2')).toBe(true);
    });

    test('应该设置 id', () => {
      const el = createElement('div', { id: 'test-id' });
      expect(el.id).toBe('test-id');
    });

    test('应该设置属性', () => {
      const el = createElement('input', {
        attrs: { type: 'text', placeholder: 'Enter text' },
      });
      expect(el.getAttribute('type')).toBe('text');
      expect(el.getAttribute('placeholder')).toBe('Enter text');
    });

    test('应该设置样式', () => {
      const el = createElement('div', {
        styles: { color: 'red', fontSize: '16px' },
      });
      expect(el.style.color).toBe('red');
      expect(el.style.fontSize).toBe('16px');
    });

    test('应该设置文本内容', () => {
      const el = createElement('span', { text: 'Hello World' });
      expect(el.textContent).toBe('Hello World');
    });

    test('应该设置 HTML 内容', () => {
      const el = createElement('div', { html: '<span>Test</span>' });
      expect(el.innerHTML).toBe('<span>Test</span>');
    });

    test('应该添加子元素', () => {
      const child = createElement('span', { text: 'Child' });
      const parent = createElement('div', { children: [child, 'Text Node'] });
      expect(parent.children.length).toBe(1);
      expect(parent.childNodes.length).toBe(2);
    });

    test('应该绑定事件', () => {
      const handler = jest.fn();
      const el = createElement('button', { events: { click: handler } });
      el.click();
      expect(handler).toHaveBeenCalled();
    });
  });

  describe('$ 和 $$', () => {
    beforeEach(() => {
      testUtils.createDOM(`
        <div class="container">
          <span class="item" id="item1">Item 1</span>
          <span class="item" id="item2">Item 2</span>
          <span class="item" id="item3">Item 3</span>
        </div>
      `);
    });

    test('$ 应该返回单个元素', () => {
      const el = $('#item1');
      expect(el).not.toBeNull();
      expect(el.id).toBe('item1');
    });

    test('$ 应该返回 null 当元素不存在时', () => {
      expect($('#nonexistent')).toBeNull();
    });

    test('$$ 应该返回元素数组', () => {
      const els = $$('.item');
      expect(Array.isArray(els)).toBe(true);
      expect(els.length).toBe(3);
    });

    test('$$ 应该支持在指定父元素中查找', () => {
      const container = $('.container');
      const els = $$('.item', container);
      expect(els.length).toBe(3);
    });
  });

  describe('matches', () => {
    test('应该正确匹配选择器', () => {
      const el = createElement('div', { className: 'test' });
      expect(matches(el, '.test')).toBe(true);
      expect(matches(el, '.other')).toBe(false);
    });

    test('应该处理 null 元素', () => {
      expect(matches(null, '.test')).toBeFalsy();
    });
  });

  describe('closest', () => {
    beforeEach(() => {
      testUtils.createDOM(`
        <div class="outer">
          <div class="inner">
            <span id="target">Target</span>
          </div>
        </div>
      `);
    });

    test('应该找到最近的匹配父元素', () => {
      const target = $('#target');
      const inner = closest(target, '.inner');
      expect(inner).not.toBeNull();
      expect(inner.className).toBe('inner');
    });

    test('应该返回 null 当没有匹配时', () => {
      const target = $('#target');
      expect(closest(target, '.nonexistent')).toBeNull();
    });
  });

  describe('nextSibling 和 nextSiblings', () => {
    beforeEach(() => {
      testUtils.createDOM(`
        <div>
          <span id="first" class="item">First</span>
          <span id="second" class="item">Second</span>
          <span id="third" class="other">Third</span>
          <span id="fourth" class="item">Fourth</span>
        </div>
      `);
    });

    test('nextSibling 应该返回下一个兄弟元素', () => {
      const first = $('#first');
      const next = nextSibling(first);
      expect(next.id).toBe('second');
    });

    test('nextSibling 应该支持选择器过滤', () => {
      const second = $('#second');
      const next = nextSibling(second, '.item');
      expect(next.id).toBe('fourth');
    });

    test('nextSiblings 应该返回所有后续兄弟元素', () => {
      const first = $('#first');
      const siblings = nextSiblings(first);
      expect(siblings.length).toBe(3);
    });

    test('nextSiblings 应该支持选择器过滤', () => {
      const first = $('#first');
      const siblings = nextSiblings(first, '.item');
      expect(siblings.length).toBe(2);
    });
  });

  describe('toggleClass', () => {
    test('应该切换类名', () => {
      const el = createElement('div');
      toggleClass(el, 'active');
      expect(el.classList.contains('active')).toBe(true);
      toggleClass(el, 'active');
      expect(el.classList.contains('active')).toBe(false);
    });

    test('应该支持强制添加/删除', () => {
      const el = createElement('div');
      toggleClass(el, 'active', true);
      expect(el.classList.contains('active')).toBe(true);
      toggleClass(el, 'active', true);
      expect(el.classList.contains('active')).toBe(true);
    });
  });

  describe('isVisible', () => {
    test('应该正确检测可见性', () => {
      const el = createElement('div');
      document.body.appendChild(el);
      expect(isVisible(el)).toBe(true);
    });

    test('应该处理 null 元素', () => {
      expect(isVisible(null)).toBe(false);
    });
  });

  describe('getData 和 setData', () => {
    test('应该正确设置和获取数据属性', () => {
      const el = createElement('div');
      setData(el, 'testKey', 'testValue');
      expect(getData(el, 'testKey')).toBe('testValue');
    });
  });
});
