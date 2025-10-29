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
                  CRM Settings
                </SubNavLink>
                <SubNavLink
                  className={
                    location.pathname ===
                    '/plugins/ui-settings/ecommerce-site-settings'
                      ? 'active'
                      : ''
                  }
                  icon={<Cog />}
                  onClick={() =>
                    navigation('/plugins/ui-settings/ecommerce-site-settings')
                  }
                >
                  ECommerce Settings
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
                    location.pathname === '/plugins/ui-settings/redis-settings'
                      ? 'active'
                      : ''
                  }
                  icon={<Database />}
                  onClick={() =>
                    navigation('/plugins/ui-settings/redis-settings')
                  }
                >
                  Redis Settings
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
                  Firebase Settings
                </SubNavLink>
                <SubNavLink
                  className={
                    location.pathname ===
                    '/plugins/ui-settings/supabase-settings'
                      ? 'active'
                      : ''
                  }
                  icon={<Database />}
                  onClick={() =>
                    navigation('/plugins/ui-settings/supabase-settings')
                  }
                >
                  Supabase Settings
                </SubNavLink>
                <SubNavLink
                  className={
                    location.pathname === '/plugins/ui-settings/mail-settings'
                      ? 'active'
                      : ''
                  }
                  icon={<Database />}
                  onClick={() =>
                    navigation('/plugins/ui-settings/mail-settings')
                  }
                >
                  Mail Settings
                </SubNavLink>
                <SubNavLink
                  className={
                    location.pathname ===
                    '/plugins/ui-settings/chatbox-settings'
                      ? 'active'
                      : ''
                  }
                  icon={<Database />}
                  onClick={() =>
                    navigation('/plugins/ui-settings/chatbox-settings')
                  }
                >
                  ChatBox Settings
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
