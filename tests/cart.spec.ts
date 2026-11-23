import { test, expect } from '@playwright/test';
import { MenuPage } from '../pages/menu-page';
import { coffees } from './test-data';

test.describe('Coffee Cart (coffee-cart.app) - cart', () => {
  let menu: MenuPage;

  // Runs before every test in this group: open the menu.
  test.beforeEach(async ({ page }) => {
    menu = new MenuPage(page);
    await menu.goto();
  });

  test('should show one item in the cart after adding Espresso', async () => {
    await menu.addCoffee('Espresso');
    await expect(menu.app).toContainText('cart (1)');
  });

  test('should display Espresso in the cart', async () => {
    await menu.addCoffee('Espresso');
    await menu.openCart();
    await expect(menu.app).toContainText('Espresso');
  });

  test('should display correct total after adding Espresso and Cappuccino', async () => {
    await menu.addCoffee('Espresso');
    await menu.addCoffee('Cappuccino');
    await expect(menu.checkoutButton).toContainText('Total: $29.00');
  });

  test('should show empty cart message when no items are added', async ({ page }) => {
    await page.goto('/cart');
    await expect(menu.app).toContainText('No coffee, go add some.');
  });
});

// Data-driven tests: one test is generated for every coffee in test-data.ts.
test.describe('Coffee Cart (coffee-cart.app) - prices', () => {
  for (const coffee of coffees) {
    test(`should show total $${coffee.price}.00 after adding ${coffee.name}`, async ({ page }) => {
      const menu = new MenuPage(page);
      await menu.goto();
      await menu.addCoffee(coffee.name);
      await expect(menu.checkoutButton).toContainText(`Total: $${coffee.price}.00`);
    });
  }
});
