import Redis from 'ioredis';

export default {
  async getRedisClient() {
    const redisConfig = await strapi
      .service('api::setting.setting')
      .getSettings('system', 'redis');

    if (!redisConfig?.redis?.url) {
      throw new Error('Redis settings not found');
    }

    const client = new Redis(redisConfig.redis.url);

    return client;
  },
};
