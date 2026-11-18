# Playwright AX 공개 데모 계획

**상태** · P0~P5 완료 · 사용자 최종 리뷰 및 업로드 대기
**제출 유형** · 유형 A · 실제 업무에서 AI를 활용한 사례

## 목적과 제출 범위

실무에서 적용한 테스트 동선 확인 → TC 설계 → 자동화 대상 선정 → AI 코드 초안 → 검토 및 실행 흐름을 SauceDemo에서 재현한다. Node LTS, npm, Playwright, TypeScript를 사용하고 로컬 실행 리포트를 제출 증빙으로 게시한다.

제출 범위는 핵심 구매 sanity, 대표 설계 기법, 직접 재현한 문제 계정 결함 1건의 분석이다. P0 → P1 → P2 → P3 → P4 → P5 순서로 진행한다. P3는 정렬 데이터 주도 검증과 결함 1건에 집중한다. API·접근성·시각 회귀·성능은 후속 확장 후보다.

- **핵심 경로 (@smoke)** — 정상 로그인 → 상품 목록 진입 및 대표 상품 확인 → 장바구니 담기 및 담긴 상품 확인 → 주문 정보 입력 → 주문 요약의 소계·세금·총액 확인 → 주문 완료 화면 확인.
- 주문 흐름은 공개 연습 사이트에서 관찰할 수 있는 범위로 정한다. 실카드 승인이나 외부 결제 수단별 로그인은 데모 범위에서 제외한다.

PDF ②에는 사내 산출물의 외부 공유가 어려워 공개 환경에서 재현했다는 설명, 공개 저장소 링크, 실행 결과 캡처를 넣는다. 공개 저장소와 증빙에는 공개 데모에서 만든 자료와 측정값을 사용한다.

## Phase별 작업

| Phase | 작업 | 주요 파일 | 완료 조건 |
| --- | --- | --- | --- |
| P0 환경 | 로컬 초기화, 의존성 승인 및 설치, 환경변수와 Playwright 설정. 환경 확인용 샘플 TC를 문서화하고 리뷰 후 작성한다. | package.json, package-lock.json, tsconfig.json, playwright.config.ts, .gitignore, .env.example, docs/test-cases.md, tests/e2e/setup.spec.ts | 샘플 1개와 TypeScript 검사 통과. 실제 .env는 Git 추적에서 제외. |
| P1 로그인 | 공개 사이트에서 정상 계정 로그인과 상품 목록 진입을 직접 확인하고, TC 작성·분류·리뷰 후 Page Object와 테스트를 작성한다. | docs/test-cases.md, pages/LoginPage.ts, pages/InventoryPage.ts, test-data/users.json, tests/e2e/login.spec.ts | 모든 로그인 TC의 자동·수동 분류 완료. 자동 TC 통과. 대표 TC ID로 코드를 찾을 수 있음. |
| P2 장바구니·결제 | 상품 목록 진입부터 장바구니·주문 완료까지 관찰하고, 대표 상품·장바구니 항목·소계·세금·총액·주문 완료를 확인하는 TC를 설계한 뒤 리뷰 후 구현한다. | docs/test-cases.md, pages/InventoryPage.ts, pages/CartPage.ts, pages/CheckoutPage.ts, test-data/checkout.json, tests/e2e/cart.spec.ts, tests/e2e/checkout.spec.ts | 핵심 구매 경로의 자동 TC와 금액 검증 통과. 주문 완료 화면까지 확인. |
| P3 확장 | 상품 목록과 문제 계정 회귀를 데이터 주도 방식으로 설계하고 리뷰 후 구현한다. 선택 API는 별도 승인 시 계획한다. | docs/test-cases.md, docs/known-issues.md, pages/InventoryPage.ts, test-data/users.json, tests/e2e/inventory.spec.ts, tests/e2e/regression.spec.ts | 자동 회귀 결과를 확인하고 발견한 사이트 결함과 근거를 기록함. |
| P4 실행 리포트 | Chromium PC·모바일 로컬 실행 결과와 캡처·trace를 정리하고 HTML 리포트를 공개 게시한다. | playwright.config.ts, docs/ai-workflow.md, 공개 리포트 페이지 | 결과 집계와 첨부 파일 검증. 로그인 없는 리포트 URL 접근 확인. |
| P5 문서 | README에서 대표 TC → 대응 테스트 → 실행 결과로 연결한다. AI 활용 기록을 정리하고 PDF용 링크와 실행 캡처를 확보한다. | README.md, docs/ai-workflow.md | README에서 3분 안에 목적, AI 활용, 범위, 결과, 재실행 방법을 파악할 수 있음. PDF용 링크와 캡처 준비 완료. |

