import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Automated accessibility checks (WCAG 2.1 A/AA) on the main public pages.
const PAGES = ['/', '/about', '/projects', '/blog'];

for (const path of PAGES) {
    test(`no serious accessibility violations on ${path}`, async ({ page }) => {
        // axe on the full home page is slow against the dev server
        test.setTimeout(180_000);
        await page.goto(path);
        await page.waitForLoadState('load');
        await page.locator('main').first().waitFor();
        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            // Decorative marquee duplicates are aria-hidden; the film grain is a pure overlay
            .exclude('.grain')
            .analyze();
        const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
        const summary = serious.map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} element(s), e.g. ${v.nodes[0]?.target.join(' ')}`);
        expect(summary, summary.join('\n')).toEqual([]);
    });
}
