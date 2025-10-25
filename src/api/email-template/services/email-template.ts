import { factories } from '@strapi/strapi';
import ejs from 'ejs';

export default factories.createCoreService(
  'api::email-template.email-template',
  ({ strapi }) => ({
    async parseContent(ejsContent: string, data: Record<string, any> = {}) {
      const content = await ejs.render(ejsContent, data, {
        async: true,
      });

      return content;
    },

    async parseTemplateContent(
      templateId: number,
      data: Record<string, any> = {},
    ) {
      const template = await strapi.db
        .query('api::email-template.email-template')
        .findOne({
          where: { id: templateId },
        });

      if (!template) {
        throw new Error('Template not found');
      }

      if (!template.content) {
        throw new Error('Template content is empty');
      }

      const subject = await this.parseContent(template.title, data);
      const content = await this.parseContent(template.content, data);

      return { subject, content };
    },
  }),
);
