import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '../../dist');

/**
 * 读取用户脚本内容
 * @param {string} scriptName - 脚本名称
 * @returns {string} 脚本内容
 */
export function getScriptContent(scriptName) {
  const scriptPath = join(distDir, `${scriptName}.user.js`);
  return readFileSync(scriptPath, 'utf-8');
}

/**
 * 移除 userscript 元数据头部
 * @param {string} script - 脚本内容
 * @returns {string} 处理后的脚本
 */
export function stripUserscriptHeader(script) {
  return script.replace(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/, '');
}

/**
 * 注入 GM API 模拟
 * @returns {string} GM API 模拟代码
 */
export function getGMAPIMock() {
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
    window.GM_notification = (details) => {
      console.log('[GM_notification]', details);
    };
    window.GM_registerMenuCommand = (name, callback) => {
      console.log('[GM_registerMenuCommand]', name);
    };
    window.GM_xmlhttpRequest = (details) => {
      return fetch(details.url, {
        method: details.method || 'GET',
        headers: details.headers || {},
        body: details.data,
      }).then(response => {
        if (details.onload) {
          response.text().then(responseText => {
            details.onload({ responseText, status: response.status });
          });
        }
      }).catch(error => {
        if (details.onerror) details.onerror(error);
      });
    };
    window.unsafeWindow = window;
  `;
}

/**
 * 向页面注入用户脚本
 * @param {import('@playwright/test').Page} page - Playwright 页面对象
 * @param {string} scriptName - 脚本名称
 */
export async function injectUserscript(page, scriptName) {
  const gmMock = getGMAPIMock();
  const scriptContent = getScriptContent(scriptName);
  const cleanScript = stripUserscriptHeader(scriptContent);
  
  await page.addInitScript(gmMock);
  await page.addInitScript(cleanScript);
}

/**
 * 在页面加载后注入脚本
 * @param {import('@playwright/test').Page} page - Playwright 页面对象
 * @param {string} scriptName - 脚本名称
 */
export async function injectAfterLoad(page, scriptName) {
  const gmMock = getGMAPIMock();
  const scriptContent = getScriptContent(scriptName);
  const cleanScript = stripUserscriptHeader(scriptContent);
  
  await page.evaluate(gmMock);
  await page.evaluate(cleanScript);
}
