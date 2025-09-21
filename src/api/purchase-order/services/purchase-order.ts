import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::purchase-order.purchase-order',
  ({ strapi }) => ({
    async getOrderNo(): Promise<string> {
      const sequenceService = strapi.service(
        'api::sequence-counter.sequence-counter'
      );
      const nextSequence =
        await sequenceService.getNextSequence('purchase_order');
      const orderNo = `PO-${String(nextSequence).padStart(6, '0')}`;
      return orderNo;
    },
  })
);
