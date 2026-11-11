/**
 * FILE: Components/Todo/Todo.jsx
 * PURPOSE: This is the "manager" of our todo tasks.
 *
 * Based on class-31/lab/starter-code/src/Components/Todo/index.jsx.
 * We kept its add, complete, and delete ideas, but moved the task display
 * into List.jsx. This makes the components smaller and easier to explain.
 *
 * REMEMBER:
 * - Todo owns the TASK DATA (list).
 * - SettingsProvider owns DISPLAY RULES (three per page, hide completed).
 * - List receives tasks as props and reads display rules from Context.
 */
import { useContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  Badge, Button, Card, Grid, Group, Slider, Stack,
  Text, TextInput, Title,
} from '@mantine/core';
import { IconCirclePlus, IconClipboardList, IconSparkles } from '@tabler/icons-react';

import useForm from '../../hooks/form.js';
import { SettingsContext } from '../../Context/Settings/Settings.jsx';
import List from '../List/List.jsx';

// STEP 1: Starting values for the add-task form.
// This constant is outside the component so it stays the same
// whenever React redraws the screen.
const DEFAULT_FORM_VALUES = {
  text: '',
  assignee: '',
  difficulty: 4,
};

export default function Todo({ appTitle }) {
  // STEP 2: Store all task objects in React state.
  // We start with an empty array, just like the starter code.
  // Example after adding a task:
  // [{ id: 'abc', text: 'Study React', assignee: 'Kai',
  //    difficulty: 4, complete: false }]
  const [list, setList] = useState([]);

  // STEP 3: Read a shared value from Settings Context.
  // We can show the page size WITHOUT passing it down from App.
  // List.jsx reads ALL of the settings from Context for its display.
  const { pageItems } = useContext(SettingsContext);

  // STEP 4: Connect the reusable useForm hook to our addItem function.
  // values: object with what the user entered.
  // handleChange: changes a field when typing / moving the slider.
  // handleSubmit: calls addItem when the form is submitted.
  const { values, handleChange, handleSubmit } =
    useForm(addItem, DEFAULT_FORM_VALUES);

  // STEP 5: Add a new task.
  // Parameter "item" is an object from useForm.
  function addItem(item) {
    const newItem = {
      ...item,                   // Copy the text, assignee, and difficulty.
      id: uuid(),                // Give each task its own unique ID.
      difficulty: Number(item.difficulty),
      complete: false,          // A new task starts unfinished.
    };

    // Copy the existing array and place our new task at the end.
    // React then redraws the list with the new task.
    setList((previousList) => [...previousList, newItem]);
  }

  // STEP 6: Change a task from incomplete to complete (or back).
  // Parameter "id" tells us which task was clicked.
  function toggleComplete(id) {
    // map() makes a NEW array. We make a NEW object for the clicked task.
    // Avoid changing item.complete directly: React state should not
    // be changed in place.
    setList((previousList) =>
      previousList.map((item) =>
        item.id === id
          ? { ...item, complete: !item.complete }
          : item
      )
    );
  }

  // STEP 7: Delete one task by ID.
  // filter() returns all tasks EXCEPT the one we want to remove.
  function deleteItem(id) {
    setList((previousList) =>
      previousList.filter((item) => item.id !== id)
    );
  }

  // STEP 8: Count unfinished tasks.
  // This number is calculated from the list rather than stored separately.
  // That avoids having two pieces of state that could disagree.
  const incomplete = list.filter((item) => !item.complete).length;

  // STEP 9: Keep the browser tab title updated when the count changes.
  // useEffect runs AFTER React updates the screen.
  useEffect(() => {
    document.title = 'To Do List: ' + incomplete;
  }, [incomplete]);

  // STEP 10: Display the page using Mantine components.
  // The form and task list are separate sections of the page.
  return (
    <div className="todo-app">
      <header className="todo-banner" data-testid="todo-header">
        <Badge color="yellow" variant="light" leftSection={<IconSparkles size={15} />}>
          {appTitle}
        </Badge>
        <Title order={1} mt="md" data-testid="todo-h1">
          To Do List: {incomplete} items pending
        </Title>
        <Text mt="sm" size="lg">
          One task at a time — you can do it!
        </Text>
        <div className="banner-hint">
          <IconClipboardList size={20} aria-hidden="true" />
          Showing up to {pageItems} unfinished tasks per page
        </div>
      </header>

      <Grid mt="xl" gutter="xl" align="flex-start">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card className="panel add-panel" radius="xl" padding="xl" withBorder>
            <Group gap="xs" mb="lg">
              <IconCirclePlus size={26} color="#7044c6" aria-hidden="true" />
              <Title order={2} size="h3">Add To Do Item</Title>
            </Group>

            {/* STEP 11: When the form is submitted, useForm calls addItem(). */}
            <form onSubmit={handleSubmit}>
              <Stack gap="lg">
                {/* STEP 12: Both text fields use handleChange from useForm. */}
                <TextInput
                  label="To Do Item"
                  name="text"
                  placeholder="Item Details"
                  value={values.text}
                  onChange={handleChange}
                  required
                  maxLength={160}
                />
                <TextInput
                  label="Assigned To"
                  name="assignee"
                  placeholder="Assignee Name"
                  value={values.assignee}
                  onChange={handleChange}
                  maxLength={80}
                />

                {/* STEP 13: Mantine Slider sends a number from 1 to 5. */}
                <div>
                  <Group justify="space-between" mb="sm">
                    <Text fw={700} size="sm">Difficulty</Text>
                    <Badge variant="light" color="violet">
                      {values.difficulty} / 5
                    </Badge>
                  </Group>
                  <Slider
                    aria-label="Difficulty"
                    min={1}
                    max={5}
                    step={1}
                    value={values.difficulty}
                    onChange={handleChange}
                    marks={[
                      { value: 1, label: 'Easy' },
                      { value: 3, label: 'Medium' },
                      { value: 5, label: 'Hard' },
                    ]}
                    mb="xl"
                  />
                </div>

                <Button type="submit" fullWidth leftSection={<IconCirclePlus size={19} />}>
                  Add Item
                </Button>
              </Stack>
            </form>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card className="panel list-panel" radius="xl" padding="xl" withBorder>
            <Group justify="space-between" align="center" mb="lg">
              <div>
                <Title order={2} size="h3">Your tasks</Title>
                <Text size="sm" c="dimmed">
                  Add five tasks to practice clicking through pages.
                </Text>
              </div>
              <Badge size="lg" color="grape" variant="light">
                {incomplete} to do
              </Badge>
            </Group>

            {/*
              STEP 14: Pass TASK DATA and TASK ACTIONS to List via props.
              We do NOT pass pageItems or showCompleted here.
              List gets those display rules from Context on its own.
            */}
            <List
              list={list}
              toggleComplete={toggleComplete}
              deleteItem={deleteItem}
            />
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
}
