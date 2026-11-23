# Coffee Cart – Playwright Tests

[![Playwright Tests](https://github.com/Zoriana29/coffee-cart-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/Zoriana29/coffee-cart-playwright/actions/workflows/playwright.yml)

UI and API tests for [coffee-cart.app](https://coffee-cart.app), written in Playwright + TypeScript and run on GitHub Actions in Chromium, Firefox and WebKit.

## Tech stack

Playwright 1.65 · TypeScript · Node.js · GitHub Actions

## What is tested

24 tests × 3 browsers (Chromium, Firefox, WebKit) = 72 runs.

| Feature | Scenario | Type |
|---|---|---|
| Cart | 1 item shown after adding Espresso | UI · Positive |
| Cart | Espresso listed on cart page | UI · Positive |
| Cart | Total is $29.00 for Espresso + Cappuccino | UI · Positive |
| Cart | Empty cart message | UI · Negative |
| Prices | Correct total for each of 9 coffees | UI · Data-driven |
| Checkout | Name and email kept in form | UI · Positive |
| Checkout | Success message after purchase | UI · Positive |
| Checkout | Empty form not submitted, field marked invalid | UI · Negative |
| Checkout | 3 invalid emails rejected | UI · Negative, data-driven |
| API | `GET /list.json` returns 200 and JSON | API |
| API | Every coffee has a name, positive price and recipe | API · Data validation |
| API | Prices match the expected test data | API |
| Mocked API | UI shows a coffee from mocked data | UI · Network mock |
| Mocked API | Empty menu when the API returns no coffees | UI · Network mock, edge case |

## Prerequisites

- Node.js 20+ (LTS)
- Git

## Run the tests

```bash
git clone https://github.com/Zoriana29/coffee-cart-playwright.git
cd coffee-cart-playwright
npm ci
npx playwright install
npm test
npx playwright show-report
```

Run one browser only:

```bash
npx playwright test --project=chromium
```

## Project structure

```
pages/
  menu-page.ts          Page Object: menu locators and actions
tests/
  cart.spec.ts          cart and price UI tests
  checkout.spec.ts      checkout UI tests
  api.spec.ts           API tests for /list.json
  network-mock.spec.ts  UI tests with mocked API data
  test-data.ts          customer, invalid emails, coffee prices
.github/workflows/      CI pipeline
playwright.config.ts    baseURL, browsers, retries, reporters
```

## Design decisions

- **Locators:** `data-test` attributes and role-based locators, so tests stay stable when styling changes.
- **Page Object Model:** menu locators and actions live in `pages/menu-page.ts`, so a changed locator is fixed in one place.
- **Test data** in `tests/test-data.ts`, shared by UI and API tests; no personal data in tests.
- **Shared setup** with `test.beforeEach`; **data-driven tests** generated from arrays with a `for` loop.
- **Negative tests** check that the form stays open and the field is invalid, not only that the success message is missing.
- **API tests** use Playwright's `request` fixture; **network mocking** with `page.route` tests the UI with controlled data.
- **baseURL** in `playwright.config.ts`: the site address lives in one place; tests use `page.goto('/')`.
- **CI settings:** retries and a single worker only on CI; a trace is recorded on the first retry for debugging.
- **Reports:** the HTML report is saved as a CI artifact (Actions → run → Artifacts); the GitHub reporter shows failures on the run page.

## Notes

Tests run against the live public site coffee-cart.app, so a change on the site can fail a test without a bug in the test code.

## Next steps

- [x] API tests with Playwright `request`
- [x] Test data in a separate file
- [x] Shared setup with `beforeEach`
- [x] Page Object Model for the menu
- [x] Network mocking
- [ ] Page Objects for cart and checkout
- [ ] Accessibility checks with axe-core
- [ ] Visual comparison with `toHaveScreenshot`
