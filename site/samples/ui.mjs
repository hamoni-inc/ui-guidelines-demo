import { PAGES } from './navigation.mjs';
export { PAGES };

const paths = {
  chart: '<path d="M3 17l5-5 4 3 7-10M3 3v18h18"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11M3 14h18"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h3M8 17h7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0116 0v2"/>',
  sidebar: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  check: '<path d="M5 12l4 4L19 6"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/>',
  chevron: '<path d="M9 5l7 7-7 7"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  more: '<circle cx="5" cy="12" r=".7"/><circle cx="12" cy="12" r=".7"/><circle cx="19" cy="12" r=".7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
};
export function icon(name) { return `<svg class="app-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? paths.grid}</svg>`; }
export function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
const themeKey = 'hamoni-ui-demo:theme';
export function getTheme() { try { return localStorage.getItem(themeKey) ?? 'auto'; } catch { return 'auto'; } }
export function setTheme(value) {
  const theme = ['auto', 'light', 'dark'].includes(value) ? value : 'auto';
  if (theme === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  try { localStorage.setItem(themeKey, theme); } catch { /* プライベートモードでも動く */ }
  document.querySelectorAll('[data-theme-picker]').forEach((select) => { select.value = theme; });
  document.dispatchEvent(new CustomEvent('ui:theme', { detail: theme }));
}
setTheme(getTheme());

export function mountShell(pageId) {
  if (document.querySelector('.app-sidebar')) return;
  document.body.classList.add('with-shell');
  const main = document.querySelector('main');
  main.id = 'main-content';
  main.classList.add('app-content');
  main.tabIndex = -1;
  const sidebar = document.createElement('aside');
  sidebar.className = 'app-sidebar'; sidebar.id = 'app-sidebar'; sidebar.setAttribute('aria-label', 'サイドバー');
  const groups = [...new Set(PAGES.map((page) => page.group))];
  sidebar.innerHTML = `<div class="app-brand-row"><a class="app-brand" href="index.html">${icon('grid')}<span>Studio<span class="app-brand-caption">UIサンプル</span></span></a><button class="app-icon-button app-nav-close" type="button" aria-label="サイドバーを閉じる">${icon('close')}</button></div>
    <nav class="app-nav" aria-label="メインナビゲーション">${groups.map((group) => `<section class="app-nav-group"><h2>${group}</h2>${PAGES.filter((page) => page.group === group).map((page) => `<a class="app-nav-link" href="${page.file}"${page.id === pageId ? ' aria-current="page"' : ''}>${icon(page.icon)}<span>${page.label}</span></a>`).join('')}</section>`).join('')}</nav>
    <div class="app-sidebar-footer"><label class="app-appearance" for="app-theme">外観<select id="app-theme" data-theme-picker aria-label="外観"><option value="auto">自動</option><option value="light">ライト</option><option value="dark">ダーク</option></select></label><a class="app-profile-link" href="account.html"><span class="app-avatar">AY</span><span><strong>秋山 結衣</strong><small>サンプルアカウント</small></span>${icon('chevron')}</a></div>`;
  const skip = document.createElement('a'); skip.className = 'app-skip'; skip.href = '#main-content'; skip.textContent = '本文へ移動';
  const mobileBar = document.createElement('header'); mobileBar.className = 'app-mobile-bar';
  mobileBar.innerHTML = `<button class="app-icon-button" type="button" aria-label="サイドバーを開く" aria-controls="app-sidebar" aria-expanded="false">${icon('sidebar')}</button><span>Studio</span><a class="app-icon-button" href="account.html" aria-label="アカウント">${icon('person')}</a>`;
  const backdrop = document.createElement('button'); backdrop.className = 'app-nav-backdrop'; backdrop.type = 'button'; backdrop.tabIndex = -1; backdrop.setAttribute('aria-label', 'サイドバーを閉じる'); backdrop.hidden = true;
  document.body.prepend(skip, sidebar, mobileBar, backdrop);
  document.querySelector('#app-theme').value = getTheme();
  document.querySelector('#app-theme').addEventListener('change', (event) => setTheme(event.target.value));
  const toggle = mobileBar.querySelector('button');
  const media = matchMedia('(max-width: 720px)');
  let navOpen = false;
  function closeNav(restore = true) {
    navOpen = false; document.body.classList.remove('nav-open'); backdrop.hidden = true;
    sidebar.inert = media.matches; sidebar.removeAttribute('role'); sidebar.removeAttribute('aria-modal');
    main.inert = false; mobileBar.inert = false; toggle.setAttribute('aria-expanded', 'false');
    if (restore) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    if (navOpen) { closeNav(); return; }
    navOpen = true; sidebar.inert = false; sidebar.setAttribute('role', 'dialog'); sidebar.setAttribute('aria-modal', 'true');
    document.body.classList.add('nav-open'); backdrop.hidden = false; main.inert = true; mobileBar.inert = true; toggle.setAttribute('aria-expanded', 'true');
    sidebar.querySelector('[aria-current="page"]').focus();
  });
  backdrop.addEventListener('click', () => closeNav());
  sidebar.querySelector('.app-nav-close').addEventListener('click', () => closeNav());
  document.addEventListener('keydown', (event) => {
    if (!navOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); closeNav(); return; }
    if (event.key === 'Tab') {
      const items = [...sidebar.querySelectorAll('a, button, select')].filter((item) => item.getClientRects().length);
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }, true);
  media.addEventListener('change', () => closeNav(false));
  closeNav(false);
  document.addEventListener('ui:modal', (event) => { sidebar.inert = event.detail || media.matches; mobileBar.inert = event.detail; });
}

