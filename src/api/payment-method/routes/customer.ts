export default {
  routes: [
    {
      method: 'POST',
      path: '/customers/payment-method/paypal/create-order',
      handler: 'paypal.createOrder',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/customers/payment-method/paypal/approve-order',
      handler: 'paypal.approveOrder',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/customers/payment-method/stripe/create-checkout-session',
      handler: 'stripe.createCheckoutSession',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
    {
      method: 'POST',
      path: '/customers/payment-method/stripe/payment-success',
      handler: 'stripe.handlePaymentSuccess',
      config: {
        policies: ['api::contact.is-authenticated'],
      },
    },
  ],
};
