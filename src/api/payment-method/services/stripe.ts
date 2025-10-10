import Stripe from 'stripe';

export default () => ({
  async getSettings() {
    return await strapi.db.query('api::payment-method.payment-method').findOne({
      where: {
        name: 'stripe',
      },
    });
  },

  async getClient(): Promise<Stripe> {
    const settings = await this.getSettings();
    const options = settings?.options || {};
    const apiKey = options.testMode ? options.testApiSecret : options.apiSecret;
    return new Stripe(apiKey, {
      apiVersion: '2025-03-31.basil' as any,
    });
  },

  async createCheckoutSession(saleOrder: any, options?: any) {
    const line_items: any[] = [];
    if (saleOrder.sale_order_details?.length > 0) {
      saleOrder.sale_order_details.forEach((detail: any) => {
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: detail.product_variant.name,
            },
            unit_amount: detail.unit_price * 100,
          },
          quantity: detail.quantity,
        });
      });
    }

    const stripe = await this.getClient();
    const session = await stripe.checkout.sessions.create({
      customer_email: saleOrder.contact.email,
      line_items,
      mode: 'payment',
      ui_mode: 'custom',
      // The URL of your payment completion page
      return_url: options?.returnUrl || null,
    });

    // Create a payment
    await strapi.service('api::payment.payment').createFromOrder(saleOrder, {
      payment_method: 'stripe',
      status: 'In Progress',
      amount: saleOrder.total_amount,
      currency: 'USD',
      transaction_id: session.id,
      payment_date: new Date(),
      payment_status: 'In Progress',
    });

    return session.client_secret;
  },

  async posPaymentSuccess(saleOrder: any, sessionId: string) {
    const payment = await strapi.db.query('api::payment.payment').findOne({
      where: {
        sale_order: saleOrder.id,
      },
    });

    const stripe = await this.getClient();
    const session = await stripe.checkout.sessions.retrieve(
      payment.transaction_id,
    );

    // Update sale order status
    await strapi.db.query('api::sale-order.sale-order').update({
      where: {
        id: saleOrder.id,
      },
      data: {
        order_status: 'Completed',
      },
    });

    return await strapi.db.query('api::sale-order.sale-order').findOne({
      where: {
        id: saleOrder.id,
      },
      populate: ['contact', 'sale_order_details.product_variant'],
    });
  },
});
