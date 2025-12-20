/**
 * Linux.do Forum Post Exporter - 国际化模块
 */

/**
 * 翻译字典
 */
export const translations = {
  en: {
    exportJSON: 'Export JSON',
    exportHTML: 'Export HTML',
    exportMarkdown: 'Export Markdown',
    embedImages: 'Embed images',
    language: 'Language',
    convertingImages: 'Converting images to base64...',
    convertingImagesJSON: 'Converting images to base64 for JSON export...',
    convertingImagesMarkdown: 'Converting images to base64 for Markdown export...',
    exportingJSON: 'Exporting to JSON...',
    exportingHTML: 'Exporting to HTML...',
    exportingMarkdown: 'Exporting to Markdown...',
    exportCompleted: '✓ Export completed!',
    jsonExportCompleted: '✓ JSON export completed!',
    htmlExportCompleted: '✓ HTML export completed!',
    markdownExportCompleted: '✓ Markdown export completed!',
    exportFailed: '✗ Export failed: ',
    loadingPosts: 'Loading posts...',
    topicID: 'Topic ID',
    posts: 'Posts',
    source: 'Source',
    replyTo: 'Reply to',
    exportedFrom: 'Exported from Linux.do on',
    dateFormat: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    noPostsFound: 'No posts found on this page',
    exportError: 'An error occurred during export',
    scriptInitialized: 'Linux.do Forum Exporter initialized',
    togglePanel: 'Toggle panel',
    searchPlaceholder: 'Search posts...',
    noResults: 'No matching posts found',
    showAll: 'Show all',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    autoTheme: 'Auto',
    theme: 'Theme',
    includeComments: 'Include comments',
    loadingComments: 'Loading all comments...',
    commentsLoaded: 'Loaded {count} comments',
    comments: 'Comments',
    views: 'Views',
    likes: 'Likes',
    participants: 'Participants',
  },
  'zh-CN': {
    exportJSON: '导出 JSON',
    exportHTML: '导出 HTML',
    exportMarkdown: '导出 Markdown',
    embedImages: '嵌入图片',
    language: '语言',
    convertingImages: '正在转换图片为 base64...',
    convertingImagesJSON: '正在为 JSON 导出转换图片...',
    convertingImagesMarkdown: '正在为 Markdown 导出转换图片...',
    exportingJSON: '正在导出为 JSON...',
    exportingHTML: '正在导出为 HTML...',
    exportingMarkdown: '正在导出为 Markdown...',
    exportCompleted: '✓ 导出完成！',
    jsonExportCompleted: '✓ JSON 导出完成！',
    htmlExportCompleted: '✓ HTML 导出完成！',
    markdownExportCompleted: '✓ Markdown 导出完成！',
    exportFailed: '✗ 导出失败：',
    loadingPosts: '正在加载帖子...',
    topicID: '主题 ID',
    posts: '帖子数',
    source: '来源',
    replyTo: '回复',
    exportedFrom: '导出自 Linux.do 于',
    dateFormat: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    noPostsFound: '页面未找到帖子',
    exportError: '导出过程中发生错误',
    scriptInitialized: 'Linux.do 论坛导出器已初始化',
    togglePanel: '展开/收起',
    searchPlaceholder: '搜索帖子...',
    noResults: '未找到匹配的帖子',
    showAll: '显示全部',
    lightTheme: '浅色',
    darkTheme: '深色',
    autoTheme: '自动',
    theme: '主题',
    includeComments: '包含评论',
    loadingComments: '正在加载所有评论...',
    commentsLoaded: '已加载 {count} 条评论',
    comments: '评论',
    views: '浏览',
    likes: '点赞',
    participants: '参与者',
  },
  'zh-TW': {
    exportJSON: '匯出 JSON',
    exportHTML: '匯出 HTML',
    exportMarkdown: '匯出 Markdown',
    embedImages: '嵌入圖片',
    language: '語言',
    convertingImages: '正在轉換圖片為 base64...',
    convertingImagesJSON: '正在為 JSON 匯出轉換圖片...',
    convertingImagesMarkdown: '正在為 Markdown 匯出轉換圖片...',
    exportingJSON: '正在匯出為 JSON...',
    exportingHTML: '正在匯出為 HTML...',
    exportingMarkdown: '正在匯出為 Markdown...',
    exportCompleted: '✓ 匯出完成！',
    jsonExportCompleted: '✓ JSON 匯出完成！',
    htmlExportCompleted: '✓ HTML 匯出完成！',
    markdownExportCompleted: '✓ Markdown 匯出完成！',
    exportFailed: '✗ 匯出失敗：',
    loadingPosts: '正在載入貼文...',
    topicID: '主題 ID',
    posts: '貼文數',
    source: '來源',
    replyTo: '回覆',
    exportedFrom: '匯出自 Linux.do 於',
    dateFormat: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    noPostsFound: '頁面未找到貼文',
    exportError: '匯出過程中發生錯誤',
    scriptInitialized: 'Linux.do 論壇匯出器已初始化',
    togglePanel: '展開/收起',
    searchPlaceholder: '搜尋貼文...',
    noResults: '未找到匹配的貼文',
    showAll: '顯示全部',
    lightTheme: '淺色',
    darkTheme: '深色',
    autoTheme: '自動',
    theme: '主題',
    includeComments: '包含評論',
    loadingComments: '正在載入所有評論...',
    commentsLoaded: '已載入 {count} 則評論',
    comments: '評論',
    views: '瀏覽',
    likes: '贊',
    participants: '參與者',
  },
  ja: {
    exportJSON: 'JSON エクスポート',
    exportHTML: 'HTML エクスポート',
    exportMarkdown: 'Markdown エクスポート',
    embedImages: '画像を埋め込む',
    language: '言語',
    convertingImages: '画像を base64 に変換中...',
    convertingImagesJSON: 'JSON エクスポート用に画像を変換中...',
    convertingImagesMarkdown: 'Markdown エクスポート用に画像を変換中...',
    exportingJSON: 'JSON にエクスポート中...',
    exportingHTML: 'HTML にエクスポート中...',
    exportingMarkdown: 'Markdown にエクスポート中...',
    exportCompleted: '✓ エクスポート完了！',
    jsonExportCompleted: '✓ JSON エクスポート完了！',
    htmlExportCompleted: '✓ HTML エクスポート完了！',
    markdownExportCompleted: '✓ Markdown エクスポート完了！',
    exportFailed: '✗ エクスポート失敗：',
    loadingPosts: '投稿を読み込み中...',
    topicID: 'トピック ID',
    posts: '投稿数',
    source: 'ソース',
    replyTo: '返信先',
    exportedFrom: 'Linux.do からエクスポート',
    dateFormat: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    noPostsFound: 'このページに投稿が見つかりません',
    exportError: 'エクスポート中にエラーが発生しました',
    scriptInitialized: 'Linux.do フォーラムエクスポーターが初期化されました',
    togglePanel: '開閉',
    searchPlaceholder: '投稿を検索...',
    noResults: '一致する投稿が見つかりません',
    showAll: 'すべて表示',
    lightTheme: 'ライト',
    darkTheme: 'ダーク',
    autoTheme: '自動',
    theme: 'テーマ',
    includeComments: 'コメントを含める',
    loadingComments: 'すべてのコメントを読み込み中...',
    commentsLoaded: '{count}件のコメントを読み込みました',
    comments: 'コメント',
    views: '閲覧',
    likes: 'いいね',
    participants: '参加者',
  },
  ko: {
    exportJSON: 'JSON 내보내기',
    exportHTML: 'HTML 내보내기',
    exportMarkdown: 'Markdown 내보내기',
    embedImages: '이미지 포함',
    language: '언어',
    convertingImages: '이미지를 base64로 변환 중...',
    convertingImagesJSON: 'JSON 내보내기를 위해 이미지 변환 중...',
    convertingImagesMarkdown: 'Markdown 내보내기를 위해 이미지 변환 중...',
    exportingJSON: 'JSON으로 내보내는 중...',
    exportingHTML: 'HTML로 내보내는 중...',
    exportingMarkdown: 'Markdown으로 내보내는 중...',
    exportCompleted: '✓ 내보내기 완료!',
    jsonExportCompleted: '✓ JSON 내보내기 완료!',
    htmlExportCompleted: '✓ HTML 내보내기 완료!',
    markdownExportCompleted: '✓ Markdown 내보내기 완료!',
    exportFailed: '✗ 내보내기 실패: ',
    loadingPosts: '게시물 로딩 중...',
    topicID: '주제 ID',
    posts: '게시물',
    source: '출처',
    replyTo: '답글',
    exportedFrom: 'Linux.do에서 내보냄',
    dateFormat: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    noPostsFound: '이 페이지에서 게시물을 찾을 수 없습니다',
    exportError: '내보내기 중 오류가 발생했습니다',
    scriptInitialized: 'Linux.do 포럼 내보내기 도구가 초기화되었습니다',
    togglePanel: '패널 전환',
    searchPlaceholder: '게시물 검색...',
    noResults: '일치하는 게시물이 없습니다',
    showAll: '전체 보기',
    lightTheme: '라이트',
    darkTheme: '다크',
    autoTheme: '자동',
    theme: '테마',
    includeComments: '댓글 포함',
    loadingComments: '모든 댓글 로딩 중...',
    commentsLoaded: '{count}개의 댓글을 로드했습니다',
    comments: '댓글',
    views: '조회수',
    likes: '좋아요',
    participants: '참여자',
  },
  es: {
    exportJSON: 'Exportar JSON',
    exportHTML: 'Exportar HTML',
    exportMarkdown: 'Exportar Markdown',
    embedImages: 'Incluir imágenes',
    language: 'Idioma',
    convertingImages: 'Convirtiendo imágenes a base64...',
    convertingImagesJSON: 'Convirtiendo imágenes para exportación JSON...',
    convertingImagesMarkdown: 'Convirtiendo imágenes para exportación Markdown...',
    exportingJSON: 'Exportando a JSON...',
    exportingHTML: 'Exportando a HTML...',
    exportingMarkdown: 'Exportando a Markdown...',
    exportCompleted: '✓ ¡Exportación completada!',
    jsonExportCompleted: '✓ ¡Exportación JSON completada!',
    htmlExportCompleted: '✓ ¡Exportación HTML completada!',
    markdownExportCompleted: '✓ ¡Exportación Markdown completada!',
    exportFailed: '✗ Error en la exportación: ',
    loadingPosts: 'Cargando publicaciones...',
    topicID: 'ID del tema',
    posts: 'Publicaciones',
    source: 'Fuente',
    replyTo: 'Responder a',
    exportedFrom: 'Exportado de Linux.do el',
    dateFormat: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    noPostsFound: 'No se encontraron publicaciones en esta página',
    exportError: 'Ocurrió un error durante la exportación',
    scriptInitialized: 'Exportador de foros Linux.do inicializado',
    togglePanel: 'Alternar panel',
    searchPlaceholder: 'Buscar publicaciones...',
    noResults: 'No se encontraron publicaciones',
    showAll: 'Mostrar todo',
    lightTheme: 'Claro',
    darkTheme: 'Oscuro',
    autoTheme: 'Auto',
    theme: 'Tema',
    includeComments: 'Incluir comentarios',
    loadingComments: 'Cargando todos los comentarios...',
    commentsLoaded: 'Se cargaron {count} comentarios',
    comments: 'Comentarios',
    views: 'Vistas',
    likes: 'Me gusta',
    participants: 'Participantes',
  },
  fr: {
    exportJSON: 'Exporter JSON',
    exportHTML: 'Exporter HTML',
    exportMarkdown: 'Exporter Markdown',
    embedImages: 'Intégrer les images',
    language: 'Langue',
    convertingImages: 'Conversion des images en base64...',
    convertingImagesJSON: "Conversion des images pour l'export JSON...",
    convertingImagesMarkdown: "Conversion des images pour l'export Markdown...",
    exportingJSON: 'Exportation en JSON...',
    exportingHTML: 'Exportation en HTML...',
    exportingMarkdown: 'Exportation en Markdown...',
    exportCompleted: '✓ Exportation terminée !',
    jsonExportCompleted: '✓ Exportation JSON terminée !',
    htmlExportCompleted: '✓ Exportation HTML terminée !',
    markdownExportCompleted: '✓ Exportation Markdown terminée !',
    exportFailed: "✗ Échec de l'exportation : ",
    loadingPosts: 'Chargement des publications...',
    topicID: 'ID du sujet',
    posts: 'Publications',
    source: 'Source',
    replyTo: 'Répondre à',
    exportedFrom: 'Exporté de Linux.do le',
    dateFormat: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    noPostsFound: 'Aucune publication trouvée sur cette page',
    exportError: "Une erreur s'est produite lors de l'exportation",
    scriptInitialized: 'Exportateur de forum Linux.do initialisé',
    togglePanel: 'Basculer le panneau',
    searchPlaceholder: 'Rechercher des publications...',
    noResults: 'Aucune publication trouvée',
    showAll: 'Tout afficher',
    lightTheme: 'Clair',
    darkTheme: 'Sombre',
    autoTheme: 'Auto',
    theme: 'Thème',
    includeComments: 'Inclure les commentaires',
    loadingComments: 'Chargement de tous les commentaires...',
    commentsLoaded: '{count} commentaires chargés',
    comments: 'Commentaires',
    views: 'Vues',
    likes: "J'aime",
    participants: 'Participants',
  },
  de: {
    exportJSON: 'JSON exportieren',
    exportHTML: 'HTML exportieren',
    exportMarkdown: 'Markdown exportieren',
    embedImages: 'Bilder einbetten',
    language: 'Sprache',
    convertingImages: 'Konvertiere Bilder zu base64...',
    convertingImagesJSON: 'Konvertiere Bilder für JSON-Export...',
    convertingImagesMarkdown: 'Konvertiere Bilder für Markdown-Export...',
    exportingJSON: 'Exportiere zu JSON...',
    exportingHTML: 'Exportiere zu HTML...',
    exportingMarkdown: 'Exportiere zu Markdown...',
    exportCompleted: '✓ Export abgeschlossen!',
    jsonExportCompleted: '✓ JSON-Export abgeschlossen!',
    htmlExportCompleted: '✓ HTML-Export abgeschlossen!',
    markdownExportCompleted: '✓ Markdown-Export abgeschlossen!',
    exportFailed: '✗ Export fehlgeschlagen: ',
    loadingPosts: 'Lade Beiträge...',
    topicID: 'Themen-ID',
    posts: 'Beiträge',
    source: 'Quelle',
    replyTo: 'Antworten an',
    exportedFrom: 'Exportiert von Linux.do am',
    dateFormat: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    noPostsFound: 'Keine Beiträge auf dieser Seite gefunden',
    exportError: 'Ein Fehler ist beim Export aufgetreten',
    scriptInitialized: 'Linux.do Forum-Exporter initialisiert',
    togglePanel: 'Panel umschalten',
    searchPlaceholder: 'Beiträge suchen...',
    noResults: 'Keine passenden Beiträge gefunden',
    showAll: 'Alle anzeigen',
    lightTheme: 'Hell',
    darkTheme: 'Dunkel',
    autoTheme: 'Auto',
    theme: 'Design',
    includeComments: 'Kommentare einschließen',
    loadingComments: 'Alle Kommentare werden geladen...',
    commentsLoaded: '{count} Kommentare geladen',
    comments: 'Kommentare',
    views: 'Aufrufe',
    likes: 'Gefällt mir',
    participants: 'Teilnehmer',
  },
  ru: {
    exportJSON: 'Экспорт JSON',
    exportHTML: 'Экспорт HTML',
    exportMarkdown: 'Экспорт Markdown',
    embedImages: 'Встроить изображения',
    language: 'Язык',
    convertingImages: 'Конвертация изображений в base64...',
    convertingImagesJSON: 'Конвертация изображений для экспорта JSON...',
    convertingImagesMarkdown: 'Конвертация изображений для экспорта Markdown...',
    exportingJSON: 'Экспорт в JSON...',
    exportingHTML: 'Экспорт в HTML...',
    exportingMarkdown: 'Экспорт в Markdown...',
    exportCompleted: '✓ Экспорт завершен!',
    jsonExportCompleted: '✓ Экспорт JSON завершен!',
    htmlExportCompleted: '✓ Экспорт HTML завершен!',
    markdownExportCompleted: '✓ Экспорт Markdown завершен!',
    exportFailed: '✗ Ошибка экспорта: ',
    loadingPosts: 'Загрузка сообщений...',
    topicID: 'ID темы',
    posts: 'Сообщения',
    source: 'Источник',
    replyTo: 'Ответить',
    exportedFrom: 'Экспортировано с Linux.do',
    dateFormat: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    noPostsFound: 'На этой странице не найдено сообщений',
    exportError: 'Произошла ошибка при экспорте',
    scriptInitialized: 'Экспортер форума Linux.do инициализирован',
    togglePanel: 'Переключить панель',
    searchPlaceholder: 'Поиск сообщений...',
    noResults: 'Сообщения не найдены',
    showAll: 'Показать все',
    lightTheme: 'Светлая',
    darkTheme: 'Тёмная',
    autoTheme: 'Авто',
    theme: 'Тема',
    includeComments: 'Включить комментарии',
    loadingComments: 'Загрузка всех комментариев...',
    commentsLoaded: 'Загружено {count} комментариев',
    comments: 'Комментарии',
    views: 'Просмотры',
    likes: 'Лайки',
    participants: 'Участники',
  },
};

