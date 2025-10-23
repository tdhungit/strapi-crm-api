import { Page } from '@strapi/strapi/admin';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import AuditLogsSettingPage from './AuditLogsSettingPage';
import ChatBoxSettings from './ChatboxSettings';
import FirebaseSettings from './FirebaseSettings';
import ImportAddressData from './ImportAddressData';
import MailSettings from './MailSettings';
import RedisSettings from './RedisSettings';
import SettingsPage from './SettingsPage';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<SettingsPage />} />
        <Route path='/audit-logs' element={<AuditLogsSettingPage />} />
        <Route path='/import-address-data' element={<ImportAddressData />} />
        <Route path='/firebase-config' element={<FirebaseSettings />} />
        <Route path='/mail-settings' element={<MailSettings />} />
        <Route path='/redis-settings' element={<RedisSettings />} />
        <Route path='/chatbox-settings' element={<ChatBoxSettings />} />
      </Route>
      <Route path='*' element={<Page.Error />} />
    </Routes>
  );
};

export default App;
