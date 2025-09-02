import { Box, Button, Flex, Status, Typography } from '@strapi/design-system';
import { ArrowLeft, ArrowRight } from '@strapi/icons';
import { useFetchClient } from '@strapi/strapi/admin';
import { useEffect, useState } from 'react';

export default function AuditLogsSettingPage() {
  const fetchClient = useFetchClient();
  const { get, post } = fetchClient;

  const [availableContentTypes, setAvailableContentTypes] = useState<any>([]);
  const [auditContentTypes, setAuditContentTypes] = useState<any>([]);
  const [selectedContentType, setSelectedContentType] = useState<any>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // load audit logs settings here
  const loadAuditLogsSettings = async () => {
    try {
      const res: any = await get('/ui-settings/audit-logs/settings');
      console.log('Audit logs settings:', res);
      const { availableContentTypes, auditContentTypes } = res.data || {};
      console.log(
        'Audit logs settings:',
        availableContentTypes,
        auditContentTypes
      );
      setAvailableContentTypes(availableContentTypes || []);
      setAuditContentTypes(auditContentTypes || []);
    } catch (error) {
      console.error('Error loading audit logs settings:', error);
    }
  };

  useEffect(() => {
    loadAuditLogsSettings();
  }, []);

  const addToAuditContentTypes = (ct: any) => {
    setAuditContentTypes([...auditContentTypes, ct]);
    setAvailableContentTypes(
      availableContentTypes.filter((item: any) => item.uid !== ct.uid)
    );
  };

  const removeFromAuditContentTypes = (ct: any) => {
    setAuditContentTypes(
      auditContentTypes.filter((item: any) => item.uid !== ct.uid)
    );
    setAvailableContentTypes([...availableContentTypes, ct]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await post('/ui-settings/audit-logs/settings', {
        availableContentTypes,
        auditContentTypes,
      });
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving audit logs settings:', error);
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Typography fontSize={24}>Audit Logs Settings</Typography>

      <Flex gap={4} direction='row' alignItems='flex-start' marginTop={4}>
        <Box background='neutral0'>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
            Content Types
          </h2>

          <Box borderColor={'black'} padding={4}>
            {availableContentTypes.map((ct: any) => (
              <Box key={ct.uid} marginBottom={2}>
                <Status
                  variant={
                    selectedContentType.uid === ct.uid ? 'warning' : 'secondary'
                  }
                  onClick={() => setSelectedContentType(ct)}
                  cursor='pointer'
                >
                  {ct.name}
                </Status>
              </Box>
            ))}
          </Box>
        </Box>

        <Box style={{ marginTop: 50 }}>
          <Flex gap={6}>
            <Button
              onClick={() => removeFromAuditContentTypes(selectedContentType)}
            >
              <ArrowLeft />
            </Button>
            <Button onClick={() => addToAuditContentTypes(selectedContentType)}>
              <ArrowRight />
            </Button>
          </Flex>
        </Box>

        <Box>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
            Audit Logs
          </h2>

          <Box borderColor={'black'} padding={4}>
            {auditContentTypes.map((ct: any) => (
              <Box key={ct.uid} marginBottom={2}>
                <Status
                  variant={
                    selectedContentType.uid === ct.uid ? 'warning' : 'success'
                  }
                  onClick={() => setSelectedContentType(ct.uid)}
                  cursor='pointer'
                >
                  {ct.name}
                </Status>
              </Box>
            ))}
          </Box>
        </Box>
      </Flex>

      <div style={{ marginTop: 20 }}>
        <Button onClick={handleSave} loading={isSaving} disabled={isSaving}>
          Save
        </Button>
      </div>
    </div>
  );
}
