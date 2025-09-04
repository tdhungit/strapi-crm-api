import { Page } from '@strapi/strapi/admin';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import AuditLogsSettingPage from './AuditLogsSettingPage';
import ImportAddressData from './ImportAddressData';
import SettingsPage from './SettingsPage';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<SettingsPage />} />
        <Route path='/audit-logs' element={<AuditLogsSettingPage />} />
        <Route path='/import-address-data' element={<ImportAddressData />} />
      </Route>
      <Route path='*' element={<Page.Error />} />
    </Routes>
  );
};

export default App;
