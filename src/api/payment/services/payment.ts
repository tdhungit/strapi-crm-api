import type { Event } from '@strapi/database/dist/lifecycles';
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

    async checkAndCreateInvoice(payment: PaymentType): Promise<void> {
      if (payment.payment_status !== 'Completed') {
        return;
      }

      if (!payment.sale_order) {
        payment = await strapi.db.query('api::payment.payment').findOne({
          where: {
            id: payment.id,
          },
          populate: ['sale_order', 'created_user'],
        });
      }

      // Check if there's an existing invoice for this payment
      const invoice = await strapi.db.query('api::invoice.invoice').findOne({
        where: {
          payment: payment.id,
        },
      });

      if (invoice) {
        return;
      }

      // Create a new invoice record based on the payment details
      await strapi
        .service('api::invoice.invoice')
        .generateInvoiceForOrder(payment.sale_order, payment, {
          due_date: payment.payment_date,
        });
    },

    async triggerPaymentChange(event: Event) {
      const { action, model, result, params } = event;

      if (model.uid !== 'api::payment.payment') {
        return;
      }

      if (action === 'afterCreate' || action === 'afterUpdate') {
        const inventoryId = params?.where?.id || result?.id;
        const payment = await strapi.db.query('api::payment.payment').findOne({
          where: {
            id: inventoryId,
          },
          populate: ['sale_order', 'created_user'],
        });

        await this.checkAndCreateInvoice(payment);
      }
    },
  }),
);
