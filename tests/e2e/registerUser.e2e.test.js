const { test, expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker");

test.describe("Register User", () => {
  test.use({ testIdAttribute: "data-qa" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Automation Exercise/i);
  });

  test("should register a new user successfully", async ({ page }) => {
    const userData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      sex: faker.person.sex(),
      password: faker.internet.password(),
      dob: faker.date.birthdate(),
      company: faker.company.name(),
      address: faker.location.streetAddress(),
      secondaryAddress: faker.location.secondaryAddress(),
      state: faker.location.state(),
      city: faker.location.city(),
      zip: faker.location.zipCode(),
      mobilePhone: faker.phone.number(),
    };
    userData.prefix = userData.sex === "male" ? "Mr." : "Mrs.";
    userData.email = faker.internet.email({
      firstName: userData.firstName,
      lastName: userData.lastName,
    });
    userData.dob_day = userData.dob.getDate().toString();
    userData.dob_month = userData.dob.toLocaleString("default", {
      month: "long",
    });
    userData.dob_year = userData.dob.getFullYear().toString();

    await test.step("Navigate to Signup Page", async () => {
      await page.getByRole("link", { name: "Signup / Login" }).click();
      await expect(
        page.getByRole("heading", { name: "New User Signup!" })
      ).toBeVisible();
    });

    await test.step("Enter Signup Information", async () => {
      await page
        .getByPlaceholder("Name")
        .fill(`${userData.firstName} ${userData.lastName}`);
      await page.getByTestId("signup-email").fill(userData.email);
      await page.getByRole("button", { name: "Signup" }).click();
      await expect(page.getByText("Enter Account Information")).toBeVisible();
    });

    await test.step("Fill Account Information", async () => {
      await page.getByRole("radio", { name: userData.prefix }).check();
      await page
        .getByRole("textbox", { name: "Password" })
        .fill(userData.password);

      await page.getByTestId("days").selectOption({ label: userData.dob_day });
      await page
        .getByTestId("months")
        .selectOption({ label: userData.dob_month });
      await page
        .getByTestId("years")
        .selectOption({ label: userData.dob_year });

      await page
        .getByRole("checkbox", { name: /Sign up for our newsletter/i })
        .check();
      await page.getByLabel(/Receive special offers/i).check();
    });

    await test.step("Fill Address Information", async () => {
      await page.getByLabel("First name").fill(userData.firstName);
      await page.getByLabel("Last name").fill(userData.lastName);
      await page.getByLabel("Company", { exact: true }).fill(userData.company);
      await page.getByTestId("address").fill(userData.address);
      await page.getByTestId("address2").fill(userData.secondaryAddress);
      await page.getByLabel("State").fill(userData.state);
      await page.getByLabel("City").fill(userData.city);
      await page.getByTestId("zipcode").fill(userData.zip);
      await page.getByLabel("Mobile Number").fill(userData.mobilePhone);
    });

    await test.step("Create Account", async () => {
      await page.getByRole("button", { name: "Create Account" }).click();
      await expect(page.getByText("Account Created!")).toBeVisible();
    });

    await test.step("Continue to Logged-in Page", async () => {
      await page.getByRole("link", { name: "Continue" }).click();
      await expect(
        page.getByText(
          `Logged in as ${userData.firstName} ${userData.lastName}`
        )
      ).toBeVisible();
    });

    await test.step("Delete Account", async () => {
      await page.getByRole("link", { name: "Delete Account" }).click();
      await expect(page.getByText("Account Deleted!")).toBeVisible();
      await page.getByRole("link", { name: "Continue" }).click();
    });
  });
});
