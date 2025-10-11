import { factories } from '@strapi/strapi';
import type { PaymentMethodType } from '../types';

export default factories.createCoreService(
  'api::payment-method.payment-method',
  ({ strapi }) => ({
    getPublicOptions(paymentMethod: PaymentMethodType) {
      let options: any = {};

      switch (paymentMethod.name) {
        case 'stripe':
          options = {
            testMode: paymentMethod.options?.testMode || false,
            apiKey: paymentMethod.options?.apiKey || '',
            testApiKey: paymentMethod.options?.testApiKey || '',
          };
          break;

        case 'paypal':
          options = {
            sandbox: paymentMethod.options?.sandbox || false,
            clientId: paymentMethod.options?.clientId || '',
            sandboxClientId: paymentMethod.options?.sandboxClientId || '',
          };
          break;

        default:
          break;
      }

      return options;
    },
  }),
);
