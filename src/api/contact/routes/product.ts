export default {
  routes: [
    {
      method: 'GET',
      path: '/sale-products',
      handler: 'product.findAvailableProducts',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/sale-products/:id',
      handler: 'product.findProduct',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/sale-categories/:id',
      handler: 'product.findCategory',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/sale-products/:id/tags',
      handler: 'product.getProductTags',
      config: {
        auth: false,
      },
    },
  ],
};
