import { Context } from 'koa';

export default {
  async findMedias(ctx: Context) {
    try {
      const { pagination, filters } = ctx.query;

      // Set default values for pagination with proper typing
      const paginationObj =
        (pagination as { page?: number; pageSize?: number }) || {};
      const page = paginationObj.page || 1;
      const pageSize = paginationObj.pageSize || 10;

      const start = (Number(page) - 1) * Number(pageSize);
      const limit = Number(pageSize);

      // Type the filters object properly
      const filtersObj = (filters as { name?: string }) || {};
      const where: any = {};
      if (filtersObj.name) {
        where.name = { $contains: filtersObj.name };
      }

      const medias = await strapi.db.query('plugin::upload.file').findMany({
        offset: start,
        limit: limit,
        where,
        orderBy: { createdAt: 'DESC' },
      });

      const total = await strapi.db.query('plugin::upload.file').count();

      ctx.body = {
        data: medias,
        meta: {
          pagination: {
            page: Number(page),
            pageSize: Number(pageSize),
            pageCount: Math.ceil(total / Number(pageSize)),
            total: total,
          },
        },
      };
    } catch (error) {
      ctx.throw(500, 'Failed to fetch media files');
    }
  },
};
