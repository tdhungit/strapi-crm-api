import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::purchase-order.purchase-order',
  ({ strapi }) => ({
    async create(ctx) {
      const { data, meta } = ctx.request.body;

      const orderNo = await strapi
        .service('api::purchase-order.purchase-order')
        .getOrderNo();

      data.name = orderNo;
      data.order_status = 'New';

      const contentType = strapi.contentType(
        'api::purchase-order.purchase-order'
      );
      const contentTypePODetail = strapi.contentType(
        'api::purchase-order-detail.purchase-order-detail'
      );

      const sanitizedData: any = await strapi.contentAPI.sanitize.input(
        data,
        contentType,
        {
          auth: ctx.state.auth,
        }
      );

      const entry = await strapi.db
        .query('api::purchase-order.purchase-order')
        .create({
          data: sanitizedData,
        });

      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          const itemSanitizedData: any = await strapi.contentAPI.sanitize.input(
            item,
            contentTypePODetail,
            {
              auth: ctx.state.auth,
            }
          );

          await strapi.db
            .query('api::purchase-order-detail.purchase-order-detail')
            .create({
              data: {
                ...itemSanitizedData,
                purchase_order: entry.id,
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
        .query('api::purchase-order.purchase-order')
        .findOne({ where: { documentId: id } });

      if (!existingEntry) {
        return ctx.notFound('Purchase Order not found');
      }

      if (
        ['Completed', 'Approved', 'Rejected'].includes(
          existingEntry.order_status
        )
      ) {
        return ctx.badRequest('Cannot update a completed Purchase Order');
      }

      const contentType = strapi.contentType(
        'api::purchase-order.purchase-order'
      );
      const contentTypePODetail = strapi.contentType(
        'api::purchase-order-detail.purchase-order-detail'
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

      const entry = await strapi.db
        .query('api::purchase-order.purchase-order')
        .update({
          where: { id: existingEntry.id },
          data: sanitizedData,
        });

      if (data.items && Array.isArray(data.items)) {
        // Fetch existing items from DB
        const existingItems = await strapi.db
          .query('api::purchase-order-detail.purchase-order-detail')
          .findMany({ where: { purchase_order: existingEntry.id } });

        const existingItemIds = existingItems.map((item) => item.id);
        const requestItemIds = data.items.filter((i) => i.id).map((i) => i.id);

        // Delete items not present in request
        const itemsToDelete = existingItems.filter(
          (item) => !requestItemIds.includes(item.id)
        );
        for (const item of itemsToDelete) {
          await strapi.db
            .query('api::purchase-order-detail.purchase-order-detail')
            .delete({ where: { id: item.id } });
        }

        // Update existing items and insert new ones
        for (const item of data.items) {
          const itemSanitizedData: any = await strapi.contentAPI.sanitize.input(
            item,
            contentTypePODetail,
            {
              auth: ctx.state.auth,
            }
          );

          if (item.id && existingItemIds.includes(item.id)) {
            // Update
            await strapi.db
              .query('api::purchase-order-detail.purchase-order-detail')
              .update({
                where: { id: item.id },
                data: {
                  ...itemSanitizedData,
                  purchase_order: entry.id,
                },
              });
          } else {
            // Insert
            await strapi.db
              .query('api::purchase-order-detail.purchase-order-detail')
              .create({
                data: {
                  ...itemSanitizedData,
                  purchase_order: entry.id,
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

      const validStatuses = [
        'New',
        'Approved',
        'Rejected',
        'Pending',
        'Completed',
      ];

      if (!validStatuses.includes(status)) {
        return ctx.badRequest('Invalid status value');
      }

      const existingEntry = await strapi.db
        .query('api::purchase-order.purchase-order')
        .findOne({ where: { documentId: id } });

      if (!existingEntry) {
        return ctx.notFound('Purchase Order not found');
      }

      if (['Completed', 'Rejected'].includes(existingEntry.order_status)) {
        return ctx.badRequest('Cannot update a completed Purchase Order');
      }

      const entry = await strapi.db
        .query('api::purchase-order.purchase-order')
        .update({
          where: { id: existingEntry.id },
          data: { order_status: status },
        });

      if (status === 'Completed') {
        // Update inventory
        await strapi
          .service('api::purchase-order.purchase-order')
          .inventoryUpdate(entry);
      }

      // Log timeline
      await strapi.service('api::timeline.timeline').saveTimeline({
        title: status,
        description: `Purchase Order change status from ${existingEntry.order_status} to ${status}`,
        model: 'purchase-orders',
        recordId: entry.id,
        user: ctx.state.user,
      });

      return this.transformResponse(entry);
    },
  })
);
