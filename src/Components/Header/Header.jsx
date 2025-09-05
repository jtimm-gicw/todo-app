// Import React (needed for JSX) and Mantine components/hooks
import React from 'react';
import { createStyles, Navbar, Text, Header } from '@mantine/core';

// Create custom styles using Mantine’s createStyles hook
// `theme` gives access to Mantine’s design tokens (colors, spacing, fonts, etc.)
const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colors.blue[7], // Dark blue background
    color: theme.colors.gray[0],           // Light gray text color
    fontSize: theme.fontSizes.md,          // Medium font size from theme
    padding: theme.spacing.md,             // Medium padding from theme
  },
}));

// Functional component AppHeader
// Receives props (e.g., `incomplete`), though currently not used
const AppHeader = ({ incomplete }) => {
  // Access the generated CSS classes from useStyles
  const { classes } = useStyles();

  return (
    // Mantine Header component represents the page/app header
    // height={60} sets height to 60px
    // p="xs" applies Mantine’s extra-small padding
    // data-testid is useful for testing with tools like React Testing Library
    <Header data-testid="todo-header" height={60} p="xs">
      
      {/* Navbar component styled with our custom classes.navbar */}
      <Navbar className={classes.navbar}>
        {/* Simple text label inside the navbar */}
        <Text>Home</Text>
      </Navbar>
    
    </Header>
  );
};

// Export component so it can be used in other parts of the app
export default AppHeader;
