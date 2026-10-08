import { mountShell, icon, bindSegments, escapeHtml, openDialog } from './ui.mjs';
import { projects, activity, weekDates, timelineSpan } from './data.mjs';
mountShell('timeline');
let offset = 0;
document.querySelector('#prev-week').innerHTML = icon('left'); document.querySelector('#next-week').innerHTML = icon('chevron');
function render() {
  const dates = weekDates(offset);
  const labels = ['月', '火', '水', '木', '金', '土', '日'];
  const monthLabel = (date) => `${date.slice(0, 4)}年${Number(date.slice(5, 7))}月`;
  document.querySelector('#period-label').textContent = dates[0].slice(0, 7) === dates[6].slice(0, 7) ? monthLabel(dates[0]) : `${monthLabel(dates[0])} — ${monthLabel(dates[6])}`;
  document.querySelector('#week-label').textContent = `${Number(dates[0].slice(5, 7))}月${Number(dates[0].slice(8))}日 — ${Number(dates[6].slice(5, 7))}月${Number(dates[6].slice(8))}日`;
  document.querySelector('#timeline-grid').innerHTML = `<div class="app-timeline-header"><span>プロジェクト</span>${dates.map((date, index) => `<span class="${date === '2026-10-07' ? 'is-today' : ''}"${date === '2026-10-07' ? ' aria-current="date"' : ''}><span>${labels[index]}${date === '2026-10-07' ? ' · 今日' : ''}</span><span class="app-timeline-date">${Number(date.slice(8))}</span></span>`).join('')}</div>${projects.map((project, index) => {
    const span = timelineSpan(project, dates);
    return `<div class="app-timeline-row"><div class="app-timeline-label"><strong>${escapeHtml(project.name)}</strong><small>${escapeHtml(project.owner)}</small></div><div class="app-timeline-track">${dates.map((date, day) => `<span style="grid-column:${day + 1}" class="${date === '2026-10-07' ? 'is-today' : ''}" aria-hidden="true"></span>`).join('')}${span ? `<button type="button" class="app-timeline-bar" data-project="${index}" data-status="${project.status}" style="grid-column:${span.start} / span ${span.span}" aria-label="${escapeHtml(project.name)}、担当${escapeHtml(project.owner)}、${project.start}から${project.end}、${project.label}"><span class="app-timeline-event-title">${escapeHtml(project.name)}</span><span class="app-timeline-event-state">${escapeHtml(project.label)}</span></button>` : ''}</div></div>`;
  }).join('')}`;
}
document.querySelector('#prev-week').addEventListener('click', () => { offset--; render(); });
document.querySelector('#next-week').addEventListener('click', () => { offset++; render(); });
document.querySelector('#this-week').addEventListener('click', () => { offset = 0; render(); });
document.querySelector('#timeline-grid').addEventListener('click', (event) => {
  const button = event.target.closest('[data-project]'); if (!button) return;
  const project = projects[Number(button.dataset.project)];
  document.querySelector('#project-title').textContent = project.name;
  document.querySelector('#project-detail').innerHTML = `<p>担当 · ${escapeHtml(project.owner)}</p><p>期間 · ${project.start} — ${project.end}</p><p>状態 · ${project.label}</p>`;
  openDialog(document.querySelector('#project-dialog'));
});
document.querySelector('#timeline-summary').textContent = `${projects.length}件のプロジェクト`;
bindSegments(document.querySelector('#timeline-view'), (value) => { document.querySelector('#schedule').hidden = value !== 'schedule'; document.querySelector('#activity-panel').hidden = value !== 'activity'; document.querySelector('#timeline-summary').textContent = value === 'schedule' ? `${projects.length}件のプロジェクト` : `${activity.length}件の更新`; });
document.querySelector('#activity-list').innerHTML = activity.map((item) => `<li><span class="app-avatar">${item.initials}</span><div><p><strong>${escapeHtml(item.name)}</strong> · <time>${item.time}</time></p><p class="app-muted">${escapeHtml(item.action)}</p></div></li>`).join('');
render();
