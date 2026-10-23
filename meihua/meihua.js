// 매화역수(梅花易數) 점괘 계산 모듈. 외부 라이브러리 없이 동작한다.

// 선천팔괘 수: 乾1 兌2 離3 震4 巽5 坎6 艮7 坤8
// lines는 아래 효부터 위 효 순서 (1 = 양, 0 = 음)
export const TRIGRAMS = {
  1: { han: '乾', ko: '건', nature: '하늘', element: '金', lines: [1, 1, 1] },
  2: { han: '兌', ko: '태', nature: '연못', element: '金', lines: [1, 1, 0] },
  3: { han: '離', ko: '리', nature: '불', element: '火', lines: [1, 0, 1] },
  4: { han: '震', ko: '진', nature: '우레', element: '木', lines: [1, 0, 0] },
  5: { han: '巽', ko: '손', nature: '바람', element: '木', lines: [0, 1, 1] },
  6: { han: '坎', ko: '감', nature: '물', element: '水', lines: [0, 1, 0] },
  7: { han: '艮', ko: '간', nature: '산', element: '土', lines: [0, 0, 1] },
  8: { han: '坤', ko: '곤', nature: '땅', element: '土', lines: [0, 0, 0] },
};

// [위 괘, 아래 괘, 한자, 한글, 풀이] — 주역 64괘 순서
const HEXAGRAMS = [
  [1, 1, '乾', '중천건', '하늘의 굳셈. 스스로 힘써 쉬지 않으면 크게 형통한다.'],
  [8, 8, '坤', '중지곤', '땅의 유순함. 따르고 포용하면 이롭다.'],
  [6, 4, '屯', '수뢰둔', '시작의 어려움. 서두르지 말고 기반을 다져라.'],
  [7, 6, '蒙', '산수몽', '어리고 몽매함. 배우고 가르침을 구하라.'],
  [6, 1, '需', '수천수', '기다림. 때가 오기를 참고 기다리면 길하다.'],
  [1, 6, '訟', '천수송', '다툼. 끝까지 다투면 흉하니 중도에서 멈춰라.'],
  [8, 6, '師', '지수사', '무리를 이끎. 바른 지도자를 따르면 길하다.'],
  [6, 8, '比', '수지비', '친하게 도움. 사람들과 화합하면 길하다.'],
  [5, 1, '小畜', '풍천소축', '작게 쌓음. 아직 때가 이르니 조금씩 모아라.'],
  [1, 2, '履', '천택리', '조심스레 밟음. 예의를 지키면 위험을 피한다.'],
  [8, 1, '泰', '지천태', '태평함. 위아래가 통하여 크게 길하다.'],
  [1, 8, '否', '천지비', '막힘. 소통이 끊기니 몸을 낮추고 때를 기다려라.'],
  [1, 3, '同人', '천화동인', '사람과 함께함. 뜻을 같이하면 큰일을 이룬다.'],
  [3, 1, '大有', '화천대유', '크게 소유함. 풍요로우니 겸손을 잃지 마라.'],
  [8, 7, '謙', '지산겸', '겸손. 낮출수록 높아지니 끝이 좋다.'],
  [4, 8, '豫', '뇌지예', '기쁨과 준비. 미리 대비하면 즐거움이 온다.'],
  [2, 4, '隨', '택뢰수', '따름. 때를 따르고 바른 것을 좇아라.'],
  [7, 5, '蠱', '산풍고', '부패를 바로잡음. 묵은 일을 고치면 새로워진다.'],
  [8, 2, '臨', '지택림', '다가감. 좋은 기운이 다가오니 성실히 임하라.'],
  [5, 8, '觀', '풍지관', '바라봄. 차분히 살피고 본보기가 되어라.'],
  [3, 4, '噬嗑', '화뢰서합', '씹어서 합함. 걸림돌을 단호히 제거하라.'],
  [7, 3, '賁', '산화비', '꾸밈. 겉보다 속을 채워야 한다.'],
  [7, 8, '剝', '산지박', '깎여 나감. 무리하지 말고 지키는 데 힘써라.'],
  [8, 4, '復', '지뢰복', '돌아옴. 다시 좋은 기운이 시작된다.'],
  [1, 4, '無妄', '천뢰무망', '거짓 없음. 순리대로 하면 길하고 욕심내면 흉하다.'],
  [7, 1, '大畜', '산천대축', '크게 쌓음. 힘을 기르면 큰일을 해낸다.'],
  [7, 4, '頤', '산뢰이', '기름. 말과 먹는 것을 삼가고 몸을 돌보라.'],
  [2, 5, '大過', '택풍대과', '크게 지나침. 부담이 크니 균형을 찾아라.'],
  [6, 6, '坎', '중수감', '거듭된 험난함. 믿음을 지키면 헤쳐 나간다.'],
  [3, 3, '離', '중화리', '밝음과 붙음. 바른 것에 의지하면 빛난다.'],
  [2, 7, '咸', '택산함', '느낌과 감응. 마음이 통하니 인연에 길하다.'],
  [4, 5, '恒', '뇌풍항', '변함없음. 꾸준히 지키면 이롭다.'],
  [1, 7, '遯', '천산돈', '물러남. 때가 아니니 물러나 몸을 지켜라.'],
  [4, 1, '大壯', '뇌천대장', '크게 굳셈. 힘이 넘치니 바르게 써라.'],
  [3, 8, '晉', '화지진', '나아감. 밝게 떠오르니 승진과 발전이 있다.'],
  [8, 3, '明夷', '지화명이', '밝음이 상함. 재능을 감추고 견뎌라.'],
  [5, 3, '家人', '풍화가인', '가정. 집안을 바로 하면 모든 일이 바르다.'],
  [3, 2, '睽', '화택규', '어긋남. 작은 일은 길하나 큰일은 삼가라.'],
  [6, 7, '蹇', '수산건', '절름거림. 어려움이 있으니 도움을 구하라.'],
  [4, 6, '解', '뇌수해', '풀림. 어려움이 풀리니 빨리 움직여라.'],
  [7, 2, '損', '산택손', '덜어냄. 줄여서 나누면 나중에 더해진다.'],
  [5, 4, '益', '풍뢰익', '더함. 나아가 일을 벌이면 이롭다.'],
  [2, 1, '夬', '택천쾌', '결단. 과감히 끊어내되 무력은 쓰지 마라.'],
  [1, 5, '姤', '천풍구', '만남. 뜻밖의 만남이 있으나 신중하라.'],
  [2, 8, '萃', '택지췌', '모임. 사람과 재물이 모이니 길하다.'],
  [8, 5, '升', '지풍승', '올라감. 차근차근 오르면 길하다.'],
  [2, 6, '困', '택수곤', '곤궁함. 말보다 행동으로 버텨라.'],
  [6, 5, '井', '수풍정', '우물. 변치 않는 근본을 지켜라.'],
  [2, 3, '革', '택화혁', '바꿈. 때가 되었으니 변화를 받아들여라.'],
  [3, 5, '鼎', '화풍정', '솥. 새로운 것을 이루니 크게 길하다.'],
  [4, 4, '震', '중뢰진', '우레. 놀랄 일이 있으나 침착하면 무사하다.'],
  [7, 7, '艮', '중산간', '그침. 멈출 때 멈추면 허물이 없다.'],
  [5, 7, '漸', '풍산점', '점진. 차례대로 나아가면 길하다.'],
  [4, 2, '歸妹', '뇌택귀매', '시집감. 서두르면 흉하니 분수를 지켜라.'],
  [4, 3, '豐', '뇌화풍', '풍성함. 가장 성할 때이니 지나침을 경계하라.'],
  [3, 7, '旅', '화산려', '나그네. 낯선 곳에서는 겸손하고 조심하라.'],
  [5, 5, '巽', '중풍손', '바람처럼 들어감. 유순하게 따르면 이롭다.'],
  [2, 2, '兌', '중택태', '기쁨. 즐겁게 소통하면 길하다.'],
  [5, 6, '渙', '풍수환', '흩어짐. 흩어진 마음을 다시 모아라.'],
  [6, 2, '節', '수택절', '절제. 알맞게 절제하면 형통한다.'],
  [5, 2, '中孚', '풍택중부', '진실한 믿음. 정성이 통하니 길하다.'],
  [4, 7, '小過', '뇌산소과', '조금 지나침. 작은 일은 되나 큰일은 삼가라.'],
  [6, 3, '既濟', '수화기제', '이미 이룸. 이룬 뒤를 경계하라.'],
  [3, 6, '未濟', '화수미제', '아직 이루지 못함. 신중히 하면 끝내 이룬다.'],
];

