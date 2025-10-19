import type { Event } from '@strapi/database/dist/lifecycles';
import { factories } from '@strapi/strapi';
import { TimelineSaveType } from '../../timeline/types';

export default factories.createCoreService(
  'api::inventory.inventory',
  ({ strapi }) => ({
    async createFromManual(result: any) {
      if (!result?.id || result?.inventory_status !== 'Approved') {
        return;
      }

      const record = await strapi.db
        .query('api::inventory-manual.inventory-manual')
        .findOne({
          where: { id: result.id },
          populate: ['details.product_variant', 'warehouse'],
        });

      if (
        !record ||
        !record.warehouse?.id ||
        !record.details ||
        record.details?.length === 0
      ) {
        return;
      }

      const items = [];
      record.details.forEach((detail: any) => {
        items.push({
          variantId: detail.product_variant.id,
          quantity: detail.quantity,
        });
      });

      await this.inventoryCreateOrUpdate(record.warehouse.id, items);
    },

    async triggerChange(event: Event) {
      const { action, model, result, params } = event;

      // Inventory Manual
      if (
        model.uid === 'api::inventory-manual.inventory-manual' &&
        action === 'afterUpdate'
      ) {
        await this.createFromManual(result);
        return;
      }

      // Inventory
      if (
        !(
          model.uid === 'api::inventory.inventory' &&
          (action === 'afterCreate' || action === 'beforeUpdate')
        )
      ) {
        return;
      }

      const inventoryId = params?.where?.id || result?.id;
      const stock_quantity =
        params?.data?.stock_quantity || result?.stock_quantity;

      const user = strapi.requestContext.get()?.state?.user;

      const inventory = await strapi.db
        .query('api::inventory.inventory')
        .findOne({
          where: { id: inventoryId },
          populate: ['product_variant', 'warehouse'],
        });

      let desc = `Added ${inventory?.stock_quantity} of ${
        inventory?.product_variant?.name || 'a product'
      } to ${inventory?.warehouse?.name || 'a warehouse'}.`;

      if (action === 'beforeUpdate') {
        desc = `Updated ${inventory?.warehouse?.name || 'a warehouse'} for ${
          inventory?.product_variant?.name || 'a product'
        } from ${inventory?.stock_quantity} to ${stock_quantity}.`;
      }

      const timeline: TimelineSaveType = {
        title:
          action === 'afterCreate'
            ? `${inventory?.product_variant?.name || 'a product'} Added`
            : `${inventory?.product_variant?.name || 'a product'} Updated`,
        description: desc,
        model: 'inventories',
        recordId: inventoryId,
        user: user,
        metadata: {
          // inventory,
          action,
          params,
          result,
        },
      };
      await strapi.service('api::timeline.timeline').saveTimeline(timeline);
    },

    async inventoryCreateOrUpdate(
      warehouseId: number,
      items: { variantId: number; quantity: number }[],
    ) {
      const entriesCreate = [];

      for await (const item of items) {
        const inventory = await strapi.db
          .query('api::inventory.inventory')
          .findOne({
            where: {
              product_variant: item.variantId,
              warehouse: warehouseId,
            },
          });

        if (inventory) {
          await strapi.db.query('api::inventory.inventory').update({
            where: { id: inventory.id },
            data: {
              stock_quantity: inventory.stock_quantity + item.quantity,
            },
          });
        } else {
          entriesCreate.push({
            product_variant: item.variantId,
            warehouse: warehouseId,
            stock_quantity: item.quantity,
          });
        }
      }

      if (entriesCreate.length > 0) {
        await strapi.db.query('api::inventory.inventory').createMany({
          data: entriesCreate,
        });
      }
    },
  }),
);
