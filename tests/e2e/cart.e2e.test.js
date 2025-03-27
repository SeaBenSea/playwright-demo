import { expect, test } from '@playwright/test';
import { navigateToHome, navigateToPage } from '../lib/navigationHelpers';
import { verifyAllElementsVisible } from '../lib/testHelpers';
import { generateUserData } from '../lib/userData';
import { deleteAccount, loginUser, registerUser } from '../lib/authHelpers';

const PRODUCT_ADDED_MESSAGE = 'Your product has been added to cart.';

test.describe.parallel('Cart Tests', () => {
  test.use({ testIdAttribute: 'data-qa' });

  test.beforeEach(async ({ page }) => {
    await navigateToHome(page);
  });

  test('should add products to the cart', async ({ page }) => {
    const productsToVerify = [];

    await test.step('Navigate to the Product page', async () => {
      await navigateToPage(page, 'Product', 'All Products');
    });

    const products = await page.locator('.productinfo').all();

    await test.step('Add first item to the cart', async () => {
      const product = await addItemToCart(page, products, 0, true);
      productsToVerify.push(product);
    });

    await test.step('Add second item to the cart', async () => {
      const product = await addItemToCart(page, products, 1, false);
      productsToVerify.push(product);
    });

    await test.step('Verify products are added to the cart', async () => {
      await expect(page.getByText('Shopping Cart')).toBeVisible();

      await verifyCartItems(page, productsToVerify);
    });
  });

  test('should verify product quantity in Cart', async ({ page }) => {
    await test.step('Navigate to the Product page', async () => {
      await navigateToPage(page, 'Product', 'All Products');
    });

    await test.step('Go to details of the first product', async () => {
      await page.getByRole('link', { name: 'View Product' }).first().click();

      await expect(page).toHaveTitle(/Product Details/i);
    });

    await test.step('Add multiple of the same product to the cart', async () => {
      await page.getByRole('spinbutton').fill('4');
      await page.getByRole('button', { name: 'Add to cart' }).click();

      await expect(
        page.getByRole('paragraph').filter({ hasText: PRODUCT_ADDED_MESSAGE })
      ).toBeVisible();

      await page.getByRole('link', { name: 'View Cart' }).click();
    });

    await test.step('Verify product quantity in the cart', async () => {
      const productRow = page.getByRole('row').nth(1);
      const productPrice = await page
        .getByRole('cell', { name: 'Rs. ' })
        .first()
        .textContent()
        .then(text => text.split(' ')[1]);

      await expect(productRow.getByRole('cell', { name: '4' })).toBeVisible();
      await expect(productRow.getByRole('cell', { name: `Rs. ${productPrice * 4}` })).toBeVisible();
    });
  });

  test('should remove products from the cart', async ({ page }) => {
    const productsToVerify = [];

    await test.step('Navigate to the Product page', async () => {
      await navigateToPage(page, 'Product', 'All Products');
    });

    const products = await page.locator('.productinfo').all();

    await test.step('Add first item to the cart', async () => {
      const product = await addItemToCart(page, products, 0, false);
      productsToVerify.push(product);
    });

    await test.step('Verify cart has the added product', async () => {
      await verifyCartItems(page, productsToVerify);
    });

    await test.step('Remove product from the cart', async () => {
      await expect(page.getByText('Cart is empty!')).toBeHidden();

      await page.getByRole('cell').locator('a').last().click();

      await expect(page.getByText('Cart is empty!')).toBeVisible();
    });
  });

  test('should keep added products after login', async ({ page }) => {
    const productsToVerify = [];
    const searchQuery = 'Blue';
    const userData = generateUserData();

    await test.step('Register and then logout', async () => {
      await navigateToPage(page, 'Signup / Login', 'New User Signup!');
      await registerUser(page, userData);
      await navigateToPage(page, 'Logout', 'New User Signup!');
    });

    await test.step('Navigate to the Product page', async () => {
      await navigateToPage(page, 'Product', 'All Products');
    });

    await test.step('Search for the product', async () => {
      await page.getByRole('textbox', { name: 'Search Product' }).fill(searchQuery);
      await page.locator('#submit_search').click();
      await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();
    });

    const products = await page.locator('.productinfo').all();

    await test.step('Verify search results are relevant', async () => {
      expect(products.length).toBeGreaterThan(0);
      verifyAllElementsVisible(products, [{ role: 'paragraph', filter: { hasText: searchQuery } }]);
    });

    await test.step('Add all the products to the cart', async () => {
      for (let i = 0; i < products.length; i++) {
        const product = await addItemToCart(page, products, i, true);
        productsToVerify.push(product);
      }
    });

    await test.step('Verify products are added to the cart', async () => {
      await page.getByRole('link', { name: 'Cart' }).first().click();

      await verifyCartItems(page, productsToVerify);
    });

    await test.step('Login with the newly registered user', async () => {
      await navigateToPage(page, 'Signup / Login', 'New User Signup!');
      await loginUser(page, userData);
      await expect(
        page.getByText(`Logged in as ${userData.firstName} ${userData.lastName}`)
      ).toBeVisible();
    });

    await test.step('Verify products are still in the cart', async () => {
      await page.getByRole('link', { name: 'Cart' }).first().click();

      await verifyCartItems(page, productsToVerify);
    });

    await test.step('Delete the newly created account', async () => {
      await deleteAccount(page);
    });
  });

  test('should add to cart from recommended products', async ({ page }) => {
    const productsToVerify = [];

    await test.step('Scroll to the bottom of the page', async () => {
      const recommendedItemsHeading = page.getByRole('heading', { name: 'recommended items' });
      await recommendedItemsHeading.scrollIntoViewIfNeeded();

      await expect(recommendedItemsHeading).toBeInViewport();
    });

    await test.step('Add the first recommended product to the cart', async () => {
      const firstRecommendedProduct = page.locator('.recommended_items .productinfo').first();
      productsToVerify.push({
        id: 1,
        name: await firstRecommendedProduct.getByRole('paragraph').textContent(),
        price: await firstRecommendedProduct
          .getByRole('heading')
          .textContent()
          .then(text => text.split(' ')[1]),
      });

      await firstRecommendedProduct.locator('.btn').click();
      await page.getByRole('link', { name: 'View Cart' }).click();
    });

    await test.step('Verify the product is added to the cart', async () => {
      await verifyCartItems(page, productsToVerify);
    });
  });
});

