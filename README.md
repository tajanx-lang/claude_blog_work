# claude_blog_work

Claude Code와 함께 만드는 블로그 프로젝트입니다.

## 보안 규칙
- 비밀번호, API 키 같은 민감한 정보는 코드에 직접 쓰지 말고 `.env` 파일에 넣습니다.
- `.env` 파일은 `.gitignore`에 등록되어 있어 GitHub에 올라가지 않습니다.
- 올리는 코드에 키가 섞여 있으면 GitHub Actions의 비밀 정보 검사(gitleaks)가 경고합니다.

## 매화역수 점괘 (`meihua/`)
숫자 두 개 또는 지금 시각(음력 연월일시)으로 매화역수 점괘를 뽑아 본괘·호괘·변괘와 체용 길흉을 보여 줍니다.

- 점괘 페이지: `meihua/`
- 외부 호출: `meihua/?a=12&b=34&h=7` (숫자 두 개 + 시진 번호, h 생략 시 지금 시각), `meihua/?t=now` (지금 시각)
- 다른 블로그에 넣기: `<iframe src=".../meihua/embed.html?t=now" width="100%" height="520"></iframe>`
- 계산 모듈: `meihua/meihua.js` (`fromNumbers`, `fromLunarTime`, `divine`)

## 신(神)의 한 수 (`shinhansu/`)
소강절의 관매역수 6가지 점법(연주점·물체점·소리점·동물점·숫자점·방위점)으로 본괘·호괘·변괘와 동효 효사를 보여 줍니다.
괘 계산과 효사 조회는 서버(Supabase Edge Function `shinhansu`)에서 하고, 효사 데이터는 공개되지 않는 데이터베이스 테이블에 있습니다.

- 페이지 외부 호출: `shinhansu/?m=숫자점&a=12&b=34&h=7`, `shinhansu/?m=방위점&a=1&b=4&h=3`, `shinhansu/?m=연주점`
  (`a`/`b` = 두 수 또는 괘 번호, `h` = 시진 번호 子=1~亥=12)
- API 직접 호출 (JSON):
  `GET https://vdiogfisdouzvtnpuvoc.supabase.co/functions/v1/shinhansu?m=숫자점&a=12&b=34&h=7`
