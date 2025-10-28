import { useFetchClient } from '@strapi/admin/strapi-admin';
import {
  Box,
  Button,
  Field,
  TextInput,
  Typography,
} from '@strapi/design-system';
import React, { useEffect, useState } from 'react';

export default function SupabaseSettings() {
  const fetchClient = useFetchClient();

  const [settings, setSettings] = useState<any>({});

  // Load current settings
  useEffect(() => {
    if (!fetchClient) {
      return;
    }

    fetchClient.get('/ui-settings/settings/system/supabase').then((res) => {
      setSettings(res.data || {});
    });
  }, [fetchClient]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSettings((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    fetchClient
      .post('/ui-settings/settings/system/supabase', {
        value: settings,
      })
      .then((res) => {
        setSettings(res.data?.supabase || {});
      });
  };

  return (
    <div>
      <Typography variant='beta'>Supabase Configuration</Typography>
      <Box
        marginTop={4}
        style={{ flexDirection: 'column', display: 'flex', gap: 16 }}
      >
        <Field.Root>
          <Field.Label>Url</Field.Label>
          <TextInput
            placeholder='Enter your url'
            name='url'
            value={settings.url || ''}
            onChange={handleInputChange}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Api Key</Field.Label>
          <TextInput
            placeholder='Enter your api key'
            name='apiKey'
            value={settings.apiKey || ''}
            onChange={handleInputChange}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Publishable key</Field.Label>
          <TextInput
            placeholder='Enter your publishable key'
            name='publishableKey'
            value={settings.publishableKey || ''}
            onChange={handleInputChange}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Secret key</Field.Label>
          <TextInput
            placeholder='Enter your secret key'
            name='secretKey'
            value={settings.secretKey || ''}
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
