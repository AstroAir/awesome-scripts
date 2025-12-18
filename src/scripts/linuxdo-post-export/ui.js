/**
 * Linux.do Forum Post Exporter - UI模块
 */

import i18n from './i18n.js';
import { getUIStyles } from './styles.js';
import { extractAllPosts } from './extractor.js';
import { generateJSON, generateHTML, downloadFile } from './generator.js';

/**
 * 显示进度提示
 * @param {string} message - 消息
 */
export function showProgress(message) {
  let progressDiv = document.getElementById('export-progress');
  if (!progressDiv) {
    progressDiv = document.createElement('div');
    progressDiv.id = 'export-progress';
    progressDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1a1a1a;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 13px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(progressDiv);
  }
  progressDiv.textContent = message;
  progressDiv.style.display = 'block';
}

/**
 * 隐藏进度提示
 */
export function hideProgress() {
  const progressDiv = document.getElementById('export-progress');
  if (progressDiv) {
    progressDiv.style.opacity = '0';
    progressDiv.style.transition = 'opacity 0.3s';
    setTimeout(() => {
      progressDiv.style.display = 'none';
      progressDiv.style.opacity = '1';
    }, 300);
  }
}

/**
 * 创建语言选择器
 * @returns {HTMLElement}
 */
export function createLanguageSelector() {
  const languages = i18n.getAvailableLanguages();
  const currentLang = i18n.currentLang;

  const selector = document.createElement('div');
  selector.className = 'language-selector';
  selector.innerHTML = `
    <select id="language-select">
      ${languages.map((lang) => `
        <option value="${lang.code}" ${lang.code === currentLang ? 'selected' : ''}>
          ${lang.name}
        </option>
      `).join('')}
    </select>
  `;

  const select = selector.querySelector('#language-select');
  select.addEventListener('change', (e) => {
    const newLang = e.target.value;
    if (i18n.setLanguage(newLang)) {
      updateUILanguage();
      showProgress(i18n.t('scriptInitialized'));
      setTimeout(hideProgress, 2000);
    }
  });

  return selector;
}

/**
 * 更新UI语言
 */
export function updateUILanguage() {
  const jsonBtn = document.getElementById('export-json');
  const htmlBtn = document.getElementById('export-html');
  const embedLabel = document.querySelector('label[for="embed-images"]');

  if (jsonBtn) jsonBtn.querySelector('span:last-child').textContent = i18n.t('exportJSON');
  if (htmlBtn) htmlBtn.querySelector('span:last-child').textContent = i18n.t('exportHTML');
  if (embedLabel) embedLabel.textContent = i18n.t('embedImages');
}

/**
 * 创建导出按钮
 */
export function createExportButton() {
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'export-button-container';
  buttonContainer.innerHTML = `
    <style>${getUIStyles()}</style>
    <div id="export-controls">
      <button id="export-json" class="export-btn">
        <span>📄</span>
        <span>${i18n.t('exportJSON')}</span>
      </button>
      <button id="export-html" class="export-btn">
        <span>🌐</span>
        <span>${i18n.t('exportHTML')}</span>
      </button>
      <label class="checkbox-wrapper">
        <input type="checkbox" id="embed-images" checked>
        <label for="embed-images">${i18n.t('embedImages')}</label>
      </label>
    </div>
  `;
  document.body.appendChild(buttonContainer);

  const langSelector = createLanguageSelector();
  document.getElementById('export-controls').appendChild(langSelector);

  document.getElementById('export-json').addEventListener('click', async () => {
    const btn = document.getElementById('export-json');
    const embedImages = document.getElementById('embed-images').checked;

    btn.disabled = true;

    if (embedImages) {
      showProgress(i18n.t('convertingImagesJSON'));
    } else {
      showProgress(i18n.t('exportingJSON'));
    }

    try {
      const data = await extractAllPosts(embedImages);
      const json = generateJSON(data);
      const filename = `linux-do-topic-${data.topic.topicId}-${Date.now()}.json`;
      downloadFile(json, filename, 'application/json');
      showProgress(i18n.t('jsonExportCompleted'));
      setTimeout(hideProgress, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      showProgress(i18n.t('exportFailed') + error.message);
      setTimeout(hideProgress, 3000);
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('export-html').addEventListener('click', async () => {
    const btn = document.getElementById('export-html');
    const embedImages = document.getElementById('embed-images').checked;

    btn.disabled = true;

    if (embedImages) {
      showProgress(i18n.t('convertingImages'));
    } else {
      showProgress(i18n.t('exportingHTML'));
    }

    try {
      const data = await extractAllPosts(embedImages);
      const html = generateHTML(data);
      const filename = `linux-do-topic-${data.topic.topicId}-${Date.now()}.html`;
      downloadFile(html, filename, 'text/html');
      showProgress(i18n.t('htmlExportCompleted'));
      setTimeout(hideProgress, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      showProgress(i18n.t('exportFailed') + error.message);
      setTimeout(hideProgress, 3000);
    } finally {
      btn.disabled = false;
    }
  });
}

export default {
  showProgress,
  hideProgress,
  createLanguageSelector,
  updateUILanguage,
  createExportButton,
};
