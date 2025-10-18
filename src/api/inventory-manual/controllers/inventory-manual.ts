import { factories } from '@strapi/strapi';
import { InventoryManualFormType } from '../types';

export default factories.createCoreController(
  'api::inventory-manual.inventory-manual',
  ({ strapi }) => ({
    async create(ctx) {
      const data: InventoryManualFormType = ctx.request.body.data;

      if (!data.details || data.details.length === 0) {
        return ctx.badRequest('Missing details');
      }

      // Create inventory manual
      const inventoryManual = await strapi.db
        .query('api::inventory-manual.inventory-manual')
        .create({
          data: {
            inventory_type: data.inventory_type,
            warehouse: data.warehouse,
            inventory_status: 'New',
            created_user: ctx.state.user.id,
          },
        });

      // Create inventory manual details
      for await (const detail of data.details) {
        await strapi.db
          .query('api::inventory-manual-detail.inventory-manual-detail')
          .create({
            data: {
              inventory_manual: inventoryManual.id,
              product_variant: detail.product_variant,
              quantity: detail.quantity,
              price: detail.price || 0,
            },
          });
      }

      return inventoryManual;
    },

    async update(ctx) {
      const { id } = ctx.params;
      const data: InventoryManualFormType = ctx.request.body;

      const entry = await strapi.db
        .query('api::inventory-manual.inventory-manual')
        .findOne({
          where: {
            id,
          },
          populate: ['details'],
        });

      if (!entry) {
        return ctx.notFound('Inventory Manual not found');
      }

      if (entry.inventory_status !== 'New') {
        return ctx.badRequest('Cannot edit a submitted inventory manual');
      }

      // Update inventory manual
      await strapi.db.query('api::inventory-manual.inventory-manual').update({
        where: {
          id,
        },
        data: {
          inventory_type: data.inventory_type,
          warehouse: data.warehouse,
          inventory_status: 'New',
        },
      });

      if (data.details && data.details.length > 0) {
        // Update or Delete details
        const existingDetails = entry.details.map((detail) => detail.id);

        for await (const detail of data.details) {
          if (existingDetails.includes(detail.id)) {
            // Update existing detail
            await strapi.db
              .query('api::inventory-manual-detail.inventory-manual-detail')
              .update({
                where: {
                  id: detail.id,
                },
                data: {
                  quantity: detail.quantity,
                  price: detail.price || 0,
                },
              });
          } else {
            // Create new detail
            await strapi.db
              .query('api::inventory-manual-detail.inventory-manual-detail')
              .create({
                data: {
                  inventory_manual: entry.id,
                  product_variant: detail.product_variant,
                  quantity: detail.quantity,
                  price: detail.price || 0,
                },
              });
          }
        }

        // Delete removed details
        for await (const detailId of existingDetails) {
          if (!data.details.map((detail) => detail.id).includes(detailId)) {
            await strapi.db
              .query('api::inventory-manual-detail.inventory-manual-detail')
              .delete({
                where: {
                  id: detailId,
                },
              });
            continue;
          }
        }
      }

      return await strapi.db
        .query('api::inventory-manual.inventory-manual')
        .findOne({
          where: {
            id,
          },
          populate: ['details'],
        });
    },

    async delete(ctx) {
      return ctx.badRequest('Inventory Manual deletion is disabled');
    },
  }),
);
