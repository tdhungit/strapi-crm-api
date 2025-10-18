import { useFetchClient } from '@strapi/admin/strapi-admin';
import {
  Box,
  Button,
  Field,
  TextInput,
  Typography,
} from '@strapi/design-system';
import { useEffect, useState } from 'react';

export default function FirebaseSettings() {
  const fetchClient = useFetchClient();

  const [settings, setSettings] = useState<any>({});

  // Load current settings
  useEffect(() => {
    if (!fetchClient) {
      return;
    }

    fetchClient.get('/ui-settings/settings/system/firebase').then((res) => {
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
      .post('/ui-settings/settings/system/firebase', {
        value: settings,
      })
      .then((res) => {
        setSettings(res.data?.firebase || {});
      });
  };

  return (
    <div>
      <Typography variant='epsilon'>Firebase Configuration</Typography>
      <Box
        marginTop={4}
        style={{ flexDirection: 'column', display: 'flex', gap: 16 }}
      >
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
          <Field.Label>Auth Domain</Field.Label>
          <TextInput
            placeholder='Enter your auth domain'
            name='authDomain'
            value={settings.authDomain || ''}
            onChange={handleInputChange}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Project Id</Field.Label>
          <TextInput
            placeholder='Enter your project id'
            name='projectId'
            value={settings.projectId || ''}
            onChange={handleInputChange}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Storage Bucket</Field.Label>
          <TextInput
            placeholder='Enter your storage bucket'
            name='storageBucket'
            value={settings.storageBucket || ''}
            onChange={handleInputChange}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Messaging Sender Id</Field.Label>
          <TextInput
            placeholder='Enter your messaging sender id'
            name='messagingSenderId'
            value={settings.messagingSenderId || ''}
            onChange={handleInputChange}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>App Id</Field.Label>
          <TextInput
            placeholder='Enter your app id'
            name='appId'
            value={settings.appId || ''}
            onChange={handleInputChange}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Measurement Id</Field.Label>
          <TextInput
            placeholder='Enter your measurement id'
            name='measurementId'
            value={settings.measurementId || ''}
            onChange={handleInputChange}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Service Account Json</Field.Label>
          <TextInput
            placeholder='Your service account json'
            name='serviceAccountJson'
            value={settings.serviceAccountJson || ''}
            readOnly
          />
          <input
            type='file'
            accept='.json'
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.append('file', file);
              try {
                const uploadRes: any = await fetchClient.post(
                  '/ui-settings/settings/upload',
                  formData,
                  {
                    headers: { 'Content-Type': 'multipart/form-data' },
                  },
                );
                setSettings((prev) => ({
                  ...prev,
                  serviceAccountJson: uploadRes.data.path,
                }));
              } catch (error) {
                console.error('Error uploading favicon:', error);
              }
            }}
          />
        </Field.Root>
        <Button onClick={handleSave} marginTop={4}>
          Save
        </Button>
      </Box>
    </div>
  );
}
