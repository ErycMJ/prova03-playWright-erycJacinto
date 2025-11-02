import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { dashboardElements } from '../elements/DashboardElements';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyDashboardVisible() {
    await this.verifyElementVisible(dashboardElements.addTransactionButton);
  }

  async clickAddTransactionButton() {
    await this.clickButton(dashboardElements.addTransactionButton);
  }

  async fillTransactionForm(category: string, amount: string, description: string) {
    await this.selectOption(dashboardElements.categorySelect, category);
    await this.fillInput(dashboardElements.amountInput, amount);
    await this.fillInput(dashboardElements.descriptionInput, description);
  }

  async submitTransactionForm() {
    await this.clickButton(dashboardElements.submitButton);
  }

  async verifyTransactionSuccess() {
    await this.verifyElementVisible(dashboardElements.successAlert);
  }

  async verifyTransactionError() {
    await this.verifyElementVisible(dashboardElements.errorAlert);
  }

  async verifyTransactionListVisible() {
    await this.verifyElementVisible(dashboardElements.transactionList);
  }

  async clickProfileButton() {
    await this.clickButton(dashboardElements.profileButton);
  }

  async clickLogoutButton() {
    await this.clickButton(dashboardElements.logoutButton);
  }

  async openUserMenu() {
    await this.clickButton(dashboardElements.userMenu);
  }
}
