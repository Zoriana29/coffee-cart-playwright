import { test, expect } from '@playwright/test';
import { MenuPage } from '../pages/menu-page';

// Network mocking: Playwright answers the /list.json request with our own data,
// so we can test how the UI shows any data without changing the real server.
test.describe('Coffee Cart (coffee-cart.app) - mocked menu data', () => {
  test('should show a coffee returned by the mocked API', async ({ page }) => {
    await page.route('**/list.json', route =>
      route.fulfill({
        json: [{ name: 'Test Coffee', price: 99, recipe: [{ name: 'espresso', quantity: 30 }] }],
      }),
    );

    const menu = new MenuPage(page);
    await menu.goto();
    await expect(menu.coffee('Test Coffee')).toBeVisible();
    await menu.addCoffee('Test Coffee');
    await expect(menu.checkoutButton).toContainText('Total: $99.00');
  });

  test('should show no coffees when the API returns an empty list', async ({ page }) => {
    await page.route('**/list.json', route => route.fulfill({ json: [] }));

    const menu = new MenuPage(page);
    await menu.goto();
    await expect(menu.coffee('Espresso')).toHaveCount(0);
    await expect(menu.checkoutButton).toContainText('Total: $0.00');
  });
});
