import { useFetchClient } from '@strapi/admin/strapi-admin';
import {
  Box,
  Button,
  Field,
  TextInput,
  Typography,
} from '@strapi/design-system';
import { useEffect, useState } from 'react';

export default function RedisSettings() {
  const fetchClient = useFetchClient();

  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    if (!fetchClient) {
      return;
    }

    fetchClient.get('/ui-settings/settings/system/redis').then((res) => {
      setSettings(res.data || {});
    });
  }, [fetchClient]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    fetchClient
      .post('/ui-settings/settings/system/redis', {
        value: settings,
      })
      .then((res) => {
        setSettings(res.data?.redis || {});
      });
  };

  return (
    <div>
      <Typography variant='epsilon'>Redis Configuration</Typography>
      <Box
        marginTop={4}
        style={{ flexDirection: 'column', display: 'flex', gap: 16 }}
      >
        <Field.Root>
          <Field.Label>Redis URL</Field.Label>
          <TextInput
            placeholder='Enter your redis url'
            name='url'
            value={settings.url || ''}
            onChange={handleInputChange}
          />
        </Field.Root>
        <Button onClick={handleSave} marginTop={4}>
          Save
        </Button>
      </Box>
    </div>
  );
}
