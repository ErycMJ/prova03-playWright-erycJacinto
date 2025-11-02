import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/scenarios',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  retries: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://cfp-client.vercel.app',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    trace: 'on-first-retry',
    locale: 'pt-BR',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'https://cfp-client.vercel.app',
    reuseExistingServer: !process.env.CI,
  },
});
