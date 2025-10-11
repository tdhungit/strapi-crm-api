import { Context } from 'koa';

export default {
  async getAddresses(ctx: Context) {
    const contactId = ctx.state.contact.id;
    try {
      const addresses = await strapi.db
        .query('api::contact-address.contact-address')
        .findMany({
          where: {
            contact: {
              id: contactId,
            },
          },
          populate: ['address'],
        });
      return addresses || [];
    } catch (error) {
      return [];
    }
  },

  async getDefaultAddress(ctx: Context) {
    const contactId = ctx.state.contact.id;

    const address = await strapi.db
      .query('api::contact-address.contact-address')
      .findOne({
        where: {
          contact: {
            id: contactId,
          },
          is_default: true,
        },
        populate: ['address'],
      });

    return {
      address,
    };
  },

  async createAddress(ctx: Context) {
    const contactId = ctx.state.contact.id;
    const {
      fullName,
      email,
      phone,
      address: street,
      city,
      state,
      postalCode,
      country,
    } = ctx.request.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !street ||
      !city ||
      !state ||
      !country ||
      !postalCode
    ) {
      return ctx.badRequest('Missing required fields');
    }

    const address = await strapi.db
      .query('api::contact-address.contact-address')
      .create({
        data: {
          name: fullName,
          email,
          phone,
          contact: contactId,
          address: street,
          city,
          state,
          zipcode: postalCode,
          country,
        },
      });

    return address;
  },

  async updateAddress(ctx: Context) {
    const contactId = ctx.state.contact.id;
    const { id } = ctx.params;
    const {
      fullName,
      email,
      phone,
      address: street,
      city,
      state,
      postalCode,
      country,
    } = ctx.request.body;

    const address = await strapi.db
      .query('api::contact-address.contact-address')
      .findOne({
        where: {
          id,
          contact: {
            id: contactId,
          },
        },
      });

    if (!address) {
      return ctx.notFound('Address not found');
    }

    const updatedAddress = await strapi.db
      .query('api::contact-address.contact-address')
      .update({
        where: { id },
        data: {
          name: fullName,
          email,
          phone,
          address: street,
          city,
          state,
          zipcode: postalCode,
          country,
        },
      });

    return updatedAddress;
  },

  async deleteAddress(ctx: Context) {
    const contactId = ctx.state.contact.id;
    const { id } = ctx.params;

    const address = await strapi.db
      .query('api::contact-address.contact-address')
      .findOne({
        where: {
          id,
          contact: {
            id: contactId,
          },
        },
      });

    if (!address) {
      return ctx.notFound('Address not found');
    }

    await strapi.db
      .query('api::contact-address.contact-address')
      .delete({ where: { id } });

    return { message: 'Address deleted successfully' };
  },

  async setDefault(ctx: Context) {
    const contactId = ctx.state.contact.id;
    const { id } = ctx.params;

    const address = await strapi.db
      .query('api::contact-address.contact-address')
      .findOne({
        where: {
          id,
          contact: {
            id: contactId,
          },
        },
      });

    if (!address) {
      return ctx.notFound('Address not found');
    }

    return await strapi.db
      .query('api::contact-address.contact-address')
      .update({
        where: {
          id: address.id,
        },
        data: {
          is_default: true,
        },
      });
  },
};
