export default {
  routes: [
    {
      method: 'GET',
      path: '/public/shipping-methods',
      handler: 'shipping-method.findAll',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/public/shipping-methods/:id',
      handler: 'shipping-method.findOne',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/public/shipping-methods/name/:name',
      handler: 'shipping-method.findByName',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/customers/shipping-methods/get-amount',
      handler: 'shipping-method.getShippingAmount',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
  ],
};
