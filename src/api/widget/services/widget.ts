export default () => ({
  async countCollectionByCreatedAt(
    collectionName: string,
    type: string,
    params: {
      start?: string;
      end?: string;
    } = {}
  ) {
    let select: string;

    switch (type) {
      case 'day':
        select = `to_char("created_at", 'YYYY-MM-DD')`;
        break;
      case 'week':
        select = `to_char("created_at", 'IYYY-IW')`;
        break;
      case 'month':
        select = `to_char("created_at", 'YYYY-MM')`;
        break;
      default:
        throw new Error('Invalid type');
    }

    const qb = strapi.db
      .connection(collectionName)
      .select(strapi.db.connection.raw(`${select} as group`));

    if (params.start && params.end) {
      qb.whereBetween('created_at', [params.start, params.end]);
    }

    const result = await qb
      .count('* as total')
      .groupBy('group')
      .orderBy('group', 'asc');

    const normalized = result.map((r) => ({
      group: r.group,
      total: Number(r.total),
    }));

    return {
      type,
      data: normalized,
    };
  },
});
