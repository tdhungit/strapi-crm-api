import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::account.account',
  ({ strapi }) => ({
    async checkDuplicate(data: any): Promise<any | null> {
      const account = await strapi.db
        .query('api::account.account')
        .findOne({ where: { name: data.name } });

      return account?.id ? account : null;
    },
  })
);
