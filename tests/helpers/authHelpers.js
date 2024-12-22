const { expect } = require("@playwright/test");

async function fillSignupForm(page, userData) {
  const { firstName, lastName, email } = userData;
  await page.getByPlaceholder("Name").fill(`${firstName} ${lastName}`);
  await page.getByTestId("signup-email").fill(email);
  await page.getByRole("button", { name: "Signup" }).click();
}

async function fillAccountDetails(page, userData) {
  const { prefix, password, dob_day, dob_month, dob_year } = userData;

  await page.getByRole("radio", { name: prefix }).check();
  await page.getByRole("textbox", { name: "Password" }).fill(password);

  await page.getByTestId("days").selectOption({ label: dob_day });
  await page.getByTestId("months").selectOption({ label: dob_month });
  await page.getByTestId("years").selectOption({ label: dob_year });

  await page
    .getByRole("checkbox", { name: /Sign up for our newsletter/i })
    .check();
  await page.getByLabel(/Receive special offers/i).check();
}

async function fillAddressDetails(page, userData) {
  const {
    firstName,
    lastName,
    company,
    address,
    secondaryAddress,
    state,
    city,
    zip,
    mobilePhone,
  } = userData;

  await page.getByLabel("First name").fill(firstName);
  await page.getByLabel("Last name").fill(lastName);
  await page.getByLabel("Company", { exact: true }).fill(company);
  await page.getByTestId("address").fill(address);
  await page.getByTestId("address2").fill(secondaryAddress);
  await page.getByLabel("State").fill(state);
  await page.getByLabel("City").fill(city);
  await page.getByTestId("zipcode").fill(zip);
  await page.getByLabel("Mobile Number").fill(mobilePhone);
}

async function createAccount(page) {
  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page.getByText("Account Created!")).toBeVisible();
}

async function continueToLoggedInPage(page, userData) {
  const { firstName, lastName } = userData;
  await page.getByRole("link", { name: "Continue" }).click();
  await expect(
    page.getByText(`Logged in as ${firstName} ${lastName}`)
  ).toBeVisible();
}

async function deleteAccount(page) {
  await page.getByRole("link", { name: "Delete Account" }).click();
  await expect(page.getByText("Account Deleted!")).toBeVisible();
  await page.getByRole("link", { name: "Continue" }).click();
}

async function registerUser(page, userData) {
  await fillSignupForm(page, userData);
  await expect(page.getByText("Enter Account Information")).toBeVisible();

  await fillAccountDetails(page, userData);
  await fillAddressDetails(page, userData);

  await createAccount(page);
  await continueToLoggedInPage(page, userData);
}

async function loginUser(page, userData) {
  const { email, password } = userData;
  await page.getByTestId("login-email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
}

module.exports = {
  fillSignupForm,
  registerUser,
  loginUser,
  deleteAccount,
};
