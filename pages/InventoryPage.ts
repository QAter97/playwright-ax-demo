import { expect, type Page } from '@playwright/test';
import inventoryData from '../test-data/inventory.json';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  async expectReady(): Promise<void> {
    await expect(this.page).toHaveURL(new URL(inventoryData.path, this.page.url()).href);
    await expect(this.page.getByTestId('title')).toHaveText(inventoryData.title);
    await expect(this.page.getByTestId('inventory-container')).toBeVisible();
    await expect(this.page.getByTestId('inventory-item').first()).toBeVisible();
  }
}
