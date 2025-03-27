import { expect } from '@playwright/test';
import { PRODUCT_ADDED_MESSAGE } from './constants';

export const addItemToCart = async (
  page,
  productLocator,
  productIndex,
  continueShopping = true
) => {
  await expect(page.getByRole('paragraph').filter({ hasText: PRODUCT_ADDED_MESSAGE })).toBeHidden();

  const product = {
    id: productIndex + 1,
    name: await productLocator[productIndex].getByRole('paragraph').textContent(),
    price: await productLocator[productIndex].getByRole('heading').textContent(),
  };

  await productLocator[productIndex].getByRole('img').first().hover();
  await page.locator('.overlay-content .btn').nth(productIndex).click();

  await expect(
    page.getByRole('paragraph').filter({ hasText: PRODUCT_ADDED_MESSAGE })
  ).toBeVisible();

  continueShopping
    ? await page.getByRole('button', { name: 'Continue Shopping' }).click()
    : await page.getByRole('link', { name: 'View Cart' }).click();

  return product;
};

export const verifyAllElementsVisible = async (elements, elementSpecialSelectors) => {
  await Promise.all(
    elements.map(async element => {
      await expect(element).toBeVisible();

      if (elementSpecialSelectors) {
        await Promise.all(
          elementSpecialSelectors.map(async specialSelector => {
            const { role, filter } = specialSelector;
            if (role && filter) {
              await expect(element.getByRole(role).filter(filter)).toBeVisible();
            }
          })
        );
      }
    })
  );
};
