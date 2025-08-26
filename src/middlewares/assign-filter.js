module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Manually decode the JWT if an Authorization header is present
    const token = ctx.request.header.authorization;
    if (token) {
      try {
        const { id } = await strapi.plugins['users-permissions'].services.jwt.getToken(ctx);
        // chỉ áp dụng với GET collection type
        if (ctx.method === 'GET' && id && ctx.request.url.startsWith('/api/')) {
          // inject filter nếu content type có field assigned_user
          const parts = ctx.request.url.split('/');
          const apiName = parts[2]; // ví dụ: accounts, contacts, deals

          const model = Object.values(strapi.contentTypes).find(
            (ct) => ct.collectionName === apiName
          );
          if (model && model.attributes.assigned_user) {
            ctx.query = {
              ...ctx.query,
              filters: {
                ...(ctx.query.filters || {}),
                assigned_user: { id: id },
              },
            };
          }
        }
      } catch (error) {
        console.log('Error assign filter', error);
      }
    }

    await next();
  };
};
