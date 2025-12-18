/**
 * ProgressToast 组件测试
 */

import {
  ProgressToast,
  showProgress,
  hideProgress,
} from '@components/progress-toast.js';

describe('ProgressToast 组件', () => {
  describe('ProgressToast 类', () => {
    let toast;

    beforeEach(() => {
      toast = new ProgressToast();
    });

    afterEach(() => {
      toast.destroy();
    });

    test('应该创建一个实例', () => {
      expect(toast).toBeInstanceOf(ProgressToast);
    });

    test('show 应该创建容器', () => {
      toast.show('Test message');
      expect(document.getElementById('progress-toast')).not.toBeNull();
    });

    test('show 应该显示消息', () => {
      toast.show('Test message');
      const container = document.getElementById('progress-toast');
      expect(container.textContent).toBe('Test message');
    });

    test('show 应该设置正确的类型颜色', () => {
      toast.show('Success', { type: 'success' });
      const container = document.getElementById('progress-toast');
      expect(container.style.background).toBe('rgb(26, 127, 55)');
    });

    test('hide 应该隐藏容器', async () => {
      toast.show('Test', { autoHide: false });
      toast.hide();
      await testUtils.wait(350);
      const container = document.getElementById('progress-toast');
      expect(container.style.display).toBe('none');
    });

    test('autoHide 应该在指定时间后隐藏', async () => {
      toast.show('Test', { autoHide: true, duration: 100 });
      await testUtils.wait(150);
      const container = document.getElementById('progress-toast');
      expect(container.style.opacity).toBe('0');
    });

    test('destroy 应该移除容器', () => {
      toast.show('Test');
      toast.destroy();
      expect(document.getElementById('progress-toast')).toBeNull();
    });

    test('应该支持自定义位置', () => {
      const customToast = new ProgressToast({ position: 'bottom-left' });
      customToast.show('Test');
      const container = document.getElementById('progress-toast');
      expect(container.style.bottom).toBe('20px');
      expect(container.style.left).toBe('20px');
      customToast.destroy();
    });

    test('应该支持自定义 ID', () => {
      const customToast = new ProgressToast({ containerId: 'custom-toast' });
      customToast.show('Test');
      expect(document.getElementById('custom-toast')).not.toBeNull();
      customToast.destroy();
    });
  });

  describe('全局函数', () => {
    afterEach(() => {
      hideProgress();
    });

    test('showProgress 应该显示消息', () => {
      showProgress('Global message');
      const toast = document.querySelector('[id$="progress-toast"]');
      expect(toast).not.toBeNull();
    });

    test('hideProgress 应该隐藏消息', async () => {
      showProgress('Test', { autoHide: false });
      hideProgress();
      await testUtils.wait(350);
    });
  });
});
