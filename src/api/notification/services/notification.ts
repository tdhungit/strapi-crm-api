export default () => ({
  async send(userId: number, title: string, body: string) {
    const { database } = await strapi
      .service('api::setting.setting')
      .getFirebaseApp();
    const ref = database.ref(`/notifications/${userId}`);
    await ref.set({
      title,
      body,
      timestamp: Date.now(),
    });
  },
});
