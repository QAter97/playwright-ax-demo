import { test as base, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import users from '../test-data/users.json';

type Fixtures = {
  authenticatedPage: Page;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ page }, use) => {
    const password = process.env.SAUCE_PASSWORD;
    if (!password) {
      throw new Error('프로젝트 .env에 SAUCE_PASSWORD를 설정하세요.');
    }
    const login = new LoginPage(page);
    await login.open();
    await login.login(users.standard.username, password);
    await new InventoryPage(page).expectReady();
    await use(page);
  },
  inventoryPage: async ({ authenticatedPage }, use) => {
    await use(new InventoryPage(authenticatedPage));
  },
  cartPage: async ({ authenticatedPage }, use) => {
    await use(new CartPage(authenticatedPage));
  },
  checkoutPage: async ({ authenticatedPage }, use) => {
    await use(new CheckoutPage(authenticatedPage));
  },
});

export { expect } from '@playwright/test';
