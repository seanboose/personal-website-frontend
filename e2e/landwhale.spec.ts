import { expect, test } from '@playwright/test';

test.describe('landwhale', () => {
  test.beforeEach(async ({ page }) => {
    {
      await page.goto('/landwhale');
    }
  });

  test('no equipment visible at first', async ({ page }) => {
    await expect(page.getByRole('img', { name: 'backpack' })).not.toBeVisible();
    await page.getByRole('button', { name: 'backpack' }).click();
    await expect(page.getByRole('img', { name: 'backpack' })).toBeVisible();
  });

  const equipment = [
    'backpack',
    'gold-flipper',
    'scanner',
    'spikes',
    'spine-eyes',
  ];
  equipment.forEach((item) => {
    test(`can toggle item '${item}'`, async ({ page }) => {
      await page.getByRole('button', { name: item.replace('-', ' ') }).click();
      await expect(page.getByRole('img', { name: item })).toBeVisible();
    });
  });
});
