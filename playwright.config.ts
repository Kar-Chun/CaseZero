import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command:
      process.env.CASEZERO_PRODUCTION === "1" ? "npm run start" : "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer:
      !process.env.CI && process.env.CASEZERO_PRODUCTION !== "1",
    timeout: 120000,
  },
});
