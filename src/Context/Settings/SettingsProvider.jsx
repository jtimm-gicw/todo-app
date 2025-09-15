import React, { useState, useEffect } from 'react';

// 1. Create a React Context for settings
//    This allows any component in the app to access these values without prop drilling.
export const SettingsContext = React.createContext();

const SettingsProvider = ({ children }) => {
  // 2. Define state for the app settings with default values
  const [showCompleted, setShowCompleted] = useState(false); // should completed tasks be shown
  const [pageItems, setPageItems] = useState(3);             // how many items to show per page
  const [sort, setSort] = useState('difficulty');           // default sort field

  // 3. Function to save current settings to Local Storage
  //    This allows user preferences to persist across page reloads.
  const saveSettings = () => {
    const settings = { showCompleted, pageItems, sort };   // package state into an object
    localStorage.setItem('todoSettings', JSON.stringify(settings)); // save as string
  };

  // 4. Load settings from Local Storage when the app first starts
  useEffect(() => {
    const saved = localStorage.getItem('todoSettings');   // get saved settings
    if (saved) {
      const { showCompleted, pageItems, sort } = JSON.parse(saved); // convert back to object
      setShowCompleted(showCompleted);  // update state with saved value
      setPageItems(pageItems);          // update state with saved value
      setSort(sort);                    // update state with saved value
    }
  }, []); // empty dependency array means this runs only once on app startup

  // 5. Bundle all state values and functions to provide via context
  const values = {
    showCompleted,       // current boolean for showing completed tasks
    pageItems,           // current number of items per page
    sort,                // current sort field
    setShowCompleted,    // function to update showCompleted
    setPageItems,        // function to update pageItems
    setSort,             // function to update sort
    saveSettings,        // function to save current settings to Local Storage
  };

  // 6. Wrap children components with the Context Provider
  //    All components inside this provider can access these settings.
  return (
    <SettingsContext.Provider value={values}>
      {children}
    </SettingsContext.Provider>
  );
};

// 7. Export the provider to use in main app (e.g., wrap <App /> with it)
export default SettingsProvider;
