import { expect } from '@playwright/test';

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
