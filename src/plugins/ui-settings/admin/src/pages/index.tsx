import { Page } from '@strapi/strapi/admin';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import AuditLogsSettingPage from './AuditLogsSettingPage';
import ChatBoxSettings from './ChatBoxSettings';
import ECommerceSiteSettings from './ECommerceSiteSettings';
import FirebaseSettings from './FirebaseSettings';
import ImportAddressData from './ImportAddressData';
import MailSettings from './MailSettings';
import RedisSettings from './RedisSettings';
import SettingsPage from './SettingsPage';
import SupabaseSettings from './SupabaseSettings';
import TwilioSettings from './TwilioSettings';
import WebhookSettings from './WebhookSettings';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<SettingsPage />} />
        <Route
          path='/ecommerce-site-settings'
          element={<ECommerceSiteSettings />}
        />
        <Route path='/audit-logs' element={<AuditLogsSettingPage />} />
        <Route path='/import-address-data' element={<ImportAddressData />} />
        <Route path='/firebase-config' element={<FirebaseSettings />} />
        <Route path='/mail-settings' element={<MailSettings />} />
        <Route path='/redis-settings' element={<RedisSettings />} />
        <Route path='/chatbox-settings' element={<ChatBoxSettings />} />
        <Route path='/supabase-settings' element={<SupabaseSettings />} />
        <Route path='/twilio-settings' element={<TwilioSettings />} />
        <Route path='/webhook-settings' element={<WebhookSettings />} />
      </Route>
      <Route path='*' element={<Page.Error />} />
    </Routes>
  );
};

export default App;
