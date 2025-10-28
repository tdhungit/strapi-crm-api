import { factories } from '@strapi/strapi';
import { SupabaseClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

export default factories.createCoreService(
  'api::contact.contact',
  ({ strapi }) => ({
    async createFromLead(leadId: number, account?: any, user?: any) {
      const lead = await strapi.db.query('api::lead.lead').findOne({
        where: { id: leadId },
        populate: {
          account: true,
          address: true,
          assigned_user: true,
          contact: true,
        },
      });

      if (!lead) {
        throw new Error('Lead not found');
      }

      if (lead.contact) {
        return lead.contact;
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

    async generateLoginToken(contact: any, firebaseToken?: string) {
      if (firebaseToken) {
        if (!(await this.checkFirebaseToken(contact, firebaseToken))) {
          throw new Error('Invalid Firebase token');
        }
      }

      const token = jwt.sign(
        { id: contact.id, email: contact.email },
        process.env.JWT_SECRET_CONTACT as string,
        {
          expiresIn: '24h',
        },
      );

      return token;
    },

    async checkFirebaseToken(contact: any, token: string) {
      const { auth } = await strapi
        .service('api::setting.firebase')
        .getFirebaseApp();
      const decoded = await auth.verifyIdToken(token);
      const { uid } = decoded;
      if (uid === contact.login_provider_sid) {
        return true;
      } else {
        return false;
      }
    },

    async mergeSocial2Local(
      authService: string,
      login_provider: string,
      login_provider_id: string,
      token: string,
    ) {
      let uid: string = '';
      let email: string = '';

      if (authService === 'firebase') {
        const { auth } = await strapi
          .service('api::setting.firebase')
          .getFirebaseApp();
        const decoded = await auth.verifyIdToken(token);
        uid = decoded.uid;
        email = decoded.email;
      } else {
        const supabase: SupabaseClient = await strapi
          .service('api::setting.supabase')
          .getApp();
        const {
          data: { user },
        } = await supabase.auth.getUser(token);
        uid = user.id;
        email = user.email;
      }

      if (!uid || !email) {
        throw new Error('Invalid ' + authService + ' token');
      }

      const contact = await strapi.db.query('api::contact.contact').findOne({
        where: { email },
      });

      if (!contact) {
        throw new Error('Contact not found');
      }

      const updateContact = await strapi.db
        .query('api::contact.contact')
        .update({
          where: { id: contact.id },
          data: { login_provider, login_provider_sid: login_provider_id },
        });

      return await this.generateLoginToken(updateContact);
    },
  }),
);
