import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController(
  'api::crm-workflow.crm-workflow',
  ({ strapi }) => ({
    async getAllActions(ctx: Context) {
      const actions = strapi
        .service('api::crm-workflow.action')
        .getListActions();
      ctx.body = actions;
    },

    async create(ctx: Context) {
      const { data } = ctx.request.body;

      const entry = await strapi.db
        .query('api::crm-workflow.crm-workflow')
        .create({
          data: {
            name: data.name,
            module: data.module,
            trigger: data.trigger,
            workflow_status: data.workflow_status || 'Active',
            metadata: data.metadata || {},
          },
        });

      if (data?.actions?.length > 0) {
        for await (const action of data.actions) {
          await strapi.db
            .query('api::crm-workflow-action.crm-workflow-action')
            .create({
              data: {
                workflow: entry.id,
                name: action.name,
                action_status: 'Ready',
                metadata: action.metadata || {},
              },
            });
        }
      }

      return { data: entry, meta: {} };
    },

    async update(ctx: Context) {
      const { id } = ctx.params;
      const { data } = ctx.request.body;

      const entry = await strapi.db
        .query('api::crm-workflow.crm-workflow')
        .update({
          where: { documentId: id },
          data: {
            name: data.name,
            module: data.module,
            trigger: data.trigger,
            workflow_status: data.workflow_status || 'Active',
            metadata: data.metadata || {},
          },
        });

      const existActions = await strapi.db
        .query('api::crm-workflow-action.crm-workflow-action')
        .findMany({
          where: {
            workflow: {
              id: entry.id,
            },
          },
        });

      if (data?.actions?.length > 0) {
        for await (const action of data.actions) {
          const existAction = existActions.find(
            (exist) => exist.id === action.id,
          );
          if (existAction) {
            await strapi.db
              .query('api::crm-workflow-action.crm-workflow-action')
              .update({
                where: {
                  id: existAction.id,
                },
                data: {
                  name: action.name,
                  action_status: 'Ready',
                  metadata: action.metadata || {},
                },
              });
          } else {
            await strapi.db
              .query('api::crm-workflow-action.crm-workflow-action')
              .create({
                data: {
                  workflow: entry.id,
                  name: action.name,
                  action_status: 'Ready',
                  metadata: action.metadata || {},
                },
              });
          }
        }

        const actionsToDelete = existActions.filter(
          (exist) => !data.actions.some((action) => action.id === exist.id),
        );

        for await (const action of actionsToDelete) {
          await strapi.db
            .query('api::crm-workflow-action.crm-workflow-action')
            .delete({ where: { id: action.id } });
        }
      }

      return { data: entry, meta: {} };
    },
  }),
);
