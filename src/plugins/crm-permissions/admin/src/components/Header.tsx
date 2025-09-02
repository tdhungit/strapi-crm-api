import { Box, Typography } from '@strapi/design-system';

export const Header = () => {
  return (
    <Box marginBottom={4}>
      <Typography variant='alpha' as='h1'>
        CRM Permissions
      </Typography>
      <Typography variant='epsilon' as='p'>
        Manage your CRM permissions settings here.
      </Typography>
    </Box>
  );
};
``;
