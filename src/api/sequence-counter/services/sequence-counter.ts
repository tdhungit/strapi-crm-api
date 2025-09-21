import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::sequence-counter.sequence-counter',
  ({ strapi }) => ({
    async getNextSequence(sequenceName: string): Promise<number> {
      const sequence = await strapi.db
        .query('api::sequence-counter.sequence-counter')
        .findOne({ where: { type: sequenceName } });

      if (!sequence) {
        // If the sequence does not exist, create it with an initial value of 1
        const newSequence = await strapi.db
          .query('api::sequence-counter.sequence-counter')
          .create({
            data: { type: sequenceName, last_number: 1 },
          });
        return newSequence.last_number;
      }

      const nextValue = sequence.last_number + 1;

      await strapi.db.query('api::sequence-counter.sequence-counter').update({
        where: { id: sequence.id },
        data: { last_number: nextValue },
      });

      return nextValue;
    },
  })
);
