import { Page } from '@strapi/strapi/admin';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import CODSettings from './CODSettings';
import PaypalSettings from './PaypalSettings';
import StripeSettings from './StripeSettings';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<CODSettings />} />
        <Route path='/paypal' element={<PaypalSettings />} />
        <Route path='/stripe' element={<StripeSettings />} />
      </Route>
      <Route path='*' element={<Page.Error />} />
    </Routes>
  );
};

export default App;
