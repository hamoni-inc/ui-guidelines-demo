export const monthly = [
  ['2025-11', 4800000, 1340000], ['2025-12', 5200000, 1520000],
  ['2026-01', 5600000, 1680000], ['2026-02', 5400000, 1450000],
  ['2026-03', 6300000, 1890000], ['2026-04', 6800000, 2140000],
  ['2026-05', 6500000, 1980000], ['2026-06', 7100000, 2390000],
  ['2026-07', 7600000, 2660000], ['2026-08', 7400000, 2520000],
  ['2026-09', 8100000, 2910000], ['2026-10', 8420000, 3120000],
].map(([month, revenue, profit]) => ({ month, revenue, profit }));
export const projects = [
  { name: '秋のブランド撮影', owner: '秋山 結衣', initials: 'AY', status: 'active', label: '進行中', start: '2026-10-05', end: '2026-10-08' },
  { name: 'カフェ特集', owner: '小川 蓮', initials: 'OR', status: 'done', label: '完了', start: '2026-10-05', end: '2026-10-06' },
  { name: '新店舗の紹介動画', owner: '高木 葵', initials: 'TA', status: 'active', label: '進行中', start: '2026-10-07', end: '2026-10-10' },
  { name: '月次レポート', owner: '秋山 結衣', initials: 'AY', status: 'planned', label: '予定', start: '2026-10-09', end: '2026-10-11' },
  { name: '次回撮影の準備', owner: '小川 蓮', initials: 'OR', status: 'planned', label: '予定', start: '2026-10-12', end: '2026-10-14' },
];
export const activity = [
  { time: '14:30', initials: 'AY', name: '秋山 結衣', action: '「秋のブランド撮影」の構成を更新しました。' },
  { time: '11:20', initials: 'OR', name: '小川 蓮', action: '「カフェ特集」の素材を共有しました。' },
  { time: '09:45', initials: 'TA', name: '高木 葵', action: '「新店舗の紹介動画」に着手しました。' },
];
export function compare(current, previous) {
  return { delta: current == null || previous == null ? null : current - previous, percent: current == null || !(previous > 0) ? null : (current - previous) / previous * 100 };
}
export function weekDates(offset = 0) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 9, 5 + offset * 7 + index));
    return date.toISOString().slice(0, 10);
  });
}
export function timelineSpan(project, dates) {
  const visible = dates.map((date, index) => date >= project.start && date <= project.end ? index : -1).filter((index) => index >= 0);
  return visible.length ? { start: visible[0] + 1, span: visible.length } : null;
}
