import { test, expect } from '@playwright/test';
import { MenuPage } from '../pages/menu-page';
import { customer, invalidEmails } from './test-data';

test.describe('Coffee Cart (coffee-cart.app) - checkout', () => {
  // Every checkout test starts the same way: add Espresso, open the payment form.
  test.beforeEach(async ({ page }) => {
    const menu = new MenuPage(page);
    await menu.goto();
    await menu.addCoffee('Espresso');
    await menu.openCheckout();
  });

  test('should preserve entered name and email in the payment form', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Name' }).fill(customer.name);
    await page.getByRole('textbox', { name: 'Email' }).fill(customer.email);
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(customer.name);
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(customer.email);
  });

  test('should display a success message after completing a purchase', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Name' }).fill(customer.name);
    await page.getByRole('textbox', { name: 'Email' }).fill(customer.email);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.locator('#app')).toContainText('Thanks for your purchase. Please check your email for payment.');
  });

  test('should not submit the payment form when fields are empty', async ({ page }) => {
    await page.getByRole('button', { name: 'Submit' }).click();
    // Strong check: the form is still open and the Name field is marked invalid.
    await expect(page.getByRole('form', { name: 'Payment form' })).toBeVisible();
    const nameIsValid = await page.getByRole('textbox', { name: 'Name' })
      .evaluate((input: HTMLInputElement) => input.validity.valid);
    expect(nameIsValid).toBe(false);
    await expect(page.getByText('Thanks for your purchase')).toBeHidden();
  });

  // Data-driven: the same check for several invalid emails.
  for (const email of invalidEmails) {
    test(`should not submit the payment form with invalid email "${email}"`, async ({ page }) => {
      await page.getByRole('textbox', { name: 'Name' }).fill(customer.name);
      await page.getByRole('textbox', { name: 'Email' }).fill(email);
      await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.getByRole('form', { name: 'Payment form' })).toBeVisible();
      const emailIsValid = await page.getByRole('textbox', { name: 'Email' })
        .evaluate((input: HTMLInputElement) => input.validity.valid);
      expect(emailIsValid).toBe(false);
    });
  }
});
