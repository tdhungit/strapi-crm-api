import { useFetchClient } from '@strapi/admin/strapi-admin';
import {
  Box,
  Button,
  Field,
  Textarea,
  TextInput,
  Typography,
} from '@strapi/design-system';
import { useEffect, useState } from 'react';

export default function ChatBoxSettings() {
  const fetchClient = useFetchClient();

  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    if (!fetchClient) {
      return;
    }

    fetchClient.get('/ui-settings/settings/system/chatbox').then((res) => {
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

  const handleSave = () => {
    if (!fetchClient) {
      return;
    }

    fetchClient
      .post('/ui-settings/settings/system/chatbox', {
        value: settings,
      })
      .then((res) => {
        setSettings(res.data?.chatbox || {});
      });
  };

  return (
    <div>
      <Typography variant='epsilon'>ChatBox Settings</Typography>

      <Box
        marginTop={4}
        style={{ flexDirection: 'column', display: 'flex', gap: 16 }}
      >
        <Box
          padding={4}
          borderRadius={2}
          borderColor={'#ccc'}
          style={{ flexDirection: 'column', display: 'flex', gap: 16 }}
        >
          <Typography variant='epsilon'>ChatBox for CRM</Typography>

          <Field.Root>
            <Field.Label>n8n chat webhook</Field.Label>
            <TextInput
              placeholder='Enter your n8n chat webhook'
              name='n8nCRMWebhook'
              value={settings.n8nCRMWebhook || ''}
              onChange={handleInputChange}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Or ChatBox Script</Field.Label>
            <Textarea
              placeholder='Enter your chat box script'
              name='CRMScript'
              value={settings.CRMScript || ''}
              onChange={handleInputChange}
            />
          </Field.Root>
        </Box>

        <Box
          padding={4}
          borderRadius={2}
          borderColor={'#ccc'}
          style={{ flexDirection: 'column', display: 'flex', gap: 16 }}
        >
          <Typography variant='epsilon'>ChatBox for E-Commerce</Typography>

          <Field.Root>
            <Field.Label>n8n chat webhook</Field.Label>
            <TextInput
              placeholder='Enter your n8n chat webhook'
              name='n8nECommerceWebhook'
              value={settings.n8nECommerceWebhook || ''}
              onChange={handleInputChange}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Or ChatBox E-Commerce Script</Field.Label>
            <Textarea
              placeholder='Enter your chat box e-commerce script'
              name='ECommerceScript'
              value={settings.ECommerceScript || ''}
              onChange={handleInputChange}
            />
          </Field.Root>
        </Box>

        <Button onClick={handleSave} marginTop={4}>
          Save
        </Button>
      </Box>
    </div>
  );
}
