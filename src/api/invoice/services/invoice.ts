import { factories } from '@strapi/strapi';
import ejs from 'ejs';
import { PaymentType } from './../../payment/types';
import { InvoiceType } from './../types';

export default factories.createCoreService(
  'api::invoice.invoice',
  ({ strapi }) => ({
    async getInvoiceNumber(): Promise<string> {
      const sequenceService = strapi.service(
        'api::sequence-counter.sequence-counter',
      );
      const nextSequence = await sequenceService.getNextSequence('invoice');
      return `INV-${String(nextSequence).padStart(6, '0')}`;
    },

    async generateInvoiceForOrder(
      order: any,
      payment: PaymentType,
      options: { [key: string]: any },
    ): Promise<any> {
      const invoiceNo = await this.getInvoiceNumber();
      // Create a new invoice record based on the order and payment details
      const invoice = await strapi.db.query('api::invoice.invoice').create({
        data: {
          invoice_number: invoiceNo,
          sale_order: order.id,
          payment: payment.id,
          invoice_date: payment.payment_date,
          issue_date: order.sale_date || new Date(),
          due_date: options.due_date || null,
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
      if (order.sale_order_details && order.sale_order_details.length > 0) {
        for (const item of order.sale_order_details) {
          await strapi.db.query('api::invoice-detail.invoice-detail').create({
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

      if (
        invoice.invoice_status === 'Paid' &&
        !['Completed', 'Rejected'].includes(order.order_status)
      ) {
        await strapi
          .service('api::sale-order.sale-order')
          .changeOrderStatus(order, 'Completed', {
            user: payment.created_user?.id,
          });
      }

      return invoice;
    },

    async generateHtml(invoice: InvoiceType) {
      return await ejs.renderFile('./src/templates/invoices/invoice.ejs', {
        invoice,
      });
    },
  }),
);
