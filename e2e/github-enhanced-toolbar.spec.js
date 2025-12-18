import { test, expect } from '@playwright/test';
import { injectUserscript } from './helpers/script-injector.js';

// 网络测试 - 需要稳定的网络连接
test.describe('GitHub Enhanced Toolbar @network', () => {
  test.beforeEach(async ({ page }) => {
    await injectUserscript(page, 'github-enhanced-toolbar');
  });

  test.skip('should load on GitHub repository page', async ({ page }) => {
    await page.goto('https://github.com/AstroAir/awesome-scripts');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 检查脚本是否注入了样式
    const hasStyles = await page.evaluate(() => {
      const styles = document.querySelectorAll('style');
      return Array.from(styles).some((s) => 
        s.textContent.includes('x-toolbar') || 
        s.textContent.includes('enhanced'),
      );
    });
    
    expect(hasStyles).toBe(true);
  });

  test.skip('should enhance repository toolbar', async ({ page }) => {
    await page.goto('https://github.com/microsoft/vscode');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 检查工具栏增强元素
    const toolbar = page.locator('.x-toolbar, [class*="enhanced-toolbar"]');
    const hasToolbar = await toolbar.count() > 0;
    
    console.log('Enhanced toolbar exists:', hasToolbar);
  });

  test.skip('should work on different repository pages', async ({ page }) => {
    const repos = [
      'https://github.com/facebook/react',
      'https://github.com/vuejs/vue',
    ];
    
    for (const repo of repos) {
      await page.goto(repo);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
      
      // 确保页面加载正常
      const title = await page.title();
      expect(title).toContain('GitHub');
    }
  });
});
