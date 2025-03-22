export const subscriptionHeading = page => {
  return page.getByRole('heading', { name: 'Subscription', exact: true });
};
