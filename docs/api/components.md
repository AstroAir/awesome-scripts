# 🧩 组件 API

本文档详细介绍 `src/components/` 目录下的公共 UI 组件 API。

## Button - 按钮组件

### 导入

```javascript
import { Button } from '@components';
```

### Button.create(options)

创建按钮元素。

```javascript
const button = Button.create({
  text: '点击我',
  icon: '<svg>...</svg>',
  className: 'my-button',
  tooltip: '按钮提示',
  onClick: () => console.log('clicked')
});
```

#### 选项

| 属性 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `text` | `string` | - | 按钮文本 |
| `icon` | `string` | - | 图标 HTML（SVG） |
| `className` | `string` | - | 额外的 CSS 类名 |
| `tooltip` | `string` | - | 悬停提示文本 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 按钮类型 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 按钮尺寸 |
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'secondary'` | 按钮样式变体 |
| `onClick` | `(e: Event) => void` | - | 点击回调 |

**返回**: `HTMLButtonElement`

---

## Dropdown - 下拉菜单组件

### 导入

```javascript
import { Dropdown } from '@components';
```

### Dropdown.create(options)

创建下拉菜单。

```javascript
const dropdown = Dropdown.create({
  trigger: triggerButton,
  items: [
    { label: '选项 1', icon: '📁', onClick: () => {} },
    { type: 'separator' },
    { label: '选项 2', onClick: () => {}, disabled: true },
    {
      label: '子菜单',
      items: [
        { label: '子选项 1', onClick: () => {} },
        { label: '子选项 2', onClick: () => {} }
      ]
    }
  ],
  position: 'bottom-start'
});
```

#### 选项

| 属性 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `trigger` | `Element` | - | 触发元素 |
| `items` | `DropdownItem[]` | - | 菜单项数组 |
| `position` | `Position` | `'bottom-start'` | 弹出位置 |
| `offset` | `number` | `4` | 与触发元素的间距 |
| `closeOnSelect` | `boolean` | `true` | 选择后是否关闭 |
| `closeOnClickOutside` | `boolean` | `true` | 点击外部是否关闭 |

#### DropdownItem 类型

```typescript
interface DropdownItem {
  type?: 'item' | 'separator' | 'header';
  label?: string;
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
  items?: DropdownItem[];  // 子菜单
}
```

#### Position 类型

```typescript
type Position = 
  | 'top-start' | 'top' | 'top-end'
  | 'bottom-start' | 'bottom' | 'bottom-end'
  | 'left-start' | 'left' | 'left-end'
  | 'right-start' | 'right' | 'right-end';
```

### 方法

#### `dropdown.open()`

打开下拉菜单。

#### `dropdown.close()`

关闭下拉菜单。

#### `dropdown.toggle()`

切换下拉菜单状态。

#### `dropdown.destroy()`

销毁下拉菜单并清理事件监听器。

---

## FoldButton - 折叠按钮组件

### 导入

```javascript
import { FoldButton } from '@components';
```

### FoldButton.create(options)

创建折叠/展开切换按钮。

```javascript
const foldBtn = FoldButton.create({
  target: contentElement,
  initialState: 'expanded',
  onToggle: (isExpanded) => {
    console.log('Current state:', isExpanded ? 'expanded' : 'collapsed');
  }
});
```

#### 选项

| 属性 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `target` | `Element` | - | 要折叠的目标元素 |
| `initialState` | `'expanded' \| 'collapsed'` | `'expanded'` | 初始状态 |
| `animation` | `boolean` | `true` | 是否启用动画 |
| `duration` | `number` | `300` | 动画时长（毫秒） |
| `icon` | `'arrow' \| 'chevron' \| 'plus'` | `'arrow'` | 图标类型 |
| `onToggle` | `(isExpanded: boolean) => void` | - | 状态变化回调 |

### 方法

#### `foldBtn.expand()`

展开目标元素。

#### `foldBtn.collapse()`

折叠目标元素。

#### `foldBtn.toggle()`

切换折叠状态。

#### `foldBtn.getState()`

获取当前状态。

**返回**: `'expanded' | 'collapsed'`

---

## DraggablePanel - 可拖动面板组件

### 导入

```javascript
import { DraggablePanel } from '@components';
```

### DraggablePanel.create(options)

创建可拖动的浮动面板。

```javascript
const panel = DraggablePanel.create({
  title: '控制面板',
  content: panelContent,
  position: { x: 100, y: 100 },
  width: 300,
  height: 'auto',
  resizable: true,
  minimizable: true,
  closable: true,
  onClose: () => console.log('Panel closed'),
  onMove: (x, y) => console.log(`Moved to ${x}, ${y}`)
});
```

#### 选项

| 属性 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `title` | `string` | - | 面板标题 |
| `content` | `Element \| string` | - | 面板内容 |
| `position` | `{ x: number, y: number }` | `{ x: 20, y: 20 }` | 初始位置 |
| `width` | `number \| 'auto'` | `'auto'` | 面板宽度 |
| `height` | `number \| 'auto'` | `'auto'` | 面板高度 |
| `minWidth` | `number` | `200` | 最小宽度 |
| `minHeight` | `number` | `100` | 最小高度 |
| `resizable` | `boolean` | `false` | 是否可调整大小 |
| `minimizable` | `boolean` | `true` | 是否可最小化 |
| `closable` | `boolean` | `true` | 是否可关闭 |
| `draggable` | `boolean` | `true` | 是否可拖动 |
| `savePosition` | `boolean` | `true` | 是否保存位置 |
| `storageKey` | `string` | - | 位置存储键名 |
| `zIndex` | `number` | `10000` | z-index 值 |
| `onClose` | `() => void` | - | 关闭回调 |
| `onMove` | `(x, y) => void` | - | 移动回调 |
| `onResize` | `(w, h) => void` | - | 调整大小回调 |

### 方法

#### `panel.setContent(content)`

设置面板内容。

```javascript
panel.setContent('<p>新内容</p>');
panel.setContent(newElement);
```

#### `panel.setTitle(title)`

设置面板标题。

#### `panel.moveTo(x, y)`

移动面板到指定位置。

#### `panel.resize(width, height)`

调整面板大小。

#### `panel.minimize()`

最小化面板。

#### `panel.restore()`

恢复面板。

#### `panel.close()`

关闭面板。

#### `panel.show()`

显示面板。

#### `panel.hide()`

隐藏面板。

#### `panel.destroy()`

销毁面板并清理资源。

---

## ProgressToast - 进度提示组件

### 导入

```javascript
import { ProgressToast } from '@components';
```

### ProgressToast.show(options)

显示进度提示。

```javascript
const toast = ProgressToast.show({
  message: '正在处理...',
  progress: 0,
  type: 'info'
});

