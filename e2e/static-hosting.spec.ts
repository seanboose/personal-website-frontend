import { expect, test } from '@playwright/test';

for (const [path, heading] of [
  ['/', 'sean boose'],
  ['/landwhale', 'equip the landwhale'],
  ['/image-display', 'image retriever'],
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

test('unknown routes, retired login and missing assets return 404', async ({
  request,
}) => {
  for (const path of [
    '/missing-page',
    '/login',
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

test('image page renders a local image and can cycle the collection', async ({
  page,
}) => {
  await page.goto('/image-display');
  const img = page.getByRole('img');
  await expect(img).toBeVisible();
  await expect
    .poll(() =>
      img.evaluate(
        (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
      ),
    )
    .toBe(true);
  const before = await img.getAttribute('src');
  // Vite may inline small PNGs; both forms are served by the static build.
  expect(before).toMatch(/^(?:\/assets\/|data:image\/png;base64,)/);
  await expect(img).toHaveAttribute('alt', /\.png$/);
  await page.getByRole('button', { name: 'load it again!' }).click();
  await expect(img).toBeVisible();
  await expect
    .poll(() =>
      img.evaluate(
        (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
      ),
    )
    .toBe(true);
});
