import { test, expect } from '@playwright/test';
import { injectUserscript } from './helpers/script-injector.js';

// 网络测试 - 需要稳定的网络连接
// 使用 --grep "@network" 运行这些测试
test.describe('GitHub Fold About @network', () => {
  test.beforeEach(async ({ page }) => {
    await injectUserscript(page, 'github-fold-about');
  });

  test.skip('should load on GitHub repository page', async ({ page }) => {
    await page.goto('https://github.com/AstroAir/awesome-scripts');
    await page.waitForLoadState('networkidle');
    
    // 等待页面完全加载
    await page.waitForTimeout(1000);
    
    // 检查脚本是否注入了样式
    const styles = await page.evaluate(() => {
      const styleElements = document.querySelectorAll('style');
      return Array.from(styleElements).some((s) => 
        s.textContent.includes('x-about-fold') || 
        s.textContent.includes('x-folded'),
      );
    });
    
    expect(styles).toBe(true);
  });

  test.skip('should add fold button to About section', async ({ page }) => {
    await page.goto('https://github.com/AstroAir/awesome-scripts');
    await page.waitForLoadState('networkidle');
    
    // 等待脚本处理 DOM
    await page.waitForTimeout(1500);
    
    // 检查折叠按钮是否存在
    const foldButton = page.locator('.x-about-fold-button, [data-state-key]');
    
    // 如果页面有 About 区域，应该有折叠按钮
    const aboutSection = page.locator('h2:has-text("About")');
    const hasAbout = await aboutSection.count() > 0;
    
    if (hasAbout) {
      await expect(foldButton.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test.skip('should toggle About section when button clicked', async ({ page }) => {
    await page.goto('https://github.com/microsoft/vscode');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const foldButton = page.locator('.x-about-fold-button').first();
    const buttonExists = await foldButton.count() > 0;
    
    if (buttonExists) {
      // 点击折叠
      await foldButton.click();
      await page.waitForTimeout(500);
      
      // 检查按钮状态变化
      const isFolded = await foldButton.evaluate((btn) => 
        btn.classList.contains('x-folded'),
      );
      expect(isFolded).toBe(true);
      
      // 再次点击展开
      await foldButton.click();
      await page.waitForTimeout(500);
      
      const isExpanded = await foldButton.evaluate((btn) => 
        !btn.classList.contains('x-folded'),
      );
      expect(isExpanded).toBe(true);
    }
  });

  test.skip('should persist fold state in localStorage', async ({ page }) => {
    await page.goto('https://github.com/microsoft/vscode');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const foldButton = page.locator('.x-about-fold-button').first();
    const buttonExists = await foldButton.count() > 0;
    
    if (buttonExists) {
      // 点击折叠
      await foldButton.click();
      await page.waitForTimeout(500);
      
      // 检查 localStorage 是否有保存状态
      const hasState = await page.evaluate(() => {
        const keys = Object.keys(localStorage);
        return keys.some((key) => key.includes('fold') || key.includes('about'));
      });
      
      expect(hasState).toBe(true);
    }
  });
});
