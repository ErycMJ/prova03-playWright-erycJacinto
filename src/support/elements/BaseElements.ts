import { Page } from '@playwright/test';

export abstract class BaseElements {
  constructor(readonly page: Page) {
    this.page = page;
  }
}
