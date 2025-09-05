// Import React and useState hook
import React, { useState } from 'react';

// Create a Context object for app-wide settings
// This allows child components to access settings without prop drilling
export const SettingsContext = React.createContext();  // must include .createContext()

// Provider component wraps part of the app and supplies settings state
const SettingsProvider = ({ children }) => {
  // --------- State Variables ---------
  // Whether completed tasks should be shown or hidden
  const [showCompleted, setShowCompleted] = useState(false);

  // How many items should be shown per page (for pagination)
  const [pageItems, setPageItems] = useState(3);

  // Sorting preference for tasks (default is "difficulty")
  const [sort, setSort] = useState('difficulty');

  // --------- Context Values ---------
  // These values + setters will be passed down to all consumers
  let values = {
    showCompleted,   // boolean
    pageItems,       // number of items per page
    sort,            // sorting rule
    setShowCompleted, // function to update showCompleted
    setPageItems,     // function to update pageItems
    setSort           // function to update sort
  }

  // --------- Provide Context ---------
  // Wrap children in the SettingsContext.Provider
  // Any component inside <SettingsProvider> can use useContext(SettingsContext)
  return(
    <SettingsContext.Provider value={values}>
      {children}
    </SettingsContext.Provider>
  )
};

// Export so we can wrap our App (or specific parts of it) in SettingsProvider
export default SettingsProvider;
