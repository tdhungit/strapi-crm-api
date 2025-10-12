import { factories } from '@strapi/strapi';
import { CouponType } from './../../coupon/types';
import { CartType } from './../types';

export default factories.createCoreService('api::cart.cart', ({ strapi }) => ({
  async clearCart(cart: any) {
    // Remove all cart details
    await strapi.db
      .query('api::cart-detail.cart-detail')
      .deleteMany({ where: { cart: { id: cart.id } } });

    // Update cart status to 'cleared'
    await strapi.db.query('api::cart.cart').update({
      where: { id: cart.id },
      data: {
        subtotal: 0,
        discount_amount: 0,
        discount_type: 'percentage',
        tax_amount: 0,
        tax_type: 'percentage',
      },
    });
  },

  async convertCartToSaleOrder(
    cart: CartType,
    warehouseId: number,
    shipping?: { contactAddress: any; shippingMethod: any },
    coupons?: any[],
  ) {
    if (!cart.contact?.id) {
      throw new Error('Contact is required');
    }

    if (!cart.cart_details || cart.cart_details.length === 0) {
      throw new Error('Cart details are required');
    }

    // Create SO shipping
    const soShipping = await strapi
      .service('api::so-shipping.so-shipping')
      .createDraft(shipping.contactAddress, shipping.shippingMethod, coupons);

    // Calculate coupon discount
    this.calcCouponDiscount(cart, coupons);

    // Create order
    const orderNo = await strapi
      .service('api::sale-order.sale-order')
      .getSalesOrderNo();
    const order = await strapi.db.query('api::sale-order.sale-order').create({
      data: {
        name: orderNo,
        sale_date: new Date(),
        contact: cart.contact.id,
        cart: cart.id,
        warehouse: warehouseId,
        status: 'New',
        subtotal: cart.subtotal,
        discount_type: cart.discount_type || 'percentage',
        discount_amount: cart.discount_amount || 0,
        shipping_amount: soShipping?.shipping_amount || 0,
        tax_type: 'percentage',
        tax_amount: cart.tax_amount || 0,
        total_amount:
          cart.subtotal -
          cart.discount_amount +
          cart.tax_amount +
          (soShipping?.shipping_amount || 0),
      },
    });

    // Create order details
    for (const item of cart.cart_details) {
      await strapi.db.query('api::sale-order-detail.sale-order-detail').create({
        data: {
          sale_order: order.id,
          warehouse: warehouseId,
          product_variant: item.product_variant.id,
          quantity: item.quantity,
          unit_price: item.price,
          discount_type: item.discount_type || 'percentage',
          discount_amount: item.discount_amount || 0,
          tax_type: 'percentage',
          tax_amount: item.tax_amount || 0,
          subtotal: item.price * item.quantity,
        },
      });
    }

    // Link Sale Order to Shipping
    await strapi
      .service('api::so-shipping.so-shipping')
      .linkSaleOrder(order, soShipping);

    // Clear cart
    await this.clearCart(cart);

    return await strapi.db.query('api::sale-order.sale-order').findOne({
      where: { id: order.id },
      populate: ['contact', 'sale_order_details'],
    });
  },

  async calcCouponDiscount(cart: CartType, coupons: CouponType[]) {
    const saleOrderCoupons: CouponType[] = coupons.filter(
      (c) => c.coupon_type === 'Sale Order',
    );
    if (saleOrderCoupons.length > 0) {
      saleOrderCoupons.forEach(async (c) => {
        if (c.discount_type === 'percentage') {
          cart.discount_amount += cart.subtotal * (c.discount_value / 100);
        } else {
          cart.discount_amount += c.discount_value;
        }
      });
    }
  },
}));
