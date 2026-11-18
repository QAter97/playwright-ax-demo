import { expect, type Page } from '@playwright/test';
import inventoryData from '../test-data/inventory.json';

type Product = { name: string; slug: string };
type ProductSummary = { name: string; price: string; description: string };

export class InventoryPage {
  constructor(private readonly page: Page) {}

  async expectReady(): Promise<void> {
    await expect(this.page).toHaveURL(new URL(inventoryData.path, this.page.url()).href);
    await expect(this.page.getByTestId('title')).toHaveText(inventoryData.title);
    await expect(this.page.getByTestId('inventory-container')).toBeVisible();
    await expect(this.page.getByTestId('inventory-item').first()).toBeVisible();
  }

  async readProduct(product: Product): Promise<ProductSummary> {
    const item = this.page.getByTestId('inventory-item').filter({
      has: this.page.getByText(product.name, { exact: true }),
    });
    return {
      name: await item.getByTestId('inventory-item-name').innerText(),
      price: await item.getByTestId('inventory-item-price').innerText(),
      description: await item.getByTestId('inventory-item-desc').innerText(),
    };
  }

  async openDetails(product: Product): Promise<void> {
    await this.page.getByRole('button', { name: 'View details for ' + product.name, exact: true })
      .filter({ has: this.page.getByText(product.name, { exact: true }) })
      .click();
    await expect(this.page.getByRole('button', { name: 'Back to products', exact: true })).toBeVisible();
  }

  async expectDetails(summary: ProductSummary): Promise<void> {
    await expect(this.page.getByTestId('inventory-item-name')).toHaveText(summary.name);
    await expect(this.page.getByTestId('inventory-item-price')).toHaveText(summary.price);
    await expect(this.page.getByTestId('inventory-item-desc')).toHaveText(summary.description);
  }

  async addFromDetails(): Promise<void> {
    await this.page.getByRole('button', { name: 'Add to cart', exact: true }).click();
  }

  async backToProducts(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back to products', exact: true }).click();
    await this.expectReady();
  }

  async add(product: Product): Promise<void> {
    const item = this.page.getByTestId('inventory-item').filter({
      has: this.page.getByText(product.name, { exact: true }),
    });
    await item.getByRole('button', { name: 'Add to cart', exact: true }).click();
  }

  async remove(product: Product): Promise<void> {
    const item = this.page.getByTestId('inventory-item').filter({
      has: this.page.getByText(product.name, { exact: true }),
    });
    await item.getByRole('button', { name: 'Remove', exact: true }).click();
  }

  async expectProductButton(product: Product, name: 'Add to cart' | 'Remove'): Promise<void> {
    const item = this.page.getByTestId('inventory-item').filter({
      has: this.page.getByText(product.name, { exact: true }),
    });
    await expect(item.getByRole('button', { name, exact: true })).toBeVisible();
  }

  async expectCartCount(count: number): Promise<void> {
    const badge = this.page.getByTestId('shopping-cart-badge');
    if (count === 0) {
      await expect(badge).toHaveCount(0);
      return;
    }
    await expect(badge).toHaveText(String(count));
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.expectReady();
  }

  async readCatalog(): Promise<Array<{ name: string; priceCents: number }>> {
    const items = this.page.getByTestId('inventory-item');
    const count = await items.count();
    const catalog: Array<{ name: string; priceCents: number }> = [];
    for (let index = 0; index < count; index++) {
      const item = items.nth(index);
      const name = await item.getByTestId('inventory-item-name').innerText();
      const price = await item.getByTestId('inventory-item-price').innerText();
      const match = price.match(/^\$(\d+)\.(\d{2})$/);
      if (!match) {
        throw new Error('상품 가격 형식을 확인하세요: ' + price);
      }
      catalog.push({ name, priceCents: Number(match[1]) * 100 + Number(match[2]) });
    }
    return catalog;
  }

  async selectSort(value: string): Promise<void> {
    const sort = this.page.getByRole('combobox');
    await sort.selectOption(value);
    await expect(sort).toHaveValue(value);
  }
  async openCart(): Promise<void> {
    await this.page.getByTestId('shopping-cart-link').click();
    await expect(this.page.getByTestId('title')).toHaveText('Your Cart');
  }
}
