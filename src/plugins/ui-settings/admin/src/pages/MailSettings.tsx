import {
  Box,
  Button,
  Field,
  SingleSelect,
  SingleSelectOption,
  TextInput,
  Typography,
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { useEffect, useState } from 'react';

export default function MailSettings() {
  const fetchClient = useFetchClient();

  const [mailServices, setMailServices] = useState<any>([]);
  const [settings, setSettings] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchClient.get('/ui-settings/settings/system/mail').then((response) => {
      setSettings(response.data || {});
    });

    fetchClient.get('/ui-settings/mail-services').then((response) => {
      setMailServices(response.data || []);
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
      <Box style={{ flexDirection: 'column', display: 'flex', gap: 16 }}>
        <Typography variant='beta'>Mail Configuration</Typography>

        <Box
          borderColor={'gray'}
          borderRadius={2}
          padding={4}
          style={{ flexDirection: 'column', display: 'flex', gap: 16 }}
        >
          <Field.Root>
            <Field.Label>Send From Email</Field.Label>
            <TextInput
              placeholder='Enter send mail from'
              name='from'
              value={settings.from || ''}
              onChange={(e) => {
                setSettings((prev: any) => ({
                  ...prev,
                  from: e.target.value,
                }));
              }}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Send From Name</Field.Label>
            <TextInput
              placeholder='Enter send mail from name'
              name='fromName'
              value={settings.fromName || ''}
              onChange={(e) => {
                setSettings((prev: any) => ({
                  ...prev,
                  fromName: e.target.value,
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
                setSettings((prev: any) => ({
                  ...prev,
                  replyTo: e.target.value,
                }));
              }}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Reply To Name</Field.Label>
            <TextInput
              placeholder='Enter reply to name'
              name='replyToName'
              value={settings.replyToName || ''}
              onChange={(e) => {
                setSettings((prev: any) => ({
                  ...prev,
                  replyToName: e.target.value,
                }));
              }}
            />
          </Field.Root>
        </Box>

        <Typography variant='epsilon'>Mail Service Configuration</Typography>

        <Box
          borderColor={'gray'}
          borderRadius={2}
          padding={4}
          style={{ flexDirection: 'column', display: 'flex', gap: 16 }}
        >
          <Field.Root>
            <Field.Label>Mail Service</Field.Label>
            <SingleSelect
              value={settings.service || ''}
              onValueChange={(value) => {
                setSettings((prev: any) => ({
                  ...prev,
                  service: value,
                }));
              }}
            >
              {mailServices.map((service: any) => (
                <SingleSelectOption key={service.value} value={service.value}>
                  {service.name}
                </SingleSelectOption>
              ))}
            </SingleSelect>
          </Field.Root>
          {settings.service === 'SendGrid' && (
            <>
              <Field.Root>
                <Field.Label>SendGrid API Key</Field.Label>
                <TextInput
                  placeholder='Enter send grid api key'
                  name='apiKey'
                  value={settings.SendGrid?.apiKey || ''}
                  onChange={(e) => {
                    setSettings((prev: any) => ({
                      ...prev,
                      SendGrid: {
                        ...(prev.SendGrid || {}),
                        apiKey: e.target.value,
                      },
                    }));
                  }}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>SendGrid Template ID</Field.Label>
                <TextInput
                  placeholder='Enter send grid template id'
                  name='templateId'
                  value={settings.SendGrid?.templateId || ''}
                  onChange={(e) => {
                    setSettings((prev: any) => ({
                      ...prev,
                      SendGrid: {
                        ...(prev.SendGrid || {}),
                        templateId: e.target.value,
                      },
                    }));
                  }}
                />
              </Field.Root>
            </>
          )}
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
