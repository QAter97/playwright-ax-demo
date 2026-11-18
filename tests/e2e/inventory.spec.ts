import { test, expect } from '../../fixtures/test-fixtures';
import sorting from '../../test-data/sorting.json';
import products from '../../test-data/products.json';

test('[TC-INV-001] 상품 목록과 상세의 이름·가격·설명 일치', {
  tag: '@regression',
}, async ({ inventoryPage }) => {
  const summary = await inventoryPage.readProduct(products.backpack);
  await inventoryPage.openDetails(products.backpack);
  await inventoryPage.expectDetails(summary);
});

for (const option of sorting) {
  test('[TC-INV-002] ' + option.label, {
    tag: '@regression',
  }, async ({ inventoryPage }) => {
    const before = await inventoryPage.readCatalog();
    expect(before.length).toBeGreaterThan(0);
    await inventoryPage.selectSort(option.value);
    const after = await inventoryPage.readCatalog();

    // 이름으로 정규화해 정렬 전후 상품과 가격의 보존을 함께 확인한다.
    const byName = (left: typeof before[number], right: typeof before[number]) =>
      left.name.localeCompare(right.name, 'en');
    expect([...after].sort(byName)).toEqual([...before].sort(byName));

    if (option.field === 'name') {
      const expectedNames = before.map(item => item.name).sort((left, right) => left.localeCompare(right, 'en'));
      if (option.direction === 'descending') {
        expectedNames.reverse();
      }
      expect(after.map(item => item.name)).toEqual(expectedNames);
    } else {
      const expectedPrices = before.map(item => item.priceCents).sort((left, right) => left - right);
      if (option.direction === 'descending') {
        expectedPrices.reverse();
      }
      expect(after.map(item => item.priceCents)).toEqual(expectedPrices);
    }
  });
}