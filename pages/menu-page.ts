import { type Page, type Locator } from '@playwright/test';

// Page Object: all locators and actions for the menu page live here,
// so tests read like steps and a changed locator is fixed in one place.
export class MenuPage {
  readonly page: Page;
  readonly app: Locator;
  readonly checkoutButton: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.app = page.locator('#app');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartLink = page.getByRole('link', { name: 'Cart page' });
  }

  async goto() {
    await this.page.goto('/');
  }

  // The site uses data-test="Flat_White": the first space becomes "_".
  coffee(name: string): Locator {
    return this.page.locator(`[data-test="${name.replace(' ', '_')}"]`);
  }

  async addCoffee(name: string) {
    await this.coffee(name).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async openCheckout() {
    await this.checkoutButton.click();
  }
}
