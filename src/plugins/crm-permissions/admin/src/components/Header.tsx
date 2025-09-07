import { Box, Typography } from '@strapi/design-system';
import React from 'react';

export const Header = () => {
  return (
    <Box marginBottom={4}>
      <Typography variant='alpha'>CRM Permissions</Typography>
      <Typography
        variant='epsilon'
        style={{ paddingLeft: 10, fontStyle: 'italic' }}
      >
        Manage your CRM permissions settings here.
      </Typography>
    </Box>
  );
};
