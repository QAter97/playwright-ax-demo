# AGENTS.md — Playwright AX 데모 프로젝트

## 1. 목적

- 실무에서 수행한 테스트 자동화 방식(TC 설계 → 자동화 대상 선정 → Playwright 자동화 → 실행 리포트)을 공개 연습 사이트에 재현하는 포트폴리오 데모다.
- 이 레포는 AX 제출서의 결과물 링크로 쓰인다. 심사자가 README만 보고 3분 안에 이해할 수 있어야 한다.
- 회사명, 내부 시스템, 내부 URL, 내부 수치는 코드·문서·커밋 어디에도 쓰지 않는다.

## 2. 대상과 기술 스택

- UI 대상: [https://www.saucedemo.com](https://www.saucedemo.com) (standard_user, locked_out_user, problem_user, performance_glitch_user 등 공개 계정, 비밀번호는 .env에서 읽는다)
- API 대상(선택): 공개 연습 API 1개. 착수 전 사용자에게 확인한다.
- Playwright + TypeScript, Node LTS, npm
- 실행 증빙: 로컬 Playwright HTML 리포트와 캡처, 공개 정적 리포트 페이지

## 3. 작업 방식 (가장 중요)

1. 코드를 쓰기 전에 docs/PLAN.md를 작성한다: Phase별 작업, 만들 파일, 완료 조건, 리스크, 사용자에게 확인할 질문.
2. 사용자가 PLAN을 승인하기 전에는 구현하지 않는다.
3. 한 번에 한 Phase만 진행하고, 끝나면 결과 요약·실행 결과·다음 단계 제안을 보고한 뒤 멈춘다.
4. TC 문서를 먼저 만들고 사용자 리뷰를 받은 뒤 코드로 옮긴다. TC 없이 테스트 코드를 먼저 쓰지 않는다.
5. 사이트 동작을 추측해서 기대결과로 쓰지 않는다. 실제로 확인하거나 질문으로 남긴다.
6. 커밋은 Phase 단위, Conventional Commits(feat:, test:, docs:, ci:)를 따른다.
7. git push, 원격 저장소 설정, 새 의존성 추가는 사용자 승인 없이 하지 않는다.

## 4. Phase와 완료 조건

| Phase | 작업 | 완료 조건 |
| --- | --- | --- |
| P0 환경 | 초기화, Playwright 설치, config, .gitignore, .env.example | 샘플 테스트 1개 통과 |
| P1 로그인 | TC 작성 → 리뷰 → Page Object·테스트 | 모든 TC가 자동/수동으로 분류되고 자동 TC 통과 |
| P2 장바구니·결제 | 동일 흐름, 금액·세금 합계 검증 포함 | 자동 TC 통과 |
| P3 확장 | 상품 목록, 문제 계정 회귀(데이터 주도), API(선택) | 문제 계정에서 발견한 결함이 known-issues에 기록됨 |
| P4 실행 리포트 | 로컬 Chromium PC·모바일 에뮬레이션 실행 결과와 trace·screenshot 정리, HTML 리포트 게시 | 두 환경의 결과 검증, 리포트 URL의 익명 접근 확인 |
| P5 문서 | README, docs/ai-workflow.md 지표 정리 | 아래 README 구성 충족 |

## 5. 디렉터리 구조

```text
AGENTS.md / CLAUDE.md
docs/        PLAN.md, test-cases.md, ai-workflow.md, known-issues.md
pages/       LoginPage.ts, InventoryPage.ts, CartPage.ts, CheckoutPage.ts
fixtures/    test-fixtures.ts
test-data/   users.json, checkout.json
tests/e2e/   영역별 UI 테스트
tests/api/   API 테스트
playwright.config.ts
.github/workflows/e2e.yml
```

## 6. TC 작성 규칙

- 위치: docs/test-cases.md
- ID: TC-<영역>-<3자리>. 영역 코드 LGN(로그인), INV(상품 목록), CRT(장바구니), CHK(결제), REG(문제 계정 회귀), API
- 표 컬럼: ID | 제목 | Given | When | Then | 설계 기법 | 우선순위(P1~P3) | 자동화(자동/수동) | 수동 사유
- 설계 기법을 반드시 적는다: 동등 분할, 경계값, 상태 전이, 데이터 주도, 오류 추정
- 자동화 선정 기준: 반복 실행 가치가 높고 기대결과가 결정적인 TC는 자동. 시각적 판단·일회성·외부 의존 TC는 수동으로 두고 사유를 쓴다.

## 7. 코드 규칙

- 테스트 이름은 TC ID로 시작한다. 예: test('[TC-CHK-003] 우편번호 미입력 시 에러 노출', ...)
- 화면 조작은 pages/의 Page Object에서만 한다. 테스트 파일에 셀렉터를 직접 쓰지 않는다.
- 로케이터 우선순위: getByRole → getByTestId → getByText → CSS. XPath 금지.
- waitForTimeout 금지, 웹 우선 단언(expect(...).toBeVisible() 등) 사용.
- 테스트 데이터는 test-data/에서만, 비밀값은 .env에서만 읽는다.
- 모든 테스트는 독립 실행 가능해야 한다. 실행 순서에 기대지 않는다.
- 태그: @smoke(핵심 경로), @regression(전체).
- 변경 후 npx playwright test와 npx tsc --noEmit이 통과해야 Phase 완료로 본다.

## 8. 실패 처리

- 실패는 trace를 근거로 테스트 결함 / 사이트 결함(의도된 버그 포함) / 환경 문제 중 하나로 분류한다.
- 사이트 결함은 테스트를 고쳐서 통과시키지 않는다. test.fail() 또는 annotation으로 표시하고 docs/known-issues.md에 기록한다.
- 불안정(flaky) 테스트를 재시도로 덮지 않는다. CI retries는 최대 1회, 원인을 기록한다.

## 9. AI 활용 기록 (AX 근거)

- Phase마다 docs/ai-workflow.md에 기록한다: AI가 만든 것, 사용자가 수정·추가한 것(누락 TC 수와 유형), 소요 시간.
- 사용자가 리뷰에서 추가한 TC는 test-cases.md에 '리뷰 추가'로 표시한다.
- 데모 수치는 실무 성과와 섞지 않는다.

## 10. README 구성

한 줄 소개·배지 → 문제 정의 → 해결 방식(AI 워크플로) → 결과 지표 → 테스트 범위 → 구조·실행 방법 → 실행 화면 → 배운 점

## 11. 하지 말 것

- 연습 사이트에 부하를 주는 실행: workers 2 이하, 스케줄 반복 실행 금지
- 회사 관련 정보 기재
- 승인 없는 push, 범위 밖 대규모 리팩터링