const addItemToCart = async (page, productLocator, productIndex, continueShopping = true) => {
  await expect(page.getByRole('paragraph').filter({ hasText: PRODUCT_ADDED_MESSAGE })).toBeHidden();

  const product = {
    id: productIndex + 1,
    name: await productLocator[productIndex].getByRole('paragraph').textContent(),
    price: await productLocator[productIndex].getByRole('heading').textContent(),
  };

  await productLocator[productIndex].getByRole('img').hover();
  await page.locator('.overlay-content .btn').nth(productIndex).click();

  await expect(
    page.getByRole('paragraph').filter({ hasText: PRODUCT_ADDED_MESSAGE })
  ).toBeVisible();

  continueShopping
    ? await page.getByRole('button', { name: 'Continue Shopping' }).click()
    : await page.getByRole('link', { name: 'View Cart' }).click();

  return product;
};

const verifyCartItems = async (page, productsToVerify) => {
  for (const product of productsToVerify) {
    const productRow = page.getByRole('row').nth(product.id);

    await expect(productRow.getByRole('cell', { name: product.name })).toBeVisible();
    await expect(productRow.getByRole('cell', { name: product.price })).toHaveCount(2);
    await expect(productRow.getByRole('cell', { name: '1', exact: true })).toBeVisible();
  }
};
