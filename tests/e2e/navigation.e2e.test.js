import { expect, test } from '@playwright/test';
import { scrollDown, scrollUp } from '../lib/navigationHelpers.js';
import { subscriptionHeading } from '../lib/selectors.js';

test.describe.parallel('Navigation Tests', () => {
  test.use({ testIdAttribute: 'data-qa' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/i);
  });

  test('should navigate to test cases page', async ({ page }) => {
    await test.step('Navigate to the test cases page', async () => {
      await page.getByRole('link', { name: 'Test Cases' }).first().click();
      await expect(page).toHaveTitle(/Test Cases/i);
      await expect(page.getByRole('link', { name: /Test Case \d/ })).toHaveCount(26);
    });
  });

  test('should scroll up with the scroll to top button', async ({ page }) => {
    await expect(subscriptionHeading(page)).not.toBeInViewport();

    await test.step('Scroll down', async () => {
      await scrollDown(page);
      await expect(subscriptionHeading(page)).toBeInViewport();
    });

    await test.step('Click on the scroll to top button', async () => {
      await page.locator('#scrollUp').click();

      await expect(subscriptionHeading(page)).not.toBeInViewport();
      await expect(mainHeading(page)).toBeInViewport();
    });
  });

  test('should scroll up and down without the scroll to top button', async ({ page }) => {
    await expect(subscriptionHeading(page)).not.toBeInViewport();

    await test.step('Scroll down', async () => {
      await scrollDown(page);
      await expect(subscriptionHeading(page)).toBeInViewport();
    });

    await test.step('Scroll up', async () => {
      await scrollUp(page);
      await expect(subscriptionHeading(page)).not.toBeInViewport();
      await expect(mainHeading(page)).toBeInViewport();
    });
  });
});

const mainHeading = page => {
  return page.getByRole('heading', { name: 'Full-Fledged practice website' });
};
