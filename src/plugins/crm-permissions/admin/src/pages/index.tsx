import { Page } from '@strapi/strapi/admin';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import Permissions from './Permissions';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<Permissions />} />
      </Route>
      <Route path='*' element={<Page.Error />} />
    </Routes>
  );
};

export default App;
