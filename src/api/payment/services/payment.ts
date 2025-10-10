import { factories } from '@strapi/strapi';
import { PaymentType } from './../types';

export default factories.createCoreService(
  'api::payment.payment',
  ({ strapi }) => ({
    async createFromOrder(
      order: any,
      options: {
        transaction_id?: string;
        payment_method?: string;
        status?: string;
        paymentMethod?: any;
        [key: string]: any;
      } = {},
    ): Promise<PaymentType> {
      let payment = await strapi.db.query('api::payment.payment').findOne({
        where: {
          sale_order: order.id,
        },
      });

      const data: any = {
        amount: order.total_amount,
        payment_method: options.payment_method || 'Direct',
        payment_date: new Date(),
        payment_status: options.status || 'Completed',
        transaction_id: options.transaction_id || '',
      };

      if (options.paymentMethod?.id) {
        data.method = options.paymentMethod.id;
      }

      if (payment) {
        return await strapi.db.query('api::payment.payment').update({
          where: {
            id: payment.id,
          },
          data,
        });
      }

      // Create a new payment record based on the order details
      payment = await strapi.db.query('api::payment.payment').create({
        data: {
          sale_order: order.id,
          ...data,
        },
      });

      return payment;
    },
  }),
);
