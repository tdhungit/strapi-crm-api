import { factories } from '@strapi/strapi';
import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
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

    async getFirebaseApp() {
      // Get firebase settings
      const firebaseConfig = await strapi
        .service('api::setting.setting')
        .getSettings('system', 'firebase');

      if (!firebaseConfig?.firebase?.serviceAccountJson) {
        throw new Error('Firebase settings not found');
      }

      const serviceAccount = JSON.parse(
        fs.readFileSync(firebaseConfig.firebase.serviceAccountJson, 'utf8'),
      );

      const app = !getApps().length
        ? initializeApp({
            credential: cert(serviceAccount),
          })
        : getApp();

      return app;
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
      const app = await this.getFirebaseApp();
      const auth = getAuth();
      const decoded = await auth.verifyIdToken(token);
      const { uid } = decoded;
      if (uid === contact.login_provider_sid) {
        return true;
      } else {
        return false;
      }
    },

    async mergeSocial2Local(
      login_provider: string,
      login_provider_id: string,
      firebaseToken: string,
    ) {
      const app = await this.getFirebaseApp();
      const auth = getAuth();
      const decoded = await auth.verifyIdToken(firebaseToken);
      const { uid, email } = decoded;

      if (!uid || !email) {
        throw new Error('Invalid Firebase token');
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
