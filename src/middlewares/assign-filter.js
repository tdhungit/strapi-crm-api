module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Manually decode the JWT if an Authorization header is present
    if (ctx.request.url.startsWith('/api/')) {
      const token = ctx.request.header.authorization;
      if (token) {
        try {
          const { id } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);
          if (id) {
            // get api name from url
            const parts = ctx.request.url.split('/');
            const apiName = parts[2]; // ví dụ: accounts, contacts, deals
            // get content type information
            const model = Object.values(strapi.contentTypes).find(
              (ct) => ct.collectionName === apiName
            );
            // check assigned_user field exist
            if (model && model.attributes.assigned_user) {
              // add assigned_user filter
              if (ctx.method === 'GET') {
                ctx.query = {
                  ...ctx.query,
                  filters: {
                    ...(ctx.query.filters || {}),
                    assigned_user: { id: id },
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
