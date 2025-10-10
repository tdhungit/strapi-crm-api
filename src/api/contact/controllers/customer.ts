import jwt from 'jsonwebtoken';
import { Context } from 'koa';
import { comparePassword, hashPassword } from '../../../helpers/utils';

export default {
  async getLeadsAndContacts(ctx: Context) {
    const page: number = ctx.query.page
      ? parseInt(ctx.query.page as string, 10)
      : 1;
    const pageSize: number = ctx.query.pageSize
      ? parseInt(ctx.query.pageSize as string, 10)
      : 10;
    const start = (page - 1) * pageSize;
    const limit = pageSize;

    const { search } = ctx.query || {};

    const where = {};

    if (search) {
      Object.assign(where, {
        $or: [
          { firstName: { $containsi: search } },
          { lastName: { $containsi: search } },
          { email: { $containsi: search } },
          { phone: { $containsi: search } },
          { mobile: { $containsi: search } },
        ],
      });
    }

    const [leadTotals, contactTotals, leads, contacts] = await Promise.all([
      // Count leads
      strapi.db.query('api::lead.lead').count({
        where,
      }),
      // Count contacts
      strapi.db.query('api::contact.contact').count({
        where,
      }),
      // Fetch leads
      strapi.db.query('api::lead.lead').findMany({
        where,
        populate: { address: true, assigned_user: true, contact: true },
        orderBy: { createdAt: 'desc' },
        offset: start,
        limit,
      }),
      // Fetch contacts
      strapi.db.query('api::contact.contact').findMany({
        where,
        populate: { account: true, address: true, assigned_user: true },
        orderBy: { createdAt: 'desc' },
        offset: start,
        limit,
      }),
    ]);

    return {
      leads,
      contacts,
      leadMeta: {
        page,
        pageSize,
        total: leadTotals,
      },
      contactMeta: { page, pageSize, total: contactTotals },
    };
  },

  async checkContactEmailExist(ctx: Context) {
    const { email } = ctx.request.body;

    const contact = await strapi.db.query('api::contact.contact').findOne({
      where: { email },
    });

    if (contact) {
      return ctx.badRequest('Email already exists');
    }

    return { email };
  },

  async contactRegister(ctx: Context) {
    const {
      email,
      password,
      salutation,
      firstName,
      lastName,
      phone,
      mobile,
      address,
      leadSource,
      autoLogin = false,
    } = ctx.request.body;

    if (!email || !password || !firstName || !lastName || !phone) {
      throw new Error(
        'Missing required fields: email, password, firstName, lastName, phone',
      );
    }

    const contact = await strapi.db.query('api::contact.contact').create({
      data: {
        salutation,
        email,
        password: hashPassword(password),
        firstName: firstName,
        lastName: lastName,
        phone,
        mobile,
        address,
        leadSource: leadSource || 'Website',
      },
    });

    let token: string = '';
    if (autoLogin) {
      // generate token
      token = jwt.sign(
        { id: contact.id, email: contact.email },
        process.env.JWT_SECRET_CONTACT as string,
        {
          expiresIn: '24h',
        },
      );
    }

    return {
      ...contact,
      token,
    };
  },

  async contactLogin(ctx: Context) {
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      return ctx.badRequest('Missing required fields: email, password');
    }

    const contact = await strapi.db.query('api::contact.contact').findOne({
      where: { email },
    });

    if (!contact) {
      return ctx.badRequest('Invalid email or password');
    }

    if (!contact.password) {
      return ctx.badRequest('Password not set');
    }

    const isPasswordValid = comparePassword(password, contact.password);

    if (!isPasswordValid) {
      return ctx.badRequest('Invalid email or password');
    }

    // generate token
    const token = jwt.sign(
      { id: contact.id, email: contact.email },
      process.env.JWT_SECRET_CONTACT as string,
      {
        expiresIn: '24h',
      },
    );

    return { jwt: token };
  },

  async contactCurrent(ctx: Context) {
    const { id } = ctx.state.contact;

    const contact = await strapi.db.query('api::contact.contact').findOne({
      where: { id },
    });

    if (!contact) {
      return ctx.badRequest('Invalid user');
    }

    delete contact.password;
    return contact;
  },

  async changePassword(ctx: Context) {
    const { id } = ctx.state.contact;
    const { oldPassword, newPassword } = ctx.request.body;

    const contact = await strapi.db.query('api::contact.contact').findOne({
      where: { id },
    });

    if (!contact) {
      return ctx.badRequest('Invalid user');
    }

    const isPasswordValid = comparePassword(oldPassword, contact.password);

    if (!isPasswordValid) {
      return ctx.badRequest('Invalid old password');
    }

    await strapi.db.query('api::contact.contact').update({
      where: { id },
      data: {
        password: hashPassword(newPassword),
      },
    });

    return { message: 'Password changed successfully' };
  },

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

  async createOrderFromCart(ctx: Context) {
    const { id } = ctx.state.contact;
    const { warehouseId } = ctx.request.body;

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

    return await strapi
      .service('api::cart.cart')
      .convertCartToSaleOrder(cart, warehouseId);
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
};
