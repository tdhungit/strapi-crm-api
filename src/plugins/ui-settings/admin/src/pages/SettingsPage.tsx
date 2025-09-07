import { useFetchClient } from '@strapi/admin/strapi-admin';
import { Box, Button, Field, Flex, TextInput } from '@strapi/design-system';
import React, { useEffect, useState } from 'react';

const defaultSettings = {
  pageTitle: '',
  pageSubtitle: '',
  favicon: '',
};

const SettingsPage = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchClient = useFetchClient();
  const { get, post } = fetchClient;

  // Load current settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await get('/ui-settings/config');
        setSettings(response?.data || defaultSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: any = {};

    if (!settings.pageTitle.trim()) {
      newErrors.pageTitle = 'Page title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save settings
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      await post('/ui-settings/config', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      <Field.Root>
        <Field.Label>Page Title</Field.Label>
        <TextInput
          name='pageTitle'
          placeholder='Page Title'
          value={settings.pageTitle}
          onChange={(e) => handleInputChange('pageTitle', e.target.value)}
          style={{ width: '100%', marginRight: 10 }}
        />
      </Field.Root>

      <Field.Root style={{ marginTop: 15 }}>
        <Field.Label>Page Subtitle</Field.Label>
        <TextInput
          name='pageSubtitle'
          placeholder='Page Subtitle'
          value={settings.pageSubtitle}
          onChange={(e) => handleInputChange('pageSubtitle', e.target.value)}
          style={{ width: '100%', marginRight: 10 }}
        />
      </Field.Root>

      <Field.Root style={{ marginTop: 15 }}>
        <Field.Label>Favicon</Field.Label>
        <TextInput
          name='favicon'
          value={settings?.favicon || ''}
          onChange={(e) => handleInputChange('favicon', e.target.value)}
          placeholder='Paste favicon URL or upload below'
          style={{ width: '100%', marginBottom: 8 }}
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
              const uploadRes = await post(
                '/ui-settings/upload-favicon',
                formData,
                {
                  headers: { 'Content-Type': 'multipart/form-data' },
                }
              );
              handleInputChange('favicon', uploadRes?.data?.url || '');
            } catch (error) {
              console.error('Error uploading favicon:', error);
            } finally {
              setIsSaving(false);
            }
          }}
          style={{ marginTop: 8 }}
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

      <Flex justifyContent='flex-end' style={{ marginTop: 15 }}>
        <Button onClick={handleSave} loading={isSaving} disabled={isSaving}>
          Save
        </Button>
      </Flex>
    </Box>
  );
};

export default SettingsPage;
