# 🔧 工具函数 API

本文档详细介绍 `src/utils/` 目录下的工具函数 API。

## DOM 工具 - dom.js

### 导入

```javascript
import { dom } from '@utils';
// 或
import * as dom from '@/utils/dom';
```

### 函数

#### `$(selector, context?)`

简化的选择器函数，返回单个元素。

```javascript
const button = $('.submit-button');
const input = $('input', formElement);
```

| 参数 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `selector` | `string` | - | CSS 选择器 |
| `context` | `Element` | `document` | 查询上下文 |

**返回**: `Element | null`

#### `$$(selector, context?)`

简化的选择器函数，返回元素数组。

```javascript
const items = $$('.list-item');
const inputs = $$('input', formElement);
```

| 参数 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `selector` | `string` | - | CSS 选择器 |
| `context` | `Element` | `document` | 查询上下文 |

**返回**: `Element[]`

#### `createElement(tag, attributes?, children?)`

创建 DOM 元素的便捷函数。

```javascript
const button = createElement('button', {
  className: 'btn btn-primary',
  id: 'submit-btn',
  onclick: () => console.log('clicked')
}, 'Submit');

const container = createElement('div', { className: 'container' }, [
  createElement('h1', {}, 'Title'),
  createElement('p', {}, 'Content')
]);
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `tag` | `string` | HTML 标签名 |
| `attributes` | `object` | 属性对象 |
| `children` | `string \| Element \| Element[]` | 子元素 |

**返回**: `Element`

#### `insertAfter(newElement, referenceElement)`

在参考元素后插入新元素。

```javascript
insertAfter(newButton, existingButton);
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `newElement` | `Element` | 要插入的元素 |
| `referenceElement` | `Element` | 参考元素 |

#### `removeElement(element)`

安全地移除元素。

```javascript
removeElement(oldButton);
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `element` | `Element` | 要移除的元素 |

#### `addClass(element, ...classNames)`

添加一个或多个类名。

```javascript
addClass(element, 'active', 'highlighted');
```

#### `removeClass(element, ...classNames)`

移除一个或多个类名。

```javascript
removeClass(element, 'active', 'highlighted');
```

#### `toggleClass(element, className, force?)`

切换类名。

```javascript
toggleClass(element, 'active');
toggleClass(element, 'visible', true); // 强制添加
```

#### `hasClass(element, className)`

检查是否包含类名。

```javascript
if (hasClass(element, 'active')) {
  // ...
}
```

**返回**: `boolean`

#### `setStyles(element, styles)`

设置元素的内联样式。

```javascript
setStyles(element, {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
});
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `element` | `Element` | 目标元素 |
| `styles` | `object` | 样式对象 |

#### `getComputedValue(element, property)`

获取计算后的样式值。

```javascript
const width = getComputedValue(element, 'width');
```

**返回**: `string`

---

## 动画工具 - animation.js

### 导入

```javascript
import { animation } from '@utils';
// 或
import * as animation from '@/utils/animation';
```

### 函数

#### `fadeIn(element, duration?, callback?)`

淡入动画。

```javascript
fadeIn(element, 300, () => {
  console.log('Fade in complete');
});
```

| 参数 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `element` | `Element` | - | 目标元素 |
| `duration` | `number` | `300` | 动画时长（毫秒） |
| `callback` | `() => void` | - | 完成回调 |

**返回**: `Promise<void>`

#### `fadeOut(element, duration?, callback?)`

淡出动画。

```javascript
await fadeOut(element, 300);
element.remove();
```

| 参数 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `element` | `Element` | - | 目标元素 |
| `duration` | `number` | `300` | 动画时长（毫秒） |
| `callback` | `() => void` | - | 完成回调 |

**返回**: `Promise<void>`

#### `slideDown(element, duration?)`

向下滑动展开。

```javascript
await slideDown(content, 200);
```

| 参数 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `element` | `Element` | - | 目标元素 |
| `duration` | `number` | `300` | 动画时长（毫秒） |

**返回**: `Promise<void>`

#### `slideUp(element, duration?)`

向上滑动收起。

```javascript
await slideUp(content, 200);
```

| 参数 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `element` | `Element` | - | 目标元素 |
| `duration` | `number` | `300` | 动画时长（毫秒） |

**返回**: `Promise<void>`

#### `slideToggle(element, duration?)`

切换滑动状态。

```javascript
button.onclick = () => slideToggle(content, 200);
```

| 参数 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `element` | `Element` | - | 目标元素 |
| `duration` | `number` | `300` | 动画时长（毫秒） |

**返回**: `Promise<void>`

#### `animate(element, keyframes, options)`

通用动画函数，基于 Web Animations API。

```javascript
await animate(element, [
  { opacity: 0, transform: 'translateY(-20px)' },
  { opacity: 1, transform: 'translateY(0)' }
], {
  duration: 300,
  easing: 'ease-out'
});
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `element` | `Element` | 目标元素 |
| `keyframes` | `Keyframe[]` | 关键帧数组 |
| `options` | `KeyframeAnimationOptions` | 动画选项 |

**返回**: `Promise<void>`

#### `debounce(fn, delay)`

防抖函数。

```javascript
const handleResize = debounce(() => {
  updateLayout();
}, 200);

window.addEventListener('resize', handleResize);
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `fn` | `Function` | 要防抖的函数 |
| `delay` | `number` | 延迟时间（毫秒） |

**返回**: `Function` - 防抖后的函数

#### `throttle(fn, delay)`

节流函数。

```javascript
const handleScroll = throttle(() => {
  updateScrollPosition();
}, 100);

window.addEventListener('scroll', handleScroll);
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `fn` | `Function` | 要节流的函数 |
| `delay` | `number` | 间隔时间（毫秒） |

**返回**: `Function` - 节流后的函数

#### `delay(ms)`

Promise 版的延迟函数。

```javascript
await delay(1000);
console.log('1 second later');
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `ms` | `number` | 延迟时间（毫秒） |

**返回**: `Promise<void>`

---

## 使用示例

### 完整示例

```javascript
import { $, $$, createElement, addClass, removeClass } from '@utils/dom';
import { fadeIn, fadeOut, debounce } from '@utils/animation';

// 创建模态框
function createModal(title, content) {
  const overlay = createElement('div', { className: 'modal-overlay' });
  const modal = createElement('div', { className: 'modal' }, [
    createElement('h2', { className: 'modal-title' }, title),
    createElement('div', { className: 'modal-content' }, content),
    createElement('button', {
      className: 'modal-close',
      onclick: () => closeModal(overlay)
    }, '关闭')
  ]);
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  fadeIn(overlay, 200);
  return overlay;
}

async function closeModal(overlay) {
  await fadeOut(overlay, 200);
  overlay.remove();
}

// 处理列表项
$$('.list-item').forEach(item => {
  item.addEventListener('click', () => {
    $$('.list-item').forEach(i => removeClass(i, 'active'));
    addClass(item, 'active');
  });
});

// 防抖搜索
const searchInput = $('#search');
searchInput.addEventListener('input', debounce((e) => {
  performSearch(e.target.value);
}, 300));
```
