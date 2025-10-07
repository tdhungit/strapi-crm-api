import {
  Box,
  Button,
  Checkbox,
  Field,
  TextInput,
  Typography,
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { useEffect, useState } from 'react';
import { PaymentMethodType } from '../types';

export default function PaypalSettings() {
  const fetchClient = useFetchClient();
  const { get, post } = fetchClient;

  const [paypalSettings, setPaypalSettings] = useState<PaymentMethodType>({
    name: 'Paypal',
    enabled: false,
    options: {
      sandbox: false,
      clientId: '',
      clientSecret: '',
      sandboxClientId: '',
      sandboxClientSecret: '',
    },
  });

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        const { data } = await get('/payment-methods/find-by-name/paypal');
        setPaypalSettings(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPaymentMethod();
  }, []);

  const onSave = async () => {
    try {
      await post('/payment-methods/save', paypalSettings);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box marginTop={4}>
        <Typography variant='epsilon'>Paypal Settings</Typography>
      </Box>

      <Box marginTop={4} borderColor='gray' padding={4}>
        <Field.Root>
          <Checkbox
            name='enabled'
            checked={paypalSettings.enabled || false}
            onCheckedChange={(e) =>
              setPaypalSettings({ ...paypalSettings, enabled: Boolean(e) })
            }
          >
            Enable Paypal
          </Checkbox>
        </Field.Root>

        <Field.Root marginTop={4}>
          <Checkbox
            name='sandbox'
            checked={paypalSettings.options?.sandbox || false}
            onCheckedChange={(e) =>
              setPaypalSettings({
                ...paypalSettings,
                options: { ...paypalSettings.options, sandbox: Boolean(e) },
              })
            }
          >
            Sandbox Mode
          </Checkbox>
        </Field.Root>
      </Box>

      <Box marginTop={4} padding={4} borderColor='gray'>
        <Typography variant='epsilon'>Sandbox Environment</Typography>

        <Field.Root marginTop={4}>
          <Field.Label>Client ID</Field.Label>
          <TextInput
            placeholder='Client ID'
            name='clientId'
            value={paypalSettings.options?.sandboxClientId || ''}
            onChange={(e) =>
              setPaypalSettings({
                ...paypalSettings,
                options: {
                  ...paypalSettings.options,
                  sandboxClientId: e.target.value,
                },
              })
            }
          />
        </Field.Root>

        <Field.Root marginTop={4}>
          <Field.Label>Client Secret</Field.Label>
          <TextInput
            placeholder='Secret'
            name='secret'
            value={paypalSettings.options?.sandboxClientSecret || ''}
            onChange={(e) =>
              setPaypalSettings({
                ...paypalSettings,
                options: {
                  ...paypalSettings.options,
                  sandboxClientSecret: e.target.value,
                },
              })
            }
          />
        </Field.Root>

        <Field.Root marginTop={4}>
          <Field.Label>Webhook ID</Field.Label>
          <TextInput
            placeholder='Webhook ID'
            name='webhookId'
            value={paypalSettings.options?.sandboxWebhookId || ''}
            onChange={(e) =>
              setPaypalSettings({
                ...paypalSettings,
                options: {
                  ...paypalSettings.options,
                  sandboxWebhookId: e.target.value,
                },
              })
            }
          />
        </Field.Root>
      </Box>

      <Box marginTop={4} padding={4} borderColor='gray'>
        <Typography variant='epsilon'>Production Environment</Typography>

        <Field.Root marginTop={4}>
          <Field.Label>Client ID</Field.Label>
          <TextInput
            placeholder='Client ID'
            name='clientId'
            value={paypalSettings.options?.clientId || ''}
            onChange={(e) =>
              setPaypalSettings({
                ...paypalSettings,
                options: {
                  ...paypalSettings.options,
                  clientId: e.target.value,
                },
              })
            }
          />
        </Field.Root>

        <Field.Root marginTop={4}>
          <Field.Label>Client Secret</Field.Label>
          <TextInput
            placeholder='Client Secret'
            name='clientSecret'
            value={paypalSettings.options?.clientSecret || ''}
            onChange={(e) =>
              setPaypalSettings({
                ...paypalSettings,
                options: {
                  ...paypalSettings.options,
                  clientSecret: e.target.value,
                },
              })
            }
          />
        </Field.Root>

        <Field.Root marginTop={4}>
          <Field.Label>Webhook ID</Field.Label>
          <TextInput
            placeholder='Webhook ID'
            name='webhookId'
            value={paypalSettings.options?.webhookId || ''}
            onChange={(e) =>
              setPaypalSettings({
                ...paypalSettings,
                options: {
                  ...paypalSettings.options,
                  webhookId: e.target.value,
                },
              })
            }
          />
        </Field.Root>
      </Box>

      <Box marginTop={4}>
        <Button variant='secondary' onClick={() => onSave()}>
          Save
        </Button>
      </Box>
    </>
  );
}
