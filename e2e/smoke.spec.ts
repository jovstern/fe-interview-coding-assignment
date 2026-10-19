import { expect, test } from '@playwright/test';

test('the app serves the home page', async ({ page }) => {
  const response = await page.goto('/');
  expect(response?.ok()).toBe(true);
});
