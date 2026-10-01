import { defineConfig } from '@playwright/test';
import chromium, { inflate, setupLambdaEnvironment } from '@sparticuz/chromium';
import { join } from 'node:path';

// The sandbox does not provide system NSS/NSPR packages, so extract the
// compatible runtime libraries packaged alongside this headless Chromium.
const runtimePath = await inflate(join(process.cwd(), 'node_modules/@sparticuz/chromium/bin/al2023.tar.br'));
setupLambdaEnvironment(join(runtimePath, 'lib'));
const executablePath = await chromium.executablePath();

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  timeout: 60_000,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    headless: true,
    launchOptions: {
      executablePath,
      args: chromium.args,
    },
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
