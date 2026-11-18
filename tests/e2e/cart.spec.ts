import { test } from '../../fixtures/test-fixtures';
import products from '../../test-data/products.json';

test('[TC-CRT-001] 상품 추가·제거에 따른 배지와 버튼 상태', {
  tag: '@regression',
}, async ({ inventoryPage }) => {
  await inventoryPage.expectCartCount(0);
  await inventoryPage.add(products.backpack);
  await inventoryPage.expectCartCount(1);
  await inventoryPage.expectProductButton(products.backpack, 'Remove');
  await inventoryPage.remove(products.backpack);
  await inventoryPage.expectCartCount(0);
  await inventoryPage.expectProductButton(products.backpack, 'Add to cart');
});

test('[TC-CRT-002] 새로고침과 화면 이동 후 장바구니 유지', {
  tag: '@regression',
}, async ({ inventoryPage, cartPage }) => {
  await inventoryPage.add(products.backpack);
  await inventoryPage.add(products.bikeLight);
  await inventoryPage.reload();
  await inventoryPage.expectCartCount(2);
  await inventoryPage.openCart();
  await cartPage.expectItems([products.backpack, products.bikeLight]);
  await cartPage.continueShopping();
  await inventoryPage.expectCartCount(2);
  await inventoryPage.openCart();
  await cartPage.expectItems([products.backpack, products.bikeLight]);
});

test('[TC-CRT-003] 상세에서 추가 후 목록 버튼 상태 동기화', {
  tag: '@regression',
}, async ({ inventoryPage }) => {
  await inventoryPage.openDetails(products.backpack);
  await inventoryPage.addFromDetails();
  await inventoryPage.backToProducts();
  await inventoryPage.expectProductButton(products.backpack, 'Remove');
  await inventoryPage.expectCartCount(1);
});
