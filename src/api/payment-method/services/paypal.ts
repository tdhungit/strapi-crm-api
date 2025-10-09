import {
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from '@paypal/paypal-server-sdk';

export default () => ({
  async getClient(): Promise<Client> {
    const paymentMethod = await strapi.db
      .query('api::payment-method.payment-method')
      .findOne({ where: { name: 'paypal' } });
    const options = paymentMethod.options || {};
    const {
      clientId,
      clientSecret,
      sandbox,
      sandboxClientId,
      sandboxClientSecret,
    } = options;

    if (!clientId || !clientSecret) {
      throw new Error('PayPal client ID and secret are required');
    }

    return new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: sandbox ? sandboxClientId : clientId,
        oAuthClientSecret: sandbox ? sandboxClientSecret : clientSecret,
      },
      timeout: 0,
      environment: sandbox ? Environment.Sandbox : Environment.Production,
      logging: {
        logLevel: LogLevel.Info,
        logRequest: {
          logBody: true,
        },
        logResponse: {
          logHeaders: true,
        },
      },
    });
  },

  async createOrder(saleOrder: any) {
    const client = await this.getClient();
    const ordersController = new OrdersController(client);

    const collect = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: 'USD',
              value: saleOrder.total_amount.toString(),
            },
            customId: saleOrder.contact.id.toString(),
            invoiceId: saleOrder.id.toString(),
            softDescriptor: saleOrder.name,
          },
        ],
      },
      prefer: 'return=minimal',
    };

    const { result, ...httpResponse } =
      await ordersController.createOrder(collect);

    // Create a payment
    await strapi.service('api::payment.payment').createFromOrder(saleOrder, {
      payment_method: 'paypal',
      status: 'In Progress',
      amount: saleOrder.total_amount,
      currency: 'USD',
      transaction_id: result.id,
    });

    return result;
  },

  async approveOrder(saleOrder: any) {
    const client = await this.getClient();
    const ordersController = new OrdersController(client);

    const payment = await strapi.db.query('api::payment.payment').findOne({
      where: {
        sale_order: saleOrder.id,
      },
    });

    await ordersController.captureOrder({
      id: payment.transaction_id,
    });

    // Update payment status
    await strapi.db.query('api::payment.payment').update({
      where: {
        id: payment.id,
      },
      data: {
        payment_status: 'Completed',
        payment_date: new Date(),
      },
    });

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
