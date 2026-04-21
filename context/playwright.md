# Playwright

> **Used by**: QA
> **What to paste**: test API (test, expect, page, locator), config (playwright.config.ts), fixtures, assertions, selectors, network interception, trace viewer.
> **Source**: https://playwright.dev/docs/intro

<!-- PASTE CONTEXT BELOW THIS LINE -->


# Playwright

Playwright is a framework for web automation and testing developed by Microsoft. It provides a unified API to automate Chromium, Firefox, and WebKit browsers with a single codebase. The framework supports cross-browser testing, headless and headed modes, and works on Windows, Linux, and macOS with native mobile emulation for Chrome Android and Mobile Safari.

Playwright is designed for end-to-end testing with features like auto-waiting, web-first assertions, test isolation, parallel execution, and comprehensive tracing capabilities. It offers multiple interfaces including Playwright Test (full test runner), Playwright CLI (for coding agents), Playwright MCP (for AI agents via Model Context Protocol), and the Playwright Library (for browser automation scripts). The framework also provides a VS Code extension for test authoring and debugging.

## Installation

Installing Playwright using npm to set up a new project with test configuration and browser binaries.

```bash
# Initialize new Playwright project (interactive prompts for TypeScript/JavaScript, test folder, GitHub Actions)
npm init playwright@latest

# Or add to existing project manually
npm i -D @playwright/test
npx playwright install
```

## Writing a Basic Test

Creating end-to-end tests using the Playwright Test framework with built-in assertions and locators.

```typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

## Running Tests

Executing tests with various options including parallel execution, headed mode, and specific projects.

```bash
# Run all tests (headless, parallel across all configured browsers)
npx playwright test

# Run tests with visible browser window
npx playwright test --headed

# Run a single project/browser
npx playwright test --project=chromium

# Run one specific test file
npx playwright test tests/example.spec.ts

# Open interactive UI mode
npx playwright test --ui

# View test report after run
npx playwright show-report
```

## Page Navigation and Screenshots

Navigating to URLs and capturing screenshots using the Page API for browser automation scripts.

```typescript
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Navigate to a URL
await page.goto('https://example.com');

// Take a screenshot
await page.screenshot({ path: 'screenshot.png' });

// Take a full page screenshot
await page.screenshot({ path: 'fullpage.png', fullPage: true });

// Generate PDF (Chromium only)
await page.pdf({ path: 'page.pdf', format: 'A4' });

await browser.close();
```

## Locators - Finding Elements

Using resilient locators that mirror how users see the page with role-based, label-based, and test ID selectors.

```typescript
// By ARIA role (recommended approach)
page.getByRole('button', { name: 'Submit' });
page.getByRole('heading', { name: 'Sign up', level: 1 });
page.getByRole('checkbox', { name: 'Subscribe', checked: true });

// By label text (for form inputs)
page.getByLabel('Email');
page.getByLabel('Password');

// By placeholder
page.getByPlaceholder('Search...');

// By test ID (data-testid attribute)
page.getByTestId('login-form');

// By text content
page.getByText('Hello World');
page.getByText('Hello', { exact: true });
page.getByText(/Hello/);

// By alt text (for images)
page.getByAltText('Playwright logo');

// By title attribute
page.getByTitle('Issues count');

// CSS selector (escape hatch)
page.locator('div.container');
```

## Clicking and Interacting

Performing click actions and other interactions on page elements with auto-waiting.

```typescript
// Simple click
await page.getByRole('button').click();

// Double-click
await page.getByRole('button').dblclick();

// Right-click
await page.getByRole('button').click({ button: 'right' });

// Shift+click
await page.getByRole('button').click({ modifiers: ['Shift'] });

// Click at specific position
await page.locator('canvas').click({
  button: 'right',
  modifiers: ['Shift'],
  position: { x: 23, y: 32 },
});

// Hover over element
await page.getByRole('link').hover();

// Check/uncheck checkboxes
await page.getByRole('checkbox').check();
await page.getByRole('checkbox').uncheck();
await page.getByRole('checkbox').setChecked(true);
```

## Filling Forms

Filling input fields and selecting options in form elements.

```typescript
// Fill text input (clears existing value first)
await page.getByRole('textbox').fill('example value');
await page.getByLabel('Email').fill('user@example.com');
await page.getByPlaceholder('Password').fill('secret123');

