import {
  Box,
  Main,
  SubNav,
  SubNavLink,
  SubNavSection,
} from '@strapi/design-system';
import { Briefcase } from '@strapi/icons';
import React from 'react';
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
                    location.pathname === '/plugins/crm-permissions'
                      ? 'active'
                      : ''
                  }
                  onClick={() => navigation('/plugins/crm-permissions')}
                  icon={<Briefcase />}
                >
                  Departments
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
