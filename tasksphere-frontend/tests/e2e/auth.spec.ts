import { test, expect } from '@playwright/test';

const TEST_USER = {
  name: 'E2E Test User',
  email: `e2e-${Date.now()}@example.com`,
  password: 'Str0ngP@ssword!',
};

test.describe.serial('Auth → Projects → Tasks E2E flow', () => {
  test('register a new user', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel(/name/i).fill(TEST_USER.name);
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /register|sign up/i }).click();

    await expect(page).toHaveURL(/\/(dashboard|projects)/, { timeout: 10_000 });
  });

  test('login with registered user', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /log\s*in|sign\s*in/i }).click();

    await expect(page).toHaveURL(/\/(dashboard|projects)/, { timeout: 10_000 });
  });

  test('navigate to projects page', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /log\s*in|sign\s*in/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|projects)/, { timeout: 10_000 });

    await page.getByRole('link', { name: /projects/i }).click();
    await expect(page).toHaveURL(/\/projects/);
  });

  test('create a project', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /log\s*in|sign\s*in/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|projects)/, { timeout: 10_000 });

    await page.getByRole('link', { name: /projects/i }).click();
    await expect(page).toHaveURL(/\/projects/);

    await page.getByRole('button', { name: /new project|create project/i }).click();

    const nameField = page.getByLabel(/project name|name/i);
    await nameField.fill('E2E Test Project');

    const descField = page.getByLabel(/description/i);
    if (await descField.isVisible()) {
      await descField.fill('Created by Playwright E2E test');
    }

    await page.getByRole('button', { name: /create|save|submit/i }).click();

    await expect(page.getByText('E2E Test Project')).toBeVisible({ timeout: 10_000 });
  });

  test('navigate to tasks and create a task', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_USER.email);
    await page.getByLabel(/password/i).fill(TEST_USER.password);
    await page.getByRole('button', { name: /log\s*in|sign\s*in/i }).click();
    await expect(page).toHaveURL(/\/(dashboard|projects)/, { timeout: 10_000 });

    await page.getByRole('link', { name: /projects/i }).click();
    await page.getByText('E2E Test Project').click();

    const tasksLink = page.getByRole('link', { name: /tasks/i });
    if (await tasksLink.isVisible()) {
      await tasksLink.click();
    }

    await page.getByRole('button', { name: /new task|create task|add task/i }).click();

    await page.getByLabel(/title/i).fill('E2E Test Task');

    const descField = page.getByLabel(/description/i);
    if (await descField.isVisible()) {
      await descField.fill('Task created by Playwright');
    }

    await page.getByRole('button', { name: /create|save|submit/i }).click();

    await expect(page.getByText('E2E Test Task')).toBeVisible({ timeout: 10_000 });
  });
});
