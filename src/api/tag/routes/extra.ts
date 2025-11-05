export default {
  routes: [
    {
      method: 'POST',
      path: '/tags/assign',
      handler: 'tag.assign',
    },
    {
      method: 'GET',
      path: '/tags/:module/:recordId',
      handler: 'tag.getRecordTags',
    },
    {
      method: 'GET',
      path: '/tags/find',
      handler: 'tag.findTagRecords',
    },
  ],
};
