import { expect, type Page } from '@playwright/test';
import loginData from '../test-data/login.json';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByTestId(loginData.usernameTestId).fill(username);
    await this.page.getByTestId(loginData.passwordTestId).fill(password);
    await this.page.getByRole('button', { name: loginData.loginButtonName, exact: true }).click();
  }

  async expectReady(): Promise<void> {
    const usernameInput = this.page.getByTestId(loginData.usernameTestId);
    const passwordInput = this.page.getByTestId(loginData.passwordTestId);
    const loginButton = this.page.getByRole('button', { name: loginData.loginButtonName, exact: true });

    await expect(usernameInput).toBeVisible();
    await expect(usernameInput).toHaveAttribute('type', 'text');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
  }
}
