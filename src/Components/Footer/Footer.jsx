// Importing the Text component from Mantine UI library
import { Text } from '@mantine/core';

// Define a functional component called Footer
const Footer = () => {
  return (
    // <footer> is the semantic HTML element for page footers
    // Inline styles set the footer to take up 80% of the page width
    // and be centered using margin: auto
    <footer style={{ width: '80%', margin: 'auto' }}>
      
      {/* Mantine's Text component is used for styling text */}
      {/* align="right" pushes the text to the right side */}
      {/* mt="lg" applies Mantine’s large top margin spacing */}
      {/* &copy; is the HTML entity for the © copyright symbol */}
      <Text align="right" mt="lg">&copy;2025 ITTP</Text>
    
    </footer>
  )
};

// Exporting Footer so it can be imported and used in other files
export default Footer;

