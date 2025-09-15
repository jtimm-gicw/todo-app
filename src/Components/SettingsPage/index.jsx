import React, { useContext, useEffect, useState } from 'react';
import { SettingsContext } from '../../Context/Settings/Settings';
import useForm from '../../hooks/form';
import { Card, TextInput, Switch, Button, Text, Grid } from '@mantine/core';

const SettingsPage = () => {
  const { showCompleted, pageItems, setShowCompleted, setPageItems, saveSettings } =
    useContext(SettingsContext);

  const defaultValues = { showCompleted, pageItems };
  const { handleChange, handleSubmit, values } = useForm(updateSettings, defaultValues);

  function updateSettings(newValues) {
    // Update context values
    setShowCompleted(newValues.showCompleted);
    setPageItems(newValues.pageItems);
    // Save changes to local storage
    saveSettings();
  }

  return (
    <Grid style={{ width: '80%', margin: 'auto' }}>
      <Grid.Col xs={12} sm={6}>
        <Card withBorder p="md">
          <form onSubmit={handleSubmit}>
            <Text>Show Completed Items?</Text>
            <Switch
              name="showCompleted"
              checked={values.showCompleted}
               // event => create a shape that your useForm expects: { target: { name, value } }
                onChange={(event) =>
                  handleChange({
                    target: {
                     name: 'showCompleted',
                     value: event.currentTarget.checked,
                    },
                  })
                 }
              />

            <Text mt="md">Items per Page</Text>
            <TextInput
              type="number"
              name="pageItems"
              value={values.pageItems}
              onChange={handleChange}
              min={1}
              max={20}
            />

            <Button type="submit" mt="md">Save Settings</Button>
          </form>
        </Card>
      </Grid.Col>

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

export default SettingsPage;
