import { factories } from '@strapi/strapi';
import type { PaymentMethodType, PaymentType } from '../types';

export default factories.createCoreService(
  'api::payment-method.payment-method',
  ({ strapi }) => ({
    async createCODPayment(
      payment: PaymentType,
      paymentMethod: PaymentMethodType,
    ) {
      return await strapi.db
        .query('api::payment-method.payment-method')
        .create({
          data: {
            payment_method: paymentMethod.id,
            ...payment,
          },
        });
    },

    async createPaypalPayment() {},

    async createStripePayment() {},
  }),
);
