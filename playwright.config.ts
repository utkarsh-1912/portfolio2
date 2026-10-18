import { defineConfig, devices } from '@playwright/test';

const PORT = 9002;

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 60_000,
    expect: { timeout: 10_000 },
    fullyParallel: true,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
    use: {
        baseURL: `http://localhost:${PORT}`,
        // Skip entrance animations so assertions see content immediately
        reducedMotion: 'reduce',
        trace: 'retain-on-failure',
    },
    projects: [
        { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
        { name: 'mobile', use: { ...devices['Pixel 7'] } },
    ],
    // Locally: reuses `npm run dev` if it's already running. In CI: serves the production build.
    webServer: {
        command: process.env.CI ? `npm run start -- -p ${PORT}` : 'npm run dev',
        port: PORT,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
    },
});
