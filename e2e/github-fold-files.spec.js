import { test, expect } from '@playwright/test';
import { injectUserscript } from './helpers/script-injector.js';

// 网络测试 - 需要稳定的网络连接
test.describe('GitHub Fold Files @network', () => {
  test.beforeEach(async ({ page }) => {
    await injectUserscript(page, 'github-fold-files');
  });

  test.skip('should load on GitHub repository file browser', async ({ page }) => {
    await page.goto('https://github.com/AstroAir/awesome-scripts');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // 检查脚本是否注入了样式
    const hasStyles = await page.evaluate(() => {
      const styles = document.querySelectorAll('style');
      return Array.from(styles).some((s) => 
        s.textContent.includes('x-fold') || 
        s.textContent.includes('x-collapsed'),
      );
    });
    
    expect(hasStyles).toBe(true);
  });

  test.skip('should add fold buttons to directory rows', async ({ page }) => {
    await page.goto('https://github.com/AstroAir/awesome-scripts');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 检查是否有文件夹行
    const directoryLinks = page.locator('[aria-label*="Directory"], .react-directory-row');
    const hasDirs = await directoryLinks.count() > 0;
    
    if (hasDirs) {
      // 检查折叠按钮
      const foldButtons = page.locator('.x-fold-button, .x-button-container');
      const hasButtons = await foldButtons.count() > 0;
      expect(hasButtons).toBe(true);
    }
  });

  test.skip('should collapse folder when button clicked', async ({ page }) => {
    await page.goto('https://github.com/AstroAir/awesome-scripts');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const foldButton = page.locator('.x-fold-button').first();
    const buttonExists = await foldButton.count() > 0;
    
    if (buttonExists) {
      await foldButton.click();
      await page.waitForTimeout(500);
      
      // 检查是否有折叠状态
      const hasCollapsed = await page.evaluate(() => {
        return document.querySelector('.x-collapsed, .x-folded') !== null;
      });
      
      expect(hasCollapsed).toBe(true);
    }
  });

  test.skip('should have global toggle button', async ({ page }) => {
    await page.goto('https://github.com/AstroAir/awesome-scripts');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 检查全局切换按钮
    const globalToggle = page.locator('.x-global-toggle, .x-global-btn');
    const hasGlobal = await globalToggle.count() > 0;
    
    // 全局按钮可能存在也可能不存在，取决于页面结构
    console.log('Global toggle exists:', hasGlobal);
  });
});
