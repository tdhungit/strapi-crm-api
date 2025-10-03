import { isNumeric } from '../helpers/utils';

export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Manually decode the JWT if an Authorization header is present
    if (ctx.request.url.startsWith('/api/')) {
      const token = ctx.request.header.authorization;
      if (token?.startsWith('Bearer ')) {
        try {
          // get user id from token
          const { id: userId } =
            await strapi.plugins['users-permissions'].services.jwt.getToken(
              ctx,
            );

          if (!userId) {
            await next();
            return;
          }

          // get api name from url
          const match = ctx.path.match(/^\/api\/([^/]+)\/([^/]+)$/);
          if (!match) {
            await next();
            return;
          }

          const [_, apiName, id] = match;
          if (!apiName || !id) {
            await next();
            return;
          }

          // get content type information
          const model: any = Object.values(strapi.contentTypes).find(
            (ct: any) => ct.collectionName === apiName,
          );
          // check assigned_user field exist
          if (!model?.attributes?.assigned_user) {
            await next();
            return;
          }

          // get record
          const where: any = {};
          if (isNumeric(id)) {
            where.id = id;
          } else {
            where.documentId = id;
          }

          const record = await strapi.db.query(model.uid).findOne({ where });
          if (!record) {
            await next();
            return;
          }

          // check is access record
          const isAccess = await strapi
            .service('api::user.user')
            .isAccessRecord(userId, model.uid, record);

          if (!isAccess) {
            ctx.send({
              message: 'Access denied',
              code: 403,
            });
            return;
          }
        } catch (error) {
          console.log('[is-access] Error assign filter', error);
          await next();
          return;
        }
      }
    }

    await next();
  };
};