const BY_TRIGRAMS = {};
HEXAGRAMS.forEach(([upper, lower, han, ko, meaning], i) => {
  BY_TRIGRAMS[`${upper}-${lower}`] = { number: i + 1, upper, lower, han, ko, meaning };
});

const TRIGRAM_BY_LINES = {};
for (const [num, t] of Object.entries(TRIGRAMS)) TRIGRAM_BY_LINES[t.lines.join('')] = Number(num);

// 오행 상생: 木→火→土→金→水→木, 상극: 木→土→水→火→金→木
const GENERATES = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const CONTROLS = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const mod = (n, m) => ((n % m) + m) % m || m;

function hexagram(upper, lower) {
  const h = BY_TRIGRAMS[`${upper}-${lower}`];
  return { ...h, upperTrigram: TRIGRAMS[upper], lowerTrigram: TRIGRAMS[lower] };
}

function linesOf(upper, lower) {
  return [...TRIGRAMS[lower].lines, ...TRIGRAMS[upper].lines];
}

function fromLines(lines) {
  return hexagram(TRIGRAM_BY_LINES[lines.slice(3, 6).join('')], TRIGRAM_BY_LINES[lines.slice(0, 3).join('')]);
}

function relation(body, use) {
  if (body === use) return { name: '비화(比和)', luck: '길', text: '체와 용이 같은 기운이라 일이 순조롭다.' };
  if (GENERATES[use] === body) return { name: '용생체(用生體)', luck: '대길', text: '바깥 일이 나를 도우니 크게 길하다.' };
  if (CONTROLS[body] === use) return { name: '체극용(體克用)', luck: '길', text: '내가 일을 이끄니 노력하면 이룬다.' };
  if (GENERATES[body] === use) return { name: '체생용(體生用)', luck: '소흉', text: '내 힘이 빠져나가니 손해나 수고가 따른다.' };
  return { name: '용극체(用克體)', luck: '흉', text: '바깥 일이 나를 누르니 신중하고 조심하라.' };
}

