import { test, expect } from '@playwright/test';
import { coffees } from './test-data';

// API tests: no browser, only HTTP requests with the `request` fixture.
// The menu page loads its data from /list.json, so we test that endpoint directly.
test.describe('Coffee Cart (coffee-cart.app) - API', () => {
  test('GET /list.json returns 200 and JSON', async ({ request }) => {
    const response = await request.get('/list.json');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('every coffee has a name, a positive price and a recipe', async ({ request }) => {
    const response = await request.get('/list.json');
    const list = await response.json();

    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    for (const coffee of list) {
      expect(typeof coffee.name).toBe('string');
      expect(coffee.price).toBeGreaterThan(0);
      expect(coffee.recipe.length).toBeGreaterThan(0);
    }
  });

  test('API prices match the expected test data', async ({ request }) => {
    const list: { name: string; price: number }[] = await (await request.get('/list.json')).json();
    for (const expected of coffees) {
      const actual = list.find(c => c.name === expected.name);
      expect(actual, `${expected.name} should be in the API response`).toBeDefined();
      expect(actual!.price).toBe(expected.price);
    }
  });
});
