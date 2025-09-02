import {
  Box,
  Main,
  SubNav,
  SubNavLink,
  SubNavSection,
} from '@strapi/design-system';
import { Cog, Database } from '@strapi/icons';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';

export default function Layout() {
  const location = useLocation();

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
                  href='/admin/plugins/ui-settings'
                  className={
                    location.pathname === '/plugins/ui-settings' ? 'active' : ''
                  }
                  icon={<Cog />}
                >
                  System Settings
                </SubNavLink>
                <SubNavLink
                  href='/admin/plugins/ui-settings/audit-logs'
                  className={
                    location.pathname === '/plugins/ui-settings/audit-logs'
                      ? 'active'
                      : ''
                  }
                  icon={<Database />}
                >
                  Audit Logs
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
