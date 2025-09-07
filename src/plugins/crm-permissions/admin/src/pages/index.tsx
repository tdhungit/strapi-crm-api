import { Page } from '@strapi/strapi/admin';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import Departments from './Departments';
import Permissions from './Permissions';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Departments />} />
        <Route path='/departments/:id/permissions' element={<Permissions />} />
      </Route>
      <Route path='*' element={<Page.Error />} />
    </Routes>
  );
};

export default App;
