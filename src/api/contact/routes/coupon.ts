export default {
  routes: [
    {
      method: 'GET',
      path: '/customers/coupons',
      handler: 'coupon.find',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
  ],
};
