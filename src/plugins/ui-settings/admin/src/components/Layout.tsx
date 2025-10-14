import {
  Box,
  Main,
  SubNav,
  SubNavLink,
  SubNavSection,
} from '@strapi/design-system';
import { Cog, Database } from '@strapi/icons';
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
              <SubNavSection label='Global Settings'>
                <SubNavLink
                  className={
                    location.pathname === '/plugins/ui-settings' ? 'active' : ''
                  }
                  icon={<Cog />}
                  onClick={() => navigation('/plugins/ui-settings')}
                >
                  System Settings
                </SubNavLink>
                <SubNavLink
                  className={
                    location.pathname === '/plugins/ui-settings/audit-logs'
                      ? 'active'
                      : ''
                  }
                  icon={<Database />}
                  onClick={() => navigation('/plugins/ui-settings/audit-logs')}
                >
                  Audit Logs
                </SubNavLink>
                <SubNavLink
                  className={
                    location.pathname ===
                    '/plugins/ui-settings/import-address-data'
                      ? 'active'
                      : ''
                  }
                  icon={<Database />}
                  onClick={() =>
                    navigation('/plugins/ui-settings/import-address-data')
                  }
                >
                  Address Data
                </SubNavLink>
                <SubNavLink
                  className={
                    location.pathname === '/plugins/ui-settings/firebase-config'
                      ? 'active'
                      : ''
                  }
                  icon={<Database />}
                  onClick={() =>
                    navigation('/plugins/ui-settings/firebase-config')
                  }
                >
                  Firebase Config
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
