import { useFetchClient } from '@strapi/admin/strapi-admin';
import {
  Box,
  Button,
  Field,
  Flex,
  SingleSelect,
  SingleSelectOption,
  TextInput,
  Typography,
} from '@strapi/design-system';
import { useEffect, useState } from 'react';

const defaultSettings = {
  pageTitle: '',
  pageSubtitle: '',
  favicon: '',
  thirdPartyService: '',
  telecomProvider: '',
};

const SettingsPage = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const fetchClient = useFetchClient();

  // Load current settings
  useEffect(() => {
    setIsLoading(true);
    fetchClient
      .get('/ui-settings/config')
      .then((res) => {
        setSettings(res?.data || defaultSettings);
      })
      .catch((err) => {
        console.error('Error loading settings:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Save settings
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await fetchClient.post('/ui-settings/config', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      <div style={{ marginBottom: 16 }}>
        <Typography variant='beta'>CRM Settings</Typography>
      </div>

      <div style={{ flexDirection: 'column', display: 'flex', gap: 16 }}>
        <Field.Root>
          <Field.Label>Page Title</Field.Label>
          <TextInput
            name='pageTitle'
            placeholder='Page Title'
            value={settings.pageTitle}
            onChange={(e) => handleInputChange('pageTitle', e.target.value)}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Page Subtitle</Field.Label>
          <TextInput
            name='pageSubtitle'
            placeholder='Page Subtitle'
            value={settings.pageSubtitle}
            onChange={(e) => handleInputChange('pageSubtitle', e.target.value)}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Favicon</Field.Label>
          <TextInput
            name='favicon'
            value={settings?.favicon || ''}
            onChange={(e) => handleInputChange('favicon', e.target.value)}
            placeholder='Paste favicon URL or upload below'
          />
          <input
            type='file'
            accept='image/x-icon,image/png,image/jpeg'
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setIsSaving(true);
              const formData = new FormData();
              formData.append('file', file);
              try {
                const uploadRes = await fetchClient.post(
                  '/ui-settings/upload-favicon',
                  formData,
                  {
                    headers: { 'Content-Type': 'multipart/form-data' },
                  },
                );
                handleInputChange('favicon', uploadRes?.data?.url || '');
              } catch (error) {
                console.error('Error uploading favicon:', error);
              } finally {
                setIsSaving(false);
              }
            }}
          />
          {settings.favicon && (
            <Box style={{ marginTop: 8 }}>
              <img
                src={settings.favicon}
                alt='Favicon preview'
                style={{ width: 32, height: 32 }}
              />
            </Box>
          )}
        </Field.Root>

        <Field.Root>
          <Field.Label>Third Party Service (auth & notifications)</Field.Label>
          {settings.thirdPartyService === 'firebase' && (
            <div>
              <Typography variant='pi'>
                Firebase is a third party service that handles authentication
                and notifications. Please configure it in the Firebase console
                and add the configuration to "Firebase Settings".
              </Typography>
            </div>
          )}
          {settings.thirdPartyService === 'supabase' && (
            <div>
              <Typography variant='pi'>
                Supabase is a third party service that handles authentication
                and notifications. Please configure it in the Supabase console
                and add the configuration to "Supabase Settings".
              </Typography>
              <br />
              <Typography variant='pi' color={'red'}>
                Please add <strong>notifications (Enable Realtime)</strong>{' '}
                table to your Supabase database. Please disable RLS or Add
                Policy The table should have the following columns:
                <br />
                <ul style={{ paddingLeft: 16, fontStyle: 'italic' }}>
                  <li>id (uuid, primary key)</li>
                  <li>user_id (number, foreign key to users)</li>
                  <li>title (text)</li>
                  <li>body (text)</li>
                  <li>timestamp (timestamp)</li>
                  <li>pushed (boolean)</li>
                  <li>read (boolean)</li>
                </ul>
              </Typography>
            </div>
          )}
          <SingleSelect
            value={settings.thirdPartyService}
            onValueChange={(value) => {
              setSettings((prev: any) => ({
                ...prev,
                thirdPartyService: value,
              }));
            }}
          >
            <SingleSelectOption value='firebase'>Firebase</SingleSelectOption>
            <SingleSelectOption value='supabase'>Supabase</SingleSelectOption>
          </SingleSelect>
        </Field.Root>

        <Field.Root>
          <Field.Label>Telecom Provider (SMS & Phone Call)</Field.Label>
          <SingleSelect
            value={settings.telecomProvider}
            onValueChange={(value) => {
              setSettings((prev: any) => ({
                ...prev,
                telecomProvider: value,
              }));
            }}
          >
            <SingleSelectOption value=''>None</SingleSelectOption>
            <SingleSelectOption value='twilio'>Twilio</SingleSelectOption>
          </SingleSelect>
        </Field.Root>
      </div>

      <Flex style={{ marginTop: 15, width: '100%' }}>
        <Button
          onClick={handleSave}
          loading={isSaving}
          disabled={isSaving}
          style={{ width: '100%' }}
        >
          Save
        </Button>
      </Flex>
    </Box>
  );
};

export default SettingsPage;
