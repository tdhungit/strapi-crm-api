import type { Event } from '@strapi/database/dist/lifecycles';
import { factories } from '@strapi/strapi';
import axios, { AxiosResponse } from 'axios';
import { WebhookType } from './../types';

export default factories.createCoreService(
  'api::crm-webhook.crm-webhook',
  ({ strapi }) => ({
    process(event: Event) {
      const data: any = this.getEventData(event);
      if (!data) {
        return;
      }

      this.getActiveWebhooks(event.model.uid, event.action).then(
        async (webhooks: WebhookType[]) => {
          for (const webhook of webhooks) {
            try {
              await this.postRequest(webhook, data);
            } catch (error) {
              console.error(error);
            }
          }
        },
      );
    },

    async postRequest(
      webhook: WebhookType,
      data: any,
    ): Promise<AxiosResponse<any, any, {}>> {
      const headers: any = {
        'Content-Type': 'application/json',
      };

      if (webhook.token) {
        headers.Authorization = `Bearer ${webhook.token}`;
      }

      return await axios.post(webhook.webhook, data, {
        headers,
      });
    },

    async getActiveWebhooks(
      uid: string,
      action: string,
    ): Promise<WebhookType[]> {
      return await strapi.db.query('api::crm-webhook.crm-webhook').findMany({
        where: {
          status: 'Active',
          webhook: {
            $notNull: true,
          },
          uid,
          trigger: action,
        },
      });
    },

    getEventData(event: Event) {
      if (event.action.startsWith('after')) {
        return event.result;
      }

      if (event.action.startsWith('before')) {
        return event.params.data;
      }

      if (event.action.startsWith('delete')) {
        return event.params.where;
      }

      return null;
    },
  }),
);
