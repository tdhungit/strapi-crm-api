import { Context } from 'koa';

export default {
  async getCart(ctx: Context) {
    const { id } = ctx.state.contact;

    const cart = await strapi.db.query('api::cart.cart').findOne({
      where: { contact: { id } },
      populate: {
        cart_details: {
          populate: {
            product_variant: true,
          },
        },
      },
    });

    if (!cart) {
      return {};
    }

    return cart;
  },

  async mergeCart(ctx: Context) {
    const { id } = ctx.state.contact;

    const contact = await strapi.db.query('api::contact.contact').findOne({
      where: { id },
    });

    if (!contact) {
      return ctx.badRequest('Invalid user');
    }

    const { localCart } = ctx.request.body;
    if (!localCart) {
      return ctx.badRequest('Missing required fields: localCart');
    }

    let subtotal = 0;
    localCart.forEach((item: any) => {
      subtotal += item.price * item.cartQty;
    });

    let cart = await strapi.db.query('api::cart.cart').findOne({
      where: {
        contact: {
          id: id,
        },
      },
    });

    if (!cart) {
      cart = await strapi.db.query('api::cart.cart').create({
        data: { contact: id, subtotal },
      });
    } else {
      cart = await strapi.db.query('api::cart.cart').update({
        where: { id: cart.id },
        data: { subtotal },
      });
    }

    // remove exist cart detail
    await strapi.db.query('api::cart-detail.cart-detail').deleteMany({
      where: { cart: cart.id },
    });

    // save cart item
    for await (const item of localCart) {
      await strapi.db.query('api::cart-detail.cart-detail').create({
        data: {
          cart: cart.id,
          product_variant: item.id,
          quantity: item.cartQty,
          price: item.price,
          discount_type: item.discountType || 'percentage',
          discount_amount: item.discountAmount || 0,
          tax_type: 'percentage',
          tax_amount: item.taxAmount || 0,
        },
      });
    }

    return { cart };
  },

  async isValidCoupons(ctx: Context) {
    const { id } = ctx.state.contact;
    const { couponIds } = ctx.request.body;

    const cart = await strapi.db.query('api::cart.cart').findOne({
      where: { contact: { id } },
      populate: ['contact', 'cart_details.product_variant'],
    });

    if (
      !cart ||
      !cart.cart_details ||
      cart.cart_details.length === 0 ||
      !cart.contact?.id
    ) {
      return ctx.badRequest('Invalid cart');
    }

    const coupons = await strapi.db.query('api::coupon.coupon').findMany({
      where: {
        id: {
          $in: couponIds,
        },
      },
    });

    if (
      !coupons ||
      coupons.length === 0 ||
      coupons.length !== couponIds.length
    ) {
      return ctx.badRequest('Invalid coupon');
    }

    const isValidCoupons = await strapi
      .service('api::coupon.coupon')
      .isValidCoupons(coupons, cart);

    return { isValidCoupons };
  },

  async createOrderFromCart(ctx: Context) {
    const { id } = ctx.state.contact;
    const {
      warehouseId,
      contactAddressId,
      shippingMethodId,
      couponIds = [],
    } = ctx.request.body;

    const cart = await strapi.db.query('api::cart.cart').findOne({
      where: { contact: id },
      populate: ['contact', 'cart_details.product_variant'],
    });

    if (
      !cart ||
      !cart.cart_details ||
      cart.cart_details.length === 0 ||
      !cart.contact?.id
    ) {
      return ctx.badRequest('Invalid cart');
    }

    let coupons = null;
    if (couponIds && couponIds.length > 0) {
      coupons = await strapi.db.query('api::coupon.coupon').findMany({
        where: {
          id: {
            $in: couponIds,
          },
        },
      });

      if (
        !coupons ||
        coupons.length === 0 ||
        coupons.length !== couponIds.length
      ) {
        return ctx.badRequest('Invalid coupon');
      }
    }

    // check valid coupons
    if (coupons && coupons.length > 0) {
      const isValidCoupons = await strapi
        .service('api::coupon.coupon')
        .isValidCoupons(coupons, cart);
      if (!isValidCoupons) {
        return ctx.badRequest('Invalid coupon');
      }
    }

    const contactAddress = await strapi.db
      .query('api::contact-address.contact-address')
      .findOne({
        where: { id: contactAddressId },
      });
    if (!contactAddress) {
      return ctx.badRequest('Invalid shipping address');
    }

    const shippingMethod = await strapi.db
      .query('api::shipping-method.shipping-method')
      .findOne({
        where: { id: shippingMethodId },
      });
    if (!shippingMethod) {
      return ctx.badRequest('Invalid shipping method');
    }

    return await strapi.service('api::cart.cart').convertCartToSaleOrder(
      cart,
      warehouseId,
      {
        contactAddress,
        shippingMethod,
      },
      coupons,
    );
  },

  async getOrders(ctx: Context) {
    const page: number = ctx.query.page
      ? parseInt(ctx.query.page as string)
      : 1;
    const limit: number = ctx.query.pageSize
      ? parseInt(ctx.query.pageSize as string)
      : 10;
    const offset = (page - 1) * limit;

    const orders = await strapi.db
      .query('api::sale-order.sale-order')
      .findMany({
        where: { contact: { id: ctx.state.contact.id } },
        populate: ['sale_order_details.product_variant'],
        limit,
        offset,
        orderBy: { sale_date: 'desc' },
      });

    const total = await strapi.db.query('api::sale-order.sale-order').count({
      where: { contact: { id: ctx.state.contact.id } },
    });

    return {
      data: orders,
      meta: {
        pagination: {
          page,
          pageSize: limit,
          pageCount: Math.ceil(total / limit),
          total,
        },
      },
    };
  },

  async getOrder(ctx: Context) {
    const { id } = ctx.params;
    const order = await strapi.db.query('api::sale-order.sale-order').findOne({
      where: { id, contact: { id: ctx.state.contact.id } },
      populate: ['contact', 'sale_order_details.product_variant'],
    });

    if (!order) {
      return ctx.notFound('Order not found');
    }

    return order;
  },

  async updateOrder(ctx: Context) {
    const { id } = ctx.params;
    const { order_status, sale_date } = ctx.request.body;

    const order = await strapi.db.query('api::sale-order.sale-order').findOne({
      where: { id, contact: { id: ctx.state.contact.id } },
    });

    if (!order) {
      return ctx.notFound('Order not found');
    }

    if (!['New'].includes(order.order_status)) {
      return ctx.badRequest('Cannot update order');
    }

    const data: any = {};
    if (order_status) data.order_status = order_status;
    if (sale_date) data.order_date = new Date(sale_date);

    await strapi.db.query('api::sale-order.sale-order').update({
      where: { id: order.id },
      data,
    });

    return { message: 'Order updated successfully' };
  },

  async addToCart(ctx: Context) {
    const { id } = ctx.state.contact;

    const contact = await strapi.db.query('api::contact.contact').findOne({
      where: { id },
    });

    if (!contact) {
      return ctx.badRequest('Invalid user');
    }

    let cart = await strapi.db.query('api::cart.cart').findOne({
      where: {
        contact: {
          id: id,
        },
      },
      populate: ['cart_details'],
    });

    const { items } = ctx.request.body;
    for await (const item of items) {
      const existingItem = cart?.cart_details?.find(
        (detail: any) => detail.product_variant === item.id,
      );

      if (existingItem) {
        // Update quantity if item already exists
        await strapi.db.query('api::cart-detail.cart-detail').update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.cartQty },
        });
      } else {
        // Create new cart detail
        await strapi.db.query('api::cart-detail.cart-detail').create({
          data: {
            cart: cart?.id,
            product_variant: item.id,
            quantity: item.cartQty,
            price: item.price,
            discount_type: item.discountType || 'percentage',
            discount_amount: item.discountAmount || 0,
            tax_type: 'percentage',
            tax_amount: item.taxAmount || 0,
          },
        });
      }
    }

    return { message: 'Items added to cart successfully', cart };
  },
};
