export default {
  routes: [
    {
      method: 'GET',
      path: '/sale-products',
      handler: 'product.findAvailableProducts',
    },
    {
      method: 'GET',
      path: '/sale-products/:id',
      handler: 'product.findProduct',
    },
    {
      method: 'GET',
      path: '/sale-categories/:id',
      handler: 'product.findCategory',
    },
  ],
};
