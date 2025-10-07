import { Box, Button, Checkbox, Typography } from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { useEffect, useState } from 'react';

export default function CODSettings() {
  const fetchClient = useFetchClient();
  const { get, post } = fetchClient;

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        const { data } = await get('/payment-methods/find-by-name/COD');
        setEnabled(data.enabled);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPaymentMethod();
  }, []);

  const onSave = async () => {
    try {
      await post('/payment-methods/save', {
        name: 'COD',
        enabled,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box>
        <Typography variant='epsilon'>COD Settings</Typography>
      </Box>

      <Box marginTop={4} borderColor='gray' padding={4}>
        <Checkbox
          checked={enabled}
          onCheckedChange={() => {
            setEnabled(!enabled);
          }}
        >
          Enable COD
        </Checkbox>
      </Box>

      <Box marginTop={4}>
        <Button variant='secondary' onClick={() => onSave()}>
          Save
        </Button>
      </Box>
    </>
  );
}