/**
 * 语言名称映射
 */
const languageNames = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  ja: '日本語',
  ko: '한국어',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский',
};

/**
 * I18n类
 */
export class I18n {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.fallbackLang = 'en';
  }

  /**
   * 检测语言
   * @returns {string}
   */
  detectLanguage() {
    const savedLang = typeof GM_getValue !== 'undefined'
      ? GM_getValue('language', null)
      : localStorage.getItem('exporter_language');

    if (savedLang && translations[savedLang]) {
      return savedLang;
    }

    const browserLang = navigator.language || navigator.userLanguage;

    if (translations[browserLang]) {
      return browserLang;
    }

    const primaryLang = browserLang.split('-')[0];
    const matchingLang = Object.keys(translations).find((lang) => lang.startsWith(primaryLang));
    if (matchingLang) {
      return matchingLang;
    }

    return this.fallbackLang;
  }

  /**
   * 设置语言
   * @param {string} lang - 语言代码
   * @returns {boolean}
   */
  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLang = lang;
      if (typeof GM_setValue !== 'undefined') {
        GM_setValue('language', lang);
      } else {
        localStorage.setItem('exporter_language', lang);
      }
      return true;
    }
    return false;
  }

  /**
   * 获取翻译
   * @param {string} key - 翻译键
   * @returns {string|Object}
   */
  t(key) {
    const keys = key.split('.');
    let value = translations[this.currentLang];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = translations[this.fallbackLang];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key;
          }
        }
        break;
      }
    }

    return value;
  }

  /**
   * 获取可用语言列表
   * @returns {Array}
   */
  getAvailableLanguages() {
    return Object.keys(translations).map((code) => ({
      code,
      name: this.getLanguageName(code),
    }));
  }

  /**
   * 获取语言名称
   * @param {string} code - 语言代码
   * @returns {string}
   */
  getLanguageName(code) {
    return languageNames[code] || code;
  }

  /**
   * 格式化日期
   * @param {string} date - 日期字符串
   * @returns {string}
   */
  formatDate(date) {
    return new Date(date).toLocaleString(this.currentLang, this.t('dateFormat'));
  }
}

export const i18n = new I18n();

export default i18n;
