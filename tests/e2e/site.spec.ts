import { test, expect, type Page } from '@playwright/test';

// Read-only smoke tests: nothing here submits the contact form or changes data.

/** Fails the test on uncaught page errors (hydration problems, runtime exceptions). */
function trackErrors(page: Page) {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    return errors;
}

test.describe('home page', () => {
    test('renders every section without runtime errors', async ({ page }) => {
        const errors = trackErrors(page);
        await page.goto('/');
        await expect(page).toHaveTitle(/Utkarsh Gupta/);
        await expect(page.locator('#hero h1')).toContainText("Hi, I'm");
        for (const id of ['about', 'education', 'projects', 'contact']) {
            await expect(page.locator(`#${id}`)).toBeAttached();
        }
        expect(errors).toEqual([]);
    });

    test('timeline filters by work and education', async ({ page }) => {
        await page.goto('/');
        const timeline = page.locator('#education');
        const all = await timeline.locator('ol > li').count();
        await timeline.getByRole('tab', { name: /work/i }).click();
        const work = await timeline.locator('ol > li').count();
        await expect(timeline.locator('ol > li .eyebrow').filter({ hasText: 'Education' })).toHaveCount(0);
        await timeline.getByRole('tab', { name: /education/i }).click();
        const edu = await timeline.locator('ol > li').count();
        expect(work + edu).toBe(all);
    });

    test('contact form validates before sending', async ({ page }) => {
        await page.goto('/#contact');
        await page.locator('#contact').getByRole('button', { name: /send message/i }).click();
        await expect(page.locator('#contact')).toContainText('at least 2 characters');
    });
});

test.describe('projects', () => {
    test('filters, opens the popup and navigates between projects', async ({ page }) => {
        await page.goto('/projects');
        const cards = page.getByRole('button', { name: /^Open details for/ });
        const total = await cards.count();
        expect(total).toBeGreaterThan(1);

        await cards.first().click();
        const dialog = page.getByRole('dialog');
        await expect(dialog).toBeVisible();
        const first = await dialog.locator('h2').textContent();
        await dialog.getByRole('button', { name: 'Next project' }).click();
        await expect(dialog.locator('h2')).not.toHaveText(first ?? '');
        await page.keyboard.press('Escape');
        await expect(dialog).toBeHidden();
    });

    test('case study link appears only for projects that have one', async ({ page }) => {
        await page.goto('/projects');
        const caseLinks = page.getByRole('link', { name: /^case study$/i });
        test.skip((await caseLinks.count()) === 0, 'no project has a written case study yet');
        await caseLinks.first().click();
        await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+$/);
        await expect(page.locator('h1')).toBeVisible();
    });

    test('projects without a case study have no page', async ({ page }) => {
        // GeoCore exists but has no case-study sections yet; the popup covers it instead
        const res = await page.goto('/projects/geocore');
        test.skip(res?.status() === 200, 'GeoCore now has a case study');
        expect(res?.status()).toBe(404);
    });

    test('unknown project slug is a 404', async ({ page }) => {
        const res = await page.goto('/projects/this-does-not-exist');
        expect(res?.status()).toBe(404);
    });
});

test.describe('terminal', () => {
    test('opens with Ctrl+` and runs commands', async ({ page, isMobile }) => {
        test.skip(isMobile, 'keyboard shortcut is desktop-only');
        await page.goto('/');
        await page.keyboard.press('Control+`');
        const term = page.getByRole('dialog', { name: 'Terminal' });
        await expect(term).toBeVisible();
        const input = term.getByLabel('Terminal command');
        await input.fill('help');
        await input.press('Enter');
        await expect(term).toContainText('List available commands');
        await input.fill('projetcs');
        await input.press('Enter');
        await expect(term).toContainText('did you mean');
        await page.keyboard.press('Escape');
        await expect(term).toBeHidden();
    });
});

test.describe('security and SEO', () => {
    test('admin requires a login', async ({ page }) => {
        await page.goto('/admin');
        await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fadmin/);
    });

    test('a forged session cookie is rejected', async ({ page, context, baseURL }) => {
        await context.addCookies([{ name: 'admin_session', value: 'authenticated', url: baseURL! }]);
        await page.goto('/admin');
        await expect(page).toHaveURL(/\/login/);
    });

    test('protected APIs return 401', async ({ request }) => {
        expect((await request.post('/api/seed')).status()).toBe(401);
        expect((await request.post('/api/upload')).status()).toBe(401);
    });

    test('sitemap and robots are served', async ({ request }) => {
        const sitemap = await request.get('/sitemap.xml');
        expect(sitemap.ok()).toBeTruthy();
        expect(await sitemap.text()).toContain('/projects</loc>');
        const robots = await request.get('/robots.txt');
        expect(await robots.text()).toContain('Disallow: /admin');
    });

    test('missing pages show the 404 screen', async ({ page }) => {
        const res = await page.goto('/definitely-not-a-page');
        expect(res?.status()).toBe(404);
        await expect(page.getByRole('heading', { name: /lost/i })).toBeVisible();
    });
});
