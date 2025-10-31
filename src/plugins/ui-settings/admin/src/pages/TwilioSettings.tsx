import { useFetchClient } from '@strapi/admin/strapi-admin';
import {
  Box,
  Button,
  Field,
  TextInput,
  Typography,
} from '@strapi/design-system';
import { useEffect, useState } from 'react';

export default function TwilioSettings() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const fetchClient = useFetchClient();

  useEffect(() => {
    fetchClient
      .get('/ui-settings/settings/system/twilio')
      .then((response) => {
        setSettings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Twilio settings:', error);
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    fetchClient
      .post('/ui-settings/settings/system/twilio', {
        value: settings,
      })
      .then((response: any) => {
        setSettings(response.data?.twilio);
      })
      .catch((error) => {
        console.error('Error saving Twilio settings:', error);
      });
    setLoading(false);
  };

  return (
    <div>
      <Typography variant='beta'>Twilio Settings</Typography>

      <Box
        padding={4}
        background='neutral0'
        shadow='filterShadow'
        borderRadius={2}
        style={{ flexDirection: 'column', display: 'flex', gap: 16 }}
      >
        <Field.Root>
          <Field.Label>Account SID</Field.Label>
          <TextInput
            type='text'
            name='accountSid'
            value={settings.accountSid || ''}
            onChange={(e) => {
              setSettings({ ...settings, accountSid: e.target.value });
            }}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Auth Token</Field.Label>
          <TextInput
            type='password'
            name='authToken'
            value={settings.authToken || ''}
            onChange={(e) => {
              setSettings({ ...settings, authToken: e.target.value });
            }}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Phone Number</Field.Label>
          <TextInput
            type='text'
            name='phoneNumber'
            value={settings.phoneNumber || ''}
            onChange={(e) => {
              setSettings({ ...settings, phoneNumber: e.target.value });
            }}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>API Key</Field.Label>
          <TextInput
            type='text'
            name='apiKey'
            value={settings.apiKey || ''}
            onChange={(e) => {
              setSettings({ ...settings, apiKey: e.target.value });
            }}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>API Secret</Field.Label>
          <TextInput
            type='text'
            name='apiSecret'
            value={settings.apiSecret || ''}
            onChange={(e) => {
              setSettings({ ...settings, apiSecret: e.target.value });
            }}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>TWIML SID</Field.Label>
          <TextInput
            type='text'
            name='twimlSid'
            value={settings.twimlSid || ''}
            onChange={(e) => {
              setSettings({ ...settings, twimlSid: e.target.value });
            }}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Workspace SID</Field.Label>
          <TextInput
            type='text'
            name='workspaceSid'
            value={settings.workspaceSid || ''}
            onChange={(e) => {
              setSettings({ ...settings, workspaceSid: e.target.value });
            }}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Workflow SID</Field.Label>
          <TextInput
            type='text'
            name='workflowSid'
            value={settings.workflowSid || ''}
            onChange={(e) => {
              setSettings({ ...settings, workflowSid: e.target.value });
            }}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Post Work Activity SID</Field.Label>
          <TextInput
            type='text'
            name='postWorkActivitySid'
            value={settings.postWorkActivitySid || ''}
            onChange={(e) => {
              setSettings({ ...settings, postWorkActivitySid: e.target.value });
            }}
          />
        </Field.Root>

        <Button type='button' disabled={loading} onClick={handleSave}>
          Save
        </Button>
      </Box>
    </div>
  );
}
