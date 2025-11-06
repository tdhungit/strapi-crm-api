import { useFetchClient } from '@strapi/admin/strapi-admin';
import {
  Box,
  Button,
  Dialog,
  Field,
  SingleSelect,
  SingleSelectOption,
  TFooter,
  Table,
  Tbody,
  Td,
  TextInput,
  Th,
  Thead,
  Tr,
  Typography,
} from '@strapi/design-system';
import { Plus } from '@strapi/icons';
import { useEffect, useState } from 'react';

interface AlertType {
  type?: string;
  title: string;
  message: string;
}

export default function WebhookSettings() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [openWebhookForm, setOpenWebhookForm] = useState(false);
  const [webhookData, setWebhookData] = useState<any | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<AlertType | null>(null);

  const ROW_COUNT = 5;
  const COL_COUNT = 10;

  const fetchClient = useFetchClient();

  useEffect(() => {
    const fetchWebhooks = async () => {
      const { data } = await fetchClient.get('/ui-settings/webhooks');
      setWebhooks(data);
    };
    fetchWebhooks();
  }, [refresh]);

  const handleInputChange = (field: string, value: any) => {
    setWebhookData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (!webhookData.id) {
        await fetchClient.post('/ui-settings/webhooks', webhookData);
      } else {
        await fetchClient.put(
          `/ui-settings/webhooks/${webhookData.id}`,
          webhookData,
        );
      }
      setRefresh(refresh + 1);
      setOpenWebhookForm(false);
    } catch (error) {
      console.error('Error saving webhook:', error);
    }
  };

  const handleDelete = async () => {
    if (!webhookData.id) return;
    try {
      await fetchClient.del(`/ui-settings/webhooks/${webhookData.id}`);
      setRefresh(refresh + 1);
      setOpenAlert(false);
    } catch (error) {
      console.error('Error deleting webhook:', error);
    }
  };

  return (
    <div style={{ flexDirection: 'column', display: 'flex', gap: 16 }}>
      <Typography variant='beta'>Webhook Settings</Typography>

      <Box>
        <Table
          colCount={COL_COUNT}
          rowCount={ROW_COUNT}
          footer={
            <TFooter
              icon={<Plus />}
              onClick={() => {
                setWebhookData(null);
                setOpenWebhookForm(true);
              }}
              style={{ cursor: 'pointer' }}
            >
              Add Webhook
            </TFooter>
          }
          style={{ fontSize: 13 }}
        >
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Content Type</Th>
              <Th>URL</Th>
              <Th>Event</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {webhooks.map((webhook: any) => (
              <Tr key={webhook.id}>
                <Td>{webhook.name}</Td>
                <Td>{webhook.uid}</Td>
                <Td>{webhook.webhook}</Td>
                <Td>{webhook.trigger}</Td>
                <Td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      onClick={() => {
                        setWebhookData(webhook);
                        setOpenWebhookForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => {
                        setWebhookData(webhook);
                        setAlertMessage({
                          type: 'delete',
                          title: 'Delete Webhook',
                          message:
                            'Are you sure you want to delete this webhook?',
                        });
                        setOpenAlert(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Dialog.Root open={openWebhookForm} onOpenChange={setOpenWebhookForm}>
        <Dialog.Content>
          <Dialog.Header>Create/Edit Webhook</Dialog.Header>
          <Dialog.Body>
            <div
              style={{
                width: '100%',
                flexDirection: 'column',
                display: 'flex',
                gap: 16,
              }}
            >
              <Field.Root width='100%'>
                <Field.Label>Name</Field.Label>
                <Field.Input
                  placeholder='Enter a name...'
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  value={webhookData?.name || ''}
                />
              </Field.Root>
              <Field.Root width='100%'>
                <Field.Label>Content Type</Field.Label>
                <SingleSelect
                  placeholder='Pick a content type...'
                  onChange={(e: any) => handleInputChange('uid', e)}
                  value={webhookData?.uid || ''}
                >
                  <SingleSelectOption value='api::contact.contact'>
                    Contact (api::contact.contact)
                  </SingleSelectOption>
                  <SingleSelectOption value='api::lead.lead'>
                    Lead (api::lead.lead)
                  </SingleSelectOption>
                </SingleSelect>
              </Field.Root>
              <Field.Root width='100%'>
                <Field.Label>Trigger</Field.Label>
                <SingleSelect
                  placeholder='Pick a trigger...'
                  onChange={(e: any) => handleInputChange('trigger', e)}
                  value={webhookData?.trigger || ''}
                >
                  <SingleSelectOption value='beforeCreate'>
                    beforeCreate
                  </SingleSelectOption>
                  <SingleSelectOption value='afterCreate'>
                    afterCreate
                  </SingleSelectOption>
                  <SingleSelectOption value='beforeUpdate'>
                    beforeUpdate
                  </SingleSelectOption>
                  <SingleSelectOption value='afterUpdate'>
                    afterUpdate
                  </SingleSelectOption>
                  <SingleSelectOption value='beforeDelete'>
                    beforeDelete
                  </SingleSelectOption>
                  <SingleSelectOption value='afterDelete'>
                    afterDelete
                  </SingleSelectOption>
                </SingleSelect>
              </Field.Root>
              <Field.Root width='100%'>
                <Field.Label>Webhook URL</Field.Label>
                <TextInput
                  placeholder='https://example.com/webhook'
                  onChange={(e) => handleInputChange('webhook', e.target.value)}
                  value={webhookData?.webhook || ''}
                />
              </Field.Root>
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button fullWidth variant='tertiary'>
                Cancel
              </Button>
            </Dialog.Cancel>
            <Dialog.Action>
              <Button fullWidth variant='success-light' onClick={handleSave}>
                Confirm
              </Button>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={openAlert} onOpenChange={setOpenAlert}>
        <Dialog.Content>
          <Dialog.Header>{alertMessage?.title || 'Error'}</Dialog.Header>
          <Dialog.Body>
            <p style={{ fontSize: '16px' }}>
              {alertMessage?.message || 'An error occurred'}
            </p>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Action>
              <Button
                fullWidth
                variant='success-light'
                onClick={() => {
                  if (alertMessage?.type === 'delete') {
                    handleDelete();
                  } else {
                    setOpenAlert(false);
                  }
                }}
              >
                OK
              </Button>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}
