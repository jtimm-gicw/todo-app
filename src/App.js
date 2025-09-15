// Import React base library
import React from 'react';

// Import routing utilities
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import child components
import ToDo from './Components/ToDo/ToDo';
import Header from './Components/Header/Header';

// Import SettingsPage from the folder — since the file is index.js (or index.jsx)
// bundlers will resolve './Components/SettingsPage' -> './Components/SettingsPage/index.js'
import SettingsPage from './Components/SettingsPage';

// App component defined as a class component (instead of functional component + hooks)
// This serves as the root component of your app (after being rendered in index.js)
export default class App extends React.Component {
  // Class components must have a render() method that returns JSX
  render() {
    return (
      // Wrap app in Router so we can define routes for / and /settings
      <Router>
        {/* Header component (likely the top navigation or title bar) */}
        <Header />

        {/* Routes define the pages in the app */}
        <Routes>
          {/* Home route — the ToDo app */}
          <Route path="/" element={<ToDo />} />

          {/* Settings route — your settings page */}
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    );
  }
}
