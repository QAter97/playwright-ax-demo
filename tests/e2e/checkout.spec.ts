import { test } from '../../fixtures/test-fixtures';
import products from '../../test-data/products.json';
import checkout from '../../test-data/checkout.json';

test('[TC-CHK-001] 로그인부터 주문 완료까지 핵심 구매 경로', {
  tag: ['@smoke', '@regression'],
}, async ({ inventoryPage, cartPage, checkoutPage }) => {
  await inventoryPage.add(products.backpack);
  await inventoryPage.add(products.bikeLight);
  await inventoryPage.openCart();
  await cartPage.expectItems([products.backpack, products.bikeLight]);
  await cartPage.checkout();
  await checkoutPage.fillInformation(checkout.customer);
  await checkoutPage.continue();
  await checkoutPage.expectOverview();
  await checkoutPage.expectSummary([products.backpack, products.bikeLight], checkout.expected);
  await checkoutPage.finish();
  await checkoutPage.expectComplete();
});

test('[TC-CHK-002] 주문 요약의 상품 합계·세금·총액 검증', {
  tag: '@regression',
}, async ({ inventoryPage, cartPage, checkoutPage }) => {
  await inventoryPage.add(products.backpack);
  await inventoryPage.add(products.bikeLight);
  await inventoryPage.openCart();
  await cartPage.checkout();
  await checkoutPage.fillInformation(checkout.customer);
  await checkoutPage.continue();
  await checkoutPage.expectOverview();
  await checkoutPage.expectSummary([products.backpack, products.bikeLight], checkout.expected);
});

for (const missing of checkout.missingFields) {
  test('[TC-CHK-003] ' + missing.label + ' 누락 시 오류 표시', {
    tag: '@regression',
  }, async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.add(products.backpack);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation({ ...checkout.customer, [missing.field]: '' });
    await checkoutPage.continue();
    await checkoutPage.expectRequiredError(missing.message);
  });
}
