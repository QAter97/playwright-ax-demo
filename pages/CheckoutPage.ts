import { expect, type Locator, type Page } from '@playwright/test';

type Customer = { firstName: string; lastName: string; postalCode: string };
type Summary = { subtotalCents: number; taxCents: number; totalCents: number };

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async fillInformation(customer: Customer): Promise<void> {
    await this.page.getByTestId('firstName').fill(customer.firstName);
    await this.page.getByTestId('lastName').fill(customer.lastName);
    await this.page.getByTestId('postalCode').fill(customer.postalCode);
  }

  async continue(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue', exact: true }).click();
  }

  async expectOverview(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(this.page.getByTestId('title')).toHaveText('Checkout: Overview');
  }

  async expectRequiredError(message: string): Promise<void> {
    await expect(this.page.getByTestId('error')).toHaveText(message);
    await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
    await expect(this.page.getByTestId('title')).toHaveText('Checkout: Your Information');
  }

  private async readCents(locator: Locator): Promise<number> {
    const text = await locator.innerText();
    const amount = text.match(/\$(\d+)\.(\d{2})$/);
    if (!amount) {
      throw new Error('금액 표시 형식을 확인하세요: ' + text);
    }
    return Number(amount[1]) * 100 + Number(amount[2]);
  }

  async expectSummary(
    products: Array<{ name: string; priceCents: number }>,
    expected: Summary,
  ): Promise<void> {
    await expect(this.page.getByTestId('inventory-item')).toHaveCount(products.length);
    let itemTotal = 0;
    for (const product of products) {
      const item = this.page.getByTestId('inventory-item').filter({
        has: this.page.getByText(product.name, { exact: true }),
      });
      await expect(item.getByTestId('inventory-item-name')).toHaveText(product.name);
      await expect(item.getByTestId('inventory-item-price')).toHaveText(
        '$' + (product.priceCents / 100).toFixed(2),
      );
      itemTotal += await this.readCents(item.getByTestId('inventory-item-price'));
    }

    const subtotal = this.page.getByTestId('subtotal-label');
    const tax = this.page.getByTestId('tax-label');
    const total = this.page.getByTestId('total-label');
    await expect(subtotal).toHaveText('Item total: $' + (expected.subtotalCents / 100).toFixed(2));
    await expect(tax).toHaveText('Tax: $' + (expected.taxCents / 100).toFixed(2));
    await expect(total).toHaveText('Total: $' + (expected.totalCents / 100).toFixed(2));

    const subtotalCents = await this.readCents(subtotal);
    const taxCents = await this.readCents(tax);
    const totalCents = await this.readCents(total);
    expect(subtotalCents).toBe(itemTotal);
    expect(totalCents).toBe(subtotalCents + taxCents);
  }

  async finish(): Promise<void> {
    await this.page.getByRole('button', { name: 'Finish', exact: true }).click();
  }

  async expectComplete(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(this.page.getByTestId('title')).toHaveText('Checkout: Complete!');
    await expect(this.page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
    await expect(this.page.getByTestId('shopping-cart-badge')).toHaveCount(0);
  }
}
