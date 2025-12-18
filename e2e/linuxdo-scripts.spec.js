import { test, expect } from '@playwright/test';
import { getScriptContent, stripUserscriptHeader, getGMAPIMock } from './helpers/script-injector.js';

test.describe('Linux.do Scripts', () => {
  test.describe('Autoreader Script', () => {
    test('should have valid script structure', async () => {
      const script = getScriptContent('linuxdo-autoreader');
      
      expect(script).toBeTruthy();
      expect(script.length).toBeGreaterThan(1000);
      
      // 检查脚本包含必要的元素
      expect(script).toContain('UserScript');
      expect(script).toContain('linux.do');
    });

    test('should have GM API calls', async () => {
      const script = getScriptContent('linuxdo-autoreader');
      
      // 检查 GM API 使用
      expect(script).toMatch(/GM_getValue|GM_setValue|GM_addStyle/);
    });

    test('should strip userscript header correctly', async () => {
      const script = getScriptContent('linuxdo-autoreader');
      const cleaned = stripUserscriptHeader(script);
      
      // 清理后不应包含 userscript 头
      expect(cleaned).not.toContain('==UserScript==');
      expect(cleaned).not.toContain('==/UserScript==');
    });
  });

  test.describe('Post Export Script', () => {
    test('should have valid script structure', async () => {
      const script = getScriptContent('linuxdo-post-export');
      
      expect(script).toBeTruthy();
      expect(script.length).toBeGreaterThan(1000);
      
      // 检查脚本包含必要的元素
      expect(script).toContain('UserScript');
      expect(script).toContain('linux.do');
    });

    test('should have export functionality markers', async () => {
      const script = getScriptContent('linuxdo-post-export');
      
      // 检查导出相关功能
      expect(script).toMatch(/export|download|markdown|html/i);
    });
  });

  test.describe('GM API Mock', () => {
    test('should provide all necessary GM functions', async () => {
      const mockCode = getGMAPIMock();
      
      expect(mockCode).toContain('GM_getValue');
      expect(mockCode).toContain('GM_setValue');
      expect(mockCode).toContain('GM_deleteValue');
      expect(mockCode).toContain('GM_addStyle');
      expect(mockCode).toContain('GM_notification');
      expect(mockCode).toContain('GM_registerMenuCommand');
      expect(mockCode).toContain('GM_xmlhttpRequest');
      expect(mockCode).toContain('unsafeWindow');
    });
  });
});

test.describe('Linux.do Page Tests', () => {
  test.skip('should load autoreader on linux.do', async ({ page }) => {
    // 这个测试需要登录，所以跳过
    // 但保留作为文档说明
    await page.goto('https://linux.do');
    await page.waitForLoadState('networkidle');
  });
});
