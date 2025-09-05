// React imports
import React, { useEffect, useState } from 'react';

// Custom hook to handle form logic (input state + submit handler)
import useForm from '../../hooks/form.js';

// UUID library for generating unique IDs for each todo item
import { v4 as uuid } from 'uuid';

// Mantine UI components
import { Card, Grid, Text, TextInput, createStyles, Button, Slider } from '@mantine/core';

// Import child components
import List from '../List/List';
import Footer from '../Footer/Footer';

// Custom styles using Mantine’s theme system
const useStyles = createStyles((theme) => ({
  formHeading: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
  },
  h1: {
    backgroundColor: theme.colors.gray[8], // dark gray background
    color: theme.colors.gray[0],           // light text color
    fontSize: theme.fontSizes.xl,          // large font size
    fontWeight: 'bold',
    margin: 'auto',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    width: '80%',
  },
}));

const ToDo = () => {
  const { classes } = useStyles();

  // Default form values (sets difficulty slider to 4 initially)
  const [defaultValues] = useState({ difficulty: 4 });

  // State for storing todo items
  const [list, setList] = useState([]);

  // State for counting incomplete items
  const [incomplete, setIncomplete] = useState([]);

  // useForm custom hook provides controlled form handlers
  const { handleChange, handleSubmit } = useForm(addItem, defaultValues);

  // -------- Functions to handle todo list logic --------

  // Add a new item to the list
  function addItem(item) {
    item.id = uuid();          // unique identifier
    item.complete = false;     // new items start as not done
    console.log(item);
    setList([...list, item]);  // update list with new item
  }

  // Delete an item by filtering it out
  function deleteItem(id) {
    const items = list.filter(item => item.id !== id);
    setList(items);
  }

  // Toggle complete/incomplete state of an item
  function toggleComplete(id) {
    const items = list.map(item => {
      if (item.id === id) {
        item.complete = !item.complete; // flip boolean
      }
      return item;
    });
    setList(items);
  }

  // -------- useEffect Hook --------
  useEffect(() => {
    // Count how many items are incomplete
    let incompleteCount = list.filter(item => !item.complete).length;
    setIncomplete(incompleteCount);

    // Update the browser tab title dynamically
    document.title = `To Do List: ${incomplete}`;
    
    // eslint-disable-next-line react-hooks/exhaustive-deps 
    // (disables warning about missing dependencies — here we only care about changes to `list`)
  }, [list]);

  // -------- JSX Rendering --------
  return (
    <>
      {/* Heading at the top showing count of incomplete tasks */}
      <h1 className={classes.h1}>To Do List: {incomplete} items pending</h1>
      
      {/* Main layout: 2-column grid (form on left, list on right) */}
      <Grid style={{ width: '80%', margin: 'auto' }}>
        
        {/* Left Column: Add New Todo Form */}
        <Grid.Col xs={12} sm={4}>
          <Card withBorder p="xs">
            <Text className={classes.formHeading}>Add To Do Item</Text>

            {/* Form for adding tasks */}
            <form onSubmit={handleSubmit}>
              
              {/* Input for todo text/description */}
              <TextInput
                mb="sm"
                onChange={handleChange}
                name="text"
                placeholder="Item Details"
                label="To Do Item"
              />

              {/* Input for assigning task to someone */}
              <TextInput
                mb="sm"
                onChange={handleChange}
                name="assignee"
                placeholder="Assignee Name"
                label="Assigned To"
              />

              {/* Slider for task difficulty (1–5) */}
              <Text>Difficulty</Text>
              <Slider
                mb="lg"
                onChange={handleChange}
                defaultValue={defaultValues.difficulty} // initial value = 4
                step={1}
                min={1}
                max={5}
                name="difficulty"
              />

              {/* Submit button to add item */}
              <Button type="submit">Add Item</Button>
            </form>
          </Card>
        </Grid.Col>

        {/* Right Column: Display list of todos */}
        <Grid.Col xs={12} sm={8}>
          <List
            list={list}
            toggleComplete={toggleComplete}
            deleteItem={deleteItem}
          />
        </Grid.Col>
      </Grid>

      {/* Footer at the bottom of the page */}
      <Footer />
    </>
  );
};

export default ToDo;
