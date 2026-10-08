import { mountShell, bindSegments, escapeHtml } from './ui.mjs';
import { monthly, projects, compare } from './data.mjs';
mountShell('dashboard');
const money = new Intl.NumberFormat('ja-JP');
let range = 6;
let selected = monthly.length - 1;
function renderMetrics() {
  const row = monthly[selected], previous = monthly[selected - 1];
  document.querySelector('#metrics').innerHTML = ['revenue', 'profit'].map((key) => {
    const label = key === 'revenue' ? '売上' : '営業利益';
    const { delta, percent } = compare(row[key], previous?.[key]);
    const change = delta == null ? '前月比 —' : `${delta >= 0 ? '+' : '−'}${(Math.abs(delta) / 10000).toFixed(1)}万円（${percent == null ? '算出不可' : `${percent >= 0 ? '+' : '−'}${Math.abs(percent).toFixed(1)}%`}）`;
    return `<div><div class="app-metric-label"><span class="app-dot series-${key}" aria-hidden="true"></span>${label}</div><p class="app-metric-value">${(row[key] / 10000).toFixed(1)} <small>万円</small></p><p class="app-change" data-direction="${delta == null || delta === 0 ? 'neutral' : delta < 0 ? 'down' : 'up'}">${change}</p><span class="app-caption">${row.month.replace('-', '年')}月 · 前月比</span></div>`;
  }).join('');
  document.querySelector('#chart-reset').hidden = selected === monthly.length - 1;
}
function renderChart() {
  const rows = monthly.slice(-range);
  const chart = document.querySelector('#revenue-chart');
  const width = Math.max(280, chart.clientWidth);
  chart.setAttribute('viewBox', `0 0 ${width} 280`);
  const plotRight = width - 54;
  const x = (index) => 12 + index * (plotRight - 12) / (rows.length - 1);
  const labelStride = Math.ceil(rows.length / Math.max(3, Math.floor(width / 56)));
  const y = (value) => 224 - value / 10000000 * 208;
  chart.innerHTML = `<g aria-hidden="true">${[0, 2500000, 5000000, 7500000, 10000000].map((value) => `<line class="grid-line" x1="12" x2="${plotRight}" y1="${y(value)}" y2="${y(value)}"/><text class="axis-label" x="${plotRight + 12}" y="${y(value) + 4}">${value / 10000}万</text>`).join('')}${['revenue', 'profit'].map((key) => `<path class="${key}-line" d="${rows.map((row, index) => `${index ? 'L' : 'M'}${x(index)},${y(row[key])}`).join(' ')}"/>`).join('')}${rows.filter((row, index) => index % labelStride === 0 || index === rows.length - 1).map((row) => `<text class="axis-label" x="${x(rows.indexOf(row))}" y="260" text-anchor="middle">${Number(row.month.slice(5))}月</text>`).join('')}</g>${rows.map((row, index) => `<circle class="chart-point" cx="${x(index)}" cy="${y(row.revenue)}" r="12" tabindex="${monthly.length - rows.length + index === selected ? 0 : -1}" role="button" data-index="${monthly.length - rows.length + index}" aria-label="${row.month} 売上${money.format(row.revenue)}円、営業利益${money.format(row.profit)}円"/>`).join('')}`;
  document.querySelector('#exact-values').innerHTML = `<table class="app-data-grid"><caption>選択した${range}か月の実績</caption><thead><tr><th scope="col">月</th><th scope="col" class="is-number">売上</th><th scope="col" class="is-number">営業利益</th></tr></thead><tbody>${rows.map((row) => `<tr><th scope="row">${row.month}</th><td class="is-number">¥${money.format(row.revenue)}</td><td class="is-number">¥${money.format(row.profit)}</td></tr>`).join('')}</tbody></table>`;
}
const chart = document.querySelector('#revenue-chart');
function selectPoint(event) { const index = event.target.dataset.index; if (index != null) { selected = Number(index); renderMetrics(); chart.querySelectorAll('.chart-point').forEach((point) => { point.tabIndex = Number(point.dataset.index) === selected ? 0 : -1; }); } }
chart.addEventListener('pointerover', selectPoint); chart.addEventListener('click', selectPoint); chart.addEventListener('focusin', selectPoint);
chart.addEventListener('keydown', (event) => {
  if (['Enter', ' '].includes(event.key)) { event.preventDefault(); selectPoint(event); }
  if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
    event.preventDefault(); const points = [...chart.querySelectorAll('.chart-point')]; const index = points.indexOf(document.activeElement);
    points[event.key === 'Home' ? 0 : event.key === 'End' ? points.length - 1 : Math.max(0, Math.min(points.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)))].focus();
  }
});
bindSegments(document.querySelector('#chart-range'), (value) => { range = Number(value); selected = monthly.length - 1; renderChart(); renderMetrics(); });
document.querySelector('#chart-reset').addEventListener('click', () => { selected = monthly.length - 1; renderMetrics(); document.querySelector('#chart-range button[aria-checked="true"]').focus(); });
document.querySelector('#project-list').innerHTML = projects.slice(0, 4).map((project) => `<li class="app-list-item"><span><strong>${escapeHtml(project.name)}</strong><small>${escapeHtml(project.owner)}</small></span><span class="app-badge" data-status="${project.status}"><span class="app-dot" aria-hidden="true"></span>${project.label}</span></li>`).join('');
function showState(state) {
  const content = document.querySelector('#dashboard-content'), panel = document.querySelector('#dashboard-state');
  content.hidden = state !== 'ready'; panel.hidden = state === 'ready';
  panel.setAttribute('aria-busy', String(state === 'loading'));
  if (state === 'loading') panel.innerHTML = '<div class="app-panel-heading"><h2>データを読み込んでいます</h2></div><div class="app-panel-body"><div class="app-skeleton" aria-hidden="true"></div></div>';
  if (state === 'empty') panel.innerHTML = '<div class="app-empty"><h2>まだ実績がありません</h2><p>運用アカウントを追加すると、実績を確認できます。</p><a class="ui-button" href="data-table.html" data-variant="primary">テーブルビューへ</a></div>';
  if (state === 'error') panel.innerHTML = '<div class="app-empty"><h2>実績を取得できませんでした</h2><p>もう一度お試しください。</p><button class="ui-button" type="button" id="retry" data-variant="secondary">再試行</button></div>';
  panel.querySelector('#retry')?.addEventListener('click', () => { document.querySelector('#dashboard-demo').value = 'ready'; showState('ready'); document.querySelector('#dashboard-demo').focus(); });
}
document.querySelector('#dashboard-demo').addEventListener('change', (event) => showState(event.target.value));
renderMetrics(); renderChart();

new ResizeObserver(() => renderChart()).observe(chart);
