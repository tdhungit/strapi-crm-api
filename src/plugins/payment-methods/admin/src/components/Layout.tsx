import {
  Box,
  Main,
  SubNav,
  SubNavLink,
  SubNavSection,
} from '@strapi/design-system';
import { Database } from '@strapi/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './Header';

export default function Layout() {
  const location = useLocation();
  const navigation = useNavigate();

  return (
    <Main>
      <Box
        padding={8}
        background='neutral0'
        shadow='tableShadow'
        hasRadius
        width='100%'
        height='100%'
      >
        <Header />

        <Box>
          <div style={{ display: 'flex' }}>
            <SubNav style={{ height: 'calc(100vh - 160px)' }}>
              <SubNavSection label='Payment Methods'>
                <SubNavLink
                  className={
                    location.pathname === '/plugins/payment-methods'
                      ? 'active'
                      : ''
                  }
                  icon={<Database />}
                  onClick={() => navigation('/plugins/payment-methods')}
                >
                  COD Settings
                </SubNavLink>
                <SubNavLink
                  className={
                    location.pathname === '/plugins/payment-methods/paypal'
                      ? 'active'
                      : ''
                  }
                  icon={<Database />}
                  onClick={() => navigation('/plugins/payment-methods/paypal')}
                >
                  Paypal Settings
                </SubNavLink>
                <SubNavLink
                  className={
                    location.pathname === '/plugins/payment-methods/stripe'
                      ? 'active'
                      : ''
                  }
                  icon={<Database />}
                  onClick={() => navigation('/plugins/payment-methods/stripe')}
                >
                  Stripe Settings
                </SubNavLink>
              </SubNavSection>
            </SubNav>
            <Box marginLeft={4} width='100%'>
              <Outlet />
            </Box>
          </div>
        </Box>
      </Box>
    </Main>
  );
}
