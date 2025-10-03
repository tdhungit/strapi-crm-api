import { Context } from 'koa';

export default (policyContext: Context, config, { strapi }) => {
  if (policyContext.state.contact?.id) {
    return true;
  }
  return false;
};
