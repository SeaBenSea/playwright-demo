import { expect } from '@playwright/test';

export const scrollDown = async page => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
};

export const scrollUp = async page => {
  await page.evaluate(() => window.scrollTo(0, 0));
};

export const navigateToHome = async page => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Automation Exercise/i);
};

export const navigateToPage = async (page, linkName, headingText) => {
  await page.getByRole('link', { name: linkName }).first().click();
  await expect(page.getByRole('heading', { name: headingText })).toBeVisible();
};
