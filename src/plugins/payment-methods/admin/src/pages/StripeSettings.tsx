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

export default function StripeSettings() {
  const fetchClient = useFetchClient();
  const { get, post } = fetchClient;

  const [isSaving, setIsSaving] = useState(false);
  const [stripeSettings, setStripeSettings] = useState<PaymentMethodType>({
    name: 'stripe',
    enabled: false,
    description: 'Stripe',
    options: {
      testMode: false,
      apiKey: '',
      apiSecret: '',
      webhookUrl: '',
      webhookSecret: '',
      testApiKey: '',
      testApiSecret: '',
      testWebhookUrl: '',
      testWebhookSecret: '',
    },
  });

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        const { data } = await get('/payment-methods/find-by-name/stripe');
        setStripeSettings(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPaymentMethod();
  }, []);

  const onStripeSave = async () => {
    console.log('Stripe settings saved', stripeSettings);
    setIsSaving(true);
    try {
      await post('/payment-methods/save', stripeSettings);
      setIsSaving(false);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  return (
    <>
      <Box marginTop={4}>
        <Typography variant='epsilon'>Stripe Settings</Typography>
      </Box>

      <Box marginTop={4} padding={4} borderColor='gray'>
        <Field.Root>
          <Checkbox
            name='stripeEnabled'
            checked={stripeSettings.enabled}
            onCheckedChange={(e) =>
              setStripeSettings({ ...stripeSettings, enabled: Boolean(e) })
            }
          >
            Enable Stripe
          </Checkbox>
        </Field.Root>

        <Field.Root marginTop={4}>
          <Checkbox
            name='stripeTestMode'
            checked={stripeSettings.options?.testMode}
            onCheckedChange={(e) =>
              setStripeSettings({
                ...stripeSettings,
                options: { ...stripeSettings.options, testMode: Boolean(e) },
              })
            }
          >
            Enable Test Mode
          </Checkbox>
        </Field.Root>

        <Field.Root marginTop={4}>
          <Field.Label>Description</Field.Label>
          <TextInput
            placeholder='Description'
            name='description'
            value={stripeSettings.description || ''}
            onChange={(e) =>
              setStripeSettings({
                ...stripeSettings,
                description: e.target.value,
              })
            }
          />
        </Field.Root>
      </Box>

      <Box marginTop={4} padding={4} borderColor='gray'>
        <Typography variant='epsilon'>Stripe Settings (Test Mode)</Typography>

        <Field.Root marginTop={4}>
          <Field.Label>Stripe API Key</Field.Label>
          <TextInput
            name='stripeKey'
            value={stripeSettings.options?.testApiKey}
            onChange={(e) =>
              setStripeSettings({
                ...stripeSettings,
                options: {
                  ...stripeSettings.options,
                  testApiKey: e.target.value,
                },
              })
            }
          />
        </Field.Root>

        <Field.Root marginTop={4}>
          <Field.Label>Stripe Secret Key</Field.Label>
          <TextInput
            name='stripeSecretKey'
            value={stripeSettings.options?.testSecretKey}
            onChange={(e) =>
              setStripeSettings({
                ...stripeSettings,
                options: {
                  ...stripeSettings.options,
                  testSecretKey: e.target.value,
                },
              })
            }
          />
        </Field.Root>

        <Field.Root marginTop={4}>
          <Field.Label>Stripe Webhook URL</Field.Label>
          <TextInput
            name='stripeWebhookUrl'
            value={stripeSettings.options?.testWebhookUrl}
            onChange={(e) =>
              setStripeSettings({
                ...stripeSettings,
                options: {
                  ...stripeSettings.options,
                  testWebhookUrl: e.target.value,
                },
              })
            }
          />
        </Field.Root>

        <Field.Root marginTop={4}>
          <Field.Label>Stripe Webhook Secret</Field.Label>
          <TextInput
            name='stripeWebhookSecret'
            value={stripeSettings.options?.testWebhookSecret}
            onChange={(e) =>
              setStripeSettings({
                ...stripeSettings,
                options: {
                  ...stripeSettings.options,
                  testWebhookSecret: e.target.value,
                },
              })
            }
          />
        </Field.Root>
      </Box>

      <Box marginTop={4} padding={4} borderColor='gray'>
        <Typography variant='epsilon'>Stripe Settings (Live Mode)</Typography>

        <Field.Root marginTop={4}>
          <Field.Label>Stripe API Key</Field.Label>
          <TextInput
            name='stripeKey'
            value={stripeSettings.options?.apiKey}
            onChange={(e) =>
              setStripeSettings({
                ...stripeSettings,
                options: {
                  ...stripeSettings.options,
                  apiKey: e.target.value,
                },
              })
            }
          />
        </Field.Root>

        <Field.Root marginTop={4}>
          <Field.Label>Stripe Secret Key</Field.Label>
          <TextInput
            name='stripeSecret'
            value={stripeSettings.options?.apiSecret}
            onChange={(e) =>
              setStripeSettings({
                ...stripeSettings,
                options: {
                  ...stripeSettings.options,
                  apiSecret: e.target.value,
                },
              })
            }
          />
        </Field.Root>

        <Field.Root marginTop={4}>
          <Field.Label>Stripe Webhook URL</Field.Label>
          <TextInput
            name='stripeWebhookUrl'
            value={stripeSettings.options?.webhookUrl}
            onChange={(e) =>
              setStripeSettings({
                ...stripeSettings,
                options: {
                  ...stripeSettings.options,
                  webhookUrl: e.target.value,
                },
              })
            }
          />
        </Field.Root>

        <Field.Root marginTop={4}>
          <Field.Label>Stripe Webhook Secret</Field.Label>
          <TextInput
            name='stripeWebhookSecret'
            value={stripeSettings.options?.webhookSecret}
            onChange={(e) =>
              setStripeSettings({
                ...stripeSettings,
                options: {
                  ...stripeSettings.options,
                  webhookSecret: e.target.value,
                },
              })
            }
          />
        </Field.Root>
      </Box>

      <Box marginTop={4}>
        <Button
          variant='secondary'
          onClick={() => onStripeSave()}
          disabled={isSaving}
        >
          Save
        </Button>
      </Box>
    </>
  );
}
