import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);
const port = 3100;

export default defineConfig({
  testDir: './e2e',
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    // Every run is recorded; the pr-demo skill turns a recording into the PR's demo GIF.
    video: { mode: 'on', size: { width: 1280, height: 720 } },
    viewport: { width: 1280, height: 720 },
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      // The assignment's API, used as-is.
      command: 'npm --prefix external-server start',
      url: 'http://localhost:4000/api/health',
      reuseExistingServer: true,
    },
    {
      // Always a fresh build: a server left running from an earlier run would test old code.
      command: `npm run build && npx next start --port ${port}`,
      url: `http://localhost:${port}`,
      reuseExistingServer: false,
      timeout: 180_000,
    },
  ],
});
