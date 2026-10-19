import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('browse from the feed to a photo and on to a related one', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Moments worth keeping' })
  ).toBeVisible();
  await page.waitForTimeout(1000);

  await page
    .getByRole('link', { name: 'Casa del Sol', exact: true })
    .click();
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', { level: 1, name: 'Casa del Sol' })
  ).toBeVisible();
  await expect(
    main.getByText('Positano', { exact: true })
  ).toBeVisible();
  await page.waitForTimeout(1000);

  await main
    .getByRole('link', { name: 'Terracotta Rooftops by Elena Rossi' })
    .click();
  await expect(
    page
      .getByRole('main')
      .getByRole('heading', { level: 1, name: 'Terracotta Rooftops' })
  ).toBeVisible();
  await page.waitForTimeout(1000);
});

test('an unknown photo shows a not-found page with a way home', async ({
  page,
}) => {
  // The photo skeleton streams first, so the status is already 200; Next.js
  // marks the streamed not-found page noindex instead.
  await page.goto('/photos/nope');
  await expect(
    page.getByRole('heading', { name: 'Photo not found' })
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Back to all photos' })
  ).toHaveAttribute('href', '/');
  await expect(
    page.locator('meta[name="robots"]').first()
  ).toHaveAttribute('content', /noindex/);
  await page.waitForTimeout(1000);
});
