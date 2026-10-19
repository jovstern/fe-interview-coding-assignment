import { expect, test, type Page } from '@playwright/test';

function cardBoxes(page: Page) {
  return page
    .getByRole('main')
    .locator('a[href^="/photos/"]')
    .evaluateAll((cards) =>
      cards.map((card) => {
        const { x, y } = card.getBoundingClientRect();
        return { x, y };
      })
    );
}

test.describe('at desktop size', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('the feed has four columns', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('main').locator('a[href^="/photos/"]')
    ).toHaveCount(8);

    // CSS columns fill top to bottom, so each column's top card is the one to compare.
    const boxes = await cardBoxes(page);
    const columnTops = new Map<number, number>();
    for (const { x, y } of boxes) {
      columnTops.set(x, Math.min(columnTops.get(x) ?? y, y));
    }
    const tops = [...columnTops.values()];
    expect(tops).toHaveLength(4);
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThanOrEqual(
      1
    );
  });

  test('the details page splits into photo and panel', async ({
    page,
  }) => {
    await page.goto('/');
    await page
      .getByRole('link', { name: 'Still Harbour', exact: true })
      .click();
    const main = page.getByRole('main');
    const title = main.getByRole('heading', {
      level: 1,
      name: 'Still Harbour',
    });
    await expect(title).toBeVisible();

    await expect(
      main.getByRole('button', { name: 'Show full photo' })
    ).toBeHidden();
    await expect(
      main.getByRole('button', { name: 'Following Sofia Lind' })
    ).toBeVisible();

    const photoBox = await main.getByRole('img').first().boundingBox();
    const titleBox = await title.boundingBox();
    expect(photoBox).not.toBeNull();
    expect(titleBox).not.toBeNull();
    expect(photoBox!.x + photoBox!.width).toBeLessThanOrEqual(
      titleBox!.x
    );

    const overflows = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(overflows).toBe(false);
  });
});

test.describe('at a short desktop window', () => {
  test.use({ viewport: { width: 1280, height: 400 } });

  test('the photo stays in place while the details scroll', async ({
    page,
  }) => {
    await page.goto('/photos/p_001');
    const hero = page.getByRole('main').getByRole('img').first();
    await expect(hero).toBeVisible();

    await page.evaluate(() => window.scrollBy(0, 200));
    // The page may be shorter than 200px past the fold; any real scroll proves it.
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(100);
    const box = await hero.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.y)).toBeLessThanOrEqual(1);
  });
});

test('Tab first focuses the skip link', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Moments worth keeping' })
  ).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' })
  ).toBeFocused();
});

test.describe('at phone size', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the feed has two columns', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('main').locator('a[href^="/photos/"]')
    ).toHaveCount(8);

    const boxes = await cardBoxes(page);
    expect(new Set(boxes.map((box) => box.x)).size).toBe(2);
  });
});
