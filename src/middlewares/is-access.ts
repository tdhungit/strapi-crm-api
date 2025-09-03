export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Manually decode the JWT if an Authorization header is present
    if (ctx.request.url.startsWith('/api/')) {
      const token = ctx.request.header.authorization;
      if (token) {
        try {
          // get user id from token
          const { id: userId } =
            await strapi.plugins['users-permissions'].services.jwt.getToken(
              ctx
            );

          if (!userId) {
            return await next();
          }

          // get api name from url
          const match = ctx.path.match(/^\/api\/([^/]+)\/(\d+)$/);
          if (!match) {
            return await next();
          }

          const [_, apiName, id] = match;
          // get content type information
          const model: any = Object.values(strapi.contentTypes).find(
            (ct: any) => ct.collectionName === apiName
          );
          // check assigned_user field exist
          if (!model?.attributes?.assigned_user) {
            return await next();
          }

          // get record
          const where: any = {};
          if (isNaN(id)) {
            where.id = id;
          } else {
            where.documentId = id;
          }

          const record = await strapi.db.query(model.uid).findOne({ where });
          if (!record) {
            return await next();
          }

          // check is access record
          const isAccess = await strapi
            .service('api::user.user')
            .isAccessRecord(id, apiName, record);

          if (!isAccess) {
            return ctx.send({
              message: 'Access denied',
              code: 403,
            });
          }
        } catch (error) {
          console.log('Error assign filter', error);
        }
      }
    }

    await next();
  };
};