## 검증과 기록

- 실제 사이트 동작 확인 → TC 작성 및 자동·수동 분류 → 사용자 리뷰 → 구현 순서로 진행한다. 관찰하지 못한 기대 결과는 확인 항목으로 남긴다.
- TC에는 ID, Given·When·Then, 설계 기법, 우선순위, 자동화 여부, 해당 시 수동 사유를 적는다. 사용자가 추가한 TC에는 ‘리뷰 추가’를 표시한다.
- 테스트 이름을 TC ID로 시작하고 화면 조작은 Page Object에서 수행한다. 테스트는 독립 실행하며 핵심 경로와 전체 회귀에 각각 @smoke와 @regression을 적용한다.
- 코드 변경 후 npx playwright test와 npx tsc --noEmit을 실행한다. 각 Phase에 docs/ai-workflow.md를 갱신해 AI 작업, 사용자 수정·추가, 누락 TC 유형과 수, 실제 소요 시간을 기록한다.
- 한 번에 한 Phase를 진행한다. Phase 종료 시 결과, 실행 검증, 다음 단계 제안을 보고하고 멈춘다. 커밋은 Phase 단위로 Conventional Commits를 따른다.
- README는 한 줄 소개·배지 → 문제 정의 → AI 활용 방식 → 데모 결과 → 테스트 범위 → 구조·실행 방법 → 실행 화면 → 배운 점 순서로 작성한다.

## 리스크와 대응

| 리스크 | 대응 |
| --- | --- |
| 공개 사이트의 동작 변경 또는 의도된 오류 | trace로 테스트 결함·사이트 결함·환경 문제를 분류한다. 확인된 사이트 결함은 test.fail() 또는 annotation으로 표시하고 docs/known-issues.md에 기록한다. |
| PC·모바일 테스트를 여러 번 동시에 실행해 부하 증가 | PC·모바일 프로젝트를 하나의 Playwright 실행으로 묶어 worker 한도 2를 공유하고, 실행이 겹치지 않도록 관리한다. 예약 반복 실행은 사용하지 않고 로컬 재시도 기본값은 0회다. |
| 비밀번호 또는 내부 정보가 공개 자료에 포함됨 | 로컬 비밀번호는 Git에서 제외한 .env에서 읽는다. 게시 전 로그와 증빙을 확인한다. |
| 심사자가 리포트를 열 수 없음 | P4에서 게시 방식을 확정하고 접근을 검증한다. PDF에 넣을 실행 캡처도 확보한다. |

## 리뷰에서 확인할 사항

1. **제출 범위** — 로그인부터 주문 완료까지의 핵심 구매 경로를 Chromium PC·모바일 에뮬레이션 두 환경에서 실행한다.
2. **P0 샘플** — 환경 확인용 샘플도 TC 문서에 먼저 작성해 리뷰하고, P1 로그인 기능 TC는 따로 리뷰할까?
3. **승인 시점** — 계획 승인 후 P0 신규 의존성 설치를 확인하고, 원격 저장소 설정·공개·push와 선택 API는 해당 작업 전에 별도로 승인받는다.

P0~P4를 완료했다. README 작성과 검증을 완료했으며 사용자 최종 리뷰·업로드를 남겼다.

## P0 실행 결과 · 2026-11-18

환경 준비 완료. TC-LGN-001은 Chromium PC·모바일 2건 통과했고 TypeScript 검사를 통과했다. .env·도구·캐시·패키지·리포트의 Git 제외도 확인했다. P1은 사용자 리뷰 후 진행한다.

로컬 PowerShell 재실행 명령은 다음과 같다. 프로젝트 내부 npm을 사용한다.

~~~powershell
Set-Location D:\auto\ax-demo
node .tools/npm/bin/npm-cli.js exec -- playwright test
node .tools/npm/bin/npm-cli.js exec -- tsc --noEmit
node .tools/npm/bin/npm-cli.js run report
~~~

Chromium 설치 경로는 playwright.config.ts에서 프로젝트 .cache/ms-playwright로 지정한다. 재설치할 때는 같은 경로를 지정한다.

