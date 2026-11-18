# Known Issues

## KI-001 · problem_user의 주문 정보 Last Name 입력 오류

**분류** · 공개 연습 사이트 결함
**상태** · PC·모바일 재현 및 회귀 자동화 검증 완료
**환경** · Chromium PC 1280×720, Pixel 7 에뮬레이션
**관련 TC** · TC-REG-001

### 재현 절차

1. 새 브라우저 컨텍스트에서 공개 problem_user 계정으로 로그인한다.
2. Backpack을 담고 장바구니에서 Checkout으로 이동한다.
3. First Name에 Demo, Last Name에 Tester, Postal Code에 12345를 순서대로 입력한다.
4. 필드 값을 확인한 뒤 Continue를 누른다.

### 기대 결과와 실제 결과

**기대 결과** · 각 필드에 Demo, Tester, 12345가 유지되고 Checkout: Overview로 이동한다. 같은 동선을 standard_user에서 수행해 정상 동작을 확인했다.

**실제 결과** · Last Name 입력이 First Name을 Tester로 덮어쓰고 Last Name은 비어 있다. Continue 시 Error: Last Name is required가 표시되고 /checkout-step-one.html에 머문다. PC와 모바일에서 동일하게 재현됐다.

### 근거와 처리 계획

Playwright trace에서 firstName에 Demo, lastName에 Tester, postalCode에 12345를 입력하는 호출을 확인했다. 입력 직후 실제 필드값 및 오류 화면도 확인했다. 테스트가 다른 필드에 값을 보내는 문제는 관찰되지 않았다. 프런트엔드 소스 수준의 근본 원인은 추가 분석 대상이다.

로컬 증거는 Git 제외 경로 .cache/p3-observations/results.json, pc-problem_user.png, mobile-problem_user.png 및 각 계정별 trace.zip에 보관한다. 로그인 이후부터 trace를 수집했다. 공개 리포트에 사용할 증거는 게시 전에 확인하고 P3 구현·P4 리포트에 연결한다.

자동화 시 정상 기대를 유지하며 확인된 결함에 test.fail()과 KI-001 annotation을 적용한다. 정상 계정은 같은 절차에서 일반 통과를 기대한다. 사용자 리뷰 승인 후 회귀 자동화를 실행해 PC·모바일에서 각각 KI-001 기대 실패를 확인했다. HTML 리포트에는 실제 필드값 JSON, 오류 화면, trace 및 known-issue annotation을 연결했다.
### 자동화 처리 범위

테스트에서 상품 담기·주문 정보 화면 진입을 먼저 확인한다. 알려진 세 필드값과 Last Name 필수 오류가 재현된 경우에만 기대 실패로 표시하고 정상 입력 유지 단언을 수행한다. 그 이전 실패나 다른 증상의 실패는 일반 실패로 처리한다. 결함이 수정되어 정상 입력과 요약 진입을 만족하면 일반 통과하며 이 문서의 상태도 갱신한다.

정상 계정·문제 계정 비교용 4개 실행은 trace를 항상 보관한다. 다른 테스트는 기존 실패 시 보관 설정을 따른다. 게시할 리포트와 증거의 공개 접근 검증은 P4에서 진행한다.