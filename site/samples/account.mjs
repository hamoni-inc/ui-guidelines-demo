import { mountShell, setTheme, getTheme, showToast, openDialog } from './ui.mjs';
mountShell('account');
const form = document.querySelector('#profile-form');
const fields = [...form.querySelectorAll('input')];
const read = () => fields.map((field) => field.value);
let saved = read();
let previous = null;
let savedToast = null;
const feedback = document.querySelector('#profile-feedback');
const error = document.querySelector('#profile-error');
const undo = document.querySelector('#profile-undo');
function write(values) { fields.forEach((field, index) => { field.value = values[index]; }); }
function renderName() { document.querySelector('#profile-heading').textContent = saved[0]; }
function restore() {
  if (!previous) return;
  saved = previous; previous = null; write(saved); renderName(); undo.hidden = true;
  feedback.textContent = '前の保存を取り消しました（見本）。';
  savedToast?.dismiss();
}
function setSaving(busy) {
  form.setAttribute('aria-busy', String(busy));
  form.querySelectorAll('input, button').forEach((control) => { control.disabled = busy; });
  document.querySelector('#profile-save').textContent = busy ? '保存中…' : '変更を保存';
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  let invalid = null;
  for (const field of fields.slice(0, 2)) {
    const valid = field.value.trim().length > 0 && field.validity.valid;
    document.querySelector(`#${field.id}-error`).hidden = valid;
    field.setAttribute('aria-invalid', String(!valid));
    if (!valid && !invalid) invalid = field;
  }
  if (invalid) { invalid.focus(); return; }
  const state = document.querySelector('#account-state').value;
  error.hidden = state !== 'error';
  if (state === 'error') { feedback.textContent = '変更は保存されていません。'; return; }
  if (state === 'saving') { setSaving(true); feedback.textContent = '保存中です。'; return; }
  previous = saved; saved = read(); renderName(); undo.hidden = false;
  feedback.textContent = 'プロフィールを保存しました（見本）。';
  savedToast?.dismiss();
  savedToast = showToast('プロフィールを保存しました', { onAction: restore });
});
fields.forEach((field) => field.addEventListener('input', () => {
  field.removeAttribute('aria-invalid'); const hint = document.querySelector(`#${field.id}-error`); if (hint) hint.hidden = true;
}));
undo.addEventListener('click', restore);
document.querySelector('#profile-reset').addEventListener('click', () => { write(saved); error.hidden = true; feedback.textContent = '未保存の変更をリセットしました。'; fields[0].focus(); });
document.querySelector('#account-state').addEventListener('change', () => { setSaving(false); feedback.textContent = '保存の状態を選びました。変更を保存して確認できます。'; });
const theme = document.querySelector('#account-theme'); theme.value = getTheme(); theme.addEventListener('change', (event) => setTheme(event.target.value));
document.querySelector('#email-summary').addEventListener('change', (event) => { document.querySelector('#preference-feedback').textContent = `週次サマリーを${event.target.checked ? '有効' : '無効'}にしました（見本）。`; });
document.querySelector('#security-detail').addEventListener('click', () => openDialog(document.querySelector('#security-dialog')));
