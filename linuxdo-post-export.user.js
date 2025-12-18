// ==UserScript==
// @name         Linux.do Forum Post Exporter
// @namespace    https://linux.do/
// @version      2.2.0
// @description  Export forum posts from linux.do with replies in JSON or HTML format - Optimized & Beautiful with i18n support
// @author       Forum Exporter
// @match        https://linux.do/t/*
// @match        https://linux.do/t/topic/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  // ==================== i18n Configuration ====================
  const translations = {
    en: {
      // UI Elements
      exportJSON: "Export JSON",
      exportHTML: "Export HTML",
      embedImages: "Embed images",
      language: "Language",
      searchPlaceholder: "Search posts...",
      noResults: "No matching posts found",
      showAll: "Show all",
      lightTheme: "Light",
      darkTheme: "Dark",
      autoTheme: "Auto",

      // Progress Messages
      convertingImages: "Converting images to base64...",
      convertingImagesJSON: "Converting images to base64 for JSON export...",
      exportingJSON: "Exporting to JSON...",
      exportingHTML: "Exporting to HTML...",
      exportCompleted: "✓ Export completed!",
      jsonExportCompleted: "✓ JSON export completed!",
      htmlExportCompleted: "✓ HTML export completed!",
      exportFailed: "✗ Export failed: ",
      loadingPosts: "Loading posts...",

      // HTML Export
      topicID: "Topic ID",
      posts: "Posts",
      source: "Source",
      replyTo: "Reply to",
      exportedFrom: "Exported from Linux.do on",

      // Date Format
      dateFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },

      // Errors
      noPostsFound: "No posts found on this page",
      exportError: "An error occurred during export",

      // Console Messages
      scriptInitialized: "Linux.do Forum Exporter initialized",
    },

    "zh-CN": {
      // UI Elements
      exportJSON: "导出 JSON",
      exportHTML: "导出 HTML",
      embedImages: "嵌入图片",
      language: "语言",
      searchPlaceholder: "搜索帖子...",
      noResults: "未找到匹配的帖子",
      showAll: "显示全部",
      lightTheme: "浅色",
      darkTheme: "深色",
      autoTheme: "自动",

      // Progress Messages
      convertingImages: "正在转换图片为 base64...",
      convertingImagesJSON: "正在为 JSON 导出转换图片...",
      exportingJSON: "正在导出为 JSON...",
      exportingHTML: "正在导出为 HTML...",
      exportCompleted: "✓ 导出完成！",
      jsonExportCompleted: "✓ JSON 导出完成！",
      htmlExportCompleted: "✓ HTML 导出完成！",
      exportFailed: "✗ 导出失败：",
      loadingPosts: "正在加载帖子...",

      // HTML Export
      topicID: "主题 ID",
      posts: "帖子数",
      source: "来源",
      replyTo: "回复",
      exportedFrom: "导出自 Linux.do 于",

      // Date Format
      dateFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },

      // Errors
      noPostsFound: "页面未找到帖子",
      exportError: "导出过程中发生错误",

      // Console Messages
      scriptInitialized: "Linux.do 论坛导出器已初始化",
    },

    "zh-TW": {
      // UI Elements
      exportJSON: "匯出 JSON",
      exportHTML: "匯出 HTML",
      embedImages: "嵌入圖片",
      language: "語言",
      searchPlaceholder: "搜尋貼文...",
      noResults: "未找到符合的貼文",
      showAll: "顯示全部",
      lightTheme: "淺色",
      darkTheme: "深色",
      autoTheme: "自動",

      // Progress Messages
      convertingImages: "正在轉換圖片為 base64...",
      convertingImagesJSON: "正在為 JSON 匯出轉換圖片...",
      exportingJSON: "正在匯出為 JSON...",
      exportingHTML: "正在匯出為 HTML...",
      exportCompleted: "✓ 匯出完成！",
      jsonExportCompleted: "✓ JSON 匯出完成！",
      htmlExportCompleted: "✓ HTML 匯出完成！",
      exportFailed: "✗ 匯出失敗：",
      loadingPosts: "正在載入貼文...",

      // HTML Export
      topicID: "主題 ID",
      posts: "貼文數",
      source: "來源",
      replyTo: "回覆",
      exportedFrom: "匯出自 Linux.do 於",

      // Date Format
      dateFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },

      // Errors
      noPostsFound: "頁面未找到貼文",
      exportError: "匯出過程中發生錯誤",

      // Console Messages
      scriptInitialized: "Linux.do 論壇匯出器已初始化",
    },

    ja: {
      // UI Elements
      exportJSON: "JSON エクスポート",
      exportHTML: "HTML エクスポート",
      embedImages: "画像を埋め込む",
      language: "言語",
      searchPlaceholder: "投稿を検索...",
      noResults: "一致する投稿が見つかりません",
      showAll: "すべて表示",
      lightTheme: "ライト",
      darkTheme: "ダーク",
      autoTheme: "自動",

      // Progress Messages
      convertingImages: "画像を base64 に変換中...",
      convertingImagesJSON: "JSON エクスポート用に画像を変換中...",
      exportingJSON: "JSON にエクスポート中...",
      exportingHTML: "HTML にエクスポート中...",
      exportCompleted: "✓ エクスポート完了！",
      jsonExportCompleted: "✓ JSON エクスポート完了！",
      htmlExportCompleted: "✓ HTML エクスポート完了！",
      exportFailed: "✗ エクスポート失敗：",
      loadingPosts: "投稿を読み込み中...",

      // HTML Export
      topicID: "トピック ID",
      posts: "投稿数",
      source: "ソース",
      replyTo: "返信先",
      exportedFrom: "Linux.do からエクスポート",

      // Date Format
      dateFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },

      // Errors
      noPostsFound: "このページに投稿が見つかりません",
      exportError: "エクスポート中にエラーが発生しました",

      // Console Messages
      scriptInitialized: "Linux.do フォーラムエクスポーターが初期化されました",
    },

    ko: {
      // UI Elements
      exportJSON: "JSON 내보내기",
      exportHTML: "HTML 내보내기",
      embedImages: "이미지 포함",
      language: "언어",
      searchPlaceholder: "게시물 검색...",
      noResults: "일치하는 게시물이 없습니다",
      showAll: "모두 표시",
      lightTheme: "라이트",
      darkTheme: "다크",
      autoTheme: "자동",

      // Progress Messages
      convertingImages: "이미지를 base64로 변환 중...",
      convertingImagesJSON: "JSON 내보내기를 위해 이미지 변환 중...",
      exportingJSON: "JSON으로 내보내는 중...",
      exportingHTML: "HTML로 내보내는 중...",
      exportCompleted: "✓ 내보내기 완료!",
      jsonExportCompleted: "✓ JSON 내보내기 완료!",
      htmlExportCompleted: "✓ HTML 내보내기 완료!",
      exportFailed: "✗ 내보내기 실패: ",
      loadingPosts: "게시물 로딩 중...",

      // HTML Export
      topicID: "주제 ID",
      posts: "게시물",
      source: "출처",
      replyTo: "답글",
      exportedFrom: "Linux.do에서 내보냄",

      // Date Format
      dateFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },

      // Errors
      noPostsFound: "이 페이지에서 게시물을 찾을 수 없습니다",
      exportError: "내보내기 중 오류가 발생했습니다",

      // Console Messages
      scriptInitialized: "Linux.do 포럼 내보내기 도구가 초기화되었습니다",
    },

    es: {
      // UI Elements
      exportJSON: "Exportar JSON",
      exportHTML: "Exportar HTML",
      embedImages: "Incluir imágenes",
      language: "Idioma",
      searchPlaceholder: "Buscar publicaciones...",
      noResults: "No se encontraron publicaciones",
      showAll: "Mostrar todo",
      lightTheme: "Claro",
      darkTheme: "Oscuro",
      autoTheme: "Auto",

      // Progress Messages
      convertingImages: "Convirtiendo imágenes a base64...",
      convertingImagesJSON: "Convirtiendo imágenes para exportación JSON...",
      exportingJSON: "Exportando a JSON...",
      exportingHTML: "Exportando a HTML...",
      exportCompleted: "✓ ¡Exportación completada!",
      jsonExportCompleted: "✓ ¡Exportación JSON completada!",
      htmlExportCompleted: "✓ ¡Exportación HTML completada!",
      exportFailed: "✗ Error en la exportación: ",
      loadingPosts: "Cargando publicaciones...",

      // HTML Export
      topicID: "ID del tema",
      posts: "Publicaciones",
      source: "Fuente",
      replyTo: "Responder a",
      exportedFrom: "Exportado de Linux.do el",

      // Date Format
      dateFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },

      // Errors
      noPostsFound: "No se encontraron publicaciones en esta página",
      exportError: "Ocurrió un error durante la exportación",

      // Console Messages
      scriptInitialized: "Exportador de foros Linux.do inicializado",
    },

    fr: {
      // UI Elements
      exportJSON: "Exporter JSON",
      exportHTML: "Exporter HTML",
      embedImages: "Intégrer les images",
      language: "Langue",
      searchPlaceholder: "Rechercher des publications...",
      noResults: "Aucune publication trouvée",
      showAll: "Tout afficher",
      lightTheme: "Clair",
      darkTheme: "Sombre",
      autoTheme: "Auto",

      // Progress Messages
      convertingImages: "Conversion des images en base64...",
      convertingImagesJSON: "Conversion des images pour l'export JSON...",
      exportingJSON: "Exportation en JSON...",
      exportingHTML: "Exportation en HTML...",
      exportCompleted: "✓ Exportation terminée !",
      jsonExportCompleted: "✓ Exportation JSON terminée !",
      htmlExportCompleted: "✓ Exportation HTML terminée !",
      exportFailed: "✗ Échec de l'exportation : ",
      loadingPosts: "Chargement des publications...",

      // HTML Export
      topicID: "ID du sujet",
      posts: "Publications",
      source: "Source",
      replyTo: "Répondre à",
      exportedFrom: "Exporté de Linux.do le",

      // Date Format
      dateFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },

      // Errors
      noPostsFound: "Aucune publication trouvée sur cette page",
      exportError: "Une erreur s'est produite lors de l'exportation",

      // Console Messages
      scriptInitialized: "Exportateur de forum Linux.do initialisé",
    },

    de: {
      // UI Elements
      exportJSON: "JSON exportieren",
      exportHTML: "HTML exportieren",
      embedImages: "Bilder einbetten",
      language: "Sprache",
      searchPlaceholder: "Beiträge suchen...",
      noResults: "Keine passenden Beiträge gefunden",
      showAll: "Alle anzeigen",
      lightTheme: "Hell",
      darkTheme: "Dunkel",
      autoTheme: "Auto",

      // Progress Messages
      convertingImages: "Konvertiere Bilder zu base64...",
      convertingImagesJSON: "Konvertiere Bilder für JSON-Export...",
      exportingJSON: "Exportiere zu JSON...",
      exportingHTML: "Exportiere zu HTML...",
      exportCompleted: "✓ Export abgeschlossen!",
      jsonExportCompleted: "✓ JSON-Export abgeschlossen!",
      htmlExportCompleted: "✓ HTML-Export abgeschlossen!",
      exportFailed: "✗ Export fehlgeschlagen: ",
      loadingPosts: "Lade Beiträge...",

      // HTML Export
      topicID: "Themen-ID",
      posts: "Beiträge",
      source: "Quelle",
      replyTo: "Antworten an",
      exportedFrom: "Exportiert von Linux.do am",

      // Date Format
      dateFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },

      // Errors
      noPostsFound: "Keine Beiträge auf dieser Seite gefunden",
      exportError: "Ein Fehler ist beim Export aufgetreten",

      // Console Messages
      scriptInitialized: "Linux.do Forum-Exporter initialisiert",
    },

    ru: {
      // UI Elements
      exportJSON: "Экспорт JSON",
      exportHTML: "Экспорт HTML",
      embedImages: "Встроить изображения",
      language: "Язык",
      searchPlaceholder: "Поиск сообщений...",
      noResults: "Сообщения не найдены",
      showAll: "Показать все",
      lightTheme: "Светлая",
      darkTheme: "Тёмная",
      autoTheme: "Авто",

      // Progress Messages
      convertingImages: "Конвертация изображений в base64...",
      convertingImagesJSON: "Конвертация изображений для экспорта JSON...",
      exportingJSON: "Экспорт в JSON...",
      exportingHTML: "Экспорт в HTML...",
      exportCompleted: "✓ Экспорт завершен!",
      jsonExportCompleted: "✓ Экспорт JSON завершен!",
      htmlExportCompleted: "✓ Экспорт HTML завершен!",
      exportFailed: "✗ Ошибка экспорта: ",
      loadingPosts: "Загрузка сообщений...",

      // HTML Export
      topicID: "ID темы",
      posts: "Сообщения",
      source: "Источник",
      replyTo: "Ответить",
      exportedFrom: "Экспортировано с Linux.do",

      // Date Format
      dateFormat: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },

      // Errors
      noPostsFound: "На этой странице не найдено сообщений",
      exportError: "Произошла ошибка при экспорте",

      // Console Messages
      scriptInitialized: "Экспортер форума Linux.do инициализирован",
    },
  };

  // Language detection and management
  class I18n {
    constructor() {
      this.currentLang = this.detectLanguage();
      this.fallbackLang = "en";
    }

    detectLanguage() {
      // Try to get saved language preference
      const savedLang =
        typeof GM_getValue !== "undefined"
          ? GM_getValue("language", null)
          : localStorage.getItem("exporter_language");
      if (savedLang && translations[savedLang]) {
        return savedLang;
      }

      // Detect from browser
      const browserLang = navigator.language || navigator.userLanguage;

      // Exact match
      if (translations[browserLang]) {
        return browserLang;
      }

      // Try primary language code (e.g., 'zh' from 'zh-CN')
      const primaryLang = browserLang.split("-")[0];
      const matchingLang = Object.keys(translations).find((lang) =>
        lang.startsWith(primaryLang)
      );
      if (matchingLang) {
        return matchingLang;
      }

      return this.fallbackLang;
    }

    setLanguage(lang) {
      if (translations[lang]) {
        this.currentLang = lang;
        if (typeof GM_setValue !== "undefined") {
          GM_setValue("language", lang);
        } else {
          localStorage.setItem("exporter_language", lang);
        }
        return true;
      }
      return false;
    }

    t(key) {
      const keys = key.split(".");
      let value = translations[this.currentLang];

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          // Fallback to English
          value = translations[this.fallbackLang];
          for (const fallbackKey of keys) {
            if (value && typeof value === "object" && fallbackKey in value) {
              value = value[fallbackKey];
            } else {
              return key; // Return key if translation not found
            }
          }
          break;
        }
      }

      return value;
    }

    getAvailableLanguages() {
      return Object.keys(translations).map((code) => ({
        code,
        name: this.getLanguageName(code),
      }));
    }

    getLanguageName(code) {
      const names = {
        en: "English",
        "zh-CN": "简体中文",
        "zh-TW": "繁體中文",
        ja: "日本語",
        ko: "한국어",
        es: "Español",
        fr: "Français",
        de: "Deutsch",
        ru: "Русский",
      };
      return names[code] || code;
    }

    formatDate(date) {
      return new Date(date).toLocaleString(
        this.currentLang,
        this.t("dateFormat")
      );
    }
  }

  const i18n = new I18n();

  // ==================== Core Functions ====================

  // Convert image URL to base64 data URL
  async function imageToBase64(url) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Failed to convert image:", url, error);
      return url;
    }
  }

  // Wait for the page to fully load
  function waitForPosts() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const posts = document.querySelectorAll("article[data-post-id]");
        if (posts.length > 0) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 500);
    });
  }

  // Extract post data from a single post element
  function extractPostData(postElement) {
    const postId = postElement.getAttribute("data-post-id");
    const postNumber = postElement
      .closest(".topic-post")
      .getAttribute("data-post-number");

    const authorLink = postElement.querySelector(".names a");
    const authorUsername = authorLink ? authorLink.textContent.trim() : "";
    const authorHref = authorLink ? authorLink.getAttribute("href") : "";

    const avatarImg = postElement.querySelector(".post-avatar img");
    const avatarUrl = avatarImg ? avatarImg.getAttribute("src") : "";

    const dateElement = postElement.querySelector(".post-date .relative-date");
    const postDate = dateElement ? dateElement.getAttribute("data-time") : "";
    const postDateFormatted = dateElement ? dateElement.textContent.trim() : "";

    const contentElement = postElement.querySelector(".cooked");
    const content = contentElement ? contentElement.innerHTML : "";
    const contentText = contentElement ? contentElement.textContent.trim() : "";

    const quotes = [];
    const quoteElements = postElement.querySelectorAll("aside.quote");
    quoteElements.forEach((quote) => {
      const quotedUser = quote.getAttribute("data-username");
      const quotedPost = quote.getAttribute("data-post");
      const quotedContent = quote.querySelector("blockquote");
      quotes.push({
        username: quotedUser,
        postNumber: quotedPost,
        content: quotedContent ? quotedContent.innerHTML : "",
      });
    });

    const replyToElement = postElement.querySelector(".reply-to-tab");
    let replyTo = null;
    if (replyToElement) {
      const replyToUser = replyToElement.querySelector("span");
      const replyToAvatar = replyToElement.querySelector("img");
      replyTo = {
        username: replyToUser ? replyToUser.textContent.trim() : "",
        avatarUrl: replyToAvatar ? replyToAvatar.getAttribute("src") : "",
      };
    }

    const reactions = [];
    const reactionElements = postElement.querySelectorAll(
      ".discourse-reactions-counter button"
    );
    reactionElements.forEach((reaction) => {
      const count = reaction.querySelector(".count");
      const emoji = reaction.querySelector(".emoji");
      if (count && emoji) {
        reactions.push({
          emoji: emoji.textContent.trim(),
          count: parseInt(count.textContent.trim()),
        });
      }
    });

    return {
      postId,
      postNumber: parseInt(postNumber),
      author: {
        username: authorUsername,
        profileUrl: authorHref,
        avatarUrl: avatarUrl,
      },
      timestamp: postDate,
      dateFormatted: postDateFormatted,
      content: content,
      contentText: contentText,
      quotes: quotes,
      replyTo: replyTo,
      reactions: reactions,
    };
  }

  // Extract topic metadata
  function extractTopicData() {
    const topicTitle = document.querySelector(
      "h1[data-topic-id] .fancy-title span"
    );
    const topicId = document
      .querySelector("h1[data-topic-id]")
      ?.getAttribute("data-topic-id");
    const category = document.querySelector(".badge-category__name");
    const tags = [
      ...new Set(
        Array.from(document.querySelectorAll(".discourse-tag")).map((tag) =>
          tag.textContent.trim()
        )
      ),
    ];

    return {
      topicId: topicId,
      title: topicTitle ? topicTitle.textContent.trim() : "",
      category: category ? category.textContent.trim() : "",
      tags: tags,
      url: window.location.href,
    };
  }

  // Process content to convert images to base64
  async function processContentImages(content) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const images = tempDiv.querySelectorAll("img");

    for (const img of images) {
      const src = img.getAttribute("src");
      if (src) {
        const fullUrl = src.startsWith("http") ? src : `https://linux.do${src}`;
        const base64 = await imageToBase64(fullUrl);
        img.setAttribute("src", base64);
      }
    }

    return tempDiv.innerHTML;
  }

  // Clean content for HTML display
  function cleanContentForHTML(content) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    const selectorsToRemove = [
      ".cooked-selection-barrier",
      "div:empty",
      '[aria-hidden="true"]',
    ];

    selectorsToRemove.forEach((selector) => {
      tempDiv.querySelectorAll(selector).forEach((el) => el.remove());
    });

    let cleaned = tempDiv.innerHTML
      .replace(/\s*<br>\s*<\/div>/g, "</div>")
      .replace(/<div>\s*<\/div>/g, "")
      .replace(/\n\s*\n/g, "\n")
      .trim();

    return cleaned;
  }

  // Extract all posts from the page
  async function extractAllPosts(convertImages = false) {
    const posts = document.querySelectorAll("article[data-post-id]");
    const postData = [];

    for (const post of posts) {
      const data = extractPostData(post);

      if (convertImages) {
        if (data.author.avatarUrl) {
          const fullUrl = data.author.avatarUrl.startsWith("http")
            ? data.author.avatarUrl
            : `https://linux.do${data.author.avatarUrl}`;
          data.author.avatarUrl = await imageToBase64(fullUrl);
        }

        data.content = await processContentImages(data.content);

        for (const quote of data.quotes) {
          quote.content = await processContentImages(quote.content);
        }

        if (data.replyTo && data.replyTo.avatarUrl) {
          const fullUrl = data.replyTo.avatarUrl.startsWith("http")
            ? data.replyTo.avatarUrl
            : `https://linux.do${data.replyTo.avatarUrl}`;
          data.replyTo.avatarUrl = await imageToBase64(fullUrl);
        }
      }

      postData.push(data);
    }

    const topicData = extractTopicData();

    return {
      topic: topicData,
      posts: postData,
      exportDate: new Date().toISOString(),
      postCount: postData.length,
      language: i18n.currentLang,
    };
  }

  // Generate JSON export
  function generateJSON(data) {
    return JSON.stringify(data, null, 2);
  }

  // Generate HTML export with modern, minimal design
  function generateHTML(data) {
    const cleanedPosts = data.posts.map((post) => ({
      ...post,
      content: cleanContentForHTML(post.content),
      quotes: post.quotes.map((quote) => ({
        ...quote,
        content: cleanContentForHTML(quote.content),
      })),
    }));

    // Get i18n strings for the exported HTML
    const i18nStrings = {
      searchPlaceholder: i18n.t("searchPlaceholder"),
      noResults: i18n.t("noResults"),
      showAll: i18n.t("showAll"),
      lightTheme: i18n.t("lightTheme"),
      darkTheme: i18n.t("darkTheme"),
      autoTheme: i18n.t("autoTheme"),
    };

    const html = `<!DOCTYPE html>
<html lang="${i18n.currentLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.topic.title} - Linux.do</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-primary: #ffffff;
            --bg-secondary: #f8f9fa;
            --bg-tertiary: #f1f3f5;
            --text-primary: #1a1a1a;
            --text-secondary: #6c757d;
            --text-tertiary: #adb5bd;
            --border-color: #e9ecef;
            --accent-color: #495057;
            --hover-bg: #f8f9fa;
            --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
            --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.06);
            --radius-sm: 4px;
            --radius-md: 8px;
            --radius-lg: 12px;
        }

        [data-theme="dark"] {
            --bg-primary: #1a1a1a;
            --bg-secondary: #242424;
            --bg-tertiary: #2d2d2d;
            --text-primary: #e9ecef;
            --text-secondary: #adb5bd;
            --text-tertiary: #6c757d;
            --border-color: #3d3d3d;
            --accent-color: #adb5bd;
            --hover-bg: #2d2d2d;
            --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2);
            --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) {
                --bg-primary: #1a1a1a;
                --bg-secondary: #242424;
                --bg-tertiary: #2d2d2d;
                --text-primary: #e9ecef;
                --text-secondary: #adb5bd;
                --text-tertiary: #6c757d;
                --border-color: #3d3d3d;
                --accent-color: #adb5bd;
                --hover-bg: #2d2d2d;
                --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2);
                --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.3);
            }
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            background: var(--bg-secondary);
            padding: 20px;
            font-size: 15px;
        }

        .container {
            max-width: 860px;
            margin: 0 auto;
        }

        /* Header Styles */
        .header {
            background: var(--bg-primary);
            padding: 32px;
            border-radius: var(--radius-lg);
            margin-bottom: 24px;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-color);
        }

        .header h1 {
            font-size: 26px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 16px;
            line-height: 1.3;
        }

        .topic-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 16px;
        }

        .category {
            display: inline-flex;
            align-items: center;
            background: var(--bg-tertiary);
            color: var(--text-secondary);
            padding: 4px 12px;
            border-radius: var(--radius-sm);
            font-size: 13px;
            font-weight: 500;
            border: 1px solid var(--border-color);
        }

        .tag {
            display: inline-flex;
            align-items: center;
            background: var(--bg-secondary);
            color: var(--text-secondary);
            padding: 4px 10px;
            border-radius: var(--radius-sm);
            font-size: 12px;
            border: 1px solid var(--border-color);
        }

        .topic-info {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--border-color);
            font-size: 13px;
            color: var(--text-secondary);
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
        }

        .topic-info-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .topic-info-label {
            font-weight: 500;
            color: var(--text-secondary);
        }

        .topic-info a {
            color: var(--text-secondary);
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: all 0.2s;
        }

        .topic-info a:hover {
            color: var(--text-primary);
            border-bottom-color: var(--text-primary);
        }

        /* Post Styles */
        .post {
            background: var(--bg-primary);
            padding: 24px;
            margin-bottom: 16px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-sm);
            transition: box-shadow 0.2s;
        }

        .post:hover {
            box-shadow: var(--shadow-md);
        }

        .post-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border-color);
        }

        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid var(--border-color);
            flex-shrink: 0;
        }

        .author-info {
            flex: 1;
            min-width: 0;
        }

        .author-name {
            font-weight: 600;
            color: var(--text-primary);
            text-decoration: none;
            font-size: 14px;
            display: inline-block;
            transition: color 0.2s;
        }

        .author-name:hover {
            color: var(--accent-color);
        }

        .post-date {
            color: var(--text-tertiary);
            font-size: 13px;
            margin-top: 2px;
        }

        .post-number {
            background: var(--bg-tertiary);
            padding: 4px 10px;
            border-radius: var(--radius-sm);
            font-size: 12px;
            color: var(--text-secondary);
            font-weight: 500;
            border: 1px solid var(--border-color);
            flex-shrink: 0;
        }

        .reply-to {
            background: var(--bg-secondary);
            padding: 8px 12px;
            border-radius: var(--radius-sm);
            margin-bottom: 16px;
            font-size: 13px;
            color: var(--text-secondary);
            border-left: 2px solid var(--border-color);
        }

        /* Content Styles */
        .post-content {
            color: var(--text-primary);
            line-height: 1.7;
        }

        .post-content p {
            margin: 0 0 16px 0;
        }

        .post-content p:last-child {
            margin-bottom: 0;
        }

        .post-content h1,
        .post-content h2,
        .post-content h3,
        .post-content h4,
        .post-content h5,
        .post-content h6 {
            margin: 24px 0 16px 0;
            font-weight: 600;
            color: var(--text-primary);
            line-height: 1.3;
        }

        .post-content h1 { font-size: 24px; }
        .post-content h2 { font-size: 20px; }
        .post-content h3 { font-size: 18px; }
        .post-content h4 { font-size: 16px; }

        .post-content img {
            max-width: 100%;
            height: auto;
            margin: 16px 0;
            border-radius: var(--radius-sm);
            border: 1px solid var(--border-color);
            display: block;
        }

        .post-content a {
            color: var(--text-primary);
            text-decoration: none;
            border-bottom: 1px solid var(--border-color);
            transition: all 0.2s;
        }

        .post-content a:hover {
            border-bottom-color: var(--text-primary);
        }

        .post-content ul,
        .post-content ol {
            margin: 16px 0;
            padding-left: 24px;
        }

        .post-content li {
            margin: 8px 0;
        }

        .post-content blockquote,
        .post-content aside.quote {
            background: var(--bg-secondary);
            border-left: 3px solid var(--border-color);
            padding: 12px 16px;
            margin: 16px 0;
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            color: var(--text-secondary);
            font-size: 14px;
        }

        .post-content pre {
            background: var(--bg-tertiary);
            padding: 16px;
            border-radius: var(--radius-sm);
            overflow-x: auto;
            margin: 16px 0;
            border: 1px solid var(--border-color);
            font-size: 13px;
            line-height: 1.5;
        }

        .post-content code {
            background: var(--bg-tertiary);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 13px;
            border: 1px solid var(--border-color);
        }

        .post-content pre code {
            background: transparent;
            padding: 0;
            border: none;
        }

        .post-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
            font-size: 14px;
        }

        .post-content table th,
        .post-content table td {
            padding: 10px 12px;
            text-align: left;
            border: 1px solid var(--border-color);
        }

        .post-content table th {
            background: var(--bg-tertiary);
            font-weight: 600;
        }

        .post-content table tr:nth-child(even) {
            background: var(--bg-secondary);
        }

        .post-content hr {
            border: none;
            border-top: 1px solid var(--border-color);
            margin: 24px 0;
        }

        /* Footer */
        .export-info {
            margin-top: 32px;
            padding: 16px;
            background: var(--bg-primary);
            border-radius: var(--radius-md);
            text-align: center;
            font-size: 13px;
            color: var(--text-tertiary);
            border: 1px solid var(--border-color);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            body {
                padding: 12px;
            }

            .header {
                padding: 20px;
            }

            .header h1 {
                font-size: 22px;
            }

            .post {
                padding: 16px;
            }

            .post-header {
                flex-wrap: wrap;
            }

            .avatar {
                width: 36px;
                height: 36px;
            }

            .topic-info {
                flex-direction: column;
                gap: 8px;
            }
        }

        @media (max-width: 480px) {
            body {
                font-size: 14px;
            }

            .header h1 {
                font-size: 20px;
            }

            .post-content {
                font-size: 14px;
            }
        }

        /* Print Styles */
        @media print {
            body {
                background: white;
                padding: 0;
            }

            .post {
                box-shadow: none;
                border: 1px solid #ddd;
                page-break-inside: avoid;
            }

            .post-content a {
                color: var(--text-primary);
                text-decoration: none;
                border-bottom: none;
            }

            .toolbar {
                display: none !important;
            }
        }

        /* Toolbar Styles */
        .toolbar {
            background: var(--bg-primary);
            padding: 16px;
            border-radius: var(--radius-md);
            margin-bottom: 16px;
            display: flex;
            gap: 12px;
            align-items: center;
            flex-wrap: wrap;
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-sm);
        }

        .search-wrapper {
            flex: 1;
            min-width: 200px;
            position: relative;
        }

        .search-input {
            width: 100%;
            padding: 10px 40px 10px 14px;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            font-size: 14px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            outline: none;
            transition: all 0.2s;
        }

        .search-input::placeholder {
            color: var(--text-tertiary);
        }

        .search-input:focus {
            border-color: var(--accent-color);
            box-shadow: 0 0 0 2px rgba(73, 80, 87, 0.1);
        }

        .search-clear {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--text-tertiary);
            cursor: pointer;
            font-size: 18px;
            padding: 4px;
            line-height: 1;
            display: none;
        }

        .search-clear.visible {
            display: block;
        }

        .search-clear:hover {
            color: var(--text-secondary);
        }

        .theme-toggle {
            display: flex;
            gap: 4px;
            background: var(--bg-secondary);
            padding: 4px;
            border-radius: var(--radius-sm);
            border: 1px solid var(--border-color);
        }

        .theme-btn {
            padding: 6px 12px;
            border: none;
            background: transparent;
            color: var(--text-secondary);
            font-size: 13px;
            cursor: pointer;
            border-radius: 3px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .theme-btn:hover {
            color: var(--text-primary);
            background: var(--hover-bg);
        }

        .theme-btn.active {
            background: var(--bg-primary);
            color: var(--text-primary);
            box-shadow: var(--shadow-sm);
        }

        .no-results {
            background: var(--bg-primary);
            padding: 40px 20px;
            text-align: center;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            display: none;
        }

        .no-results.visible {
            display: block;
        }

        .no-results-icon {
            font-size: 48px;
            margin-bottom: 12px;
            opacity: 0.5;
        }

        .no-results-text {
            font-size: 16px;
            margin-bottom: 16px;
        }

        .show-all-btn {
            padding: 8px 16px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            color: var(--text-primary);
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .show-all-btn:hover {
            background: var(--hover-bg);
        }

        .post.hidden {
            display: none;
        }

        .search-highlight {
            background: #fff3cd;
            padding: 1px 2px;
            border-radius: 2px;
        }

        [data-theme="dark"] .search-highlight {
            background: #5a4b00;
        }

        @media (prefers-color-scheme: dark) {
            :root:not([data-theme="light"]) .search-highlight {
                background: #5a4b00;
            }
        }

        @media (max-width: 768px) {
            .toolbar {
                flex-direction: column;
                align-items: stretch;
            }

            .search-wrapper {
                width: 100%;
            }

            .theme-toggle {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${data.topic.title}</h1>
            <div class="topic-meta">
                ${
                  data.topic.category
                    ? `<span class="category">${data.topic.category}</span>`
                    : ""
                }
                ${data.topic.tags
                  .map((tag) => `<span class="tag">${tag}</span>`)
                  .join("")}
            </div>
            <div class="topic-info">
                <div class="topic-info-item">
                    <span class="topic-info-label">${i18n.t("topicID")}:</span>
                    <span>${data.topic.topicId}</span>
                </div>
                <div class="topic-info-item">
                    <span class="topic-info-label">${i18n.t("posts")}:</span>
                    <span>${data.postCount}</span>
                </div>
                <div class="topic-info-item">
                    <span class="topic-info-label">${i18n.t("source")}:</span>
                    <a href="${data.topic.url}" target="_blank">linux.do</a>
                </div>
            </div>
        </div>

        <div class="toolbar">
            <div class="search-wrapper">
                <input type="text" class="search-input" id="searchInput" placeholder="${i18nStrings.searchPlaceholder}">
                <button class="search-clear" id="searchClear">&times;</button>
            </div>
            <div class="theme-toggle">
                <button class="theme-btn" data-theme="light" title="${i18nStrings.lightTheme}">☀️ ${i18nStrings.lightTheme}</button>
                <button class="theme-btn active" data-theme="auto" title="${i18nStrings.autoTheme}">🌗 ${i18nStrings.autoTheme}</button>
                <button class="theme-btn" data-theme="dark" title="${i18nStrings.darkTheme}">🌙 ${i18nStrings.darkTheme}</button>
            </div>
        </div>

        <div class="no-results" id="noResults">
            <div class="no-results-icon">🔍</div>
            <div class="no-results-text">${i18nStrings.noResults}</div>
            <button class="show-all-btn" id="showAllBtn">${i18nStrings.showAll}</button>
        </div>

        ${cleanedPosts
          .map(
            (post) => `
        <div class="post" id="post-${post.postNumber}" data-author="${post.author.username}" data-content="${post.contentText.replace(/"/g, '&quot;').substring(0, 1000)}">
            <div class="post-header">
                ${
                  post.author.avatarUrl
                    ? `<img src="${post.author.avatarUrl}" alt="${post.author.username}" class="avatar">`
                    : ""
                }
                <div class="author-info">
                    <a href="https://linux.do${
                      post.author.profileUrl
                    }" class="author-name">${post.author.username}</a>
                    <div class="post-date">${post.dateFormatted}</div>
                </div>
                <span class="post-number">#${post.postNumber}</span>
            </div>

            ${
              post.replyTo
                ? `
            <div class="reply-to">
                ↩ ${i18n.t("replyTo")} @${post.replyTo.username}
            </div>
            `
                : ""
            }

            <div class="post-content">
                ${post.content}
            </div>
        </div>
        `
          )
          .join("")}

        <div class="export-info">
            ${i18n.t("exportedFrom")} ${i18n.formatDate(data.exportDate)}
        </div>
    </div>

    <script>
        (function() {
            // Theme switching
            const themeButtons = document.querySelectorAll('.theme-btn');
            const htmlElement = document.documentElement;
            
            function setTheme(theme) {
                themeButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelector('[data-theme="' + theme + '"]').classList.add('active');
                
                if (theme === 'auto') {
                    htmlElement.removeAttribute('data-theme');
                } else {
                    htmlElement.setAttribute('data-theme', theme);
                }
                
                localStorage.setItem('theme', theme);
            }
            
            // Load saved theme
            const savedTheme = localStorage.getItem('theme') || 'auto';
            setTheme(savedTheme);
            
            themeButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    setTheme(this.getAttribute('data-theme'));
                });
            });
            
            // Search functionality
            const searchInput = document.getElementById('searchInput');
            const searchClear = document.getElementById('searchClear');
            const noResults = document.getElementById('noResults');
            const showAllBtn = document.getElementById('showAllBtn');
            const posts = document.querySelectorAll('.post');
            
            let searchTimeout;
            
            function performSearch(query) {
                const normalizedQuery = query.toLowerCase().trim();
                let visibleCount = 0;
                
                posts.forEach(post => {
                    const author = (post.getAttribute('data-author') || '').toLowerCase();
                    const content = (post.getAttribute('data-content') || '').toLowerCase();
                    const postContent = post.querySelector('.post-content');
                    const originalContent = postContent.getAttribute('data-original') || postContent.innerHTML;
                    
                    // Store original content
                    if (!postContent.getAttribute('data-original')) {
                        postContent.setAttribute('data-original', postContent.innerHTML);
                    }
                    
                    if (!normalizedQuery) {
                        post.classList.remove('hidden');
                        postContent.innerHTML = originalContent;
                        visibleCount++;
                        return;
                    }
                    
                    const matches = author.includes(normalizedQuery) || content.includes(normalizedQuery);
                    
                    if (matches) {
                        post.classList.remove('hidden');
                        visibleCount++;
                    } else {
                        post.classList.add('hidden');
                    }
                });
                
                // Show/hide no results message
                if (visibleCount === 0 && normalizedQuery) {
                    noResults.classList.add('visible');
                } else {
                    noResults.classList.remove('visible');
                }
                
                // Show/hide clear button
                if (query) {
                    searchClear.classList.add('visible');
                } else {
                    searchClear.classList.remove('visible');
                }
            }
            
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    performSearch(this.value);
                }, 200);
            });
            
            searchClear.addEventListener('click', function() {
                searchInput.value = '';
                performSearch('');
                searchInput.focus();
            });
            
            showAllBtn.addEventListener('click', function() {
                searchInput.value = '';
                performSearch('');
            });
            
            // Keyboard shortcut: Ctrl/Cmd + F to focus search
            document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                    e.preventDefault();
                    searchInput.focus();
                    searchInput.select();
                }
            });
        })();
    </script>
</body>
</html>`;

    return html;
  }

  // Download file
  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Show progress indicator
  function showProgress(message) {
    let progressDiv = document.getElementById("export-progress");
    if (!progressDiv) {
      progressDiv = document.createElement("div");
      progressDiv.id = "export-progress";
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
    progressDiv.style.display = "block";
  }

  function hideProgress() {
    const progressDiv = document.getElementById("export-progress");
    if (progressDiv) {
      progressDiv.style.opacity = "0";
      progressDiv.style.transition = "opacity 0.3s";
      setTimeout(() => {
        progressDiv.style.display = "none";
        progressDiv.style.opacity = "1";
      }, 300);
    }
  }

  // Create language selector
  function createLanguageSelector() {
    const languages = i18n.getAvailableLanguages();
    const currentLang = i18n.currentLang;

    const selector = document.createElement("div");
    selector.className = "language-selector";
    selector.innerHTML = `
            <select id="language-select">
                ${languages
                  .map(
                    (lang) => `
                    <option value="${lang.code}" ${
                      lang.code === currentLang ? "selected" : ""
                    }>
                        ${lang.name}
                    </option>
                `
                  )
                  .join("")}
            </select>
        `;

    const select = selector.querySelector("#language-select");
    select.addEventListener("change", (e) => {
      const newLang = e.target.value;
      if (i18n.setLanguage(newLang)) {
        // Refresh UI
        updateUILanguage();
        showProgress(i18n.t("scriptInitialized"));
        setTimeout(hideProgress, 2000);
      }
    });

    return selector;
  }

  // Update UI language
  function updateUILanguage() {
    const jsonBtn = document.getElementById("export-json");
    const htmlBtn = document.getElementById("export-html");
    const embedLabel = document.querySelector('label[for="embed-images"]');

    if (jsonBtn)
      jsonBtn.querySelector("span:last-child").textContent =
        i18n.t("exportJSON");
    if (htmlBtn)
      htmlBtn.querySelector("span:last-child").textContent =
        i18n.t("exportHTML");
    if (embedLabel) embedLabel.textContent = i18n.t("embedImages");
  }

  // Create export button with modern design
  function createExportButton() {
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "export-button-container";
    buttonContainer.innerHTML = `
            <style>
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                #export-controls {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }

                .export-btn {
                    background: #1a1a1a;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    white-space: nowrap;
                    min-width: 160px;
                    justify-content: center;
                }

                .export-btn:hover {
                    background: #2d2d2d;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    transform: translateY(-1px);
                }

                .export-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                }

                .export-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .checkbox-wrapper {
                    background: white;
                    padding: 10px 16px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    color: #1a1a1a;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: 1px solid #e9ecef;
                }

                .checkbox-wrapper:hover {
                    background: #f8f9fa;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
                }

                .checkbox-wrapper input[type="checkbox"] {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                    margin: 0;
                }

                .checkbox-wrapper label {
                    cursor: pointer;
                    user-select: none;
                    font-weight: 500;
                }

                .language-selector {
                    background: white;
                    padding: 8px 12px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e9ecef;
                }

                .language-selector select {
                    width: 100%;
                    border: none;
                    background: transparent;
                    font-size: 13px;
                    font-weight: 500;
                    color: #1a1a1a;
                    cursor: pointer;
                    outline: none;
                    font-family: inherit;
                }

                @media (max-width: 768px) {
                    #export-controls {
                        bottom: 16px;
                        right: 16px;
                    }

                    .export-btn {
                        padding: 10px 16px;
                        font-size: 12px;
                        min-width: 140px;
                    }

                    .checkbox-wrapper {
                        padding: 8px 12px;
                        font-size: 12px;
                    }

                    .language-selector {
                        padding: 6px 10px;
                    }

                    .language-selector select {
                        font-size: 12px;
                    }
                }
            </style>
            <div id="export-controls">
                <button id="export-json" class="export-btn">
                    <span>📄</span>
                    <span>${i18n.t("exportJSON")}</span>
                </button>
                <button id="export-html" class="export-btn">
                    <span>🌐</span>
                    <span>${i18n.t("exportHTML")}</span>
                </button>
                <label class="checkbox-wrapper">
                    <input type="checkbox" id="embed-images" checked>
                    <label for="embed-images">${i18n.t("embedImages")}</label>
                </label>
            </div>
        `;
    document.body.appendChild(buttonContainer);

    // Add language selector
    const langSelector = createLanguageSelector();
    document.getElementById("export-controls").appendChild(langSelector);

    // Add event listeners
    document
      .getElementById("export-json")
      .addEventListener("click", async () => {
        const btn = document.getElementById("export-json");
        const embedImages = document.getElementById("embed-images").checked;

        btn.disabled = true;

        if (embedImages) {
          showProgress(i18n.t("convertingImagesJSON"));
        } else {
          showProgress(i18n.t("exportingJSON"));
        }

        try {
          const data = await extractAllPosts(embedImages);
          const json = generateJSON(data);
          const filename = `linux-do-topic-${
            data.topic.topicId
          }-${Date.now()}.json`;
          downloadFile(json, filename, "application/json");
          showProgress(i18n.t("jsonExportCompleted"));
          setTimeout(hideProgress, 2000);
        } catch (error) {
          console.error("Export failed:", error);
          showProgress(i18n.t("exportFailed") + error.message);
          setTimeout(hideProgress, 3000);
        } finally {
          btn.disabled = false;
        }
      });

    document
      .getElementById("export-html")
      .addEventListener("click", async () => {
        const btn = document.getElementById("export-html");
        const embedImages = document.getElementById("embed-images").checked;

        btn.disabled = true;

        if (embedImages) {
          showProgress(i18n.t("convertingImages"));
        } else {
          showProgress(i18n.t("exportingHTML"));
        }

        try {
          const data = await extractAllPosts(embedImages);
          const html = generateHTML(data);
          const filename = `linux-do-topic-${
            data.topic.topicId
          }-${Date.now()}.html`;
          downloadFile(html, filename, "text/html");
          showProgress(i18n.t("htmlExportCompleted"));
          setTimeout(hideProgress, 2000);
        } catch (error) {
          console.error("Export failed:", error);
          showProgress(i18n.t("exportFailed") + error.message);
          setTimeout(hideProgress, 3000);
        } finally {
          btn.disabled = false;
        }
      });
  }

  // Initialize the exporter
  async function init() {
    showProgress(i18n.t("loadingPosts"));
    await waitForPosts();
    hideProgress();
    createExportButton();
    console.log(i18n.t("scriptInitialized") + " v2.2.0");
  }

  // Start the script
  init();
})();
