import { Box, Typography } from '@strapi/design-system';

export const Header = () => {
  return (
    <Box marginBottom={4}>
      <Typography variant='alpha'>CRM Settings</Typography>
      <Typography
        variant='epsilon'
        style={{ paddingLeft: 10, fontStyle: 'italic' }}
      >
        Configure your CRM.
      </Typography>
    </Box>
  );
};
``;
