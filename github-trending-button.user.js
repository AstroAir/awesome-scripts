// ==UserScript==
// @name         GitHub Trending Button Enhanced
// @namespace    https://github.com/wenyuanw
// @version      2.0.0
// @description  Enhanced trending button with language filter, favorites, and quick access
// @author       wenyuan
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// ==/UserScript==

(function () {
  "use strict";

  // ==================== 配置 ====================
  const CONFIG = {
    BUTTON_ID: "trending-button",
    DROPDOWN_ID: "trending-dropdown",
    SETTINGS_KEY: "trending_settings",
    FAVORITES_KEY: "trending_favorites",
    RECENT_KEY: "trending_recent",
  };

  const DEFAULT_SETTINGS = {
    defaultLanguage: "",
    defaultPeriod: "daily",
    showRecent: true,
    maxRecent: 5,
    openInNewTab: false,
  };

  // 热门编程语言列表
  const POPULAR_LANGUAGES = [
    { name: "All Languages", value: "", icon: "🌐", category: "all" },
    { name: "JavaScript", value: "javascript", icon: "📜", category: "web" },
    { name: "TypeScript", value: "typescript", icon: "📘", category: "web" },
    { name: "Python", value: "python", icon: "🐍", category: "general" },
    { name: "Java", value: "java", icon: "☕", category: "general" },
    { name: "C++", value: "c++", icon: "⚙️", category: "systems" },
    { name: "C", value: "c", icon: "🔧", category: "systems" },
    { name: "C#", value: "c%23", icon: "🎯", category: "general" },
    { name: "Go", value: "go", icon: "🐹", category: "systems" },
    { name: "Rust", value: "rust", icon: "🦀", category: "systems" },
    { name: "PHP", value: "php", icon: "🐘", category: "web" },
    { name: "Ruby", value: "ruby", icon: "💎", category: "web" },
    { name: "Swift", value: "swift", icon: "🍎", category: "mobile" },
    { name: "Kotlin", value: "kotlin", icon: "🤖", category: "mobile" },
    { name: "Dart", value: "dart", icon: "🎯", category: "mobile" },
    { name: "Shell", value: "shell", icon: "🐚", category: "systems" },
    { name: "Vue", value: "vue", icon: "💚", category: "web" },
    {
      name: "React",
      value: "javascript",
      icon: "⚛️",
      category: "web",
      search: "react",
    },
    { name: "HTML", value: "html", icon: "🌐", category: "web" },
    { name: "CSS", value: "css", icon: "🎨", category: "web" },
  ];

  const TIME_PERIODS = [
    { name: "Today", value: "daily", icon: "📅" },
    { name: "This Week", value: "weekly", icon: "📆" },
    { name: "This Month", value: "monthly", icon: "📊" },
  ];

  const CATEGORIES = {
    all: { name: "Popular", icon: "⭐" },
    web: { name: "Web", icon: "🌐" },
    mobile: { name: "Mobile", icon: "📱" },
    systems: { name: "Systems", icon: "⚙️" },
    general: { name: "General", icon: "💻" },
  };

  // ==================== 存储管理 ====================
  class Storage {
    static get(key, defaultValue) {
      try {
        const value = GM_getValue(key);
        return value !== undefined ? JSON.parse(value) : defaultValue;
      } catch {
        return defaultValue;
      }
    }

    static set(key, value) {
      GM_setValue(key, JSON.stringify(value));
    }

    static getSettings() {
      return this.get(CONFIG.SETTINGS_KEY, DEFAULT_SETTINGS);
    }

    static setSettings(settings) {
      this.set(CONFIG.SETTINGS_KEY, { ...DEFAULT_SETTINGS, ...settings });
    }

    static getFavorites() {
      return this.get(CONFIG.FAVORITES_KEY, []);
    }

    static toggleFavorite(language) {
      const favorites = this.getFavorites();
      const index = favorites.indexOf(language);
      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push(language);
      }
      this.set(CONFIG.FAVORITES_KEY, favorites);
      return index === -1; // 返回是否添加
    }

    static getRecent() {
      return this.get(CONFIG.RECENT_KEY, []);
    }

    static addRecent(language) {
      const settings = this.getSettings();
      if (!settings.showRecent) return;

      const recent = this.getRecent();
      // 移除重复项
      const filtered = recent.filter((item) => item.language !== language);
      // 添加到开头
      filtered.unshift({
        language: language,
        timestamp: Date.now(),
      });
      // 限制数量
      const limited = filtered.slice(0, settings.maxRecent);
      this.set(CONFIG.RECENT_KEY, limited);
    }

    static clearRecent() {
      this.set(CONFIG.RECENT_KEY, []);
    }
  }

  // ==================== UI 组件 ====================
  function createIcon() {
    return `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-graph">
                <path d="M1.5 1.75V13.5h13.75a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75V1.75a.75.75 0 0 1 1.5 0Zm14.28 2.53-5.25 5.25a.75.75 0 0 1-1.06 0L7 7.06 4.28 9.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.06 0L10 7.94l4.72-4.72a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>
            </svg>
        `;
  }

  function createSearchBox() {
    return `
            <div style="padding: 12px 16px; border-bottom: 1px solid var(--borderColor-default, #d0d7de);">
                <input type="text"
                    id="trending-search"
                    placeholder="Search languages..."
                    style="
                        width: 100%;
                        padding: 6px 12px;
                        border: 1px solid var(--borderColor-default, #d0d7de);
                        border-radius: 6px;
                        background: var(--bgColor-default);
                        color: var(--fgColor-default);
                        font-size: 13px;
                        outline: none;
                    "
                    onkeydown="if(event.key==='Escape') this.value=''; if(event.key==='Escape' || event.key==='Enter') this.dispatchEvent(new Event('input', {bubbles: true}));"
                />
            </div>
        `;
  }

  function createCategoryTabs() {
    return `
            <div style="padding: 8px 16px; border-bottom: 1px solid var(--borderColor-default, #d0d7de); overflow-x: auto; white-space: nowrap;">
                <div style="display: inline-flex; gap: 4px;">
                    ${Object.entries(CATEGORIES)
                      .map(
                        ([key, cat]) => `
                        <button class="category-tab" data-category="${key}" style="
                            padding: 4px 12px;
                            border: 1px solid var(--borderColor-default, #d0d7de);
                            border-radius: 6px;
                            background: ${
                              key === "all"
                                ? "var(--bgColor-emphasis)"
                                : "transparent"
                            };
                            color: ${
                              key === "all"
                                ? "var(--fgColor-onEmphasis)"
                                : "var(--fgColor-default)"
                            };
                            font-size: 12px;
                            cursor: pointer;
                            transition: all 0.2s;
                            white-space: nowrap;
                        " onmouseover="if(this.dataset.active!=='true') this.style.background='var(--bgColor-muted)'" onmouseout="if(this.dataset.active!=='true') this.style.background='transparent'">
                            ${cat.icon} ${cat.name}
                        </button>
                    `
                      )
                      .join("")}
                </div>
            </div>
        `;
  }

  function createLanguageLink(lang, isFavorite, showCategory = false, period = "daily") {
    const params = new URLSearchParams();
    if (period && period !== "daily") params.set("since", period);
    if (lang.search) params.set("q", lang.search);
    const queryString = params.toString();
    return `
            <a href="/trending/${lang.value}${queryString ? "?" + queryString : ""}"
                class="trending-lang-link"
                data-lang="${lang.value}"
                data-category="${lang.category}"
                style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 12px;
                    margin: 2px 0;
                    border-radius: 6px;
                    text-decoration: none;
                    color: var(--fgColor-default);
                    font-size: 13px;
                    transition: background 0.2s;
                "
                onmouseover="this.style.background='var(--bgColor-muted)'"
                onmouseout="this.style.background='transparent'">
                <span style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">${lang.icon}</span>
                    <span>${lang.name}</span>
                    ${
                      showCategory
                        ? `<span style="font-size: 10px; color: var(--fgColor-muted); opacity: 0.7;">${
                            CATEGORIES[lang.category].name
                          }</span>`
                        : ""
                    }
                </span>
                <span class="favorite-star"
                    data-lang="${lang.value}"
                    style="
                        cursor: pointer;
                        font-size: 14px;
                        opacity: ${isFavorite ? 1 : 0.3};
                        transition: all 0.2s;
                        padding: 0 4px;
                    "
                    onmouseover="this.style.opacity='1'; this.style.transform='scale(1.2)'"
                    onmouseout="this.style.opacity='${
                      isFavorite ? 1 : 0.3
                    }'; this.style.transform='scale(1)'"
                    title="${
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }"
                >${isFavorite ? "⭐" : "☆"}</span>
            </a>
        `;
  }

  function createDropdown() {
    const settings = Storage.getSettings();
    const favorites = Storage.getFavorites();
    const recent = Storage.getRecent();

    const dropdown = document.createElement("div");
    dropdown.id = CONFIG.DROPDOWN_ID;
    dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 8px;
            background: var(--overlay-bgColor, #ffffff);
            border: 1px solid var(--borderColor-default, #d0d7de);
            border-radius: 12px;
            box-shadow: var(--shadow-floating-large, 0 8px 24px rgba(140,149,159,0.2));
            min-width: 360px;
            max-width: 400px;
            max-height: 600px;
            overflow-y: auto;
            z-index: 9999;
            display: none;
        `;

    let content = "";

    // 标题和时间段选择
    content += `
            <div style="padding: 16px; border-bottom: 1px solid var(--borderColor-default, #d0d7de);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <strong style="font-size: 15px; display: flex; align-items: center; gap: 8px;">
                        ${createIcon()}
                        <span>Trending</span>
                    </strong>
                    <button id="trending-settings-btn" style="
                        padding: 4px 8px;
                        border: 1px solid var(--borderColor-default, #d0d7de);
                        border-radius: 6px;
                        background: transparent;
                        color: var(--fgColor-muted);
                        font-size: 12px;
                        cursor: pointer;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='var(--bgColor-muted)'" onmouseout="this.style.background='transparent'" title="Settings">⚙️</button>
                </div>
                <div style="display: flex; gap: 6px;">
                    ${TIME_PERIODS.map((period) => {
                      const isActive = period.value === settings.defaultPeriod;
                      return `
                            <button class="period-btn" data-period="${
                              period.value
                            }" style="
                                flex: 1;
                                padding: 8px 12px;
                                border: 1px solid var(--borderColor-default, #d0d7de);
                                border-radius: 6px;
                                background: ${
                                  isActive
                                    ? "var(--bgColor-emphasis)"
                                    : "transparent"
                                };
                                color: ${
                                  isActive
                                    ? "var(--fgColor-onEmphasis)"
                                    : "var(--fgColor-default)"
                                };
                                font-size: 12px;
                                font-weight: ${isActive ? "600" : "400"};
                                cursor: pointer;
                                transition: all 0.2s;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 4px;
                            " ${
                              isActive ? 'data-active="true"' : ""
                            } onmouseover="if(this.dataset.active!=='true') this.style.background='var(--bgColor-muted)'" onmouseout="if(this.dataset.active!=='true') this.style.background='transparent'">
                                <span>${period.icon}</span>
                                <span>${period.name}</span>
                            </button>
                        `;
                    }).join("")}
                </div>
            </div>
        `;

    // 搜索框
    content += createSearchBox();

    // 最近访问
    if (settings.showRecent && recent.length > 0) {
      content += `
                <div style="padding: 12px 16px; border-bottom: 1px solid var(--borderColor-default, #d0d7de);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <div style="font-size: 12px; font-weight: 600; color: var(--fgColor-muted);">🕐 Recent</div>
                        <button class="clear-recent-btn" style="
                            padding: 2px 8px;
                            border: none;
                            background: transparent;
                            color: var(--fgColor-muted);
                            font-size: 11px;
                            cursor: pointer;
                            border-radius: 4px;
                            transition: background 0.2s;
                        " onmouseover="this.style.background='var(--bgColor-muted)'" onmouseout="this.style.background='transparent'" title="Clear recent">Clear</button>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${recent
                          .map((item) => {
                            const lang = POPULAR_LANGUAGES.find(
                              (l) => l.value === item.language
                            );
                            if (!lang) return "";
                            const recentParams = new URLSearchParams();
                            if (settings.defaultPeriod && settings.defaultPeriod !== "daily") recentParams.set("since", settings.defaultPeriod);
                            const recentQuery = recentParams.toString();
                            return `
                                <a href="/trending/${lang.value}${recentQuery ? "?" + recentQuery : ""}"
                                    class="trending-lang-link recent-chip"
                                    data-lang="${lang.value}"
                                    style="
                                        display: inline-flex;
                                        align-items: center;
                                        gap: 4px;
                                        padding: 4px 10px;
                                        border: 1px solid var(--borderColor-default, #d0d7de);
                                        border-radius: 12px;
                                        text-decoration: none;
                                        color: var(--fgColor-default);
                                        font-size: 12px;
                                        background: var(--bgColor-muted);
                                        transition: all 0.2s;
                                    "
                                    onmouseover="this.style.background='var(--bgColor-emphasis)'; this.style.color='var(--fgColor-onEmphasis)'; this.style.borderColor='transparent'"
                                    onmouseout="this.style.background='var(--bgColor-muted)'; this.style.color='var(--fgColor-default)'; this.style.borderColor='var(--borderColor-default)'">
                                    <span>${lang.icon}</span>
                                    <span>${lang.name}</span>
                                </a>
                            `;
                          })
                          .join("")}
                    </div>
                </div>
            `;
    }

    // 收藏夹
    if (favorites.length > 0) {
      content += `
                <div style="padding: 12px 16px; border-bottom: 1px solid var(--borderColor-default, #d0d7de);">
                    <div style="font-size: 12px; font-weight: 600; color: var(--fgColor-muted); margin-bottom: 8px;">⭐ Favorites</div>
                    <div id="favorites-list">
                        ${favorites
                          .map((langValue) => {
                            const lang = POPULAR_LANGUAGES.find(
                              (l) => l.value === langValue
                            );
                            return lang ? createLanguageLink(lang, true, false, settings.defaultPeriod) : "";
                          })
                          .join("")}
                    </div>
                </div>
            `;
    }

    // 分类标签
    content += createCategoryTabs();

    // 语言列表
    content += `
            <div style="padding: 12px 16px;">
                <div id="languages-list">
                    ${POPULAR_LANGUAGES.map((lang) =>
                      createLanguageLink(lang, favorites.includes(lang.value), false, settings.defaultPeriod)
                    ).join("")}
                </div>
                <div id="no-results" style="
                    display: none;
                    padding: 20px;
                    text-align: center;
                    color: var(--fgColor-muted);
                    font-size: 13px;
                ">
                    <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
                    <div>No languages found</div>
                </div>
            </div>
        `;

    // 快捷键提示
    content += `
            <div style="border-top: 1px solid var(--borderColor-default, #d0d7de); padding: 10px 16px; font-size: 11px; color: var(--fgColor-muted);">
                <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <span>💡 <kbd style="padding: 2px 6px; border: 1px solid var(--borderColor-default); border-radius: 3px; background: var(--bgColor-muted); font-family: monospace;">Alt+T</kbd> Quick open</span>
                    <span><kbd style="padding: 2px 6px; border: 1px solid var(--borderColor-default); border-radius: 3px; background: var(--bgColor-muted); font-family: monospace;">ESC</kbd> Close</span>
                </div>
            </div>
        `;

    dropdown.innerHTML = content;
    return dropdown;
  }

  function updateLanguageLinksWithPeriod(dropdown, period) {
    // 更新所有语言链接的 href
    dropdown.querySelectorAll(".trending-lang-link").forEach((link) => {
      const langValue = link.dataset.lang;
      const lang = POPULAR_LANGUAGES.find((l) => l.value === langValue);
      if (!lang) return;

      const params = new URLSearchParams();
      if (period && period !== "daily") params.set("since", period);
      if (lang.search) params.set("q", lang.search);
      const queryString = params.toString();
      link.href = `/trending/${lang.value}${queryString ? "?" + queryString : ""}`;
    });
  }

  function updateDropdown(dropdown) {
    const settings = Storage.getSettings();
    const favorites = Storage.getFavorites();
    // 获取当前选中的时间段
    const activePeriodBtn = dropdown.querySelector(".period-btn[data-active='true']");
    const currentPeriod = activePeriodBtn ? activePeriodBtn.dataset.period : settings.defaultPeriod;

    // 更新收藏列表
    const favoritesList = dropdown.querySelector("#favorites-list");
    if (favoritesList) {
      favoritesList.innerHTML = favorites
        .map((langValue) => {
          const lang = POPULAR_LANGUAGES.find((l) => l.value === langValue);
          return lang ? createLanguageLink(lang, true, false, currentPeriod) : "";
        })
        .join("");
    }

    // 更新语言列表中的星标
    dropdown.querySelectorAll(".favorite-star").forEach((star) => {
      const lang = star.dataset.lang;
      const isFavorite = favorites.includes(lang);
      star.textContent = isFavorite ? "⭐" : "☆";
      star.style.opacity = isFavorite ? "1" : "0.3";
      star.title = isFavorite ? "Remove from favorites" : "Add to favorites";
    });

    // 确保所有链接都有正确的时间范围参数
    updateLanguageLinksWithPeriod(dropdown, currentPeriod);
  }

  function setupDropdownEvents(dropdown, container) {
    const settings = Storage.getSettings();

    // 搜索功能
    const searchInput = dropdown.querySelector("#trending-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const languagesList = dropdown.querySelector("#languages-list");
        const noResults = dropdown.querySelector("#no-results");
        const links = languagesList.querySelectorAll(".trending-lang-link");

        let visibleCount = 0;
        links.forEach((link) => {
          const lang = link.textContent.toLowerCase();
          const matches = lang.includes(query);
          link.style.display = matches ? "flex" : "none";
          if (matches) visibleCount++;
        });

        noResults.style.display =
          visibleCount === 0 && query ? "block" : "none";
        languagesList.style.display =
          visibleCount === 0 && query ? "none" : "block";
      });

      // 聚焦搜索框
      searchInput.focus();
    }

    // 分类筛选
    dropdown.querySelectorAll(".category-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.stopPropagation();
        const category = tab.dataset.category;

        // 更新标签样式
        dropdown.querySelectorAll(".category-tab").forEach((t) => {
          const isActive = t.dataset.category === category;
          t.style.background = isActive
            ? "var(--bgColor-emphasis)"
            : "transparent";
          t.style.color = isActive
            ? "var(--fgColor-onEmphasis)"
            : "var(--fgColor-default)";
          t.dataset.active = isActive;
        });

        // 筛选语言
        const links = dropdown.querySelectorAll(
          "#languages-list .trending-lang-link"
        );
        links.forEach((link) => {
          if (category === "all") {
            link.style.display = "flex";
          } else {
            link.style.display =
              link.dataset.category === category ? "flex" : "none";
          }
        });

        // 清空搜索
        if (searchInput) searchInput.value = "";
      });
    });

    // 时间段切换
    dropdown.querySelectorAll(".period-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const period = btn.dataset.period;
        const newSettings = { ...settings, defaultPeriod: period };
        Storage.setSettings(newSettings);

        dropdown.querySelectorAll(".period-btn").forEach((b) => {
          const isActive = b.dataset.period === period;
          b.style.background = isActive
            ? "var(--bgColor-emphasis)"
            : "transparent";
          b.style.color = isActive
            ? "var(--fgColor-onEmphasis)"
            : "var(--fgColor-default)";
          b.style.fontWeight = isActive ? "600" : "400";
          b.dataset.active = isActive;
        });

        // 更新所有语言链接的 URL
        updateLanguageLinksWithPeriod(dropdown, period);
      });
    });

    // 收藏切换
    dropdown.addEventListener("click", (e) => {
      if (e.target.classList.contains("favorite-star")) {
        e.preventDefault();
        e.stopPropagation();
        const lang = e.target.dataset.lang;
        Storage.toggleFavorite(lang);
        updateDropdown(dropdown);
      }

      // 语言链接点击
      if (e.target.closest(".trending-lang-link")) {
        const link = e.target.closest(".trending-lang-link");
        const lang = link.dataset.lang;
        Storage.addRecent(lang);

        if (settings.openInNewTab) {
          e.preventDefault();
          window.open(link.href, "_blank");
        }
      }

      // 清除最近访问
      if (e.target.classList.contains("clear-recent-btn")) {
        e.preventDefault();
        e.stopPropagation();
        Storage.clearRecent();
        // 重新创建下拉菜单
        const newDropdown = createDropdown();
        setupDropdownEvents(newDropdown, container);
        dropdown.replaceWith(newDropdown);
        container.querySelector("#" + CONFIG.DROPDOWN_ID).style.display =
          "block";
      }

      // 设置按钮
      if (
        e.target.id === "trending-settings-btn" ||
        e.target.closest("#trending-settings-btn")
      ) {
        e.preventDefault();
        e.stopPropagation();
        showSettingsDialog();
      }
    });

    // ESC 键关闭
    const escHandler = (e) => {
      if (e.key === "Escape") {
        dropdown.style.display = "none";
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
  }

  function showSettingsDialog() {
    const settings = Storage.getSettings();

    const dialog = document.createElement("div");
    dialog.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

    dialog.innerHTML = `
            <div style="
                background: var(--overlay-bgColor, #ffffff);
                border: 1px solid var(--borderColor-default, #d0d7de);
                border-radius: 12px;
                padding: 24px;
                min-width: 400px;
                max-width: 500px;
                box-shadow: var(--shadow-floating-large, 0 16px 32px rgba(0,0,0,0.12));
            ">
                <h3 style="margin: 0 0 20px 0; font-size: 18px; display: flex; align-items: center; gap: 8px;">
                    <span>⚙️</span>
                    <span>Settings</span>
                </h3>

                <div style="margin-bottom: 16px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; border-radius: 6px; transition: background 0.2s;" onmouseover="this.style.background='var(--bgColor-muted)'" onmouseout="this.style.background='transparent'">
                        <input type="checkbox" id="setting-show-recent" ${
                          settings.showRecent ? "checked" : ""
                        } style="cursor: pointer;">
                        <span style="font-size: 14px;">Show recent languages</span>
                    </label>
                </div>

                <div style="margin-bottom: 16px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; border-radius: 6px; transition: background 0.2s;" onmouseover="this.style.background='var(--bgColor-muted)'" onmouseout="this.style.background='transparent'">
                        <input type="checkbox" id="setting-open-new-tab" ${
                          settings.openInNewTab ? "checked" : ""
                        } style="cursor: pointer;">
                        <span style="font-size: 14px;">Open links in new tab</span>
                    </label>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--fgColor-muted);">
                        Max recent items (1-10):
                    </label>
                    <input type="number" id="setting-max-recent" min="1" max="10" value="${
                      settings.maxRecent
                    }" style="
                        width: 100%;
                        padding: 8px 12px;
                        border: 1px solid var(--borderColor-default, #d0d7de);
                        border-radius: 6px;
                        background: var(--bgColor-default);
                        color: var(--fgColor-default);
                        font-size: 14px;
                    ">
                </div>

                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button id="settings-cancel" style="
                        padding: 8px 16px;
                        border: 1px solid var(--borderColor-default, #d0d7de);
                        border-radius: 6px;
                        background: transparent;
                        color: var(--fgColor-default);
                        font-size: 14px;
                        cursor: pointer;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='var(--bgColor-muted)'" onmouseout="this.style.background='transparent'">
                        Cancel
                    </button>
                    <button id="settings-save" style="
                        padding: 8px 16px;
                        border: none;
                        border-radius: 6px;
                        background: var(--bgColor-emphasis);
                        color: var(--fgColor-onEmphasis);
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: opacity 0.2s;
                    " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                        Save
                    </button>
                </div>
            </div>
        `;

    document.body.appendChild(dialog);

    dialog.querySelector("#settings-cancel").addEventListener("click", () => {
      dialog.remove();
    });

    dialog.querySelector("#settings-save").addEventListener("click", () => {
      const newSettings = {
        ...settings,
        showRecent: dialog.querySelector("#setting-show-recent").checked,
        openInNewTab: dialog.querySelector("#setting-open-new-tab").checked,
        maxRecent:
          parseInt(dialog.querySelector("#setting-max-recent").value) || 5,
      };
      Storage.setSettings(newSettings);
      dialog.remove();

      // 刷新下拉菜单
      const existingDropdown = document.getElementById(CONFIG.DROPDOWN_ID);
      if (existingDropdown) {
        const container = existingDropdown.parentElement;
        const wasVisible = existingDropdown.style.display === "block";
        existingDropdown.remove();
        const newDropdown = createDropdown();
        container.appendChild(newDropdown);
        setupDropdownEvents(newDropdown, container);
        if (wasVisible) newDropdown.style.display = "block";
      }
    });

    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        dialog.remove();
      }
    });
  }

  function addTrendingButton() {
    const actionsContainer = document.querySelector(".AppHeader-actions");
    if (!actionsContainer) return false;

    if (document.getElementById(CONFIG.BUTTON_ID)) return true;

    // 创建容器
    const container = document.createElement("div");
    container.style.cssText =
      "position: relative; display: flex; align-items: center;";

    // 创建按钮
    const trendingButton = document.createElement("button");
    trendingButton.id = CONFIG.BUTTON_ID;
    trendingButton.className =
      "Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted";
    trendingButton.setAttribute("aria-label", "Trending repositories");
    trendingButton.innerHTML = createIcon();

    // 创建下拉菜单
    const dropdown = createDropdown();

    // 按钮点击事件
    trendingButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const isVisible = dropdown.style.display === "block";

      if (isVisible) {
        dropdown.style.display = "none";
      } else {
        dropdown.style.display = "block";
        // 重新设置事件（因为下拉菜单可能被重新创建）
        setupDropdownEvents(dropdown, container);
      }
    });

    // 点击外部关闭
    document.addEventListener("click", (e) => {
      if (!container.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });

    // 组装元素
    container.appendChild(trendingButton);
    container.appendChild(dropdown);

    const refNode =
      actionsContainer.querySelector("notification-indicator") ||
      actionsContainer.querySelector(".AppHeader-user");
    if (refNode) {
      actionsContainer.insertBefore(container, refNode);
    } else {
      actionsContainer.appendChild(container);
    }

    return true;
  }

  // ==================== 快捷键 ====================
  function setupKeyboardShortcuts() {
    const settings = Storage.getSettings();

    document.addEventListener("keydown", (e) => {
      // Alt+T 打开默认 Trending
      if (e.altKey && e.key === "t" && !e.shiftKey) {
        e.preventDefault();
        const lang = settings.defaultLanguage || "";
        const period = settings.defaultPeriod || "daily";
        const url = `/trending/${lang}?since=${period}`;
        if (settings.openInNewTab) {
          window.open(url, "_blank");
        } else {
          window.location.href = url;
        }
      }

      // Alt+Shift+T 打开下拉菜单
      if (e.altKey && e.shiftKey && e.key === "T") {
        e.preventDefault();
        const button = document.getElementById(CONFIG.BUTTON_ID);
        if (button) button.click();
      }
    });
  }

  // ==================== 菜单命令 ====================
  function setupMenuCommands() {
    GM_registerMenuCommand("⚙️ Settings", () => {
      showSettingsDialog();
    });

    GM_registerMenuCommand("⭐ Manage Favorites", () => {
      const favorites = Storage.getFavorites();
      const favoriteNames = favorites
        .map((val) => {
          const lang = POPULAR_LANGUAGES.find((l) => l.value === val);
          return lang ? lang.name : val;
        })
        .join(", ");

      alert(
        `Favorites (${favorites.length}):\n\n${
          favoriteNames || "No favorites yet"
        }\n\nClick the star icon next to any language to add/remove favorites.`
      );
    });

    GM_registerMenuCommand("🗑️ Clear All Data", () => {
      if (confirm("Clear all data including favorites and recent languages?")) {
        Storage.set(CONFIG.FAVORITES_KEY, []);
        Storage.set(CONFIG.RECENT_KEY, []);
        Storage.set(CONFIG.SETTINGS_KEY, DEFAULT_SETTINGS);
        alert("All data cleared! Please refresh the page.");
      }
    });

    GM_registerMenuCommand("ℹ️ About", () => {
      alert(
        `GitHub Trending Button Enhanced v2.0.0\n\nFeatures:\n• Quick access to trending repositories\n• Filter by language and time period\n• Favorites system\n• Recent languages tracking\n• Keyboard shortcuts (Alt+T, Alt+Shift+T)\n• Search languages\n• Category filtering\n\nMade with ❤️`
      );
    });
  }

  // ==================== 主函数 ====================
  function main() {
    if (!addTrendingButton()) {
      const observer = new MutationObserver((mutations, obs) => {
        if (addTrendingButton()) {
          obs.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => observer.disconnect(), 5000);
    }
  }

  // 初始化
  main();
  setupKeyboardShortcuts();
  setupMenuCommands();

  // Turbo 支持
  document.addEventListener("turbo:load", main);
  document.addEventListener("turbo:render", main);
})();
