import { defineConfig, devices } from '@playwright/test';

const PORT = 9002;

export default defineConfig({
    testDir: './tests/e2e',
    timeout: 60_000,
    expect: { timeout: 10_000 },
    fullyParallel: true,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? 'github' : 'list',
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
    // Reuses `npm run dev` if it's already running
    webServer: {
        command: 'npm run dev',
        port: PORT,
        reuseExistingServer: true,
        timeout: 180_000,
    },
});
