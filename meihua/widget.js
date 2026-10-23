// 매화역수 점괘 위젯. URL 파라미터로 외부에서 호출할 수 있다.
//   ?a=12&b=34  → 숫자 두 개로 점괘
//   ?t=now      → 지금 시각(음력 연월일시)으로 점괘
import { fromNumbers, fromLunarTime } from './meihua.js?v=2026102304';

const LUCK_CLASS = { 대길: 'great', 길: 'good', 소흉: 'caution', 흉: 'bad' };

function lineSvg(lines, moving) {
  // 위 효부터 그리기
  const rows = lines.map((yang, i) => ({ yang, moving: i + 1 === moving })).reverse();
  return `<svg class="hex" viewBox="0 0 100 ${rows.length * 16}" role="img" aria-label="괘 그림">
    ${rows.map((r, i) => {
      const y = i * 16 + 4;
      const cls = r.moving ? 'line moving' : 'line';
      return r.yang
        ? `<rect class="${cls}" x="0" y="${y}" width="100" height="8" rx="2"/>`
        : `<rect class="${cls}" x="0" y="${y}" width="44" height="8" rx="2"/><rect class="${cls}" x="56" y="${y}" width="44" height="8" rx="2"/>`;
    }).join('')}
  </svg>`;
}

function hexCard(title, hex, lines, moving, sub) {
  return `<div class="hex-card">
    <div class="hex-title">${title}</div>
    ${lineSvg(lines, moving)}
    <div class="hex-name">${hex.ko} <span class="han">${hex.han}</span></div>
    <div class="hex-sub">${sub || `${hex.upperTrigram.nature} 위 ${hex.lowerTrigram.nature} · 제${hex.number}괘`}</div>
  </div>`;
}

// 처음(내호괘) → 나중(외호괘) 순서로 체괘에 주는 영향
function influenceHtml(r) {
  return r.influence.map(t => `
    <div class="influence ${LUCK_CLASS[t.relation.luck]}">
      <span class="stage">${t.stage}</span>
      <div>
        <strong>${t.role} ${t.ko}(${t.han}) ${t.element} → 체괘 ${r.body.ko}(${r.body.han}) ${r.body.element}</strong>
        <p>${t.relation.name} · <b>${t.relation.luck}</b> — ${t.relation.text}</p>
      </div>
    </div>`).join('');
}

function hexLines(hex) {
  return [...hex.lowerTrigram.lines, ...hex.upperTrigram.lines];
}

export function render(el, r) {
  const changedLines = r.lines.slice();
  changedLines[r.moving - 1] = 1 - changedLines[r.moving - 1];
  const inputText = r.method === 'time'
    ? `음력 ${r.input.yearBranch}년 ${r.input.month}월 ${r.input.day}일 ${r.input.hourBranch}시`
    : `숫자 ${r.input.a}, ${r.input.b} · ${r.input.hourBranch}시(${r.input.hourNum})`;

  el.innerHTML = `
    <p class="input">${inputText} · 동효 ${r.moving}효</p>
    <div class="hex-row">
      ${hexCard('본괘 · 현재', r.original, r.lines, r.moving)}
      ${hexCard('호괘 · 영향과 과정', r.mutual, hexLines(r.mutual), 0,
        `내호 ${r.influence[0].han}(${r.influence[0].element}) · 외호 ${r.influence[1].han}(${r.influence[1].element})`)}
      ${hexCard('변괘 · 결과', r.changed, changedLines, 0)}
    </div>
    <div class="verdict ${LUCK_CLASS[r.relation.luck]}">
      <span class="luck">${r.relation.luck}</span>
      <div>
        <strong>${r.relation.name}</strong>
        <p>체괘(나) ${r.body.han} ${r.body.element} · 용괘(일) ${r.use.han} ${r.use.element}</p>
        <p>${r.relation.text}</p>
      </div>
    </div>
    <dl class="meanings">
      <dt>현재 (${r.original.ko})</dt><dd>${r.original.meaning}</dd>
      <dt>영향과 과정</dt><dd class="influence-list">${influenceHtml(r)}</dd>
      <dt>결과 (${r.changed.ko})</dt><dd>${r.changed.meaning}</dd>
    </dl>`;
}

const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 서울 시간 기준 { year, month, day, hour }
function seoulNow(date = new Date()) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', hourCycle: 'h23',
  }).formatToParts(date).map(x => [x.type, Number(x.value)]));
}

// 시진 번호: 子=1, 丑=2, ... 亥=12
function hourBranchNum(hour) {
  return Math.floor((hour + 1) / 2) % 12 + 1;
}

// 서울 시간 기준 한국 음력(한국천문연구원 기준)으로 계산한다.
// 브라우저에 korean-lunar-calendar(전역 KoreanLunarCalendar)가 로드되어 있어야 한다.
export function fromNow(date = new Date()) {
  const p = seoulNow(date);
  const cal = new window.KoreanLunarCalendar();
  cal.setSolarDate(p.year, p.month, p.day);
  const lunar = cal.getLunarCalendar();
  return fromLunarTime({
    yearBranch: BRANCHES[((lunar.year - 4) % 12 + 12) % 12],
    month: lunar.month,
    day: lunar.day,
    hourBranch: BRANCHES[hourBranchNum(p.hour) - 1],
  });
}

export function fromParams(params) {
  if (params.has('a') && params.has('b')) {
    const a = Number(params.get('a'));
    const b = Number(params.get('b'));
    const h = params.has('h') ? Number(params.get('h')) : hourBranchNum(seoulNow().hour);
    if (Number.isFinite(a) && Number.isFinite(b) && a > 0 && b > 0 && h > 0) return fromNumbers(a, b, h);
  }
  if (params.get('t') === 'now') return fromNow();
  return null;
}

export function mount({ result, form }) {
  const show = (r) => { render(result, r); result.hidden = false; };

  const fromUrl = fromParams(new URLSearchParams(location.search));
  if (fromUrl) show(fromUrl);
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const a = Number(form.a.value);
    const b = Number(form.b.value);
    if (!(a > 0 && b > 0)) return;
    const h = hourBranchNum(seoulNow().hour);
    show(fromNumbers(a, b, h));
    history.replaceState(null, '', `?a=${a}&b=${b}&h=${h}`);
  });
  form.querySelector('[data-now]').addEventListener('click', () => {
    show(fromNow());
    history.replaceState(null, '', '?t=now');
  });
}
