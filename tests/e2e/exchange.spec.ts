import { test, expect, type Page } from '@playwright/test';

async function chooseAppearance(page: Page, name: 'Light' | 'Dark' | 'Exchange') {
  const toggle = page.locator('.appearance-cycle:visible');
  // Light → Dark → Exchange → Light; retry clicks until the page has hydrated
  await expect(async () => {
    if (await toggle.getAttribute('data-mode') !== name.toLowerCase()) await toggle.click();
    await expect(toggle).toHaveAttribute('data-mode', name.toLowerCase(), { timeout: 1000 });
  }).toPass({ timeout: 30_000 });
}

test('exchange is opt-in and returns to the selected standard theme', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.daylight-home')).toBeVisible();
  await chooseAppearance(page, 'Dark');
  await chooseAppearance(page, 'Exchange');
  await expect(page.locator('.exchange-home')).toBeVisible();
  await expect(page.locator('.daylight-home')).toBeHidden();
  // On phones the desks fold into a menu, so check the navigation exists rather than is shown
  await expect(page.locator('#exchange-navigation')).toBeAttached();
  await page.getByRole('button', { name: 'Reset market replay' }).click();
  await page.getByRole('button', { name: 'Advance simulated market tick' }).click();
  await expect(page.locator('.tick-sequence')).toContainText('480121');
  await page.getByRole('button', { name: 'Event tape', exact: true }).click();
  await expect(page.locator('.tick-events')).toContainText('ADD');
  await page.reload();
  await expect(page.locator('.exchange-home')).toBeVisible();
  await chooseAppearance(page, 'Light');
  await expect(page.locator('.daylight-home')).toBeVisible();
  await expect(page.locator('.exchange-home')).toBeHidden();
  await expect(page.locator('html')).toHaveClass(/\blight\b/);
});

test('exchange follows public pages and fits the viewport', async ({ page }) => {
  await page.goto('/');
  await chooseAppearance(page, 'Exchange');
  for (const route of ['/about', '/projects', '/blog']) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('data-experience', 'exchange');
    await expect(page.locator('main h1:visible')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.goto('/login');
  await expect(page.locator('html')).toHaveAttribute('data-experience', 'daylight');
  await expect(page.getByRole('navigation', { name: 'Exchange navigation' })).toHaveCount(0);
});

test('exchange project search and contact validation remain functional', async ({ page }) => {
  await page.goto('/projects');
  await chooseAppearance(page, 'Exchange');
  await page.getByRole('searchbox', { name: 'Search projects' }).fill('no-project-matches-this-query-987');
  await expect(page.locator('.project-register tbody tr')).toHaveCount(0);
  await expect(page.getByText('No projects match that filter.')).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search projects' }).fill('');
  const rows = page.locator('.project-register tbody tr');
  if (await rows.count()) {
    await rows.first().getByRole('button', { name: /^Open details for/ }).click();
    await expect(page.locator('.project-detail-window')).toBeVisible();
    await page.keyboard.press('Escape');
  }
  await page.goto('/#contact');
  await expect(page.getByRole('heading', { name: 'Contact desk', exact: true })).toBeVisible();
  await page.locator('#contact').getByRole('button', { name: /Send message/ }).click();
  await expect(page.locator('#contact')).toContainText('at least 2 characters');
});
