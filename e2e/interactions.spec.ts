import { expect, test } from '@playwright/test';

test.describe('at phone size', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('filter, follow and collapse, then move on to a related photo', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Moments worth keeping' })
    ).toBeVisible();

    await page.getByRole('link', { name: 'Coast' }).click();
    await expect(page).toHaveURL(/\?filter=coast$/);
    await expect(
      page.getByRole('main').locator('a[href^="/photos/"]')
    ).toHaveCount(3);
    await page.waitForTimeout(1000);

    await page
      .getByRole('link', { name: 'Still Harbour', exact: true })
      .click();
    const main = page.getByRole('main');
    await expect(
      main.getByRole('heading', { level: 1, name: 'Still Harbour' })
    ).toBeVisible();
    await page.waitForTimeout(1000);

    // Sofia Lind is followed on the server; the toggle flips it locally.
    const follow = main.getByRole('button', {
      name: /^Follow(ing)? Sofia Lind$/,
    });
    await expect(follow).toHaveAttribute('aria-pressed', 'true');
    await follow.click();
    await expect(follow).toHaveAttribute('aria-pressed', 'false');
    await expect(follow).toHaveAccessibleName('Follow Sofia Lind');
    await page.waitForTimeout(1000);

    await main.getByRole('button', { name: 'Show full photo' }).click();
    const handle = main.getByRole('button', {
      name: 'Show photo details',
    });
    await expect(handle).toHaveAttribute('aria-expanded', 'false');
    await expect(follow).not.toBeInViewport();
    await page.waitForTimeout(1000);

    await handle.click();
    await expect(
      main.getByRole('button', { name: 'Show full photo' })
    ).toHaveAttribute('aria-expanded', 'true');
    await expect(follow).toBeInViewport();
    await page.waitForTimeout(1000);

    // Collapsed again, then on to a related photo: its sheet starts expanded, and Lucia
    // Moretti is followed on the server, so it shows that, not the previous toggle. The
    // collapsed sheet hides the related links, so the click is dispatched directly.
    await main.getByRole('button', { name: 'Show full photo' }).click();
    await expect(handle).toHaveAttribute('aria-expanded', 'false');
    await main
      .getByRole('link', {
        name: 'Amalfi Steps by Lucia Moretti',
        includeHidden: true,
      })
      .dispatchEvent('click');
    await expect(
      main.getByRole('heading', { level: 1, name: 'Amalfi Steps' })
    ).toBeVisible();
    await expect(
      main.getByRole('button', { name: 'Following Lucia Moretti' })
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(
      main.getByRole('button', { name: 'Show full photo' })
    ).toHaveAttribute('aria-expanded', 'true');
    await page.waitForTimeout(1000);
  });
});

test.describe('at 320px', () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const path of ['/', '/photos/p_001']) {
    test(`${path} has no horizontal overflow`, async ({ page }) => {
      await page.goto(path);
      await expect(
        page.getByRole('heading', { level: 1 })
      ).toBeVisible();
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
