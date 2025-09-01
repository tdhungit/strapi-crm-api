import { Box, Typography } from '@strapi/design-system';

export const Header = () => {
  return (
    <Box marginBottom={4}>
      <Typography variant='alpha' as='h1'>
        UI Settings
      </Typography>
      <Typography variant='epsilon' as='p'>
        Configure your UI settings.
      </Typography>
    </Box>
  );
};
``;
