import { test } from '../../fixtures/test-fixtures';
import products from '../../test-data/products.json';

test('[TC-INV-001] 상품 목록과 상세의 이름·가격·설명 일치', {
  tag: '@regression',
}, async ({ inventoryPage }) => {
  const summary = await inventoryPage.readProduct(products.backpack);
  await inventoryPage.openDetails(products.backpack);
  await inventoryPage.expectDetails(summary);
});
