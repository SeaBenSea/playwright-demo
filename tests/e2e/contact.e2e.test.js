import { expect, test } from '@playwright/test';
import { generateUserData } from '../lib/userData';

test.describe.parallel('Contact Tests', () => {
  test.use({ testIdAttribute: 'data-qa' });

  test('should submit the contact form successfully', async ({ page }) => {
    const userData = generateUserData();

    await test.step('Navigate to the contact page', async () => {
      await page.goto('/');
      await expect(page).toHaveTitle(/Automation Exercise/i);

      await page.getByRole('link', { name: 'Contact Us' }).click();
      await expect(page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible();
    });

    await test.step('Fill the text fields of the form', async () => {
      await page.getByPlaceholder('Name').fill(userData.firstName);
      await page.getByPlaceholder('Email', { exact: true }).fill(userData.email);
      await page.getByPlaceholder('Subject').fill('Test Subject');
      await page.getByPlaceholder('Your Message Here').fill('Test Message');
    });

    await test.step('Upload file and submit the form', async () => {
      await page.locator('input[type="file"]').setInputFiles({
        name: 'file.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('this is test'),
      });

      page.once('dialog', dialog => {
        dialog.accept();
      });

      await page.getByRole('button', { name: 'Submit' }).click();
    });

    await test.step('Verify success message and go back home', async () => {
      const contactForm = page.locator('#contact-page');
      await expect(
        contactForm.getByText('Success! Your details have been submitted successfully.')
      ).toBeVisible();

      await page.getByRole('link', { name: 'Home' }).last().click();
      await expect(page).toHaveURL('/');
      await expect(page).toHaveTitle(/Automation Exercise/i);
    });
  });
});
