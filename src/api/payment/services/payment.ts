import { factories } from '@strapi/strapi';
import { PaymentType } from './../types';

export default factories.createCoreService(
  'api::payment.payment',
  ({ strapi }) => ({
    async createFromOrder(
      order: any,
      options: { [key: string]: any } = {}
    ): Promise<PaymentType> {
      // Create a new payment record based on the order details
      const payment = await strapi.db.query('api::payment.payment').create({
        data: {
          sale_order: order.id,
          amount: order.total_amount,
          payment_method: options.payment_method || 'Direct',
          payment_date: new Date(),
          payment_status: 'Completed',
        },
      });

      return payment;
    },
  })
);