// Clear input field
await page.getByRole('textbox').clear();

// Type character by character (for special keyboard handling)
await page.getByRole('textbox').pressSequentially('Hello');
await page.getByRole('textbox').pressSequentially('World', { delay: 100 });

// Select dropdown options
await page.getByRole('combobox').selectOption('blue');
await page.getByRole('combobox').selectOption({ label: 'Blue' });
await page.getByRole('combobox').selectOption(['red', 'green', 'blue']);

// File upload
await page.getByLabel('Upload file').setInputFiles('myfile.pdf');
await page.getByLabel('Upload files').setInputFiles(['file1.txt', 'file2.txt']);
await page.getByLabel('Upload file').setInputFiles([]); // Clear selection
```

## Keyboard Actions

Pressing keyboard keys and shortcuts on focused elements.

```typescript
// Press single keys
await page.getByRole('textbox').press('Backspace');
await page.getByRole('textbox').press('Enter');
await page.getByRole('textbox').press('Tab');

// Press key combinations
await page.getByRole('textbox').press('Control+a');
await page.getByRole('textbox').press('Control+c');
await page.getByRole('textbox').press('Control+v');
await page.getByRole('textbox').press('Shift+ArrowLeft');

// ControlOrMeta works cross-platform (Control on Windows/Linux, Meta on macOS)
await page.getByRole('textbox').press('ControlOrMeta+a');
```

## Assertions

Using web-first assertions that automatically retry until the condition is met or timeout.

```typescript
import { test, expect } from '@playwright/test';

test('assertions example', async ({ page }) => {
  // Page assertions
  await expect(page).toHaveTitle(/Playwright/);
  await expect(page).toHaveURL('https://playwright.dev/');

  // Locator assertions
  await expect(page.getByRole('heading')).toBeVisible();
  await expect(page.getByRole('button')).toBeEnabled();
  await expect(page.getByRole('button')).toBeDisabled();
  await expect(page.getByRole('checkbox')).toBeChecked();
  await expect(page.getByRole('textbox')).toBeEditable();
  await expect(page.getByRole('textbox')).toBeFocused();
  await expect(page.getByRole('dialog')).toBeHidden();

  // Text assertions
  await expect(page.getByRole('heading')).toHaveText('Welcome');
  await expect(page.getByRole('listitem')).toHaveText(['Item 1', 'Item 2']);
  await expect(page.getByRole('heading')).toContainText('Welcome');

  // Attribute and value assertions
  await expect(page.getByRole('textbox')).toHaveValue('expected value');
  await expect(page.getByRole('link')).toHaveAttribute('href', '/about');

  // Count assertion
  await expect(page.getByRole('listitem')).toHaveCount(5);

  // Negative assertions
  await expect(page.getByRole('button')).not.toBeDisabled();
});
```

## Browser Context and Authentication

Managing browser contexts for test isolation and storing/reusing authentication state.

```typescript
import { chromium } from 'playwright';

const browser = await chromium.launch();

// Create a new context (isolated session)
const context = await browser.newContext();
const page = await context.newPage();

// Perform login
await page.goto('https://example.com/login');
await page.getByLabel('Username').fill('user');
await page.getByLabel('Password').fill('password');
await page.getByRole('button', { name: 'Sign in' }).click();

// Save authentication state to file
await page.context().storageState({ path: 'auth.json' });
await browser.close();

// Later, reuse authentication state
const browser2 = await chromium.launch();
const context2 = await browser2.newContext({ storageState: 'auth.json' });
const page2 = await context2.newPage();
// User is already logged in!
```

## Network Request Interception

Intercepting and modifying network requests using route handlers.

```typescript
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Abort all image requests
await page.route('**/*.{png,jpg,jpeg}', route => route.abort());

// Mock API response
await page.route('/api/users', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ users: [{ id: 1, name: 'John' }] }),
  });
});

// Modify request
await page.route('/api/**', async route => {
  const headers = {
    ...route.request().headers(),
    'Authorization': 'Bearer token123',
  };
  await route.continue({ headers });
});

