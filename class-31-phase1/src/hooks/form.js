/**
 * FILE: hooks/form.js
 * PURPOSE: Help our form remember what the user types or selects.
 *
 * This is based on the starter-code useForm() hook.
 * "Hook" means a reusable React function that works with React state.
 *
 * EXAMPLE:
 * const { values, handleChange, handleSubmit } =
 *   useForm(addItem, { text: '', assignee: '', difficulty: 4 });
 *
 * callback      = function to run when the user submits (addItem).
 * defaultValues = starting values for the form.
 */
import { useState } from 'react';

export default function useForm(callback, defaultValues = {}) {
  // STEP 1: Make one state object for all three form fields.
  // Example: { text: 'Read docs', assignee: 'Sam', difficulty: 4 }
  const [values, setValues] = useState({ ...defaultValues });

  // STEP 2: Update the correct field whenever the user changes it.
  function handleChange(eventOrNumber) {
    let name;
    let value;

    // STEP 2A: Mantine Slider gives a NUMBER directly.
    // We know that number belongs to the "difficulty" field.
    if (typeof eventOrNumber === 'number') {
      name = 'difficulty';
      value = eventOrNumber;
    } else {
      // STEP 2B: TextInput gives a browser change event.
      // "name" tells us WHICH field changed: text or assignee.
      name = eventOrNumber.currentTarget.name;
      value = eventOrNumber.currentTarget.value;
    }

    // STEP 2C: Keep old fields and replace only the field that changed.
    // The three dots (...previous) copy the current form values.
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // STEP 3: Handle the Add Item button.
  function handleSubmit(event) {
    // STEP 3A: Stop the browser from refreshing the whole page.
    event.preventDefault();

    // STEP 3B: Ignore empty tasks.
    if (typeof values.text !== 'string' || !values.text.trim()) return;

    // STEP 3C: Call addItem() from Todo.jsx.
    // Sending a COPY avoids changing the form object by accident.
    callback({
      ...values,
      text: values.text.trim(),
    });

    // STEP 3D: Clear the form back to its starting values.
    setValues({ ...defaultValues });
  }

  // STEP 4: Give Todo.jsx the values and two functions it needs.
  return { values, handleChange, handleSubmit };
}
