/* eslint-disable playwright/expect-expect */
import { expect, test } from '@playwright/test';
import { navigateToHome, navigateToPage } from '../lib/navigationHelpers';
import { generateUserData } from '../lib/userData';
import { deleteAccount, loginUser, registerUser } from '../lib/authHelpers';
import { addItemToCart } from '../lib/testHelpers';

test.describe.parallel('Order Tests', () => {
  test.use({ testIdAttribute: 'data-qa' });

  test.beforeEach(async ({ page }) => {
    await navigateToHome(page);
  });

  test.afterEach(async ({ page }) => {
    await deleteAccount(page);
  });

  test('should place order with registering while checkout', async ({ page }) => {
    const user = generateUserData();

    await test.step('Add first item to the cart', async () => {
      await addFirstItemToCart(page);
    });

    await test.step('Proceed to checkout', async () => {
      await proceedToCheckout(page, user);
    });

    await test.step('Create an account', async () => {
      await registerUser(page, user);
    });

    await test.step('Go to cart', async () => {
      await page.getByRole('link', { name: 'Cart' }).first().click();
    });

    await test.step('Proceed to checkout after login', async () => {
      await proceedToCheckout(page, user, true);
    });

    await test.step('Fill payment details', async () => {
      await fillPaymentDetails(page, user);
    });
  });

  test('should place order with registering before checkout', async ({ page }) => {
    const user = generateUserData();

    await test.step('Register an account', async () => {
      await navigateToPage(page, 'Signup / Login', 'New User Signup!');

      await registerUser(page, user);
    });

    await test.step('Add first item to the cart', async () => {
      await addFirstItemToCart(page);
    });

    await test.step('Proceed to checkout', async () => {
      await proceedToCheckout(page, user, true);
    });

    await test.step('Fill payment details', async () => {
      await fillPaymentDetails(page, user);
    });
  });

  test('should place order with logging in before checkout', async ({ page }) => {
    const user = generateUserData();

    await test.step('Register and logout', async () => {
      await navigateToPage(page, 'Signup / Login', 'New User Signup!');
      await registerUser(page, user);
      await navigateToPage(page, 'Logout', 'New User Signup!');
    });

    await test.step('Login with the newly registered user', async () => {
      await loginUser(page, user);
      await expect(page.getByText(`Logged in as ${user.firstName} ${user.lastName}`)).toBeVisible();
    });

    await test.step('Add first item to the cart', async () => {
      await addFirstItemToCart(page);
    });

    await test.step('Proceed to checkout', async () => {
      await proceedToCheckout(page, user, true);
    });

    await test.step('Fill payment details', async () => {
      await fillPaymentDetails(page, user);
    });
  });

  test('should download invoice after purchase order', async ({ page }) => {
    const user = generateUserData();

    await test.step('Add first item to the cart', async () => {
      await addFirstItemToCart(page);
    });

    await test.step('Proceed to checkout', async () => {
      await proceedToCheckout(page, user);
    });

    await test.step('Create an account', async () => {
      await registerUser(page, user);
    });

    await test.step('Go to cart', async () => {
      await page.getByRole('link', { name: 'Cart' }).first().click();
    });

    await test.step('Proceed to checkout after login', async () => {
      await proceedToCheckout(page, user, true);
    });

    await test.step('Fill payment details', async () => {
      await fillPaymentDetails(page, user);
    });

    await test.step('Download the invoice', async () => {
      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('link', { name: 'Download Invoice' }).click();
      const download = await downloadPromise;

      await download.saveAs('./test-downloads/' + download.suggestedFilename());
      expect(download.suggestedFilename()).toBe('invoice.txt');

      const content = await download.createReadStream();

      let data = '';
      for await (const chunk of content) {
        data += chunk;
      }

      expect(data).toContain(`${user.firstName} ${user.lastName}`);
    });
  });
});

const addFirstItemToCart = async page => {
  const products = await page.locator('.productinfo').all();

  await addItemToCart(page, products, 0, false);
};

const verifyUserDetails = async (page, user) => {
  const expectedDetails = [
    `${user.prefix} ${user.firstName} ${user.lastName}`,
    user.company,
    user.address,
    user.secondaryAddress,
    `${user.city} ${user.state} ${user.zip}`,
    user.mobilePhone,
  ];

  for (const detail of expectedDetails) {
    await expect(page.getByRole('listitem').filter({ hasText: detail })).toHaveCount(2);
  }
};

const fillPaymentDetails = async (page, user) => {
  await page.getByTestId('name-on-card').fill(`${user.firstName} ${user.lastName}`);
  await page.getByTestId('card-number').fill(user.cardNumber);
  await page.getByTestId('cvc').fill(user.cardCvc);
  await page.getByTestId('expiry-month').fill('12');
  await page.getByTestId('expiry-year').fill(`${new Date().getFullYear() + 1}`);
  await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();

  await expect(
    page
      .getByRole('paragraph')
      .filter({ hasText: 'Congratulations! Your order has been confirmed!' })
  ).toBeVisible();
};

const proceedToCheckout = async (page, user, loggedIn = false) => {
  await expect(page.getByText('Shopping Cart')).toBeVisible();

  await page.locator('a').filter({ hasText: 'Proceed To Checkout' }).click();

  if (!loggedIn) {
    await expect(
      page.getByRole('paragraph').filter({ hasText: 'Register / Login account to' })
    ).toBeVisible();

    await page.getByRole('link', { name: 'Register / Login' }).click();
  } else {
    await verifyUserDetails(page, user);

    await page.getByRole('textbox').first().fill('Test Order');

    await page.getByRole('link', { name: 'Place Order' }).click();
  }
};
