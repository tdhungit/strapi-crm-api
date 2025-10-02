export default {
  routes: [
    {
      method: 'GET',
      path: '/sale-products',
      handler: 'product.findAvailableProducts',
    },
  ],
};
