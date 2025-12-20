// ==UserScript==
// @name        GitHub Trending Button Enhanced
// @description Enhanced trending button with language filter, favorites, and quick access
// @version     2.0.0
// @author      AstroAir
// @match       https://github.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @icon        https://github.githubassets.com/favicons/favicon.svg
// @license     MIT
// @namespace   https://github.com/AstroAir
// @run-at      document-end
// ==/UserScript==

(()=>{"use strict";function e(e,t={}){const{className:n,id:a,attrs:r={},styles:o={},text:i,html:d,children:s=[],events:l={}}=t,c=document.createElement(e);n&&(Array.isArray(n)?c.classList.add(...n):c.className=n),a&&(c.id=a);for(const[e,t]of Object.entries(r))c.setAttribute(e,t);for(const[e,t]of Object.entries(o))c.style[e]=t;i&&(c.textContent=i),d&&(c.innerHTML=d);for(const e of s)e instanceof Element?c.appendChild(e):"string"==typeof e&&c.appendChild(document.createTextNode(e));for(const[e,t]of Object.entries(l))c.addEventListener(e,t);return c}function t(e,t=document){return t.querySelector(e)}function n(e,t=document){return Array.from(t.querySelectorAll(e))}const a=(function(e,...t){return e.reduce((e,n,a)=>e+n+(t[a]||""),"")})`
  /* 下拉菜单容器 */
  .x-trending-dropdown {
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
  }

  .x-trending-dropdown--visible {
    display: block;
  }

  /* 头部区域 */
  .x-trending-header {
    padding: 16px;
    border-bottom: 1px solid var(--borderColor-default, #d0d7de);
  }

  .x-trending-header__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .x-trending-header__title {
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* 时间段按钮组 */
  .x-trending-periods {
    display: flex;
    gap: 6px;
  }

  .x-trending-period-btn {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 6px;
    background: transparent;
    color: var(--fgColor-default, #1f2328);
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .x-trending-period-btn:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  .x-trending-period-btn--active {
    background: var(--bgColor-emphasis, #0969da);
    color: var(--fgColor-onEmphasis, #ffffff);
    border-color: transparent;
    font-weight: 600;
  }

  /* 搜索框 */
  .x-trending-search {
    padding: 12px 16px;
    border-bottom: 1px solid var(--borderColor-default, #d0d7de);
  }

  .x-trending-search__input {
    width: 100%;
    padding: 6px 12px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 6px;
    background: var(--bgColor-default, #ffffff);
    color: var(--fgColor-default, #1f2328);
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .x-trending-search__input:focus {
    border-color: var(--focus-outlineColor, #0969da);
    box-shadow: 0 0 0 3px var(--focus-outlineColor-alpha, rgba(9, 105, 218, 0.3));
  }

  /* 区块样式 */
  .x-trending-section {
    padding: 12px 16px;
    border-bottom: 1px solid var(--borderColor-default, #d0d7de);
  }

  .x-trending-section:last-child {
    border-bottom: none;
  }

  .x-trending-section__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .x-trending-section__title {
    font-size: 12px;
    font-weight: 600;
    color: var(--fgColor-muted, #656d76);
  }

  /* 芯片样式 */
  .x-trending-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .x-trending-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 12px;
    text-decoration: none;
    color: var(--fgColor-default, #1f2328);
    font-size: 12px;
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
    transition: all 0.2s;
  }

  .x-trending-chip:hover {
    background: var(--bgColor-emphasis, #0969da);
    color: var(--fgColor-onEmphasis, #ffffff);
    border-color: transparent;
  }

  /* 分类标签 */
  .x-trending-tabs {
    padding: 8px 16px;
    border-bottom: 1px solid var(--borderColor-default, #d0d7de);
    overflow-x: auto;
    white-space: nowrap;
  }

  .x-trending-tabs__inner {
    display: inline-flex;
    gap: 4px;
  }

  .x-trending-tab {
    padding: 4px 12px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 6px;
    background: transparent;
    color: var(--fgColor-default, #1f2328);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .x-trending-tab:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  .x-trending-tab--active {
    background: var(--bgColor-emphasis, #0969da);
    color: var(--fgColor-onEmphasis, #ffffff);
    border-color: transparent;
  }

  /* 语言链接 */
  .x-trending-lang {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    margin: 2px 0;
    border-radius: 6px;
    text-decoration: none;
    color: var(--fgColor-default, #1f2328);
    font-size: 13px;
    transition: background 0.2s;
  }

  .x-trending-lang:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  .x-trending-lang__label {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .x-trending-lang__icon {
    font-size: 16px;
  }

  .x-trending-lang__category {
    font-size: 10px;
    color: var(--fgColor-muted, #656d76);
    opacity: 0.7;
  }

  /* 收藏星标 */
  .x-trending-star {
    cursor: pointer;
    font-size: 14px;
    opacity: 0.3;
    transition: all 0.2s;
    padding: 0 4px;
  }

  .x-trending-star:hover {
    opacity: 1;
    transform: scale(1.2);
  }

  .x-trending-star--active {
    opacity: 1;
  }

  /* 空状态 */
  .x-trending-empty {
    display: none;
    padding: 20px;
    text-align: center;
    color: var(--fgColor-muted, #656d76);
    font-size: 13px;
  }

  .x-trending-empty__icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  /* 底部提示 */
  .x-trending-footer {
    border-top: 1px solid var(--borderColor-default, #d0d7de);
    padding: 10px 16px;
    font-size: 11px;
    color: var(--fgColor-muted, #656d76);
  }

  .x-trending-footer__inner {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }

  .x-trending-kbd {
    padding: 2px 6px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 3px;
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
    font-family: monospace;
  }

  /* 设置按钮 */
  .x-trending-settings-btn {
    padding: 4px 8px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 6px;
    background: transparent;
    color: var(--fgColor-muted, #656d76);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .x-trending-settings-btn:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  /* 清除按钮 */
  .x-trending-clear-btn {
    padding: 2px 8px;
    border: none;
    background: transparent;
    color: var(--fgColor-muted, #656d76);
    font-size: 11px;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .x-trending-clear-btn:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  /* 按钮容器 */
  .x-trending-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  /* 主按钮 */
  .x-trending-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: var(--fgColor-muted, #656d76);
    cursor: pointer;
    transition: all 0.2s;
  }

  .x-trending-btn:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
    color: var(--fgColor-default, #1f2328);
  }

  /* 设置对话框 */
  .x-trending-dialog {
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
  }

  .x-trending-dialog__content {
    background: var(--overlay-bgColor, #ffffff);
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 12px;
    padding: 24px;
    min-width: 400px;
    max-width: 500px;
    box-shadow: var(--shadow-floating-large, 0 16px 32px rgba(0,0,0,0.12));
  }

  .x-trending-dialog__title {
    margin: 0 0 20px 0;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .x-trending-dialog__field {
    margin-bottom: 16px;
  }

  .x-trending-dialog__label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .x-trending-dialog__label:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  .x-trending-dialog__input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 6px;
    background: var(--bgColor-default, #ffffff);
    color: var(--fgColor-default, #1f2328);
    font-size: 14px;
  }

  .x-trending-dialog__actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .x-trending-dialog__btn {
    padding: 8px 16px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 6px;
    background: transparent;
    color: var(--fgColor-default, #1f2328);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .x-trending-dialog__btn:hover {
    background: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
  }

  .x-trending-dialog__btn--primary {
    border: none;
    background: var(--bgColor-emphasis, #0969da);
    color: var(--fgColor-onEmphasis, #ffffff);
    font-weight: 600;
  }

  .x-trending-dialog__btn--primary:hover {
    opacity: 0.9;
  }
`,r="trending-button",o="trending-dropdown",i="trending_settings",d="trending_favorites",s="trending_recent",l={defaultLanguage:"",defaultPeriod:"daily",showRecent:!0,maxRecent:5,openInNewTab:!1},c=[{name:"All Languages",value:"",icon:"🌐",category:"all"},{name:"JavaScript",value:"javascript",icon:"📜",category:"web"},{name:"TypeScript",value:"typescript",icon:"📘",category:"web"},{name:"Python",value:"python",icon:"🐍",category:"general"},{name:"Java",value:"java",icon:"☕",category:"general"},{name:"C++",value:"c++",icon:"⚙️",category:"systems"},{name:"C",value:"c",icon:"🔧",category:"systems"},{name:"C#",value:"c%23",icon:"🎯",category:"general"},{name:"Go",value:"go",icon:"🐹",category:"systems"},{name:"Rust",value:"rust",icon:"🦀",category:"systems"},{name:"PHP",value:"php",icon:"🐘",category:"web"},{name:"Ruby",value:"ruby",icon:"💎",category:"web"},{name:"Swift",value:"swift",icon:"🍎",category:"mobile"},{name:"Kotlin",value:"kotlin",icon:"🤖",category:"mobile"},{name:"Dart",value:"dart",icon:"🎯",category:"mobile"},{name:"Shell",value:"shell",icon:"🐚",category:"systems"},{name:"Vue",value:"vue",icon:"💚",category:"web"},{name:"React",value:"javascript",icon:"⚛️",category:"web",search:"react"},{name:"HTML",value:"html",icon:"🌐",category:"web"},{name:"CSS",value:"css",icon:"🎨",category:"web"}],g=[{name:"Today",value:"daily",icon:"📅"},{name:"This Week",value:"weekly",icon:"📆"},{name:"This Month",value:"monthly",icon:"📊"}],p={all:{name:"Popular",icon:"⭐"},web:{name:"Web",icon:"🌐"},mobile:{name:"Mobile",icon:"📱"},systems:{name:"Systems",icon:"⚙️"},general:{name:"General",icon:"💻"}},u=".AppHeader-actions",f="notification-indicator",x=".AppHeader-user";function v(e=!1){return e?"⭐":"☆"}class b{constructor(e=""){this.prefix=e}_getKey(e){return this.prefix?`${this.prefix}_${e}`:e}get(e,t=null){try{const n=GM_getValue(this._getKey(e));return void 0===n?t:"string"==typeof n?JSON.parse(n):n}catch(n){return console.warn(`[GMStorage] Failed to get "${e}":`,n),t}}set(e,t){try{return GM_setValue(this._getKey(e),JSON.stringify(t)),!0}catch(t){return console.warn(`[GMStorage] Failed to set "${e}":`,t),!1}}remove(e){try{return GM_deleteValue(this._getKey(e)),!0}catch(t){return console.warn(`[GMStorage] Failed to remove "${e}":`,t),!1}}}const h=new class{constructor(){this.storage=new b}getSettings(){const e=this.storage.get(i,null);return{...l,...e}}setSettings(e){this.storage.set(i,{...l,...e})}getFavorites(){return this.storage.get(d,[])}toggleFavorite(e){const t=this.getFavorites(),n=t.indexOf(e);return n>-1?(t.splice(n,1),this.storage.set(d,t),!1):(t.push(e),this.storage.set(d,t),!0)}getRecent(){return this.storage.get(s,[])}addRecent(e){const t=this.getSettings();if(!t.showRecent)return;const n=this.getRecent().filter(t=>t.language!==e);n.unshift({language:e,timestamp:Date.now()});const a=n.slice(0,t.maxRecent);this.storage.set(s,a)}clearRecent(){this.storage.set(s,[])}clearAll(){this.storage.set(d,[]),this.storage.set(s,[]),this.storage.set(i,l)}getLanguageByValue(e){return c.find(t=>t.value===e)||null}};function m(e){return e.querySelector(".x-trending-search__input")}function y(t={}){const{activePeriod:a="daily",onChange:r=null}=t,o=e("div",{className:"x-trending-periods"});return g.forEach(t=>{const i=t.value===a,d=e("button",{className:"x-trending-period-btn "+(i?"x-trending-period-btn--active":""),attrs:{"data-period":t.value,type:"button"},html:`<span>${t.icon}</span><span>${t.name}</span>`});i&&(d.dataset.active="true"),d.addEventListener("click",e=>{e.stopPropagation(),function(e,t){n(".x-trending-period-btn",e).forEach(e=>{const n=e.dataset.period===t;e.classList.toggle("x-trending-period-btn--active",n),e.dataset.active=n?"true":""})}(o,t.value),r&&r(t.value)}),o.appendChild(d)}),o}function C(e){const t=e.querySelector(".x-trending-period-btn--active");return t?t.dataset.period:"daily"}function _(t={}){const{activeCategory:a="all",onChange:r=null}=t,o=e("div",{className:"x-trending-tabs"}),i=e("div",{className:"x-trending-tabs__inner"});return Object.entries(p).forEach(([t,d])=>{const s=t===a,l=e("button",{className:"x-trending-tab "+(s?"x-trending-tab--active":""),attrs:{"data-category":t,type:"button"},text:`${d.icon} ${d.name}`});s&&(l.dataset.active="true"),l.addEventListener("click",e=>{e.stopPropagation(),function(e,t){n(".x-trending-tab",e).forEach(e=>{const n=e.dataset.category===t;e.classList.toggle("x-trending-tab--active",n),e.dataset.active=n?"true":""})}(o,t),r&&r(t)}),i.appendChild(l)}),o.appendChild(i),o}function k(e,t="daily"){const n=new URLSearchParams;t&&"daily"!==t&&n.set("since",t),e.search&&n.set("q",e.search);const a=n.toString();return`/trending/${e.value}${a?"?"+a:""}`}function w(t={}){const{lang:n,isFavorite:a=!1,showCategory:r=!1,period:o="daily",onFavoriteClick:i=null,onClick:d=null}=t,s=e("a",{className:"x-trending-lang",attrs:{href:k(n,o),"data-lang":n.value,"data-category":n.category}}),l=e("span",{className:"x-trending-lang__label"}),c=e("span",{className:"x-trending-lang__icon",text:n.icon});l.appendChild(c);const g=e("span",{text:n.name});if(l.appendChild(g),r){const t=e("span",{className:"x-trending-lang__category",text:p[n.category]?.name||""});l.appendChild(t)}s.appendChild(l);const u=e("span",{className:"x-trending-star "+(a?"x-trending-star--active":""),attrs:{"data-lang":n.value,title:a?"Remove from favorites":"Add to favorites"},text:v(a)});return u.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),i&&i(n.value,u)}),s.appendChild(u),d&&s.addEventListener("click",e=>{d(e,n)}),s}function S(e,t="",a="all"){const r=e.querySelector("#languages-list"),o=e.querySelector("#no-results");if(!r)return;const i=n(".x-trending-lang",r);let d=0;i.forEach(e=>{const n=e.textContent.toLowerCase(),r=e.dataset.category,o=(!t||n.includes(t.toLowerCase()))&&("all"===a||r===a);e.style.display=o?"flex":"none",o&&d++}),o&&(o.style.display=0===d&&t?"block":"none"),r&&(r.style.display=0===d&&t?"none":"block")}function N(t={}){const n=function(t={}){const{settings:n={},onSave:a=null,onCancel:r=null}=t,o=e("div",{className:"x-trending-dialog"}),i=e("div",{className:"x-trending-dialog__content"}),d=e("h3",{className:"x-trending-dialog__title",html:"<span>⚙️</span><span>Settings</span>"});i.appendChild(d);const s=e("div",{className:"x-trending-dialog__field"}),l=e("label",{className:"x-trending-dialog__label"}),c=e("input",{attrs:{type:"checkbox",id:"setting-show-recent",...n.showRecent?{checked:"checked"}:{}},styles:{cursor:"pointer"}});l.appendChild(c),l.appendChild(e("span",{styles:{fontSize:"14px"},text:"Show recent languages"})),s.appendChild(l),i.appendChild(s);const g=e("div",{className:"x-trending-dialog__field"}),p=e("label",{className:"x-trending-dialog__label"}),u=e("input",{attrs:{type:"checkbox",id:"setting-open-new-tab",...n.openInNewTab?{checked:"checked"}:{}},styles:{cursor:"pointer"}});p.appendChild(u),p.appendChild(e("span",{styles:{fontSize:"14px"},text:"Open links in new tab"})),g.appendChild(p),i.appendChild(g);const f=e("div",{className:"x-trending-dialog__field",styles:{marginBottom:"20px"}}),x=e("label",{styles:{display:"block",fontSize:"13px",fontWeight:"600",marginBottom:"8px",color:"var(--fgColor-muted, #656d76)"},text:"Max recent items (1-10):"});f.appendChild(x);const v=e("input",{className:"x-trending-dialog__input",attrs:{type:"number",id:"setting-max-recent",min:"1",max:"10",value:n.maxRecent||5}});f.appendChild(v),i.appendChild(f);const b=e("div",{className:"x-trending-dialog__actions"}),h=e("button",{className:"x-trending-dialog__btn",attrs:{type:"button"},text:"Cancel"});h.addEventListener("click",()=>{o.remove(),r&&r()}),b.appendChild(h);const m=e("button",{className:"x-trending-dialog__btn x-trending-dialog__btn--primary",attrs:{type:"button"},text:"Save"});return m.addEventListener("click",()=>{const e={...n,showRecent:c.checked,openInNewTab:u.checked,maxRecent:parseInt(v.value)||5};o.remove(),a&&a(e)}),b.appendChild(m),i.appendChild(b),o.appendChild(i),o.addEventListener("click",e=>{e.target===o&&(o.remove(),r&&r())}),o}(t);document.body.appendChild(n)}function E(t={}){const{onRefresh:a=null}=t,r=h.getSettings(),i=h.getFavorites(),d=h.getRecent(),s=e("div",{className:"x-trending-dropdown",attrs:{id:o}}),l=e("div",{className:"x-trending-header"}),g=e("div",{className:"x-trending-header__top"}),p=e("strong",{className:"x-trending-header__title",html:'\n    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-graph">\n      <path d="M1.5 1.75V13.5h13.75a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75V1.75a.75.75 0 0 1 1.5 0Zm14.28 2.53-5.25 5.25a.75.75 0 0 1-1.06 0L7 7.06 4.28 9.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.06 0L10 7.94l4.72-4.72a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>\n    </svg>\n  <span>Trending</span>'});g.appendChild(p);const u=e("button",{className:"x-trending-settings-btn",attrs:{type:"button",title:"Settings"},text:"⚙️"});u.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),function(e,t){N({settings:h.getSettings(),onSave:e=>{h.setSettings(e),t&&t()}})}(0,a)}),g.appendChild(u),l.appendChild(g);const f=y({activePeriod:r.defaultPeriod,onChange:e=>function(e,t){const a=h.getSettings();h.setSettings({...a,defaultPeriod:t}),function(e,t){n(".x-trending-lang",e).forEach(e=>{const n=e.dataset.lang,a=c.find(e=>e.value===n);a&&(e.href=k(a,t))})}(e,t)}(s,e)});l.appendChild(f),s.appendChild(l);const x=function(t={}){const{id:n="trending-search",placeholder:a="Search languages...",onInput:r=null}=t,o=e("div",{className:"x-trending-search"}),i=e("input",{className:"x-trending-search__input",attrs:{type:"text",id:n,placeholder:a}});return i.addEventListener("keydown",e=>{"Escape"===e.key&&(i.value="",i.dispatchEvent(new Event("input",{bubbles:!0})))}),r&&i.addEventListener("input",r),o.appendChild(i),o}({onInput:e=>function(e,t){const n=e.querySelector(".x-trending-section:last-of-type");n&&S(n,t)}(s,e.target.value)});if(s.appendChild(x),r.showRecent&&d.length>0){const t=function(t={}){const{recent:n=[],period:a="daily",onClear:r=null,onClick:o=null}=t;if(0===n.length)return null;const i=e("div",{className:"x-trending-section"}),d=e("div",{className:"x-trending-section__header"}),s=e("div",{className:"x-trending-section__title",text:"🕐 Recent"});d.appendChild(s);const l=e("button",{className:"x-trending-clear-btn",attrs:{type:"button",title:"Clear recent"},text:"Clear"});r&&l.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),r()}),d.appendChild(l),i.appendChild(d);const g=e("div",{className:"x-trending-chips"});return n.forEach(t=>{const n=c.find(e=>e.value===t.language);if(!n)return;const r=e("a",{className:"x-trending-chip",attrs:{href:k(n,a),"data-lang":n.value},html:`<span>${n.icon}</span><span>${n.name}</span>`});o&&r.addEventListener("click",e=>o(e,n)),g.appendChild(r)}),i.appendChild(g),i}({recent:d,period:r.defaultPeriod,onClear:()=>function(e,t){h.clearRecent(),t&&t()}(0,a),onClick:(e,t)=>F(e,t,r)});t&&s.appendChild(t)}if(i.length>0){const t=function(t={}){const{favorites:n=[],period:a="daily",onFavoriteClick:r=null,onClick:o=null}=t;if(0===n.length)return null;const i=e("div",{className:"x-trending-section"}),d=e("div",{className:"x-trending-section__title",text:"⭐ Favorites"});i.appendChild(d);const s=e("div",{attrs:{id:"favorites-list"}});return n.forEach(e=>{const t=c.find(t=>t.value===e);if(!t)return;const n=w({lang:t,isFavorite:!0,period:a,onFavoriteClick:r,onClick:o});s.appendChild(n)}),i.appendChild(s),i}({favorites:i,period:r.defaultPeriod,onFavoriteClick:e=>L(s,e),onClick:(e,t)=>F(e,t,r)});t&&s.appendChild(t)}const v=_({onChange:e=>function(e,t){const n=e.querySelector(".x-trending-section:last-of-type"),a=m(e),r=a?a.value:"";n&&S(n,r,t),a&&(a.value="")}(s,e)});s.appendChild(v);const b=function(t={}){const{favorites:n=[],period:a="daily",onFavoriteClick:r=null,onClick:o=null}=t,i=e("div",{className:"x-trending-section"}),d=e("div",{attrs:{id:"languages-list"}});c.forEach(e=>{const t=w({lang:e,isFavorite:n.includes(e.value),period:a,onFavoriteClick:r,onClick:o});d.appendChild(t)}),i.appendChild(d);const s=e("div",{className:"x-trending-empty",attrs:{id:"no-results"},html:'\n      <div class="x-trending-empty__icon">🔍</div>\n      <div>No languages found</div>\n    '});return i.appendChild(s),i}({favorites:i,period:r.defaultPeriod,onFavoriteClick:e=>L(s,e),onClick:(e,t)=>F(e,t,r)});s.appendChild(b);const C=e("div",{className:"x-trending-footer",html:'\n      <div class="x-trending-footer__inner">\n        <span>💡 <kbd class="x-trending-kbd">Alt+T</kbd> Quick open</span>\n        <span><kbd class="x-trending-kbd">ESC</kbd> Close</span>\n      </div>\n    '});return s.appendChild(C),s}function L(e,t){h.toggleFavorite(t);const a=h.getFavorites();!function(e,t){n(".x-trending-star",e).forEach(e=>{const n=e.dataset.lang,a=t.includes(n);e.textContent=v(a),e.classList.toggle("x-trending-star--active",a),e.title=a?"Remove from favorites":"Add to favorites"})}(e,a);const r=e.querySelector("#favorites-list");r&&function(e,t={}){const{favorites:n=[],period:a="daily",onFavoriteClick:r=null,onClick:o=null}=t;(function(e){for(;e.firstChild;)e.removeChild(e.firstChild)})(e),n.forEach(t=>{const n=c.find(e=>e.value===t);if(!n)return;const i=w({lang:n,isFavorite:!0,period:a,onFavoriteClick:r,onClick:o});e.appendChild(i)})}(r,{favorites:a,period:C(e.querySelector(".x-trending-periods")),onFavoriteClick:t=>L(e,t)})}function F(e,t,n){h.addRecent(t.value),n.openInNewTab&&(e.preventDefault(),window.open(e.currentTarget.href,"_blank"))}function M(e,t){if(void 0===t?e.classList.toggle("x-trending-dropdown--visible"):e.classList.toggle("x-trending-dropdown--visible",t),e.classList.contains("x-trending-dropdown--visible")){const t=m(e);t&&setTimeout(()=>t.focus(),50)}}function R(){const n=t(u);if(!n)return!1;if(document.getElementById(r))return!0;const a=e("div",{className:"x-trending-container"}),o=e("button",{className:"x-trending-btn Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted",attrs:{id:r,"aria-label":"Trending repositories",type:"button"},html:'\n    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-graph">\n      <path d="M1.5 1.75V13.5h13.75a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75V1.75a.75.75 0 0 1 1.5 0Zm14.28 2.53-5.25 5.25a.75.75 0 0 1-1.06 0L7 7.06 4.28 9.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.06 0L10 7.94l4.72-4.72a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z"></path>\n    </svg>\n  '}),i=()=>{const e=a.querySelector(".x-trending-dropdown"),t=e?.classList.contains("x-trending-dropdown--visible");e&&e.remove();const n=E({onRefresh:i});a.appendChild(n),t&&M(n,!0)},d=E({onRefresh:i});o.addEventListener("click",e=>{e.stopPropagation(),M(d)}),a.appendChild(o),a.appendChild(d),function(e,t){document.addEventListener("click",n=>{e.contains(n.target)||M(t,!1)})}(a,d),function(e){document.addEventListener("keydown",t=>{"Escape"===t.key&&M(e,!1)})}(d);const s=t(f,n)||t(x,n);return s?n.insertBefore(a,s):n.appendChild(a),!0}function z(){if(!R()){const e=function(e,t=document.body,n={}){const a={childList:!0,subtree:!0,attributes:!1,characterData:!1,...n},r=new MutationObserver(t=>{e(t)});return r.observe(t,a),r}(t=>{R()&&e.disconnect()});setTimeout(()=>e.disconnect(),5e3)}}(function(e,t=null){if(t){const n=document.getElementById(t);if(n)return n.textContent=e,n}if("undefined"!=typeof GM_addStyle)try{return GM_addStyle(e),null}catch(e){console.warn("[Styles] GM_addStyle failed, falling back to style tag:",e)}const n=document.createElement("style");n.type="text/css",t&&(n.id=t),n.textContent=e,(document.head||document.documentElement).appendChild(n)})(a),z(),document.addEventListener("keydown",e=>{const t=h.getSettings();if(e.altKey&&"t"===e.key&&!e.shiftKey){e.preventDefault();const n=t.defaultLanguage||"",a=t.defaultPeriod||"daily",r=`/trending/${n}${"daily"!==a?`?since=${a}`:""}`;t.openInNewTab?window.open(r,"_blank"):window.location.href=r}if(e.altKey&&e.shiftKey&&"T"===e.key){e.preventDefault();const t=document.getElementById(r);t&&t.click()}}),GM_registerMenuCommand("⚙️ Settings",()=>{N({settings:h.getSettings(),onSave:e=>{h.setSettings(e),alert("Settings saved! Please refresh the page to apply changes.")}})}),GM_registerMenuCommand("⭐ Manage Favorites",()=>{const e=h.getFavorites(),t=e.map(e=>{const t=c.find(t=>t.value===e);return t?t.name:e}).join(", ");alert(`Favorites (${e.length}):\n\n${t||"No favorites yet"}\n\nClick the star icon next to any language to add/remove favorites.`)}),GM_registerMenuCommand("🗑️ Clear All Data",()=>{confirm("Clear all data including favorites and recent languages?")&&(h.clearAll(),alert("All data cleared! Please refresh the page."))}),GM_registerMenuCommand("ℹ️ About",()=>{alert("GitHub Trending Button Enhanced v2.0.0\n\nFeatures:\n• Quick access to trending repositories\n• Filter by language and time period\n• Favorites system\n• Recent languages tracking\n• Keyboard shortcuts (Alt+T, Alt+Shift+T)\n• Search languages\n• Category filtering\n\nMade with ❤️")}),document.addEventListener("turbo:load",z),document.addEventListener("turbo:render",z)})();