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
              value: (saleOrder.total_amount * 1000).toString(),
            },
            customId: saleOrder.contact.id,
            invoiceId: saleOrder.id,
            softDescriptor: saleOrder.name,
          },
        ],
      },
      prefer: 'return=minimal',
    };

    const { result, ...httpResponse } =
      await ordersController.createOrder(collect);

    return result;
  },

  async approveOrder(saleOrder: any) {
    const client = await this.getClient();
    const ordersController = new OrdersController(client);

    const { result, ...httpResponse } = await ordersController.captureOrder({
      id: saleOrder.id,
    });

    return result;
  },
});
