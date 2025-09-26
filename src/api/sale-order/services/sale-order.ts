import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::sale-order.sale-order',
  ({ strapi }) => ({
    async getSalesOrderNo(): Promise<string> {
      const sequenceService = strapi.service(
        'api::sequence-counter.sequence-counter'
      );
      const nextSequence = await sequenceService.getNextSequence('sales_order');
      const orderNo = `SO-${String(nextSequence).padStart(6, '0')}`;
      return orderNo;
    },

    async inventoryUpdate(saleOrder: any) {
      // Fetch all sale order details
      const details = await strapi.db
        .query('api::sale-order-detail.sale-order-detail')
        .findMany({
          where: { sale_order: saleOrder.id },
          populate: ['product_variant', 'warehouse'],
        });

      for (const detail of details) {
        // Find or create inventory record for this product_variant and warehouse
        let inventory = await strapi.db
          .query('api::inventory.inventory')
          .findOne({
            where: {
              product_variant: {
                id: detail.product_variant.id,
              },
              warehouse: {
                id: detail.warehouse.id,
              },
            },
          });

        if (inventory) {
          // Update stock_quantity
          await strapi.db.query('api::inventory.inventory').update({
            where: { id: inventory.id },
            data: {
              stock_quantity: inventory.stock_quantity - detail.quantity,
              last_updated: new Date(),
            },
          });
        } else {
          // Create inventory record if not exists
          await strapi.db.query('api::inventory.inventory').create({
            data: {
              product_variant: detail.product_variant,
              warehouse: detail.warehouse,
              stock_quantity: -detail.quantity,
              last_updated: new Date(),
            },
          });
        }
      }
    },

    async invalidateInventory(saleOrder: any): Promise<boolean> {
      let isValid = true;
      // Fetch all sale order details
      const details = await strapi.db
        .query('api::sale-order-detail.sale-order-detail')
        .findMany({
          where: { sale_order: saleOrder.id },
          populate: ['product_variant', 'warehouse'],
        });

      let inventories: any[] = [];
      for await (const detail of details) {
        const findIndex = inventories.findIndex(
          (inv) =>
            inv.product_variant.id === detail.product_variant.id &&
            inv.warehouse.id === detail.warehouse.id
        );

        if (findIndex !== -1) {
          inventories[findIndex].quantity += detail.quantity;
          continue;
        }

        inventories.push({
          product_variant: detail.product_variant,
          warehouse: detail.warehouse,
          quantity: detail.quantity,
        });
      }

      for await (const inventory of inventories) {
        const existingInventory = await strapi.db
          .query('api::inventory.inventory')
          .findOne({
            where: {
              product_variant: {
                id: inventory.product_variant.id,
              },
              warehouse: {
                id: inventory.warehouse.id,
              },
            },
          });

        if (
          !existingInventory ||
          existingInventory.stock_quantity < inventory.quantity
        ) {
          isValid = false;
          break;
        }
      }

      return isValid;
    },
  })
);
