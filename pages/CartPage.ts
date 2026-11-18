import { expect, type Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async expectItems(products: Array<{ name: string; priceCents: number }>): Promise<void> {
    await expect(this.page.getByTestId('inventory-item')).toHaveCount(products.length);
    for (const product of products) {
      const item = this.page.getByTestId('inventory-item').filter({
        has: this.page.getByText(product.name, { exact: true }),
      });
      await expect(item.getByTestId('inventory-item-name')).toHaveText(product.name);
      await expect(item.getByTestId('inventory-item-price')).toHaveText(
        '$' + (product.priceCents / 100).toFixed(2),
      );
    }
  }

  async continueShopping(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue Shopping', exact: true }).click();
    await expect(this.page.getByTestId('title')).toHaveText('Products');
  }

  async checkout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Checkout', exact: true }).click();
    await expect(this.page.getByTestId('title')).toHaveText('Checkout: Your Information');
  }
}
