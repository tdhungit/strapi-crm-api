export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Manually decode the JWT if an Authorization header is present
    if (ctx.request.url.startsWith('/api/')) {
      const token = ctx.request.header.authorization;
      if (token) {
        try {
          // get user id from token
          const { id } =
            await strapi.plugins['users-permissions'].services.jwt.getToken(
              ctx
            );
          // check user id
          if (id) {
            // get api name from url
            const parts = ctx.request.url.split('/');
            let apiName = parts[2];
            if (apiName.indexOf('?') > 0) {
              apiName = apiName.split('?')[0];
            }
            // get content type information
            const model: any = Object.values(strapi.contentTypes).find(
              (ct: any) => ct.collectionName === apiName
            );
            // check assigned_user field exist
            if (model && model.attributes?.assigned_user) {
              // add assigned_user filter
              if (ctx.method === 'GET') {
                const assignFilter = await strapi
                  .service('api::user.user')
                  .generateAssignFilter(id, model, 'read');
                // merge with existing filters
                ctx.query = {
                  ...ctx.query,
                  filters: {
                    ...(ctx.query.filters || {}),
                    ...assignFilter,
                  },
                };
              } else if (ctx.method === 'POST') {
                // add assigned_user to body
                if (ctx.request.body?.data) {
                  // @TODO
                  if (!ctx.request.body.data.assigned_user) {
                    ctx.request.body.data.assigned_user = id;
                  }
                }
              }
            }
          }
        } catch (error) {
          console.log('Error assign filter', error);
        }
      }
    }

    await next();
  };
};
