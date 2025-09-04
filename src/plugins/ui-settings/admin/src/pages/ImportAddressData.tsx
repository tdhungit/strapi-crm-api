import { Box, Button, Status, Typography } from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { useEffect, useState } from 'react';

export default function ImportAddressData() {
  const { post, get } = useFetchClient();

  const [isLoading, setIsLoading] = useState(false);
  const [addressStatistics, setAddressStatistics] = useState<any>({});

  const fetchAddressStatistics = async () => {
    try {
      const res = await get('/ui-settings/addresses/statistics');
      setAddressStatistics(res.data);
    } catch (error) {
      console.error('Error fetching address statistics:', error);
    }
  };

  useEffect(() => {
    fetchAddressStatistics();
  }, []);

  const handleImportAddressData = async () => {
    setIsLoading(true);
    try {
      await post('/ui-settings/addresses/import-address-data');
    } catch (error) {
      console.error('Error importing address data:', error);
    } finally {
      await fetchAddressStatistics();
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Typography fontSize={24}>Import/Update Address Data</Typography>

      <Box marginTop={4}>
        <Typography variant='delta' fontWeight='bold'>
          Address Statistics
        </Typography>

        <Box marginTop={2}>
          <Status variant='success'>
            Countries: {addressStatistics?.countryCount}
          </Status>
        </Box>
        <Box marginTop={2}>
          <Status variant='success'>
            States: {addressStatistics?.stateCount}
          </Status>
        </Box>
        <Box marginTop={2}>
          <Status variant='success'>
            Cities: {addressStatistics?.cityCount}
          </Status>
        </Box>
      </Box>

      <Box marginTop={4}>
        <Button onClick={handleImportAddressData} loading={isLoading}>
          Import Address Data
        </Button>
      </Box>
    </div>
  );
}