~~~powershell
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location).Path '.cache/ms-playwright'
node node_modules/playwright/cli.js install chromium
~~~
## P1 실행 결과

TC-LGN-002 구현 완료. P0와 합쳐 설계 TC 2개, Chromium PC·모바일 실제 실행 4건 통과. TypeScript 검사 통과. P2 상품 상세·장바구니·주문 동선을 다음 관찰·리뷰 대상으로 제안한다.
## P2 진행 상태 · 관찰 및 TC 리뷰

상품 상세, 장바구니 추가·제거·유지, 주문 완료, 금액 계산, 필수 입력 누락을 PC·모바일에서 직접 확인했다. docs/test-cases.md의 P2 7개 TC를 리뷰 대상으로 제시한다. 세금은 관찰한 상품 조합의 금액을 기준으로 검증하고 일반 세율 규칙은 추가 확인한다. 현재 P2 구현과 완료 검증은 TC 리뷰 후 진행한다.
## P2 완료 결과

승인된 P2 TC 7개를 구현했다. 상품 상세·장바구니·주문 완료·금액 계산·필수 입력 오류를 독립 컨텍스트에서 검증한다. P0·P1 포함 전체 실행 22건과 TypeScript 검사가 통과했다. 재현된 로케이터 결함과 수정 근거는 AI 활용 기록에 남겼다. 다음은 P3 정렬 데이터 주도 검증과 문제 계정 결함 1건의 관찰·TC 리뷰다.
## P3 관찰 결과

정렬 4종과 problem_user의 Last Name 입력 오류를 PC·모바일에서 확인했다. TC-INV-002 및 TC-REG-001의 구현 전 리뷰를 요청한다. 결함 근거와 재현 절차는 docs/known-issues.md의 KI-001에 기록했다. P3 구현은 리뷰 대기 상태다.
## P3 완료 결과

정렬 4종과 KI-001 계정 비교를 구현하고 전체 실행 34건을 검증했다. 일반 통과 32건, 확인된 결함 기대 실패 2건, 예상 밖 실패·재시도 0건이며 TypeScript 검사도 통과했다. 문제 계정 결함은 known-issues 및 리포트 증거에 연결했다. 수동 시각 TC는 미수행으로 표시했다. 다음 단계는 P4 로컬 실행 결과와 HTML 리포트 게시다.
## P4 및 제출 PDF 초안 완료

사용자가 제출 목적에 맞춰 Actions 자동 실행을 제외하고 캡처·리포트·저장소 링크 제공을 선택했다.

- 공개 리포트 — https://qater97-playwright-ax-report.scentedtick3.chatgpt.site
- 전체 HTML — https://qater97-playwright-ax-report.scentedtick3.chatgpt.site/report/
- GitHub — https://github.com/QAter97/playwright-ax-demo
- 공개 접근 — 새 브라우저 컨텍스트에서 홈·HTML·known-issue 표시와 trace 다운로드의 HTTP 200 확인.
- 제출 PDF — 3페이지 초안에 실제 실행 캡처와 클릭 가능한 두 링크를 포함하고 렌더링 확인.
- 실무 도구는 Claude Code, 공개 재현 데모 제작은 Codex로 기록.
- 제출 전 GitHub 저장소 공개 여부와 실무 성과 수치의 제출 가능 범위를 최종 확인.
## P5 완료 결과

README에 소개·배지, 문제 정의, AI 활용 흐름과 사용자 기여, 결과 지표, 테스트 범위, 구조·재실행, 캡처, 배운 점을 작성했다. 공개 계정과 공통 연습 비밀번호, .env 설정 및 Chromium 설치 경로를 안내했다. docs/ai-workflow.md의 최종 지표와 미측정 항목도 정리했다.

잠금 파일 재설치 후 전체 34건을 재실행했고 일반 통과 32건·알려진 결함 기대 실패 2건을 확인했다. TypeScript 검사와 README 파일·이미지 링크 11개 검사를 통과했다. 수동 시각 TC는 미수행으로 유지한다. macOS·Linux 명령은 참고용이며 실행 미검증으로 표시했다. 기존 공개 리포트는 보관된 P3 결과를 계속 제공한다.

로컬 Phase 작업은 완료했으며 사용자 README·PDF 최종 리뷰, GitHub 업로드·Public 전환을 제출 전 확인한다.