import {
  Box,
  Button,
  Field,
  TextInput,
  Typography,
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { useEffect, useState } from 'react';

export default function MailSettings() {
  const fetchClient = useFetchClient();

  const [settings, setSettings] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchClient.get('/ui-settings/settings/system/mail').then((response) => {
      setSettings(response.data || {});
    });
  }, []);

  const saveSettings = () => {
    setIsSaving(true);
    fetchClient
      .post('/ui-settings/settings/system/mail', {
        value: settings,
      })
      .then((response) => {
        setSettings(response.data?.mail || {});
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
      <Typography variant='epsilon'>Mail Configuration</Typography>

      <Box
        marginTop={4}
        style={{ flexDirection: 'column', display: 'flex', gap: 16 }}
      >
        <Field.Root>
          <Field.Label>Send From Email</Field.Label>
          <TextInput
            placeholder='Enter send mail from'
            name='from'
            value={settings.from || ''}
            onChange={(e) => {
              setSettings((prev) => ({
                ...prev,
                from: e.target.value,
              }));
            }}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label>Reply To</Field.Label>
          <TextInput
            placeholder='Enter reply to'
            name='replyTo'
            value={settings.replyTo || ''}
            onChange={(e) => {
              setSettings((prev) => ({
                ...prev,
                replyTo: e.target.value,
              }));
            }}
          />
        </Field.Root>
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
