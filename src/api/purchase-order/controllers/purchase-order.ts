import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::purchase-order.purchase-order',
  ({ strapi }) => ({
    async create(ctx) {
      const { data, meta } = ctx.request.body;

      const orderNo = await strapi
        .service('api::purchase-order.purchase-order')
        .getOrderNo();

      data.order_no = orderNo;
      data.status = 'New';

      const transformData = await strapi
        .service('api::purchase-order.purchase-order')
        .sanitizeInput(data, ctx);

      const sanitizedData = await strapi
        .service('api::purchase-order.purchase-order')
        .validateInput(transformData, { action: 'create' });

      const entry = await strapi.db
        .query('api::purchase-order.purchase-order')
        .create({
          data: sanitizedData,
        });

      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          await strapi.db
            .query('api::purchase-order-detail.purchase-order-detail')
            .create({
              data: {
                ...item,
                purchase_order: entry.id,
              },
            });
        }
      }

      return this.transformResponse(entry);
    },
  })
);