const toastQueue = [];
let activeToast = null;
let toastTimer;
export function showToast(message, { kind = 'success', action, actionLabel = '取り消す', onAction } = {}) {
  const entry = { message, kind, action: action ?? Boolean(onAction), actionLabel, onAction, origin: document.activeElement };
  toastQueue.push(entry);
  if (!activeToast) presentNextToast();
  return { dismiss() { if (activeToast === entry) dismissToast(); else { const index = toastQueue.indexOf(entry); if (index >= 0) toastQueue.splice(index, 1); } } };
}
function presentNextToast() {
  activeToast = toastQueue.shift();
  if (!activeToast) return;
  const entry = activeToast;
  const toast = document.createElement('div'); toast.className = 'app-toast'; toast.dataset.kind = activeToast.kind;
  const label = document.createElement('span'); label.className = 'app-toast-message'; label.setAttribute('role', activeToast.kind === 'error' ? 'alert' : 'status'); label.textContent = activeToast.message;
  toast.innerHTML = icon(activeToast.kind === 'error' ? 'alert' : 'check'); toast.append(label);
  if (activeToast.action) {
    const action = document.createElement('button'); action.className = 'app-toast-action'; action.type = 'button'; action.textContent = activeToast.actionLabel;
    action.addEventListener('click', async () => {
      action.disabled = true;
      try { await entry.onAction?.(); if (activeToast === entry) dismissToast(); }
      catch { label.setAttribute('role', 'alert'); label.textContent = '操作に失敗しました。もう一度お試しください。'; toast.dataset.kind = 'error'; action.disabled = false; }
    });
    toast.append(action);
  }
  const close = document.createElement('button'); close.className = 'app-icon-button'; close.type = 'button'; close.setAttribute('aria-label', '通知を閉じる'); close.innerHTML = icon('close'); close.addEventListener('click', dismissToast); toast.append(close);
  document.body.append(toast);
  function schedule() {
    clearTimeout(toastTimer);
    // 操作付きとエラーはユーザーが閉じる。通常通知のみ自動消去する。
    if (!activeToast?.action && activeToast?.kind !== 'error' && !toast.matches(':hover, :focus-within')) {
      toastTimer = setTimeout(dismissToast, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--toast-timeout')) || 4000);
    }
  }
  toast.addEventListener('mouseenter', () => clearTimeout(toastTimer)); toast.addEventListener('focusin', () => clearTimeout(toastTimer));
  toast.addEventListener('mouseleave', schedule); toast.addEventListener('focusout', schedule); schedule();
}
function dismissToast() {
  clearTimeout(toastTimer);
  const toast = document.querySelector('.app-toast');
  const restore = toast?.contains(document.activeElement);
  const origin = activeToast?.origin;
  toast?.remove(); activeToast = null;
  if (restore && origin?.isConnected) origin.focus();
  presentNextToast();
}

export function bindSegments(element, onChange) {
  const buttons = [...element.querySelectorAll('button')];
  function select(button) {
    element.style.setProperty('--index', buttons.indexOf(button));
    buttons.forEach((item) => { const selected = item === button; item.setAttribute('aria-checked', String(selected)); item.tabIndex = selected ? 0 : -1; });
    onChange(button.dataset.value);
  }
  element.style.setProperty('--count', buttons.length);
  element.style.setProperty('--index', buttons.findIndex((button) => button.getAttribute('aria-checked') === 'true'));
  buttons.forEach((button) => { button.tabIndex = button.getAttribute('aria-checked') === 'true' ? 0 : -1; button.addEventListener('click', () => select(button)); });
  element.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault(); const index = buttons.indexOf(document.activeElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    select(buttons[next]); buttons[next].focus();
  });
}
export function openDialog(dialog) {
  const origin = document.activeElement; dialog.showModal();
  document.dispatchEvent(new CustomEvent('ui:modal', { detail: true }));
  dialog.addEventListener('close', () => { document.dispatchEvent(new CustomEvent('ui:modal', { detail: false })); if (origin?.isConnected) origin.focus(); }, { once: true });
}

export function bindMenu(trigger, menu, onSelect) {
  const items = [...menu.querySelectorAll('[role="menuitem"]')];
  items.forEach((item) => { item.tabIndex = -1; });
  function close(restore = true) { menu.hidden = true; trigger.setAttribute('aria-expanded', 'false'); if (restore) trigger.focus(); }
  function open(index = 0) { menu.hidden = false; trigger.setAttribute('aria-expanded', 'true'); items[index].focus(); }
  trigger.addEventListener('click', () => menu.hidden ? open() : close());
  trigger.addEventListener('keydown', (event) => { if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); open(event.key === 'ArrowDown' ? 0 : items.length - 1); } });
  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
    else if (event.key === 'Tab') close(false);
    else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault(); const index = items.indexOf(document.activeElement);
      items[event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
    }
  });
  menu.addEventListener('click', (event) => { const item = event.target.closest('[role="menuitem"]'); if (!item) return; close(); if (item.dataset.menuAction) onSelect(item); });
  document.addEventListener('pointerdown', (event) => { if (!menu.hidden && !menu.contains(event.target) && !trigger.contains(event.target)) close(false); });
  document.addEventListener('focusin', (event) => { if (!menu.hidden && !menu.contains(event.target) && event.target !== trigger) close(false); });
}
