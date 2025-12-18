/**
 * 时间段选择器组件
 */

import { createElement, $$ } from '@utils/dom.js';
import { TIME_PERIODS } from '../config.js';

/**
 * 创建时间段选择器
 * @param {Object} options - 选项
 * @returns {HTMLElement} 选择器元素
 */
export function createPeriodSelector(options = {}) {
  const {
    activePeriod = 'daily',
    onChange = null,
  } = options;

  const container = createElement('div', {
    className: 'x-trending-periods',
  });

  TIME_PERIODS.forEach((period) => {
    const isActive = period.value === activePeriod;
    const button = createElement('button', {
      className: `x-trending-period-btn ${isActive ? 'x-trending-period-btn--active' : ''}`,
      attrs: {
        'data-period': period.value,
        type: 'button',
      },
      html: `<span>${period.icon}</span><span>${period.name}</span>`,
    });

    if (isActive) {
      button.dataset.active = 'true';
    }

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      setActivePeriod(container, period.value);
      if (onChange) onChange(period.value);
    });

    container.appendChild(button);
  });

  return container;
}

/**
 * 设置活动时间段
 * @param {HTMLElement} container - 容器元素
 * @param {string} period - 时间段值
 */
export function setActivePeriod(container, period) {
  const buttons = $$('.x-trending-period-btn', container);

  buttons.forEach((btn) => {
    const isActive = btn.dataset.period === period;
    btn.classList.toggle('x-trending-period-btn--active', isActive);
    btn.dataset.active = isActive ? 'true' : '';
  });
}

/**
 * 获取当前活动时间段
 * @param {HTMLElement} container - 容器元素
 * @returns {string} 时间段值
 */
export function getActivePeriod(container) {
  const activeBtn = container.querySelector('.x-trending-period-btn--active');
  return activeBtn ? activeBtn.dataset.period : 'daily';
}

export default {
  createPeriodSelector,
  setActivePeriod,
  getActivePeriod,
};
