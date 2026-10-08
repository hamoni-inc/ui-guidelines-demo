import { mountShell, showToast, bindSegments, bindMenu, openDialog, icon } from './ui.mjs';
mountShell('components');
document.querySelector('[data-icon]').innerHTML = icon('grid');
document.querySelector('#toast-success').addEventListener('click', () => showToast('変更を保存しました'));
document.querySelector('#toast-error').addEventListener('click', () => showToast('接続できませんでした。もう一度お試しください。', { kind: 'error', action: true, actionLabel: '再試行', onAction: () => { document.querySelector('#toast-feedback').textContent = '再試行に成功しました（見本）。'; } }));
let archived = false;
function renderArchive() { document.querySelector('#archive-status').textContent = `「秋の制作メモ」は${archived ? 'アーカイブされています' : '表示中です'}。`; document.querySelector('#archive-restore').hidden = !archived; }
function restoreArchive() { archived = false; renderArchive(); }
document.querySelector('#toast-undo-demo').addEventListener('click', () => { if (archived) return; archived = true; renderArchive(); showToast('制作メモをアーカイブしました', { onAction: restoreArchive }); });
document.querySelector('#archive-restore').addEventListener('click', restoreArchive);
document.querySelectorAll('[data-demo-button]').forEach((button) => button.addEventListener('click', () => { document.querySelector('#button-feedback').textContent = `${button.textContent}を実行しました（見本）。`; }));
bindSegments(document.querySelector('#demo-segments'), (value) => { document.querySelector('#segment-feedback').textContent = `${value}を選択しています。`; });
bindMenu(document.querySelector('#sample-menu-button'), document.querySelector('#sample-menu'), (button) => showToast(button.dataset.menuAction));
const dialog = document.querySelector('#delete-dialog');
document.querySelector('#delete-demo').addEventListener('click', () => openDialog(dialog));
dialog.addEventListener('close', () => { if (dialog.returnValue === 'delete') document.querySelector('#button-feedback').textContent = '削除操作を実行しました（見本）。'; });

function renderViewport() { document.querySelector('#viewport-info').textContent = `CSSの表示幅: ${window.innerWidth}px / 高さ: ${window.innerHeight}px / ピクセル比: ${window.devicePixelRatio}`; }
window.addEventListener('resize', renderViewport); renderViewport();
