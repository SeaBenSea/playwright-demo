import { expect, test } from "@playwright/test";
import { scrollDown } from "../lib/navigationHelpers.js";
import { subscriptionHeading } from "../lib/selectors";

test.describe.parallel("Subscription Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Automation Exercise/i);
  });

  test("should subscribe using form in home page", async ({ page }) => {
    await expect(subscriptionHeading(page)).not.toBeInViewport();

    await test.step("Scroll down", async () => {
      await scrollDown(page);
      await expect(subscriptionHeading(page)).toBeInViewport();
    });

    await test.step("Fill the subscription form", async () => {
      await fillSubscriptionForm(page);
    });
  });

  test("should subscribe using form in cart page", async ({ page }) => {
    await test.step("Navigate to the cart page", async () => {
      await expect(page.getByText("Shopping Cart")).toBeHidden();
      await page.getByRole("link", { name: "Cart" }).click();
      await expect(page.getByText("Shopping Cart")).toBeVisible();
    });

    await test.step("Scroll down", async () => {
      await scrollDown(page);
      await expect(subscriptionHeading(page)).toBeInViewport();
    });

    await test.step("Fill the subscription form", async () => {
      await fillSubscriptionForm(page);
    });
  });
});

const fillSubscriptionForm = async (page) => {
  await page.getByPlaceholder("Email Address").fill("test@test.com");
  await expect(page.getByText("You have been successfully")).toBeHidden();
  await page.click('button[type="submit"]#subscribe');
  await expect(page.getByText("You have been successfully")).toBeVisible();
};
