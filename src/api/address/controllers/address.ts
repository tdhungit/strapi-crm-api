import type { Context } from 'koa';

export default {
  async getCountries(ctx: Context) {
    const countries = await strapi.db.query('api::country.country').findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return countries;
  },

  async getStates(ctx: Context) {
    const { country } = ctx.params;
    const states = await strapi.db.query('api::state.state').findMany({
      where: {
        country: {
          name: country,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return states;
  },

  async getCities(ctx: Context) {
    const { state } = ctx.params;
    const cities = await strapi.db.query('api::city.city').findMany({
      where: {
        state: {
          name: state,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return cities;
  },
};
