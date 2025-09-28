import { factories } from '@strapi/strapi';
import { SaleOrderSaveOptions, SaleOrderSaveType } from './../types';

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

    async createOrder(data: SaleOrderSaveType, options?: SaleOrderSaveOptions) {
      const orderNo = await this.getSalesOrderNo();

      data.name = orderNo;
      data.order_status = options?.status || 'New';

      const contentType = strapi.contentType('api::sale-order.sale-order');
      const contentTypeSODetail = strapi.contentType(
        'api::sale-order-detail.sale-order-detail'
      );

      const sanitizedData: any = await strapi.contentAPI.sanitize.input(
        data,
        contentType,
        {
          auth: options?.auth || undefined,
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
              auth: options?.auth || undefined,
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

      return entry;
    },

    async updateOrder(
      existingEntry: any,
      data: SaleOrderSaveType,
      options?: SaleOrderSaveOptions
    ) {
      if (
        ['Completed', 'Approved', 'Rejected'].includes(
          existingEntry.order_status
        )
      ) {
        throw new Error('Cannot update a completed Sale Order');
      }

      const contentType = strapi.contentType('api::sale-order.sale-order');
      const contentTypeSODetail = strapi.contentType(
        'api::sale-order-detail.sale-order-detail'
      );

      const sanitizedData: any = await strapi.contentAPI.sanitize.input(
        data,
        contentType,
        {
          auth: options?.auth || undefined,
        }
      );

      // Not allow updating order_status via this method
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
              auth: options?.auth || undefined,
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
    },

    async changeOrderStatus(
      existingEntry: any,
      status: string,
      options?: SaleOrderSaveOptions
    ) {
      const validStatuses = [
        'New',
        'Approved',
        'Rejected',
        'Pending',
        'Completed',
      ];

      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status value');
      }

      if (['Completed', 'Rejected'].includes(existingEntry.order_status)) {
        throw new Error(
          'Cannot change status of a completed or rejected Sale Order'
        );
      }

      let entry: any;
      if (status === 'Approved') {
        // Ensure inventory is valid before approving
        const isValid = await strapi
          .service('api::sale-order.sale-order')
          .invalidateInventory(existingEntry);

        if (!isValid) {
          throw new Error('Insufficient inventory to approve this Sale Order');
        }

        // Change status to Approved
        entry = await strapi.db.query('api::sale-order.sale-order').update({
          where: { id: existingEntry.id },
          data: { order_status: 'Approved' },
        });

        // Update inventory
        await strapi
          .service('api::sale-order.sale-order')
          .inventoryUpdate(existingEntry);
      } else {
        entry = await strapi.db.query('api::sale-order.sale-order').update({
          where: { id: existingEntry.id },
          data: { order_status: status },
        });
      }

      // Log timeline
      await strapi.service('api::timeline.timeline').saveTimeline({
        title: status,
        description: `Sale Order change status from ${existingEntry.order_status} to ${status}`,
        model: 'sale-orders',
        recordId: entry.id,
        user: options?.user || null,
      });

      return entry;
    },
  })
);
