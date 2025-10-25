import { Job, Queue, Worker } from 'bullmq';

export default {
  async getQueue() {
    const connection = await strapi
      .service('api::setting.redis')
      .getRedisClient();
    const queue = new Queue('strapi-crm-jobs', {
      connection,
    });

    return queue;
  },

  async scheduleJob() {
    const queue = await this.getQueue();
    await queue.add(
      'cronjob',
      {},
      {
        repeat: {
          every: 5000,
        },
      },
    );
  },

  async startWorker() {
    const worker = new Worker('strapi-crm-jobs', this.processJob);

    worker.on('completed', (job) => {
      console.log('Job completed', job);
    });

    worker.on('failed', (job, err) => {
      console.log('Job failed', job, err);
    });
  },

  async processJob(job: Job) {
    if (!job.name || job.name !== 'cronjob') {
      return;
    }

    await strapi
      .service('api::campaign-action.campaign-action')
      .checkAndProcessAction();
  },
};