// Conditional routing based on post data
await page.route('/api/**', async route => {
  if (route.request().postData()?.includes('my-string')) {
    await route.fulfill({ body: 'mocked-data' });
  } else {
    await route.continue();
  }
});

await page.goto('https://example.com');
await browser.close();
```

## Mobile Device Emulation

Emulating mobile devices including viewport, user agent, touch, and device scale factor.

```typescript
import { chromium, devices } from 'playwright';

const browser = await chromium.launch();

// Use predefined device settings
const context = await browser.newContext(devices['iPhone 15']);
const page = await context.newPage();
await page.goto('https://playwright.dev/');
await page.screenshot({ path: 'iphone.png' });

// Custom device emulation
const customContext = await browser.newContext({
  viewport: { width: 375, height: 812 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Custom User Agent',
});

await browser.close();
```

## Waiting for Elements and Navigation

Waiting for specific conditions before proceeding with test actions.

```typescript
// Wait for element to be visible (implicit in locator actions)
await page.getByRole('button').waitFor();
await page.getByRole('button').waitFor({ state: 'visible' });
await page.getByRole('button').waitFor({ state: 'hidden' });
await page.getByRole('button').waitFor({ state: 'attached' });
await page.getByRole('button').waitFor({ state: 'detached' });

// Wait for URL navigation
await page.waitForURL('**/target.html');
await page.waitForURL(/.*success.*/);

// Wait for load state
await page.getByRole('button').click(); // triggers navigation
await page.waitForLoadState(); // default: 'load'
await page.waitForLoadState('domcontentloaded');
await page.waitForLoadState('networkidle');

// Wait for request/response
const requestPromise = page.waitForRequest('https://example.com/api');
await page.getByText('Load data').click();
const request = await requestPromise;

const responsePromise = page.waitForResponse('https://example.com/api');
await page.getByText('Load data').click();
const response = await responsePromise;
```

## Filtering and Chaining Locators

Narrowing down element selection using filters and locator composition.

```typescript
// Filter by text content
const row = page.locator('tr').filter({ hasText: 'John' });

// Filter by containing another locator
const row2 = page.locator('tr').filter({
  has: page.getByRole('button', { name: 'Edit' }),
});

// Filter by NOT containing text
const row3 = page.locator('tr').filter({ hasNotText: 'Deleted' });

// Filter by NOT containing another locator
const row4 = page.locator('tr').filter({
  hasNot: page.getByRole('button', { name: 'Archive' }),
});

// Chain multiple filters
await page.locator('tr')
  .filter({ hasText: 'Active' })
  .filter({ has: page.getByRole('button', { name: 'Edit' }) })
  .screenshot();

// Combine locators with AND logic
const button = page.getByRole('button').and(page.getByTitle('Subscribe'));

// Combine locators with OR logic
const element = page.getByRole('button', { name: 'New' })
  .or(page.getByText('Confirm settings'));
await expect(element.first()).toBeVisible();

// Get nth element (zero-indexed)
await page.getByRole('listitem').nth(2).click();
await page.getByRole('listitem').first().click();
await page.getByRole('listitem').last().click();
```

## iFrames

Working with iframe content using frame locators.

```typescript
// Locate iframe and interact with elements inside
const frameLocator = page.frameLocator('#my-iframe');
await frameLocator.getByRole('button', { name: 'Submit' }).click();
await frameLocator.getByText('Success').waitFor();

// Nested iframes
const nestedFrame = page.frameLocator('iframe.outer').frameLocator('iframe.inner');
await nestedFrame.getByRole('link').click();

// Convert locator to frame locator
const iframeLocator = page.locator('iframe[name="embedded"]');
const frame = iframeLocator.contentFrame();
await frame.getByRole('button').click();
```

## Tracing and Debugging

Recording traces for debugging test failures with full DOM snapshots and network logs.

```typescript
// playwright.config.ts - Enable tracing on first retry
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    trace: 'on-first-retry',  // 'on', 'off', 'on-first-retry', 'retain-on-failure'
  },
});
```

```bash
# View trace file
npx playwright show-trace trace.zip

# Run with headed browser and pause on failure
npx playwright test --headed --debug

