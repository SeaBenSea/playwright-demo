const { test, expect } = require("@playwright/test");

test.describe("Automation Exercise", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Automation Exercise");
  });
});
