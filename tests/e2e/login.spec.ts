import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import users from '../../test-data/users.json';

test('[TC-LGN-002] 정상 로그인 후 상품 목록 표시', {
  tag: ['@smoke', '@regression'],
}, async ({ page }) => {
  const password = process.env.SAUCE_PASSWORD;
  if (!password) {
    throw new Error('프로젝트 .env에 SAUCE_PASSWORD를 설정하세요.');
  }

  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(users.standard.username, password);
  await new InventoryPage(page).expectReady();
});
