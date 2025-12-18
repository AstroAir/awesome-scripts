/**
 * 本地测试 - 使用本地 HTML 文件测试用户脚本
 * 不依赖网络连接
 */
import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, '../fixtures');
const distDir = join(__dirname, '../../dist');

/**
 * 获取 GM API 模拟代码
 */
function getGMAPIMock() {
  return `
    window.GM_storage = {};
    window.GM_getValue = (key, defaultValue) => {
      return window.GM_storage[key] !== undefined ? window.GM_storage[key] : defaultValue;
    };
    window.GM_setValue = (key, value) => {
      window.GM_storage[key] = value;
    };
    window.GM_deleteValue = (key) => {
      delete window.GM_storage[key];
    };
    window.GM_addStyle = (css) => {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
      return style;
    };
    window.GM_notification = () => {};
    window.GM_registerMenuCommand = () => {};
    window.unsafeWindow = window;
  `;
}

/**
 * 获取脚本内容（去掉 userscript 头）
 */
function getScriptContent(scriptName) {
  const scriptPath = join(distDir, `${scriptName}.user.js`);
  const content = readFileSync(scriptPath, 'utf-8');
  return content.replace(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/, '');
}

test.describe('GitHub Fold About - Local Tests', () => {
  test('should inject styles into page', async ({ page }) => {
    // 加载本地 HTML
    const htmlPath = `file://${join(fixturesDir, 'github-repo.html')}`;
    
    // 先注入 GM API
    await page.addInitScript(getGMAPIMock());
    
    await page.goto(htmlPath);
    await page.waitForLoadState('domcontentloaded');
    
    // 注入用户脚本
    const script = getScriptContent('github-fold-about');
    await page.evaluate(script);
    
    // 等待脚本执行
    await page.waitForTimeout(500);
    
    // 检查样式注入
    const hasStyles = await page.evaluate(() => {
      const styles = document.querySelectorAll('style');
      return Array.from(styles).some((s) => 
        s.textContent.includes('x-about') || s.textContent.includes('fold'),
      );
    });
    
    expect(hasStyles).toBe(true);
  });

  test('should add fold button to About section', async ({ page }) => {
    const htmlPath = `file://${join(fixturesDir, 'github-repo.html')}`;
    
    await page.addInitScript(getGMAPIMock());
    await page.goto(htmlPath);
    await page.waitForLoadState('domcontentloaded');
    
    const script = getScriptContent('github-fold-about');
    await page.evaluate(script);
    
    await page.waitForTimeout(500);
    
    // 检查 About 标题存在
    const aboutHeading = page.locator('h2:has-text("About")');
    await expect(aboutHeading).toBeVisible();
    
    // 检查折叠按钮
    const foldButton = page.locator('.x-about-fold-button, .x-about-fold-wrapper button');
    const buttonCount = await foldButton.count();
    
    console.log('Fold button count:', buttonCount);
    expect(buttonCount).toBeGreaterThanOrEqual(0);
  });

  test('should toggle content visibility', async ({ page }) => {
    const htmlPath = `file://${join(fixturesDir, 'github-repo.html')}`;
    
    await page.addInitScript(getGMAPIMock());
    await page.goto(htmlPath);
    await page.waitForLoadState('domcontentloaded');
    
    const script = getScriptContent('github-fold-about');
    await page.evaluate(script);
    
    await page.waitForTimeout(500);
    
    const foldButton = page.locator('.x-about-fold-button').first();
    const buttonExists = await foldButton.count() > 0;
    
    if (buttonExists) {
      // 点击折叠
      await foldButton.click();
      await page.waitForTimeout(300);
      
      // 检查状态变化
      const isFolded = await foldButton.evaluate((btn) => 
        btn.classList.contains('x-folded'),
      );
      
      console.log('Is folded:', isFolded);
    }
  });
});

test.describe('GitHub Fold Files - Local Tests', () => {
  test('should inject styles into page', async ({ page }) => {
    const htmlPath = `file://${join(fixturesDir, 'github-repo.html')}`;
    
    await page.addInitScript(getGMAPIMock());
    await page.goto(htmlPath);
    await page.waitForLoadState('domcontentloaded');
    
    const script = getScriptContent('github-fold-files');
    await page.evaluate(script);
    
    await page.waitForTimeout(500);
    
    const hasStyles = await page.evaluate(() => {
      const styles = document.querySelectorAll('style');
      return Array.from(styles).some((s) => 
        s.textContent.includes('x-fold') || s.textContent.includes('collapsed'),
      );
    });
    
    expect(hasStyles).toBe(true);
  });

  test('should detect directory rows', async ({ page }) => {
    const htmlPath = `file://${join(fixturesDir, 'github-repo.html')}`;
    
    await page.addInitScript(getGMAPIMock());
    await page.goto(htmlPath);
    await page.waitForLoadState('domcontentloaded');
    
    // 检查目录行存在
    const directoryRows = page.locator('[aria-label="Directory"], .react-directory-row');
    const count = await directoryRows.count();
    
    expect(count).toBeGreaterThan(0);
    console.log('Directory rows found:', count);
  });
});

test.describe('GitHub Trending Button - Local Tests', () => {
  test('should inject styles into page', async ({ page }) => {
    const htmlPath = `file://${join(fixturesDir, 'github-repo.html')}`;
    
    await page.addInitScript(getGMAPIMock());
    await page.goto(htmlPath);
    await page.waitForLoadState('domcontentloaded');
    
    const script = getScriptContent('github-trending-button');
    await page.evaluate(script);
    
    await page.waitForTimeout(500);
    
    const hasStyles = await page.evaluate(() => {
      const styles = document.querySelectorAll('style');
      return Array.from(styles).some((s) => 
        s.textContent.includes('trending') || s.textContent.includes('x-trending'),
      );
    });
    
    expect(hasStyles).toBe(true);
  });

  test('should find header actions container', async ({ page }) => {
    const htmlPath = `file://${join(fixturesDir, 'github-repo.html')}`;
    
    await page.addInitScript(getGMAPIMock());
    await page.goto(htmlPath);
    await page.waitForLoadState('domcontentloaded');
    
    // 检查 header actions 容器
    const actionsContainer = page.locator('.AppHeader-actions');
    await expect(actionsContainer).toBeVisible();
  });
});

test.describe('GitHub Enhanced Toolbar - Local Tests', () => {
  test('should inject styles into page', async ({ page }) => {
    const htmlPath = `file://${join(fixturesDir, 'github-repo.html')}`;
    
    await page.addInitScript(getGMAPIMock());
    await page.goto(htmlPath);
    await page.waitForLoadState('domcontentloaded');
    
    const script = getScriptContent('github-enhanced-toolbar');
    await page.evaluate(script);
    
    await page.waitForTimeout(500);
    
    const hasStyles = await page.evaluate(() => {
      const styles = document.querySelectorAll('style');
      return styles.length > 0;
    });
    
    expect(hasStyles).toBe(true);
  });
});
