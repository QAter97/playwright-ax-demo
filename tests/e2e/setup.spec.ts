import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test('[TC-LGN-001] 로그인 화면의 기본 입력과 버튼 표시', {
  tag: ['@smoke', '@regression'],
}, async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.expectReady();
});
