import { defineConfig } from '@playwright/test';

const port = 4175;

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: {
    timeout: 7_500
  },
  use: {
    acceptDownloads: true,
    baseURL: `http://127.0.0.1:${port}`,
    browserName: 'chromium',
    headless: true
  },
  webServer: {
    command: 'npm run build && npm run preview',
    port,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
