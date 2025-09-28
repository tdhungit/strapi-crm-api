import { factories } from '@strapi/strapi';
import { PaymentType } from './../../payment/types';

export default factories.createCoreService(
  'api::invoice.invoice',
  ({ strapi }) => ({
    async generateInvoiceForOrder(
      order: any,
      payment: PaymentType,
      options: { [key: string]: any }
    ): Promise<any> {
      // Create a new invoice record based on the order and payment details
      const invoice = await strapi.db.query('api::invoice.invoice').create({
        data: {
          sale_order: order.id,
          payment: payment.id,
          invoice_date: payment.payment_date,
          due_date: options.due_date || new Date(),
          invoice_status:
            payment.payment_status === 'Completed' ? 'Paid' : 'Unpaid',
          subtotal: order.subtotal,
          discount_amount: order.discount_amount || 0,
          tax_amount: order.tax_amount || 0,
          total_amount: order.total_amount,
          invoice_tax_amount: options.invoice_tax_amount || 0,
          description: options.description || '',
          account_tax: options.account_tax || null,
        },
      });

      // Create invoice details for each item in the order
      if (order.order_details && order.order_details.length > 0) {
        for (const item of order.order_details) {
          await strapi.db.query('api::invoice.invoice-detail').create({
            data: {
              invoice: invoice.id,
              name: item.product_variant.name,
              quantity: item.quantity,
              unit_price: item.subtotal,
              discount_amount: item.discount_amount || 0,
              tax_amount: item.tax_amount || 0,
              subtotal: item.subtotal,
              product_variant: item.product_variant.id || null,
            },
          });
        }
      }

      return invoice;
    },
  })
);
