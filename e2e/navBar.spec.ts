import { expect, test } from '@playwright/test';

test.describe('can nav to', async () => {
  test('landwhale', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'landwhale' }).click();

    await expect(
      page.getByRole('heading', { name: 'equip the landwhale' }),
    ).toBeVisible();
  });
});