# Run with VS Code debugger
# Add breakpoints and run from Testing sidebar
```

## Playwright Test Configuration

Configuring Playwright Test with browsers, timeouts, retries, and parallel execution.

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Evaluate JavaScript in Browser

Executing JavaScript code within the browser context for custom operations.

```typescript
// Evaluate expression
const pageTitle = await page.evaluate(() => document.title);

// Pass arguments to evaluate
const result = await page.evaluate(([x, y]) => {
  return Promise.resolve(x * y);
}, [7, 8]);
console.log(result); // 56

// Evaluate on element
const text = await page.getByTestId('myId').evaluate((element, suffix) => {
  return element.textContent + suffix;
}, ' - appended');

// Evaluate on all matching elements
const itemCount = await page.locator('div').evaluateAll((divs, min) => {
  return divs.length >= min;
}, 10);
```

## Handling Dialogs

Responding to JavaScript dialogs like alerts, confirms, and prompts.

```typescript
// Auto-accept all dialogs
page.on('dialog', dialog => dialog.accept());

// Handle specific dialog types
page.on('dialog', async dialog => {
  console.log(dialog.type()); // 'alert', 'confirm', 'prompt', 'beforeunload'
  console.log(dialog.message()); // dialog text

  if (dialog.type() === 'confirm') {
    await dialog.accept(); // or dialog.dismiss()
  } else if (dialog.type() === 'prompt') {
    await dialog.accept('My answer');
  } else {
    await dialog.dismiss();
  }
});

await page.getByRole('button', { name: 'Show Dialog' }).click();
```

## Drag and Drop

Performing drag and drop operations between elements.

```typescript
// Simple drag and drop
const source = page.locator('#source');
const target = page.locator('#target');
await source.dragTo(target);

// Drag to specific position
await source.dragTo(target, {
  sourcePosition: { x: 34, y: 7 },
  targetPosition: { x: 10, y: 20 },
});

// Using page method with selectors
await page.dragAndDrop('#source', '#target');
```

## API Testing

Making HTTP requests directly without browser context for API testing.

```typescript
import { test, expect } from '@playwright/test';

test('API test', async ({ request }) => {
  // GET request
  const response = await request.get('https://api.example.com/users');
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  const users = await response.json();
  expect(users).toHaveLength(10);

  // POST request with JSON body
  const createResponse = await request.post('https://api.example.com/users', {
    data: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  });
  expect(createResponse.status()).toBe(201);

  // Request with headers
  const authResponse = await request.get('https://api.example.com/protected', {
    headers: {
      'Authorization': 'Bearer token123',
    },
  });

  // Form data
  const formResponse = await request.post('https://api.example.com/submit', {
    form: {
      name: 'John',
      email: 'john@example.com',
    },
  });
});
```

## MCP Server Integration

Setting up Playwright MCP server for AI agent integration through the Model Context Protocol.

```json
// MCP client configuration (VS Code, Cursor, Claude Desktop, etc.)
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

```bash
# Add MCP server for Claude Code
claude mcp add playwright npx @playwright/mcp@latest
```

## Playwright CLI for Coding Agents

Using Playwright CLI for browser automation in coding agent workflows.

```bash
# Install globally
npm install -g @playwright/cli@latest

# Optionally install skills for richer agent integration
playwright-cli install --skills

# Open browser and navigate
playwright-cli open https://demo.playwright.dev/todomvc/ --headed

# Type into input
playwright-cli type "Buy groceries"

# Press keys
playwright-cli press Enter

# Take screenshot
playwright-cli screenshot

# Show visual dashboard with live sessions
playwright-cli show
```

Playwright is the go-to solution for modern web automation and testing, providing a robust framework for end-to-end testing, web scraping, PDF generation, and AI-driven browser automation. Its cross-browser support, resilient locator strategies, and comprehensive tooling make it suitable for both testing teams and developers building browser automation solutions.

The framework integrates seamlessly with various development workflows through its test runner, VS Code extension, CLI, and MCP server. Whether you're writing traditional end-to-end tests, building coding agents, or integrating with AI assistants, Playwright provides the necessary APIs and tools to interact with web pages reliably across all major browsers and platforms.
