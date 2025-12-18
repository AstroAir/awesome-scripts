/**
 * 最近访问区域组件
 */

import { createElement } from '@utils/dom.js';
import { POPULAR_LANGUAGES } from '../config.js';
import { generateLanguageUrl } from './language-list.js';

/**
 * 创建最近访问区域
 * @param {Object} options - 选项
 * @returns {HTMLElement|null} 区域元素或 null
 */
export function createRecentSection(options = {}) {
  const {
    recent = [],
    period = 'daily',
    onClear = null,
    onClick = null,
  } = options;

  if (recent.length === 0) return null;

  const section = createElement('div', {
    className: 'x-trending-section',
  });

  // 头部
  const header = createElement('div', {
    className: 'x-trending-section__header',
  });

  const title = createElement('div', {
    className: 'x-trending-section__title',
    text: '🕐 Recent',
  });
  header.appendChild(title);

  const clearBtn = createElement('button', {
    className: 'x-trending-clear-btn',
    attrs: {
      type: 'button',
      title: 'Clear recent',
    },
    text: 'Clear',
  });

  if (onClear) {
    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClear();
    });
  }

  header.appendChild(clearBtn);
  section.appendChild(header);

  // 芯片列表
  const chips = createElement('div', {
    className: 'x-trending-chips',
  });

  recent.forEach((item) => {
    const lang = POPULAR_LANGUAGES.find((l) => l.value === item.language);
    if (!lang) return;

    const chip = createElement('a', {
      className: 'x-trending-chip',
      attrs: {
        href: generateLanguageUrl(lang, period),
        'data-lang': lang.value,
      },
      html: `<span>${lang.icon}</span><span>${lang.name}</span>`,
    });

    if (onClick) {
      chip.addEventListener('click', (e) => onClick(e, lang));
    }

    chips.appendChild(chip);
  });

  section.appendChild(chips);

  return section;
}

export default {
  createRecentSection,
};
