import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('a collection chip filters the feed through the URL', async ({
  page,
}) => {
  await page.goto('/');
  const cards = page.getByRole('main').locator('a[href^="/photos/"]');
  await expect(cards).toHaveCount(8);

  await page.getByRole('link', { name: 'Coast' }).click();
  await expect(page).toHaveURL(/\?filter=coast$/);
  await expect(cards).toHaveCount(3);
  await expect(
    page.getByRole('link', { name: 'Coast' })
  ).toHaveAttribute('aria-current', 'page');

  await page.goBack();
  await expect(cards).toHaveCount(8);
});

test('an unknown collection shows the empty state', async ({
  page,
}) => {
  await page.goto('/?filter=zzz');
  await expect(
    page.getByRole('heading', { name: 'Nothing here yet' })
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Show all photos' })
  ).toHaveAttribute('href', '/');
});
