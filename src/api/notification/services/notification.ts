export default () => ({
  async send(userId: number, title: string, body: string) {
    const { database } = await strapi
      .service('api::setting.firebase')
      .getFirebaseApp();
    const ref = database.ref(`/notifications/${userId}`);
    return await ref.push({
      title,
      body,
      timestamp: Date.now(),
      pushed: false,
      read: false,
    });
  },
});
