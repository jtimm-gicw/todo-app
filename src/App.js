// Import React base library
import React from 'react';

// Import child components
import ToDo from './Components/ToDo/ToDo';
import Header from './Components/Header/Header';

// App component defined as a class component (instead of functional component + hooks)
// This serves as the root component of your app (after being rendered in index.js)
export default class App extends React.Component {
  // Class components must have a render() method that returns JSX
  render() {
    return (
      <>
        {/* Header component (likely the top navigation or title bar) */}
        <Header />

        {/* ToDo component (main application logic: form + list + footer) */}
        <ToDo />
      </>
    );
  }
}
