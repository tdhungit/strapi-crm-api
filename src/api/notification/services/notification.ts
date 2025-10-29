import { SupabaseClient } from '@supabase/supabase-js';

export default () => ({
  async send(userId: number, title: string, body: string) {
    const settings = await strapi
      .service('api::setting.setting')
      .getCRMSettings();
    const service = settings.thirdPartyService;
    console.log(service);

    if (!service) {
      return null;
    }

    const notificationData = {
      title,
      body,
      timestamp: Date.now(),
      pushed: false,
      read: false,
    };

    if (service === 'firebase') {
      const { database } = await strapi
        .service('api::setting.firebase')
        .getFirebaseApp();

      const ref = database.ref(`/notifications/${userId}`);
      return await ref.push(notificationData);
    }

    if (service === 'supabase') {
      const supabase: SupabaseClient = await strapi
        .service('api::setting.supabase')
        .getApp();
      const timestamp = new Date().toISOString();
      return await supabase
        .from('notifications')
        .insert([{ ...notificationData, user_id: userId, timestamp }]);
    }

    return null;
  },
});
