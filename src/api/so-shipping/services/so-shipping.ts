import { factories } from '@strapi/strapi';
import { ShippingAmountType } from '../../shipping-method/types';

export default factories.createCoreService(
  'api::so-shipping.so-shipping',
  ({ strapi }) => ({
    async createDraft(
      contactAddress: any,
      shippingMethod: any,
      coupons?: any[],
    ) {
      // Get shipping amount
      const shippingAmount: ShippingAmountType = await strapi
        .service('api::shipping-method.shipping-method')
        .getShippingAmount(contactAddress, shippingMethod, coupons);

      return await strapi.db.query('api::so-shipping.so-shipping').create({
        data: {
          contact_address: contactAddress.id,
          shipping_method: shippingMethod.id,
          coupon: shippingAmount.couponId || null,
          shipping_status: 'Draft',
          shipping_subtotal: shippingAmount.subtotal,
          shipping_discount: shippingAmount.discount,
          shipping_amount: shippingAmount.total,
        },
      });
    },

    async linkSaleOrder(order: any, soShipping: any) {
      return await strapi.db.query('api::so-shipping.so-shipping').update({
        where: {
          id: soShipping.id,
        },
        data: {
          sale_order: order.id,
        },
      });
    },
  }),
);
