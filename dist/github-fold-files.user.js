// ==UserScript==
// @name        GitHub Fold Files Enhanced
// @description Enhanced file/folder collapsing for GitHub with smooth animations
// @version     1.0.1
// @author      AstroAir
// @match       https://github.com/*
// @grant       GM_addStyle
// @icon        https://www.google.com/s2/favicons?sz=64&domain=github.com
// @license     MIT
// @namespace   http://tampermonkey.net/
// @run-at      document-end
// ==/UserScript==

(()=>{"use strict";function t(t,e={}){const{className:o,id:n,attrs:r={},styles:a={},text:l,html:s,children:i=[],events:c={}}=e,d=document.createElement(t);o&&(Array.isArray(o)?d.classList.add(...o):d.className=o),n&&(d.id=n);for(const[t,e]of Object.entries(r))d.setAttribute(t,e);for(const[t,e]of Object.entries(a))d.style[t]=e;l&&(d.textContent=l),s&&(d.innerHTML=s);for(const t of i)t instanceof Element?d.appendChild(t):"string"==typeof t&&d.appendChild(document.createTextNode(t));for(const[t,e]of Object.entries(c))d.addEventListener(t,e);return d}function e(t,e=document){return e.querySelector(t)}function o(t,e=document){return Array.from(e.querySelectorAll(t))}const n=(function(t,...e){return t.reduce((t,o,n)=>t+o+(e[n]||""),"")})`
  /* 折叠状态 */
  .x-folded > tr:not(:first-child) {
    display: none !important;
  }

  /* 悬停预览 */
  .x-hover-preview > tr:not(:first-child) {
    display: table-row !important;
    opacity: 0.6 !important;
    pointer-events: none;
  }

  /* 按钮容器 */
  .x-button-container {
    display: inline-flex;
    margin-left: auto;
  }

  /* 折叠按钮 */
  .x-fold-button {
    width: 2em;
    height: 2em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--fgColor-muted, #656d76);
  }

  .x-fold-button:hover {
    background-color: var(--bgColor-muted, rgba(175, 184, 193, 0.2));
    color: var(--fgColor-default, #1f2328);
  }

  .x-fold-button:active {
    transform: scale(0.95);
  }

  /* 图标旋转动画 */
  .x-chevron {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .x-collapsed .x-chevron {
    transform: rotate(-90deg);
  }

  /* 确保按钮在右侧 */
  div:has(+ .x-button-container) {
    margin-left: auto;
  }

  /* 全局按钮样式 */
  .x-global-toggle {
    display: inline-flex;
    margin-right: 8px;
  }

  .x-global-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    border-radius: 6px;
    border: 1px solid var(--borderColor-default, rgba(27, 31, 36, 0.15));
    background-color: var(--button-default-bgColor-rest, #f6f8fa);
    color: var(--fgColor-default, #24292f);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .x-global-btn:hover {
    background-color: var(--button-default-bgColor-hover, #f3f4f6);
    border-color: var(--button-default-borderColor-hover, rgba(27, 31, 36, 0.15));
  }

  .x-global-btn:active {
    background-color: var(--button-default-bgColor-active, hsla(220, 14%, 93%, 1));
  }

  .x-global-btn svg {
    flex-shrink: 0;
  }

  /* 行动画优化 - 移除可能导致抖动的样式 */
  tbody[data-animating="true"] tr {
    will-change: opacity, transform;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .x-global-text {
      display: none;
    }
    .x-global-btn {
      padding: 5px 8px;
    }
  }

  /* 性能优化 */
  .x-fold-button,
  .x-chevron {
    will-change: transform;
  }

  /* 焦点样式 */
  .x-fold-button:focus-visible,
  .x-global-btn:focus-visible {
    outline: 2px solid var(--focus-outlineColor, #0969da);
    outline-offset: 2px;
  }

  /* 减少动画 */
  @media (prefers-reduced-motion: reduce) {
    .x-fold-button,
    .x-chevron,
    .x-global-btn,
    tbody tr {
      transition: none !important;
    }
  }
`,r={animationDuration:200,rememberState:!0,collapseAll:!0,hoverPreview:!0,staggerDelay:30,expandStaggerDelay:30,collapseStaggerDelay:20},a='tr[class*="DirectoryContent"] td > div[class*="LatestCommit"]',l="div[data-hpc] .Box-sc-g0xbh4-0",s="a[data-pjax]",i="github-fold-state";const c=new class{constructor(t=""){this.prefix=t}_getKey(t){return this.prefix?`${this.prefix}-${t}`:t}get(t,e=null){try{const o=localStorage.getItem(this._getKey(t));return null===o?e:JSON.parse(o)}catch(o){return console.warn(`[Storage] Failed to get "${t}":`,o),e}}set(t,e){try{return localStorage.setItem(this._getKey(t),JSON.stringify(e)),!0}catch(e){return console.warn(`[Storage] Failed to set "${t}":`,e),!1}}remove(t){try{return localStorage.removeItem(this._getKey(t)),!0}catch(e){return console.warn(`[Storage] Failed to remove "${t}":`,e),!1}}clear(){if(!this.prefix)return void console.warn("[Storage] Cannot clear without prefix");const t=[];for(let e=0;e<localStorage.length;e++){const o=localStorage.key(e);o&&o.startsWith(this.prefix)&&t.push(o)}t.forEach(t=>localStorage.removeItem(t))}},d=new class{constructor(){this.collapsed=new Set,this.init()}init(){if(r.rememberState){const t=c.get(i);Array.isArray(t)&&(this.collapsed=new Set(t))}}save(){r.rememberState&&c.set(i,[...this.collapsed])}toggle(t){return this.collapsed.has(t)?(this.collapsed.delete(t),this.save(),!1):(this.collapsed.add(t),this.save(),!0)}isCollapsed(t){return this.collapsed.has(t)}setCollapsed(t,e){e?this.collapsed.add(t):this.collapsed.delete(t),this.save()}clear(){this.collapsed.clear(),this.save()}};(function(t,e=null){if(e){const o=document.getElementById(e);if(o)return o.textContent=t,o}if("undefined"!=typeof GM_addStyle)try{return GM_addStyle(t),null}catch(t){console.warn("[Styles] GM_addStyle failed, falling back to style tag:",t)}const o=document.createElement("style");o.type="text/css",e&&(o.id=e),o.textContent=t,(document.head||document.documentElement).appendChild(o)})(n),function(t,e,o=document,n={}){const{once:r=!1,timeout:a=0,subtree:l=!0}=n,s="_wfe_"+Math.random().toString(36).slice(2);let i=null,c=null;const d=(()=>{const n=o.querySelectorAll(`:is(${t}):not([${s}])`);return n.forEach(t=>{t.setAttribute(s,""),e(t),r&&c&&(c.disconnect(),i&&clearTimeout(i))}),n.length>0})();r&&d||(c=new MutationObserver(o=>{for(const n of o)for(const o of n.addedNodes)if(1===o.nodeType){if(o.matches&&o.matches(t)&&!o.hasAttribute(s)&&(o.setAttribute(s,""),e(o),r))return c.disconnect(),void(i&&clearTimeout(i));if(o.querySelectorAll){const n=o.querySelectorAll(`:is(${t}):not([${s}])`);for(const t of n)if(t.setAttribute(s,""),e(t),r)return c.disconnect(),void(i&&clearTimeout(i))}}}),c.observe(o,{childList:!0,subtree:l}),a>0&&(i=setTimeout(()=>{c.disconnect()},a)))}(a,n=>{!function(n){const a=n.closest("tbody");if(!a||a.querySelector(".x-fold-button"))return;const l=function(t){const o=e(s,t);return o?o.getAttribute("href"):""}(a),i=d.isCollapsed(l),c=function(e,o=!1){const n=t("div",{className:"x-button-container"}),r=t("button",{className:"x-fold-button Button--iconOnly Button--invisible "+(o?"x-collapsed":""),attrs:{"aria-label":"折叠/展开文件夹",title:"点击折叠/展开文件夹"},html:'\n      <svg class="x-chevron" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">\n        <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>\n      </svg>\n    ',events:{click:t=>{t.preventDefault(),t.stopPropagation(),e&&e(t,r)}}});return n.appendChild(r),n}(async(t,e)=>{const n=function(t){return o("tr:not(:first-child)",t)}(a),s=a.classList.contains("x-folded");(function(t,e){t.classList.toggle("x-collapsed",e)})(e,!s),await function(t,e,o){const n=(a=t,l=()=>async function(t,e,o){const{animationDuration:n,expandStaggerDelay:a,collapseStaggerDelay:l}=r;return new Promise(r=>{if(o){e.forEach((t,e)=>{t.style.transition=`opacity ${n}ms ease-out, transform ${n}ms ease-out`,setTimeout(()=>{t.style.opacity="0",t.style.transform="translateY(-8px)"},e*l)});const o=n+e.length*l;setTimeout(()=>{t.classList.add("x-folded"),e.forEach(t=>{t.style.transition="",t.style.opacity="",t.style.transform=""}),r()},o)}else{e.forEach(t=>{t.style.display="table-row",t.style.opacity="0",t.style.transform="translateY(-8px)"}),t.offsetHeight,t.classList.remove("x-folded"),e.forEach((t,e)=>{setTimeout(()=>{t.style.transition=`opacity ${n}ms ease-out, transform ${n}ms ease-out`,t.style.opacity="1",t.style.transform="translateY(0)"},e*a)});const o=n+e.length*a;setTimeout(()=>{e.forEach(t=>{t.style.transition="",t.style.opacity="",t.style.transform="",t.style.display=""}),r()},o)}})}(t,e,o),async(...t)=>{if("true"!==a.dataset.animating){a.dataset.animating="true";try{await l(...t)}finally{a.dataset.animating="false"}}});var a,l;return n()}(a,n,!s),d.toggle(l)},i),u=c.querySelector(".x-fold-button");i&&function(t,e){t.classList.toggle("x-folded",e)}(a,!0),function(t,e){if(!r.hoverPreview)return;let o=null;e.addEventListener("mouseenter",()=>{t.classList.contains("x-folded")&&(o=setTimeout(()=>{t.classList.add("x-hover-preview")},500))}),e.addEventListener("mouseleave",()=>{o&&(clearTimeout(o),o=null),t.classList.remove("x-hover-preview")})}(a,u),n.appendChild(c)}(n),function(){if(!r.collapseAll)return;const n=e(l);if(!n||n.querySelector(".x-global-toggle"))return;const a=function(e){const o=t("div",{className:"x-global-toggle"}),n=t("button",{className:"x-global-btn types__StyledButton-sc-ws60qy-0",attrs:{title:"折叠所有文件夹"},html:'\n      <svg class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">\n        <path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H13a1 1 0 0 1 1 1v.5H2.75a.75.75 0 0 0 0 1.5h11.978a1 1 0 0 1 .994 1.117L15 13.25A1.75 1.75 0 0 1 13.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.184-.909.513-1.237Z"></path>\n      </svg>\n      <span class="x-global-text">全部折叠</span>\n    '});let r=!1;return n.addEventListener("click",()=>{r=!r,e&&e(r);const t=n.querySelector(".x-global-text");t&&(t.textContent=r?"全部展开":"全部折叠")}),o.appendChild(n),o}(t=>{o(".x-fold-button").forEach(e=>{const o=e.closest("tbody");if(!o)return;const n=o.classList.contains("x-folded");(t&&!n||!t&&n)&&e.click()})});n.prepend(a)}()})})();