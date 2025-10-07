export default {
  routes: [
    {
      method: 'GET',
      path: '/payment-methods/:name/details',
      handler: 'payment-method.findByName',
      config: {
        auth: false,
      },
    },
  ],
};
