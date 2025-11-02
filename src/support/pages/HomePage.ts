import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { homeElements } from '../elements/HomeElements';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyHomePageVisible() {
    await this.verifyElementVisible(homeElements.navbar);
    await this.verifyElementVisible(homeElements.heroTitle);
  }

  async verifyNavbarVisible() {
    await this.verifyElementVisible(homeElements.navbar);
  }

  async verifySignInButtonVisible() {
    await this.verifyElementVisible(homeElements.signInButton);
  }

  async verifyCTAButtonVisible() {
    await this.verifyElementVisible(homeElements.ctaButton);
  }

  async clickSignInButton() {
    await this.page.click(homeElements.signInButton);
    await this.page.waitForLoadState('networkidle');
  }

  async clickCTAButton() {
    await this.page.click(homeElements.ctaButton);
    await this.page.waitForLoadState('networkidle');
  }

  async verifyFeaturesSection() {
    await this.verifyElementVisible(homeElements.featuresSection);
  }

  async verifyTestimonialsSection() {
    await this.verifyElementVisible(homeElements.testimonials);
  }

  async verifyFooterVisible() {
    await this.verifyElementVisible(homeElements.footer);
  }
}
