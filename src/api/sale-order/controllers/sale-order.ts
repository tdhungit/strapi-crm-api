import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::sale-order.sale-order',
  ({ strapi }) => ({
    async create(ctx) {
      const { data, meta } = ctx.request.body;

      const orderNo = await strapi
        .service('api::sale-order.sale-order')
        .getSalesOrderNo();

      data.name = orderNo;
      data.order_status = 'New';

      const contentType = strapi.contentType('api::sale-order.sale-order');
      const contentTypeSODetail = strapi.contentType(
        'api::sale-order-detail.sale-order-detail'
      );

      const sanitizedData: any = await strapi.contentAPI.sanitize.input(
        data,
        contentType,
        {
          auth: ctx.state.auth,
        }
      );

      const entry = await strapi.db.query('api::sale-order.sale-order').create({
        data: sanitizedData,
      });

      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          const itemSanitizedData: any = await strapi.contentAPI.sanitize.input(
            item,
            contentTypeSODetail,
            {
              auth: ctx.state.auth,
            }
          );

          await strapi.db
            .query('api::sale-order-detail.sale-order-detail')
            .create({
              data: {
                ...itemSanitizedData,
                sale_order: entry.id,
              },
            });
        }
      }

      return this.transformResponse(entry);
    },

    async update(ctx) {
      const { id } = ctx.params;
      const { data, meta } = ctx.request.body;

      const existingEntry = await strapi.db
        .query('api::sale-order.sale-order')
        .findOne({ where: { documentId: id } });

      if (!existingEntry) {
        return ctx.notFound('Sale Order not found');
      }

      if (
        ['Completed', 'Approved', 'Rejected'].includes(
          existingEntry.order_status
        )
      ) {
        return ctx.badRequest('Cannot update a completed Sale Order');
      }

      const contentType = strapi.contentType('api::sale-order.sale-order');
      const contentTypeSODetail = strapi.contentType(
        'api::sale-order-detail.sale-order-detail'
      );

      const sanitizedData: any = await strapi.contentAPI.sanitize.input(
        data,
        contentType,
        {
          auth: ctx.state.auth,
        }
      );

      if (sanitizedData.order_status) {
        delete sanitizedData.order_status;
      }

      const entry = await strapi.db.query('api::sale-order.sale-order').update({
        where: { id: existingEntry.id },
        data: sanitizedData,
      });

      if (data.items && Array.isArray(data.items)) {
        // Fetch existing items from DB
        const existingItems = await strapi.db
          .query('api::sale-order-detail.sale-order-detail')
          .findMany({
            where: { sale_order: existingEntry.id },
          });

        const existingItemIds = existingItems.map((item) => item.id);
        const requestItemIds = data.items.filter((i) => i.id).map((i) => i.id);

        // Delete items not present in request
        const itemsToDelete = existingItems.filter(
          (item) => !requestItemIds.includes(item.id)
        );
        for (const item of itemsToDelete) {
          await strapi.db
            .query('api::sale-order-detail.sale-order-detail')
            .delete({ where: { id: item.id } });
        }

        // Update existing items and insert new ones
        for (const item of data.items) {
          const itemSanitizedData: any = await strapi.contentAPI.sanitize.input(
            item,
            contentTypeSODetail,
            {
              auth: ctx.state.auth,
            }
          );

          if (item.id && existingItemIds.includes(item.id)) {
            // Update existing item
            await strapi.db
              .query('api::sale-order-detail.sale-order-detail')
              .update({
                where: { id: item.id },
                data: itemSanitizedData,
              });
          } else {
            // Create new item
            await strapi.db
              .query('api::sale-order-detail.sale-order-detail')
              .create({
                data: {
                  ...itemSanitizedData,
                  sale_order: entry.id,
                },
              });
          }
        }
      }

      return this.transformResponse(entry);
    },

    async changeStatus(ctx) {
      const { id } = ctx.params;
      const { status } = ctx.request.body;

      const validStatuses = ['New', 'Approved', 'Rejected', 'Pending'];

      if (!validStatuses.includes(status)) {
        return ctx.badRequest('Invalid status value');
      }

      const existingEntry = await strapi.db
        .query('api::sale-order.sale-order')
        .findOne({ where: { documentId: id } });

      if (!existingEntry) {
        return ctx.notFound('Sale Order not found');
      }

      if (
        ['Completed', 'Approved', 'Rejected'].includes(
          existingEntry.order_status
        )
      ) {
        return ctx.badRequest('Cannot update a completed Sale Order');
      }

      const entry = await strapi.db.query('api::sale-order.sale-order').update({
        where: { id: existingEntry.id },
        data: { order_status: status },
      });

      return this.transformResponse(entry);
    },

    async completeOrder(ctx) {
      const { id } = ctx.params;

      const existingEntry = await strapi.db
        .query('api::sale-order.sale-order')
        .findOne({ where: { documentId: id } });

      if (!existingEntry) {
        return ctx.notFound('Sale Order not found');
      }

      if (existingEntry.order_status === 'Completed') {
        return ctx.badRequest('Sale Order is already completed');
      }

      const entry = await strapi.db.query('api::sale-order.sale-order').update({
        where: { id: existingEntry.id },
        data: { order_status: 'Completed' },
      });

      // Update inventory
      await strapi
        .service('api::sale-order.sale-order')
        .inventoryUpdate(existingEntry);

      return this.transformResponse(entry);
    },
  })
);
