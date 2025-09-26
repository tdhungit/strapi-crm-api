import type { Event } from '@strapi/database/dist/lifecycles';
import { factories } from '@strapi/strapi';
import { TimelineSaveType } from '../../timeline/types';

export default factories.createCoreService(
  'api::inventory.inventory',
  ({ strapi }) => ({
    async triggerTimeline(event: Event) {
      const { action, model, result, params } = event;

      if (
        !(
          model.uid === 'api::inventory.inventory' &&
          (action === 'afterCreate' || action === 'beforeUpdate')
        )
      ) {
        return;
      }

      console.log(result, params);

      const inventoryId = params?.where?.id || result?.id;
      const stock_quantity =
        params?.data?.stock_quantity || result?.stock_quantity;

      const user = strapi.requestContext.get()?.state?.user;

      const inventory = await strapi.db
        .query('api::inventory.inventory')
        .findOne({
          where: { id: inventoryId },
          populate: ['product_variant'],
        });

      let desc = `Added ${inventory?.stock_quantity} of ${
        inventory?.product_variant?.name || 'a product'
      } to inventory.`;

      if (action === 'beforeUpdate') {
        desc = `Updated inventory for ${
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
          action,
          params,
          result,
        },
      };
      await strapi.service('api::timeline.timeline').saveTimeline(timeline);
    },
  })
);
