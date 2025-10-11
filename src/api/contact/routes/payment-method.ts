export default {
  routes: [
    // Payment methods
    {
      method: 'GET',
      path: '/public/payment-methods',
      handler: 'payment-method.findAll',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/public/payment-methods/:id',
      handler: 'payment-method.findOne',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/public/payment-methods/:name/details',
      handler: 'payment-method.findByName',
      config: {
        auth: false,
      },
    },
    // Third-party payment methods
    {
      method: 'POST',
      path: '/customers/payment-method/paypal/create-order',
      handler: 'payment-method-paypal.createOrder',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/customers/payment-method/paypal/approve-order',
      handler: 'payment-method-paypal.approveOrder',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/customers/payment-method/stripe/create-checkout-session',
      handler: 'payment-method-stripe.createCheckoutSession',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/customers/payment-method/stripe/payment-success',
      handler: 'payment-method-stripe.handlePaymentSuccess',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
  ],
};
