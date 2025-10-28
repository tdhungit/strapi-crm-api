import { createClient, SupabaseClient } from '@supabase/supabase-js';

export default {
  async getApp(): Promise<SupabaseClient> {
    const settings = await strapi
      .service('api::setting.setting')
      .getSettings('system', 'supabase');

    const supabaseConfig = settings.supabase || {};
    const supabase = createClient(supabaseConfig.url, supabaseConfig.secretKey);

    return supabase;
  },
};
