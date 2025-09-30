import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::lead.lead',
  ({ strapi }) => ({
    async convertToContact(ctx) {
      const { id } = ctx.params;
      const { accountId } = ctx.request.body;
      if (!id) {
        return ctx.badRequest('Lead ID is required');
      }

      const lead = await strapi.db.query('api::lead.lead').findOne({
        where: { id: Number(id) },
        populate: { contact: true },
      });

      if (!lead) {
        return ctx.notFound('Lead not found');
      }

      if (lead.contact?.id) {
        if (lead.leadStatus !== 'Converted') {
          await strapi.db.query('api::lead.lead').update({
            where: { id: lead.id },
            data: { leadStatus: 'Converted' },
          });
        }
        return ctx.badRequest('Lead is already converted to a contact');
      }

      let account: any = null;
      if (accountId) {
        account = await strapi.db.query('api::account.account').findOne({
          where: { id: Number(accountId) },
        });
        if (!account) {
          return ctx.badRequest('Account not found');
        }
      }

      const contactService = strapi.service('api::contact.contact');
      try {
        const contact = await contactService.createFromLead(
          lead.id,
          account,
          ctx.state.user
        );
        return ctx.send({ contact });
      } catch (error) {
        return ctx.internalServerError('Error converting lead to contact', {
          error,
        });
      }
    },
  })
);
