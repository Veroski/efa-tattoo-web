import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: 1,
  reporter: "list",
  use: {
    headless: true,
    ignoreHTTPSErrors: true,
    launchOptions: {
      executablePath:
        "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  },
  projects: [
    {
      name: "Mobile Chrome",
      use: { viewport: { width: 390, height: 844 } },
    },
    {
      name: "Desktop Chrome",
      use: { viewport: { width: 1280, height: 800 } },
    },
  ],
});
