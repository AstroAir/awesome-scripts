# 📦 核心模块 API

本文档详细介绍 `src/core/` 目录下的核心模块 API。

## Storage - 存储管理

### 导入

```javascript
import { Storage } from '@core';
// 或
import { Storage } from '@/core/storage';
```

### 类：Storage

统一的存储管理类，自动选择合适的存储后端。

#### 构造函数

```javascript
new Storage(namespace, options?)
```

| 参数 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `namespace` | `string` | - | 存储命名空间，用于隔离数据 |
| `options.backend` | `'auto' \| 'gm' \| 'local'` | `'auto'` | 存储后端 |

#### 方法

##### `get(key, defaultValue?)`

获取存储的值。

```javascript
const value = await storage.get('theme', 'light');
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `key` | `string` | 存储键名 |
| `defaultValue` | `any` | 默认值 |

**返回**: `Promise<any>` - 存储的值或默认值

##### `set(key, value)`

设置存储的值。

```javascript
await storage.set('theme', 'dark');
await storage.set('settings', { fontSize: 14, compact: true });
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `key` | `string` | 存储键名 |
| `value` | `any` | 要存储的值（会自动序列化） |

**返回**: `Promise<void>`

##### `remove(key)`

删除存储的值。

```javascript
await storage.remove('theme');
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `key` | `string` | 存储键名 |

**返回**: `Promise<void>`

##### `clear()`

清除当前命名空间下的所有数据。

```javascript
await storage.clear();
```

**返回**: `Promise<void>`

##### `keys()`

获取当前命名空间下的所有键名。

```javascript
const keys = await storage.keys();
// ['theme', 'settings', 'favorites']
```

**返回**: `Promise<string[]>`

---

## Observer - DOM 观察器

### 导入

```javascript
import { Observer } from '@core';
// 或
import { Observer } from '@/core/observer';
```

### 类：Observer

基于 MutationObserver 的 DOM 变化观察器。

#### 构造函数

```javascript
new Observer(options?)
```

| 参数 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `options.root` | `Element` | `document.body` | 观察的根元素 |
| `options.subtree` | `boolean` | `true` | 是否观察子树 |

#### 方法

##### `watch(selector, callback, options?)`

观察匹配选择器的元素出现。

```javascript
observer.watch('.new-element', (elements) => {
  elements.forEach(el => {
    console.log('New element:', el);
  });
});
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `selector` | `string` | CSS 选择器 |
| `callback` | `(elements: Element[]) => void` | 回调函数 |
| `options.once` | `boolean` | 只触发一次 |

**返回**: `() => void` - 取消观察的函数

##### `waitFor(selector, timeout?)`

等待元素出现。

```javascript
try {
  const element = await observer.waitFor('.target', 5000);
  console.log('Element found:', element);
} catch (error) {
  console.log('Element not found within timeout');
}
```

| 参数 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `selector` | `string` | - | CSS 选择器 |
| `timeout` | `number` | `10000` | 超时时间（毫秒） |

**返回**: `Promise<Element>` - 找到的元素

##### `watchAttribute(element, attribute, callback)`

观察元素属性变化。

```javascript
observer.watchAttribute(element, 'class', (oldValue, newValue) => {
  console.log(`Class changed from ${oldValue} to ${newValue}`);
});
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `element` | `Element` | 目标元素 |
| `attribute` | `string` | 属性名 |
| `callback` | `(oldValue, newValue) => void` | 回调函数 |

**返回**: `() => void` - 取消观察的函数

##### `disconnect()`

停止所有观察。

```javascript
observer.disconnect();
```

---

## Styles - 样式注入

### 导入

```javascript
import { Styles } from '@core';
// 或
import { Styles } from '@/core/styles';
```

### 静态方法

##### `Styles.inject(css, id?)`

注入 CSS 样式。

```javascript
// 注入样式（无 ID）
Styles.inject(`
  .my-button {
    background: blue;
    color: white;
  }
`);

// 注入带 ID 的样式（可更新）
Styles.inject(buttonStyles, 'button-styles');
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `css` | `string` | CSS 样式字符串 |
| `id` | `string` | 可选，样式 ID |

**返回**: `HTMLStyleElement` - 创建的 style 元素

##### `Styles.remove(id)`

删除已注入的样式。

```javascript
Styles.remove('button-styles');
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `id` | `string` | 样式 ID |

##### `Styles.update(id, css)`

更新已注入的样式。

```javascript
Styles.update('button-styles', newButtonStyles);
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `id` | `string` | 样式 ID |
| `css` | `string` | 新的 CSS 样式 |

##### `Styles.has(id)`

检查样式是否已注入。

```javascript
if (!Styles.has('button-styles')) {
  Styles.inject(buttonStyles, 'button-styles');
}
```

| 参数 | 类型 | 描述 |
|-----|------|------|
| `id` | `string` | 样式 ID |

**返回**: `boolean`

---

## 使用示例

### 完整示例

```javascript
import { Storage, Observer, Styles } from '@core';

// 初始化存储
const storage = new Storage('my-script');

// 初始化观察器
const observer = new Observer();

// 注入样式
Styles.inject(`
  .my-button {
    padding: 8px 16px;
    border-radius: 4px;
  }
`, 'my-styles');

// 主函数
async function main() {
  // 读取设置
  const settings = await storage.get('settings', { enabled: true });
  
  if (!settings.enabled) return;
  
  // 等待目标元素
  const container = await observer.waitFor('.target-container');
  
  // 观察动态内容
  observer.watch('.dynamic-item', (items) => {
    items.forEach(processItem);
  });
}

main();
```
