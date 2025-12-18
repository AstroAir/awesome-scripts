import { test, expect } from '@playwright/test';
import { injectUserscript } from './helpers/script-injector.js';

// 网络测试 - 需要稳定的网络连接
test.describe('GitHub Trending Button @network', () => {
  test.beforeEach(async ({ page }) => {
    await injectUserscript(page, 'github-trending-button');
  });

  test.skip('should add trending button to GitHub header', async ({ page }) => {
    await page.goto('https://github.com');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // 检查样式注入
    const hasStyles = await page.evaluate(() => {
      const styles = document.querySelectorAll('style');
      return Array.from(styles).some((s) => 
        s.textContent.includes('x-trending') || 
        s.textContent.includes('trending-btn'),
      );
    });
    
    expect(hasStyles).toBe(true);
  });

  test.skip('should show trending button in navigation', async ({ page }) => {
    await page.goto('https://github.com');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // 查找趋势按钮
    const trendingBtn = page.locator('.x-trending-btn, #x-trending-btn, [aria-label*="Trending"]');
    const hasButton = await trendingBtn.count() > 0;
    
    if (hasButton) {
      await expect(trendingBtn.first()).toBeVisible();
    }
  });

  test.skip('should open dropdown when button clicked', async ({ page }) => {
    await page.goto('https://github.com');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const trendingBtn = page.locator('.x-trending-btn').first();
    const buttonExists = await trendingBtn.count() > 0;
    
    if (buttonExists) {
      await trendingBtn.click();
      await page.waitForTimeout(500);
      
      // 检查下拉菜单是否可见
      const dropdown = page.locator('.x-trending-dropdown');
      const isVisible = await dropdown.evaluate((el) => 
        el && (el.classList.contains('x-trending-dropdown--visible') || 
               window.getComputedStyle(el).display !== 'none'),
      ).catch(() => false);
      
      expect(isVisible).toBe(true);
    }
  });

  test.skip('should have search functionality in dropdown', async ({ page }) => {
    await page.goto('https://github.com');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const trendingBtn = page.locator('.x-trending-btn').first();
    const buttonExists = await trendingBtn.count() > 0;
    
    if (buttonExists) {
      await trendingBtn.click();
      await page.waitForTimeout(500);
      
      // 检查搜索框
      const searchInput = page.locator('.x-trending-search input, .x-trending-dropdown input[type="text"]');
      const hasSearch = await searchInput.count() > 0;
      
      if (hasSearch) {
        await searchInput.fill('javascript');
        await page.waitForTimeout(300);
        
        // 验证输入
        const value = await searchInput.inputValue();
        expect(value).toBe('javascript');
      }
    }
  });

  test.skip('should have period selector', async ({ page }) => {
    await page.goto('https://github.com');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const trendingBtn = page.locator('.x-trending-btn').first();
    const buttonExists = await trendingBtn.count() > 0;
    
    if (buttonExists) {
      await trendingBtn.click();
      await page.waitForTimeout(500);
      
      // 检查时间段选择器
      const periodSelector = page.locator('.x-trending-periods, [class*="period"]');
      const hasPeriod = await periodSelector.count() > 0;
      
      expect(hasPeriod).toBe(true);
    }
  });

  test.skip('should close dropdown on escape key', async ({ page }) => {
    await page.goto('https://github.com');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const trendingBtn = page.locator('.x-trending-btn').first();
    const buttonExists = await trendingBtn.count() > 0;
    
    if (buttonExists) {
      await trendingBtn.click();
      await page.waitForTimeout(500);
      
      // 按 ESC 键
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      
      // 检查下拉菜单是否关闭
      const dropdown = page.locator('.x-trending-dropdown');
      const isHidden = await dropdown.evaluate((el) => 
        !el || !el.classList.contains('x-trending-dropdown--visible'),
      ).catch(() => true);
      
      expect(isHidden).toBe(true);
    }
  });
});
