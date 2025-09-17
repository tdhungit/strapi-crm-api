import { Context } from 'koa';

export default {
  async getAllActions(ctx: Context) {
    const allActionNames: string[] = strapi
      .service('api::campaign-action.action')
      .getListActions();
    const actions = [];
    allActionNames.forEach((actionName) => {
      const label = actionName.replace(/_/g, ' ');
      actions.push({
        label: label,
        value: actionName,
      });
    });
    return actions;
  },
};
