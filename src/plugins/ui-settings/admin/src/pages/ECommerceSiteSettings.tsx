import {
  Box,
  Button,
  Field,
  SingleSelect,
  SingleSelectOption,
  Typography,
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import React, { useEffect, useState } from 'react';

export default function ECommerceSiteSettings() {
  const [settings, setSettings] = useState({
    authService: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchClient = useFetchClient();

  useEffect(() => {
    fetchClient
      .get('/ui-settings/settings/system/ecommerce')
      .then((response) => {
        setSettings(response.data || {});
      });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setSettings((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveSettings = () => {
    setIsSaving(true);
    fetchClient
      .post('/ui-settings/settings/system/ecommerce', {
        value: settings,
      })
      .then((response) => {
        setSettings(response.data?.ecommerce || {});
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <div>
      <Typography variant='beta'>ECommerce Site Configuration</Typography>

      <Box
        style={{ flexDirection: 'column', display: 'flex', gap: 16 }}
        marginTop={4}
      >
        <Box
          borderColor={'gray'}
          borderRadius={2}
          padding={4}
          style={{ flexDirection: 'column', display: 'flex', gap: 16 }}
        >
          <Typography variant='epsilon'>Authentication</Typography>
          <Field.Root>
            <Field.Label>Authentication Service</Field.Label>
            <SingleSelect
              value={settings.authService}
              onValueChange={(value) => {
                setSettings((prev: any) => ({
                  ...prev,
                  authService: value,
                }));
              }}
            >
              <SingleSelectOption value='firebase'>Firebase</SingleSelectOption>
              <SingleSelectOption value='supabase'>Supabase</SingleSelectOption>
            </SingleSelect>
          </Field.Root>
        </Box>
        <Button
          variant='default'
          type='button'
          disabled={isSaving}
          onClick={saveSettings}
        >
          Save
        </Button>
      </Box>
    </div>
  );
}
