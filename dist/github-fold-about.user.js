// ==UserScript==
// @name        GitHub Fold About Sidebar
// @description Fold/unfold the About section in GitHub repository sidebar
// @version     1.0.0
// @author      AstroAir
// @match       https://github.com/*/*
// @grant       GM_addStyle
// @icon        https://www.google.com/s2/favicons?sz=64&domain=github.com
// @license     MIT
// @namespace   http://tampermonkey.net/
// @run-at      document-end
// ==/UserScript==

(()=>{"use strict";const t=(function(t,...e){return t.reduce((t,o,r)=>t+o+(e[r]||""),"")})`
  /* About 标题样式调整 */
  h2.mb-3.h4 {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* 按钮包装器 */
  .x-about-fold-wrapper {
    display: inline-flex;
    align-items: center;
    margin-left: auto;
    pointer-events: auto;
  }

  /* 折叠按钮 */
  .x-about-fold-button {
    width: 1.75rem;
    height: 1.75rem;
    padding: 0.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.3, 0, 0.5, 1);
    color: var(--fgColor-muted, #656d76);
  }

  /* 图标 */
  .x-about-chevron {
    display: block;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* 折叠状态 */
  .x-about-fold-button.x-folded .x-about-chevron {
    transform: rotate(-90deg);
  }

  /* 悬停效果 */
  .x-about-fold-button:hover {
    background-color: var(--button-default-bgColor-hover, rgba(175, 184, 193, 0.2));
    color: var(--fgColor-default, #1f2328);
    transform: scale(1.1);
  }

  .x-about-fold-button:active {
    background-color: var(--button-default-bgColor-active, rgba(175, 184, 193, 0.3));
    transform: scale(0.95);
  }

  /* 暗色主题 */
  [data-color-mode="dark"] .x-about-fold-button {
    color: var(--fgColor-muted, #848d97);
  }

  [data-color-mode="dark"] .x-about-fold-button:hover {
    background-color: var(--button-default-bgColor-hover, rgba(110, 118, 129, 0.4));
    color: var(--fgColor-default, #e6edf3);
  }

  [data-color-mode="dark"] .x-about-fold-button:active {
    background-color: var(--button-default-bgColor-active, rgba(110, 118, 129, 0.5));
  }

  /* 亮色主题 */
  [data-color-mode="light"] .x-about-fold-button:hover {
    background-color: var(--button-default-bgColor-hover, rgba(234, 238, 242, 1));
  }

  [data-color-mode="light"] .x-about-fold-button:active {
    background-color: var(--button-default-bgColor-active, rgba(221, 225, 230, 1));
  }

  /* 内容动画 */
  .BorderGrid-cell > *:not(h2):not(details.details-reset) {
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  }

  /* 焦点样式 */
  .x-about-fold-button:focus-visible {
    outline: 2px solid var(--focus-outlineColor, #0969da);
    outline-offset: 2px;
    box-shadow: 0 0 0 3px var(--focus-outlineColor-alpha, rgba(9, 105, 218, 0.3));
  }

  /* 高对比度模式 */
  @media (prefers-contrast: high) {
    .x-about-fold-button {
      border: 1px solid currentColor;
    }
  }

  /* 减少动画 */
  @media (prefers-reduced-motion: reduce) {
    .x-about-fold-button,
    .x-about-chevron,
    .BorderGrid-cell > * {
      transition: none !important;
    }
  }

  /* 移动端优化 */
  @media (max-width: 768px) {
    .x-about-fold-button {
      width: 2rem;
      height: 2rem;
      padding: 0.375rem;
    }
  }

  /* 防止标题换行 */
  h2.mb-3.h4 {
    flex-wrap: nowrap;
    gap: 0.5rem;
  }
`;const e=new class{constructor(t,e,o="map"){this.storage=t,this.key=e,this.type=o,this.state=this._load()}_load(){const t=this.storage.get(this.key);return"set"===this.type?new Set(Array.isArray(t)?t:[]):t&&"object"==typeof t?new Map(Object.entries(t)):new Map}save(){"set"===this.type?this.storage.set(this.key,[...this.state]):this.storage.set(this.key,Object.fromEntries(this.state))}get(t){return this.state.get(t)}set(t,e){this.state.set(t,e),this.save()}has(t){return this.state.has(t)}add(t){"set"===this.type&&(this.state.add(t),this.save())}delete(t){this.state.delete(t),this.save()}toggle(t){return"set"===this.type&&(this.state.has(t)?(this.state.delete(t),this.save(),!1):(this.state.add(t),this.save(),!0))}clear(){this.state.clear(),this.save()}entries(){return"set"===this.type?[...this.state]:[...this.state.entries()]}get size(){return this.state.size}}(new class{constructor(t=""){this.prefix=t}_getKey(t){return this.prefix?`${this.prefix}-${t}`:t}get(t,e=null){try{const o=localStorage.getItem(this._getKey(t));return null===o?e:JSON.parse(o)}catch(o){return console.warn(`[Storage] Failed to get "${t}":`,o),e}}set(t,e){try{return localStorage.setItem(this._getKey(t),JSON.stringify(e)),!0}catch(e){return console.warn(`[Storage] Failed to set "${t}":`,e),!1}}remove(t){try{return localStorage.removeItem(this._getKey(t)),!0}catch(e){return console.warn(`[Storage] Failed to remove "${t}":`,e),!1}}clear(){if(!this.prefix)return void console.warn("[Storage] Cannot clear without prefix");const t=[];for(let e=0;e<localStorage.length;e++){const o=localStorage.key(e);o&&o.startsWith(this.prefix)&&t.push(o)}t.forEach(t=>localStorage.removeItem(t))}},"github-about-fold-states","map");function o(t,e={}){const{className:o,id:r,attrs:a={},styles:n={},text:s,html:i,children:l=[],events:c={}}=e,d=document.createElement(t);o&&(Array.isArray(o)?d.classList.add(...o):d.className=o),r&&(d.id=r);for(const[t,e]of Object.entries(a))d.setAttribute(t,e);for(const[t,e]of Object.entries(n))d.style[t]=e;s&&(d.textContent=s),i&&(d.innerHTML=i);for(const t of l)t instanceof Element?d.appendChild(t):"string"==typeof t&&d.appendChild(document.createTextNode(t));for(const[t,e]of Object.entries(c))d.addEventListener(t,e);return d}function r(){return function(t,e=document){return Array.from(e.querySelectorAll(t))}("h2.mb-3.h4").find(t=>"About"===t.textContent.trim())||null}function a(t,e){t.classList.toggle("x-folded",e),t.setAttribute("aria-expanded",(!e).toString()),t.setAttribute("aria-label",e?"Expand About section":"Collapse About section")}const n={duration:200,easing:"ease-out",staggerDelay:30};const s={duration:n.duration,staggerDelay:n.staggerDelay,easing:n.easing};function i(t,e){return function(t,e,o={}){const{duration:r=n.duration,easing:a=n.easing,staggerDelay:s=n.staggerDelay}=o;return new Promise(e?e=>{t.forEach((t,e)=>{setTimeout(()=>{t.style.transition=`opacity ${r}ms ${a}, transform ${r}ms ${a}`,t.style.opacity="0",t.style.transform="translateY(-8px)"},e*s)});const o=r+t.length*s;setTimeout(()=>{t.forEach(t=>{t.style.display="none",t.style.transition="",t.style.opacity="",t.style.transform=""}),e()},o)}:e=>{t.forEach(t=>{t.style.display="",t.style.opacity="0",t.style.transform="translateY(-8px)"}),document.body.offsetHeight,t.forEach((t,e)=>{setTimeout(()=>{t.style.transition=`opacity ${r}ms ${a}, transform ${r}ms ${a}`,t.style.opacity="1",t.style.transform="translateY(0)"},e*s)});const o=r+t.length*s;setTimeout(()=>{t.forEach(t=>{t.style.transition="",t.style.opacity="",t.style.transform=""}),e()},o)})}(t,e,s)}function l(){const t=r();if(!t)return;if(t.hasAttribute("data-fold-processed"))return;t.setAttribute("data-fold-processed","true");if(!t.closest(".BorderGrid-cell"))return;const n=function(t,e){const o=[];let r=e.nextElementSibling;for(;r;)r.matches("details.details-reset")||o.push(r),r=r.nextElementSibling;return o}(0,t);if(0===n.length)return;const s=function(t=window.location.pathname){return`about-${t}`}(),l=function(t,e){return o("button",{className:"x-about-fold-button",attrs:{type:"button","aria-label":"Toggle About section","data-state-key":t,title:"Toggle About section"},html:'\n      <svg aria-hidden="true" class="x-about-chevron"\n           viewBox="0 0 16 16" width="16" height="16" fill="currentColor">\n        <path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path>\n      </svg>\n    ',events:{click:t=>{t.preventDefault(),t.stopPropagation(),e&&e(t)}}})}(s,()=>{!async function(t,o,r){const n=!t.classList.contains("x-folded");var s,l;a(t,n),await i(o,n),s=r,l=n,e.set(s,l)}(l,n,s)}),c=function(t){const e=o("span",{className:"x-about-fold-wrapper"});return e.appendChild(t),e}(l);var d,u;t.appendChild(c),u=s,!0===e.get(u)&&(d=!0,n.forEach(t=>{d?(t.style.display="none",t.style.opacity="0",t.style.transform="translateY(-10px)"):(t.style.display="",t.style.opacity="1",t.style.transform="translateY(0)")}),a(l,!0))}(function(t,e=null){if(e){const o=document.getElementById(e);if(o)return o.textContent=t,o}if("undefined"!=typeof GM_addStyle)try{return GM_addStyle(t),null}catch(t){console.warn("[Styles] GM_addStyle failed, falling back to style tag:",t)}const o=document.createElement("style");o.type="text/css",e&&(o.id=e),o.textContent=t,(document.head||document.documentElement).appendChild(o)})(t),function(t,e={}){const{debounce:o=100,observeBody:r=!0}=e;let a=null,n=null;const s=()=>{n&&clearTimeout(n),n=setTimeout(t,o)},i=()=>{t(),r&&(a=function(t,e=document.body,o={}){const r={childList:!0,subtree:!0,attributes:!1,characterData:!1,...o},a=new MutationObserver(e=>{t(e)});return a.observe(e,r),a}(()=>{s()}))};"loading"===document.readyState?document.addEventListener("DOMContentLoaded",i):i();const l=function(t,e={}){const{immediate:o=!0,watchTitle:r=!0,watchPopstate:a=!0}=e;let n=location.href,s=null;const i=()=>{const e=location.href;if(e!==n){const o=n;n=e,t(e,o)}};if(o&&t(location.href,null),a&&window.addEventListener("popstate",i),r){const t=document.querySelector("title");t&&(s=new MutationObserver(i),s.observe(t,{childList:!0,subtree:!0,characterData:!0}))}return()=>{s&&s.disconnect(),a&&window.removeEventListener("popstate",i)}}(()=>{s()},{immediate:!1}),c=()=>s();document.addEventListener("turbo:load",c),document.addEventListener("turbo:render",c)}(()=>{setTimeout(l,100)},{debounce:100,observeBody:!0})})();