// 호괘(내호·외호)가 체괘에 주는 영향
function mutualRelation(body, mutual) {
  if (body === mutual) return { name: '비화(比和)', luck: '길', text: '같은 기운이 이어져 순조롭다.' };
  if (GENERATES[mutual] === body) return { name: '호생체(互生體)', luck: '대길', text: '도움이 들어와 체괘가 힘을 얻는다.' };
  if (CONTROLS[body] === mutual) return { name: '체극호(體克互)', luck: '길', text: '체괘가 다스릴 수 있으니 노력하면 풀린다.' };
  if (GENERATES[body] === mutual) return { name: '체생호(體生互)', luck: '소흉', text: '체괘의 힘이 빠져나가 수고가 따른다.' };
  return { name: '호극체(互克體)', luck: '흉', text: '체괘가 눌리니 신중하고 조심해야 한다.' };
}

// 위 괘 수, 아래 괘 수(1~8), 동효(1~6, 아래부터)로 점괘를 풀이한다.
export function divine({ upper, lower, moving, method = 'manual', input = {} }) {
  upper = mod(upper, 8);
  lower = mod(lower, 8);
  moving = mod(moving, 6);

  const lines = linesOf(upper, lower);
  const changed = lines.slice();
  changed[moving - 1] = 1 - changed[moving - 1];

  // 동효가 있는 괘가 용(用), 없는 괘가 체(體)
  const bodyNum = moving <= 3 ? upper : lower;
  const useNum = moving <= 3 ? lower : upper;
  const body = TRIGRAMS[bodyNum];
  const use = TRIGRAMS[useNum];

  // 영향과 과정: 호괘를 하나의 괘(예: 화수미제)로 보지 않는다.
  // 체괘를 내호괘(3·4·5효)와 외호괘(2·3·4효) 사이에 두고 두 괘를 새로 세운다.
  //   초반: 내호괘(위) + 체괘(아래)   예) 풍산점 3효 → 離 위 巽 아래 = 화풍정
  //   후반: 체괘(위) + 외호괘(아래)   예) 풍산점 3효 → 巽 위 坎 아래 = 풍수환
  const innerNum = TRIGRAM_BY_LINES[[lines[2], lines[3], lines[4]].join('')];
  const outerNum = TRIGRAM_BY_LINES[[lines[1], lines[2], lines[3]].join('')];
  const influence = [
    {
      stage: '초반', role: '내호괘', ...TRIGRAMS[innerNum], number: innerNum,
      hexagram: hexagram(innerNum, bodyNum),
      relation: mutualRelation(body.element, TRIGRAMS[innerNum].element),
    },
    {
      stage: '후반', role: '외호괘', ...TRIGRAMS[outerNum], number: outerNum,
      hexagram: hexagram(bodyNum, outerNum),
      relation: mutualRelation(body.element, TRIGRAMS[outerNum].element),
    },
  ];

  return {
    method,
    input,
    original: hexagram(upper, lower),
    changed: fromLines(changed),
    moving,
    lines,
    body: { ...body, number: bodyNum },
    use: { ...use, number: useNum },
    relation: relation(body.element, use.element),
    influence,
  };
}

// 숫자 두 개로 괘를 세운다. 동효는 두 수의 합으로 정한다.
// 숫자 두 개와 시진 번호(子=1 ~ 亥=12)로 괘를 세운다.
// 동효는 (두 수 + 시진 수)를 6으로 나눈 나머지 (0이면 6효).
export function fromNumbers(a, b, hourNum) {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  hourNum = mod(Math.abs(Math.trunc(hourNum)), 12);
  return divine({
    upper: a, lower: b, moving: a + b + hourNum, method: 'numbers',
    input: { a, b, hourNum, hourBranch: BRANCHES[hourNum - 1] },
  });
}

// 음력 날짜와 시각으로 괘를 세운다 (매화역수 연월일시 기괘법).
// yearBranch, hourBranch: 地支 한자 (예: '午'), month/day: 음력 월/일
export function fromLunarTime({ yearBranch, month, day, hourBranch }) {
  const y = BRANCHES.indexOf(yearBranch) + 1;
  const h = BRANCHES.indexOf(hourBranch) + 1;
  if (!y || !h) throw new Error('yearBranch와 hourBranch는 子~亥 중 하나여야 합니다.');
  month = Math.abs(month);
  const base = y + month + day;
  return divine({
    upper: base,
    lower: base + h,
    moving: base + h,
    method: 'time',
    input: { yearBranch, month, day, hourBranch },
  });
}
