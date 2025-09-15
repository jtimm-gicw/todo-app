// Import React and hooks
import React, { useContext } from 'react';

// Import SettingsContext so we can access and update global settings
import { SettingsContext } from '../../Context/Settings/Settings';

// Import custom form hook to handle input changes and form submission
import useForm from '../../hooks/form';

// Import Mantine UI components for layout and styling
import { Card, TextInput, Switch, Button, Text, Grid } from '@mantine/core';

// Main page component that lets users view + update app settings
const SettingsPage = () => {
  // Pull current settings and updater functions from context
  const { showCompleted, pageItems, setShowCompleted, setPageItems, saveSettings } =
    useContext(SettingsContext);

  // Set initial values for the form using current context values
  const defaultValues = { showCompleted, pageItems };

  // useForm() gives us:
  // - handleChange: updates local form state when inputs change
  // - handleSubmit: handles form submit event
  // - values: current form field values
  const { handleChange, handleSubmit, values } = useForm(updateSettings, defaultValues);

  // Function called on form submission
  function updateSettings(newValues) {
    // Update context values with new form data
    setShowCompleted(newValues.showCompleted);
    setPageItems(newValues.pageItems);

    // Save the new settings to localStorage immediately
    // Passing newValues ensures we save the updated state (not stale state)
    saveSettings(newValues);
  }

  return (
    // Use Mantine's Grid layout to split screen into two columns (form + preview)
    <Grid style={{ width: '80%', margin: 'auto' }}>
      
      {/* ----- Left Column: Settings Form ----- */}
      <Grid.Col xs={12} sm={6}>
        <Card withBorder p="md">
          {/* Wrap inputs in a form so handleSubmit is triggered on submit */}
          <form onSubmit={handleSubmit}>
            <Text>Show Completed Items?</Text>

            {/* Switch input toggles showCompleted true/false */}
            {/* We manually format event so useForm understands name/value */}
            <Switch
              name="showCompleted"
              checked={values.showCompleted}
              onChange={(event) =>
                handleChange({
                  target: {
                    name: 'showCompleted',
                    value: event.currentTarget.checked,
                  },
                })
              }
            />

            {/* Numeric input for pageItems setting */}
            <Text mt="md">Items per Page</Text>
            <TextInput
              type="number"
              name="pageItems"
              value={values.pageItems}
              onChange={handleChange}
              min={1}
              max={20}
            />

            {/* Submit button saves settings */}
            <Button type="submit" mt="md">Save Settings</Button>
          </form>
        </Card>
      </Grid.Col>

      {/* ----- Right Column: Live Preview of Current Settings ----- */}
      <Grid.Col xs={12} sm={6}>
        <Card withBorder p="md">
          <Text weight={500}>Current Settings:</Text>
          <Text>Show Completed: {values.showCompleted ? 'Yes' : 'No'}</Text>
          <Text>Items per Page: {values.pageItems}</Text>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

// Export so App.js (or Router) can render this page
export default SettingsPage;
