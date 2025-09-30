import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::contact.contact',
  ({ strapi }) => ({
    async createFromLead(leadId: number, account?: any, user?: any) {
      const lead = await strapi.db.query('api::lead.lead').findOne({
        where: { id: leadId },
        populate: { account: true, address: true, assigned_user: true },
      });

      if (!lead) {
        throw new Error('Lead not found');
      }

      const contactAddress: any = lead?.address || null;
      if (contactAddress) {
        delete contactAddress.id;
        delete contactAddress.documentId;
      }

      const contactData = {
        lead: lead.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        mobile: lead.mobile,
        bod: lead.bod,
        jobTitle: lead.jobTitle,
        department: lead.department,
        leadSource: lead.leadSource,
        address: contactAddress,
        description: lead.description,
        account: account?.id || null,
        assigned_user: lead.assigned_user?.id || user?.id || null,
      };

      const contact = await strapi.db.query('api::contact.contact').create({
        data: contactData,
      });

      // Optionally, update the lead status to 'converted'
      await strapi.db.query('api::lead.lead').update({
        where: { id: lead.id },
        data: { leadStatus: 'Converted', contact: contact.id },
      });

      return contact;
    },
  })
);
