export const scrollDown = async page => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
};

export const scrollUp = async page => {
  await page.evaluate(() => window.scrollTo(0, 0));
};
