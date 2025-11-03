import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './src/scenarios',
  timeout: 120 * 1000, // 2 minutos por teste
  expect: { timeout: 20000 },
  retries: 2,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'https://cfp-client.vercel.app',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    trace: 'on-first-retry',
    locale: 'pt-BR',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    navigationTimeout: 90000,
    actionTimeout: 30000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
