// @ts-check
import { defineConfig } from "@playwright/test";

process.env.PLAYWRIGHT_EXPERIMENTAL_FEATURES = "1";

module.exports = defineConfig({
  expect: {
    timeout: 10 * 1000,
  },
  retries: process.env.CI ? 3 : 0,
  reporter: process.env.CI
    ? "github"
    : [
        ["list"],
        ["html", { open: "never", outputFolder: "reports" }],
        ["json", { outputFile: "reports/results.json" }],
      ],
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  use: {
    browsers: ["chromium"],
    viewport: { width: 1440, height: 900 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions: {
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--disable-gpu",
        "--disable-dev-shm-usage",
      ],
    },
    headless: true,
  },

  projects: [
    {
      name: "e2e",
      testDir: "tests/e2e",
      testMatch: "**/*.e2e.test.js",
      outputDir: "test-results/e2e",
      timeout: 60000,
      use: {
        baseURL: "https://www.automationexercise.com/",
      },
    },
    {
      name: "api",
      testDir: "tests/api",
      testMatch: "**/*.api.test.js",
      outputDir: "test-results/api",
      timeout: 60000,
      use: {
        baseURL: "https://automationexercise.com/api/",
      },
    },
  ],
});
