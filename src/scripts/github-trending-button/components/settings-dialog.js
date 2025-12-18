/**
 * 设置对话框组件
 */

import { createElement } from '@utils/dom.js';

/**
 * 创建设置对话框
 * @param {Object} options - 选项
 * @returns {HTMLElement} 对话框元素
 */
export function createSettingsDialog(options = {}) {
  const {
    settings = {},
    onSave = null,
    onCancel = null,
  } = options;

  const dialog = createElement('div', {
    className: 'x-trending-dialog',
  });

  const content = createElement('div', {
    className: 'x-trending-dialog__content',
  });

  // 标题
  const title = createElement('h3', {
    className: 'x-trending-dialog__title',
    html: '<span>⚙️</span><span>Settings</span>',
  });
  content.appendChild(title);

  // 显示最近访问选项
  const showRecentField = createElement('div', {
    className: 'x-trending-dialog__field',
  });
  const showRecentLabel = createElement('label', {
    className: 'x-trending-dialog__label',
  });
  const showRecentCheckbox = createElement('input', {
    attrs: {
      type: 'checkbox',
      id: 'setting-show-recent',
      ...(settings.showRecent ? { checked: 'checked' } : {}),
    },
    styles: { cursor: 'pointer' },
  });
  showRecentLabel.appendChild(showRecentCheckbox);
  showRecentLabel.appendChild(createElement('span', {
    styles: { fontSize: '14px' },
    text: 'Show recent languages',
  }));
  showRecentField.appendChild(showRecentLabel);
  content.appendChild(showRecentField);

  // 新标签页打开选项
  const openNewTabField = createElement('div', {
    className: 'x-trending-dialog__field',
  });
  const openNewTabLabel = createElement('label', {
    className: 'x-trending-dialog__label',
  });
  const openNewTabCheckbox = createElement('input', {
    attrs: {
      type: 'checkbox',
      id: 'setting-open-new-tab',
      ...(settings.openInNewTab ? { checked: 'checked' } : {}),
    },
    styles: { cursor: 'pointer' },
  });
  openNewTabLabel.appendChild(openNewTabCheckbox);
  openNewTabLabel.appendChild(createElement('span', {
    styles: { fontSize: '14px' },
    text: 'Open links in new tab',
  }));
  openNewTabField.appendChild(openNewTabLabel);
  content.appendChild(openNewTabField);

  // 最大最近数量
  const maxRecentField = createElement('div', {
    className: 'x-trending-dialog__field',
    styles: { marginBottom: '20px' },
  });
  const maxRecentLabelText = createElement('label', {
    styles: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      marginBottom: '8px',
      color: 'var(--fgColor-muted, #656d76)',
    },
    text: 'Max recent items (1-10):',
  });
  maxRecentField.appendChild(maxRecentLabelText);
  const maxRecentInput = createElement('input', {
    className: 'x-trending-dialog__input',
    attrs: {
      type: 'number',
      id: 'setting-max-recent',
      min: '1',
      max: '10',
      value: settings.maxRecent || 5,
    },
  });
  maxRecentField.appendChild(maxRecentInput);
  content.appendChild(maxRecentField);

  // 操作按钮
  const actions = createElement('div', {
    className: 'x-trending-dialog__actions',
  });

  const cancelBtn = createElement('button', {
    className: 'x-trending-dialog__btn',
    attrs: { type: 'button' },
    text: 'Cancel',
  });
  cancelBtn.addEventListener('click', () => {
    dialog.remove();
    if (onCancel) onCancel();
  });
  actions.appendChild(cancelBtn);

  const saveBtn = createElement('button', {
    className: 'x-trending-dialog__btn x-trending-dialog__btn--primary',
    attrs: { type: 'button' },
    text: 'Save',
  });
  saveBtn.addEventListener('click', () => {
    const newSettings = {
      ...settings,
      showRecent: showRecentCheckbox.checked,
      openInNewTab: openNewTabCheckbox.checked,
      maxRecent: parseInt(maxRecentInput.value) || 5,
    };
    dialog.remove();
    if (onSave) onSave(newSettings);
  });
  actions.appendChild(saveBtn);

  content.appendChild(actions);
  dialog.appendChild(content);

  // 点击背景关闭
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.remove();
      if (onCancel) onCancel();
    }
  });

  return dialog;
}

/**
 * 显示设置对话框
 * @param {Object} options - 选项
 */
export function showSettingsDialog(options = {}) {
  const dialog = createSettingsDialog(options);
  document.body.appendChild(dialog);
}

export default {
  createSettingsDialog,
  showSettingsDialog,
};
