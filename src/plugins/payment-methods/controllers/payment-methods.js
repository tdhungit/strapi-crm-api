export default {
  'payment-methods': {
    async findByName(ctx) {
      const { name } = ctx.params;
      const db = strapi.db.query('api::payment-method.payment-method');
      const paymentMethod = await db.findOne({ where: { name } });
      if (!paymentMethod) {
        return {
          name,
          description: '',
          enabled: false,
          options: {},
        };
      }
      return paymentMethod;
    },

    async save(ctx) {
      const { name, description, enabled, options } = ctx.request.body;
      if (!name) {
        return ctx.badRequest('Name is required');
      }

      const db = strapi.db.query('api::payment-method.payment-method');

      let paymentMethod;

      paymentMethod = await db.findOne({ where: { name } });

      if (!paymentMethod) {
        paymentMethod = await db.create({
          data: {
            name,
            description: description || '',
            enabled: enabled || false,
            options: options || {},
          },
        });
      } else {
        paymentMethod = await db.update({
          where: { id: paymentMethod.id },
          data: {
            name,
            description: description || '',
            enabled: enabled || false,
            options: options || {},
          },
        });
      }

      return paymentMethod;
    },
  },
};
