// @ts-nocheck
import { Box, Field, Flex, TextInput } from '@strapi/design-system';
import React, { useEffect, useState } from 'react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    pageTitle: '',
    pageSubtitle: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  // Simple fetch function
  const fetchData = async (url, options = {}) => {
    const response = await fetch(`/api${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  // Load current settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetchData('/ui-settings/config');
        if (response) {
          setSettings({
            pageTitle: response.pageTitle || '',
            pageSubtitle: response.pageSubtitle || '',
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setNotification({
          type: 'danger',
          message: 'Failed to load settings',
        });
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
    const newErrors = {};

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
      await fetchData('/ui-settings/config', {
        method: 'POST',
        body: JSON.stringify(settings),
      });

      setNotification({
        type: 'success',
        message: 'Settings saved successfully!',
      });

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setNotification({
        type: 'danger',
        message: 'Failed to save settings',
      });
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
          label='Page Title'
          value={settings.pageTitle}
          onChange={(e) => handleInputChange('pageTitle', e.target.value)}
          style={{ width: '100%', marginRight: 10 }}
        />
      </Field.Root>
      <Field.Root style={{ marginTop: 15 }}>
        <Field.Label>Page Subtitle</Field.Label>
        <TextInput
          name='pageSubtitle'
          label='Page Subtitle'
          value={settings.pageSubtitle}
          onChange={(e) => handleInputChange('pageSubtitle', e.target.value)}
          style={{ width: '100%', marginRight: 10 }}
        />
      </Field.Root>
      <Flex alignItems='center'></Flex>
    </Box>
  );
};

export default SettingsPage;