// 更新进度
toast.setProgress(50);
toast.setMessage('处理中 50%');

// 完成
toast.success('处理完成！');

// 或失败
toast.error('处理失败');
```

#### 选项

| 属性 | 类型 | 默认值 | 描述 |
|-----|------|--------|------|
| `message` | `string` | - | 提示消息 |
| `progress` | `number` | `0` | 初始进度（0-100） |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | 提示类型 |
| `position` | `'top' \| 'bottom'` | `'top'` | 显示位置 |
| `duration` | `number` | `0` | 自动关闭时间（0 为不自动关闭） |
| `closable` | `boolean` | `true` | 是否可手动关闭 |

### 方法

#### `toast.setProgress(value)`

设置进度值（0-100）。

#### `toast.setMessage(message)`

设置提示消息。

#### `toast.success(message?)`

显示成功状态并自动关闭。

#### `toast.error(message?)`

显示错误状态。

#### `toast.close()`

关闭提示。

---

## Icons - 图标库

### 导入

```javascript
import { Icons } from '@components';
```

### 可用图标

```javascript
Icons.arrow       // 箭头
Icons.chevron     // V 形箭头
Icons.close       // 关闭
Icons.check       // 勾选
Icons.star        // 星星
Icons.starFilled  // 实心星星
Icons.settings    // 设置
Icons.search      // 搜索
Icons.menu        // 菜单
Icons.plus        // 加号
Icons.minus       // 减号
Icons.refresh     // 刷新
Icons.external    // 外部链接
Icons.copy        // 复制
Icons.download    // 下载
Icons.upload      // 上传
Icons.folder      // 文件夹
Icons.file        // 文件
Icons.edit        // 编辑
Icons.trash       // 删除
```

### 使用示例

```javascript
import { Button, Icons } from '@components';

const downloadBtn = Button.create({
  text: '下载',
  icon: Icons.download,
  onClick: handleDownload
});
```

---

## 使用示例

### 完整示例

```javascript
import { 
  Button, 
  Dropdown, 
  DraggablePanel, 
  ProgressToast,
  Icons 
} from '@components';

// 创建控制面板
function createControlPanel() {
  // 创建操作按钮
  const startBtn = Button.create({
    text: '开始',
    icon: Icons.play,
    variant: 'primary',
    onClick: handleStart
  });

  const settingsBtn = Button.create({
    icon: Icons.settings,
    tooltip: '设置',
    onClick: openSettings
  });

  // 创建面板内容
  const content = document.createElement('div');
  content.appendChild(startBtn);
  content.appendChild(settingsBtn);

  // 创建可拖动面板
  const panel = DraggablePanel.create({
    title: '控制面板',
    content,
    position: { x: 20, y: 100 },
    minimizable: true,
    storageKey: 'control-panel-position'
  });

  return panel;
}

// 开始处理
async function handleStart() {
  const toast = ProgressToast.show({
    message: '准备中...',
    progress: 0
  });

  for (let i = 0; i <= 100; i += 10) {
    await delay(500);
    toast.setProgress(i);
    toast.setMessage(`处理中 ${i}%`);
  }

  toast.success('完成！');
}
```
