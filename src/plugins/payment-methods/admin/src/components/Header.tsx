import { Box, Typography } from '@strapi/design-system';

export const Header = () => {
  return (
    <Box marginBottom={4}>
      <Typography variant='alpha'>Payment Methods Settings</Typography>
      <Typography
        variant='epsilon'
        style={{ paddingLeft: 10, fontStyle: 'italic' }}
      >
        Configure your payment methods.
      </Typography>
    </Box>
  );
};
