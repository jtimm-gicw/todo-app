// Import React hooks
import { useState, useEffect } from 'react';

// Custom hook useForm
// Takes in a callback function (to run on form submit)
// and optional defaultValues for initial state
const useForm = (callback, defaultValues = {}) => {

  // State to store form field values (object of key-value pairs)
  const [values, setValues] = useState({});

  // --------- Handle Submit ---------
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents page refresh (default form behavior)
    callback(values);       // Call the function passed in (e.g., addItem) with current form data
    event.target.reset();   // Reset form fields visually
  };

  // --------- Handle Change ---------
  const handleChange = (event) => {
    let name, value;

    if (typeof(event) === 'object') {
      // Standard case: user typed into an input field
      event.persist(); // Keeps the event object around (needed in async React behavior)
      name = event.target.name;   // Field name attribute (e.g., "text" or "assignee")
      value = event.target.value; // Value entered
    } else {
      // Special case: when a component (like Slider) gives just a number instead of event object
      name = 'difficulty'; // Hardcoded because slider is for difficulty
      value = event;
    }

    // Convert numeric string values into integers (e.g., "3" → 3)
    if (parseInt(value)) {
      value = parseInt(value);
    }

    // Update state by merging new value with existing values
    // Example: { text: 'Buy milk', difficulty: 4 }
    setValues(values => ({ ...values, [name]: value }));
  };

  // --------- Sync with Default Values ---------
  useEffect(() => {
    // Whenever defaultValues changes, update our state
    setValues(defaultValues);
  }, [defaultValues]);

  // Return handlers and state to be used in a form component
  return {
    handleChange,
    handleSubmit,
    values,
  };
};

export default useForm;
