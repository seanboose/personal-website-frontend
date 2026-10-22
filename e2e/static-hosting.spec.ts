import { expect, test } from '@playwright/test';

for (const [path, heading] of [
  ['/', 'sean boose'],
  ['/landwhale', 'equip the landwhale'],
]) {
  test(`${path} supports direct navigation and refresh`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole('heading', { name: heading, exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole('heading', { name: heading, exact: true }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('unknown routes, retired auth/image endpoints and missing assets return 404', async ({
  request,
}) => {
  for (const path of [
    '/missing-page',
    '/login',
    '/image-display',
    '/api/images/list',
    '/assets/images/auth-image/testImage-purple.png',
    '/assets/missing.js',
    '/assets/missing.png',
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test('landwhale images load from this deployment', async ({ page }) => {
  await page.goto('/landwhale');
  for (const img of await page
    .getByRole('img', { includeHidden: true })
    .all()) {
    await expect
      .poll(() =>
        img.evaluate(
          (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
        ),
      )
      .toBe(true);
    expect(await img.getAttribute('src')).toMatch(/^\/assets\/landwhale\//);
  }
});
