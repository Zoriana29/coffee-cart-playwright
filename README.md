# Coffee Cart – Playwright Tests

[![Playwright Tests](https://github.com/Zoriana29/coffee-cart-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/Zoriana29/coffee-cart-playwright/actions/workflows/playwright.yml)

UI tests for [coffee-cart.app](https://coffee-cart.app) using **Playwright + TypeScript**, running on **GitHub Actions** in Chromium, Firefox and WebKit.

## What is tested

| Feature | Scenario | Type |
|---|---|---|
| Cart | 1 item shown after adding Espresso | Positive |
| Cart | Espresso listed on cart page | Positive |
| Cart | Total is $29.00 for Espresso + Cappuccino | Positive |
| Cart | Empty cart message | Negative |
| Checkout | Name and email kept in form | Positive |
| Checkout | Success message after purchase | Positive |
| Checkout | Empty form not submitted | Negative |
| Checkout | Invalid email not submitted | Negative |

## Run the tests

```bash
git clone https://github.com/Zoriana29/coffee-cart-playwright.git
cd coffee-cart-playwright
npm ci
npx playwright install
npx playwright test
npx playwright show-report
```

---

## How this project was built

### 1. Install tools (macOS)

```bash
# Homebrew (also installs Git)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js and npm – needed to run Playwright
brew install node

# Check
git -v && node -v && npm -v
```

### 2. Create the project

```bash
npm init playwright@latest   # one-time: creates config, package.json, .gitignore
npx playwright install       # downloads the browsers
```

### 3. Write tests

Tests are in `tests/` and named `*.spec.ts`. Run with `npx playwright test`.

### 4. Push to GitHub

Create an empty repo on GitHub, then:

```bash
git init
git add .
git commit -m "Add Playwright tests"
git branch -M main
git remote add origin https://github.com/<username>/coffee-cart-playwright.git
git push -u origin main
```

`node_modules/` and test reports are excluded by `.gitignore`.

### 5. Set up GitHub Actions

```bash
mkdir -p .github/workflows
touch .github/workflows/playwright.yml
```

Paste the workflow from the [Playwright CI docs](https://playwright.dev/docs/ci-intro) (see [playwright.yml](.github/workflows/playwright.yml)). It runs tests on every push to `main` and saves the HTML report.

Add the GitHub reporter in `playwright.config.ts` to see failures on the run page:

```ts
reporter: [['html'], ['github']],
```

Push, then open the **Actions** tab to watch the run.

### 6. Improve structure

- **baseURL** in `playwright.config.ts` – site address in one place:
  ```ts
  use: { baseURL: 'https://coffee-cart.app' }
  ```
  Tests then use `page.goto('/')`.
- **Grouped tests** into `cart.spec.ts` and `checkout.spec.ts` with `test.describe`.

### 7. Add negative tests

Check that the form rejects empty fields and an invalid email, and that an empty cart shows a message.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Executable doesn't exist` | Run `npx playwright install` |
| Firefox won't launch locally on macOS | Run `--project=chromium --project=webkit` locally; Firefox passes in CI |
| `Node.js 20 is deprecated` warning in CI | Update actions to the latest versions (`@v6`) |
| CI fails with `invalid URL` | `playwright.config.ts` wasn't committed – check `git status` before committing |

## Next steps

- [ ] Reusable helpers / Page Object Model
- [ ] Test data in a separate file
- [ ] API tests
