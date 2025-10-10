export default {
  routes: [
    {
      method: 'GET',
      path: '/shipping-methods/:name',
      handler: 'shipping-method.findByName',
      config: {
        auth: false,
      },
    },
  ],
};
