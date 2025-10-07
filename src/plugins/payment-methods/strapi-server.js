const { default: paymentMethods } = require('./controllers/payment-methods');

module.exports = () => {
  return {
    register() {},

    bootstrap() {},

    routes: [
      {
        method: 'GET',
        path: '/find-by-name/:name',
        handler: 'payment-methods.findByName',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
      {
        method: 'POST',
        path: '/save',
        handler: 'payment-methods.save',
        config: { policies: ['admin::isAuthenticatedAdmin'] },
      },
    ],

    controllers: {
      ...paymentMethods,
    },
  };
};
