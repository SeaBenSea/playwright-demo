import { expect, test } from "@playwright/test";
import { generateUserData } from "../lib/userData";
import {
  deleteAccount,
  registerUser,
  loginUser,
  fillSignupForm,
} from "../lib/authHelpers";

test.describe.parallel("User Authentication Tests", () => {
  test.use({ testIdAttribute: "data-qa" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Automation Exercise/i);

    await page.getByRole("link", { name: "Signup / Login" }).click();
    await expect(
      page.getByRole("heading", { name: "New User Signup!" })
    ).toBeVisible();
  });

  // eslint-disable-next-line playwright/expect-expect
  test("should register a new user successfully", async ({ page }) => {
    const userData = generateUserData();

    await test.step("Register and verify account creation", async () => {
      await registerUser(page, userData);
    });

    await test.step("Delete the newly created account", async () => {
      await deleteAccount(page);
    });
  });

  test("should show an error when registering with an existing email", async ({
    page,
  }) => {
    const userData = generateUserData();

    await test.step("Register the user for the first time", async () => {
      await registerUser(page, userData);
    });

    await test.step("Logout the newly created user", async () => {
      await page.getByRole("link", { name: "Logout" }).click();
      await expect(
        page.getByRole("heading", { name: "New User Signup!" })
      ).toBeVisible();
    });

    await test.step("Try registering with the same user credentials again", async () => {
      await page.getByRole("link", { name: "Signup / Login" }).click();
      await expect(
        page.getByRole("heading", { name: "New User Signup!" })
      ).toBeVisible();

      await fillSignupForm(page, userData);
      await expect(
        page.getByText(/Email Address already exist!/i)
      ).toBeVisible();
    });

    await test.step("Login with the existing user credentials", async () => {
      await loginUser(page, userData);
      await expect(
        page.getByText(
          `Logged in as ${userData.firstName} ${userData.lastName}`
        )
      ).toBeVisible();
    });

    await test.step("Clean up by deleting the first user account", async () => {
      await deleteAccount(page);
    });
  });

  test("should allow an existing (newly created) user to login successfully", async ({
    page,
  }) => {
    const userData = generateUserData();

    await test.step("Register and then logout to prepare for login test", async () => {
      await registerUser(page, userData);
      await page.getByRole("link", { name: "Logout" }).click();
      await expect(
        page.getByRole("heading", { name: "New User Signup!" })
      ).toBeVisible();
    });

    await test.step("Login with the newly registered user", async () => {
      await loginUser(page, userData);
      await expect(
        page.getByText(
          `Logged in as ${userData.firstName} ${userData.lastName}`
        )
      ).toBeVisible();
    });

    await test.step("Delete the newly created account", async () => {
      await deleteAccount(page);
    });
  });

  test("should fail to login with incorrect credentials", async ({ page }) => {
    const invalidUser = {
      email: "fakeuser123@test.com",
      password: "wrong-password",
    };

    await test.step("Attempt login with invalid credentials", async () => {
      await loginUser(page, invalidUser);
      await expect(
        page.getByText("Your email or password is incorrect!")
      ).toBeVisible();
    });
  });
});
