/**
 * Linux.do Forum Post Exporter
 * Export forum posts from linux.do with replies in JSON or HTML format
 * Optimized & Beautiful with i18n support
 */

import i18n from './i18n.js';
import { waitForPosts } from './extractor.js';
import { showProgress, hideProgress, createExportButton } from './ui.js';

/**
 * 初始化导出器
 */
async function init() {
  try {
    showProgress(i18n.t('loadingPosts'));
    await waitForPosts();
    hideProgress();
    createExportButton();
    console.log(i18n.t('scriptInitialized') + ' v2.1.0');
  } catch (error) {
    hideProgress();
    console.error('Linux.do Exporter:', error.message);
  }
}

init();

export default {
  init,
  i18n,
};
