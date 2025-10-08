import { factories } from '@strapi/strapi';

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
}));
