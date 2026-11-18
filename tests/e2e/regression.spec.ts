import { test, expect } from '../../fixtures/test-fixtures';
import users from '../../test-data/users.json';
import products from '../../test-data/products.json';
import checkout from '../../test-data/checkout.json';

test.use({ trace: 'on' });

for (const account of Object.values(users)) {
  test.describe(account.username, () => {
    test.use({ username: account.username });

    test('[TC-REG-001] 주문 정보 입력 유지와 주문 요약 진입', {
      tag: '@regression',
    }, async ({ inventoryPage, cartPage, checkoutPage }, testInfo) => {
      await inventoryPage.add(products.backpack);
      await inventoryPage.openCart();
      await cartPage.checkout();
      await checkoutPage.fillInformation(checkout.customer);
      const observed = await checkoutPage.readInformation();

      await testInfo.attach('checkout-inputs', {
        body: JSON.stringify({ account: account.username, expected: checkout.customer, observed }, null, 2),
        contentType: 'application/json',
      });

      await checkoutPage.continue();
      const knownFailure = Boolean(account.knownIssue)
        && observed.firstName === checkout.customer.lastName
        && observed.lastName === ''
        && observed.postalCode === checkout.customer.postalCode;

      if (knownFailure) {
        await checkoutPage.expectRequiredError(
          checkout.missingFields.find(item => item.field === 'lastName')!.message,
        );
        testInfo.annotations.push({
          type: 'known-issue',
          description: account.knownIssue + ' · docs/known-issues.md',
        });
        await testInfo.attach('KI-001-checkout', {
          body: await checkoutPage.screenshot(),
          contentType: 'image/png',
        });
        // 기대 실패 범위를 확인된 입력 오동작과 오류 화면으로 한정한다.
        test.fail(true, account.knownIssue + ' · Last Name 입력이 First Name을 덮어씀');
      }

      expect(observed).toEqual(checkout.customer);
      await checkoutPage.expectOverview();
    });
  });
}
