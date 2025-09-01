// @ts-nocheck
import { Page } from '@strapi/strapi/admin';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import SettingsPage from './SettingsPage';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<SettingsPage />} />
      </Route>
      <Route path='*' element={<Page.Error />} />
    </Routes>
  );
};

export default App;
