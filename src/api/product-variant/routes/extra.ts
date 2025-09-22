export default {
  routes: [
    {
      method: 'GET',
      path: '/product-variants/:id/price',
      handler: 'product-variant.getPrice',
    },
  ],
};
