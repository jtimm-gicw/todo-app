// Import React hooks and utilities
import { useContext, useState } from 'react';

// Import SettingsContext (provides configuration like pageItems, completed, etc.)
import { SettingsContext } from '../../Context/Settings/Settings';

// Import conditional rendering helper (renders children only if condition is true)
import { When } from 'react-if';

// Import Mantine UI components for styling and layout
import { Badge, Card, CloseButton, Group, Pagination, Text, createStyles } from '@mantine/core';

// Define custom styles using Mantine's createStyles
// Here we style the Badge component
const useStyles = createStyles((theme) => ({
  badge: {
    textTransform: 'capitalize', // Capitalize first letter of text
    fontSize: theme.fontSizes.xs, // Extra-small font size
    margin: '3px', // Add small margin between badges
  },
}));

// List component takes props:
// - list: array of todo items
// - toggleComplete: function to mark item complete/incomplete
// - deleteItem: function to remove item from the list
const List = ({ list, toggleComplete, deleteItem }) => {
  const { classes } = useStyles(); // Get our custom styles
  const { pageItems, completed } = useContext(SettingsContext); 
  // - pageItems: how many items to show per page
  // - completed: boolean that decides whether to show completed tasks or not
  
  const [page, setPage] = useState(1); // Track which page the user is currently on

  // ----- Pagination Logic -----

  // If "completed" setting is true → show entire list
  // Else → only show items that are NOT completed
  const renderList = completed ? list : list.filter(item => !item.complete);

  // Figure out the slice indexes for current page
  const listStart = pageItems * (page - 1); // first index of items for this page
  const listEnd = listStart + pageItems;    // last index (exclusive)
  
  // Total number of pages needed
  const pageCount = Math.ceil(renderList.length / pageItems);

  // Slice the list to only show items for the current page
  const displayList = renderList ? renderList.slice(listStart, listEnd) : [];

  // ----- Render UI -----
  return (
    <>
      {/* Loop through the current page's items */}
      {displayList.map(item => (
        <Card 
          key={item.id} // unique identifier for React list rendering
          withBorder 
          shadow="md" 
          radius="sm" 
          pb="xs" 
          mb="sm"
        >
          {/* Top section of the card with status + assignee + delete button */}
          <Card.Section withBorder>
            <Group position="apart"> {/* Flexbox row: space-between left and right groups */}
              
              {/* Left side: Badge + Assignee */}
              <Group position="left">
                <Badge
                  // Green badge if still pending, red if complete
                  color={item.complete ? "red" : "green"}
                  variant="filled"
                  className={classes.badge}
                  // Clicking badge toggles completion status
                  onClick={() => toggleComplete(item.id)}
                >
                  {/* Show label based on completion */}
                  {item.complete ? 'Complete' : 'Pending'}
                </Badge>
                {/* Show the person assigned to this task */}
                <Text>{item.assignee}</Text>
              </Group>
              
              {/* Right side: delete/close button */}
              <Group>
                <CloseButton
                  title="Close ToDo Item"
                  onClick={() => deleteItem(item.id)} // remove item from list
                />
              </Group>
            </Group>
          </Card.Section>

          {/* Task description */}
          <Text align="left" mt="sm">{item.text}</Text>

          {/* Difficulty rating, aligned to the right */}
          <Text align="right">
            <small>Difficulty: {item.difficulty}</small>
          </Text>
        </Card>
      ))}

      {/* Only show pagination controls if there are items in the list */}
      <When condition={renderList.length > 0}>
        <Pagination 
          page={page}        // Current page
          onChange={setPage} // Function to update page when user clicks
          total={pageCount}  // Total number of pages
        />
      </When>
    </>
  )
}

// Export so it can be used in other files
export default List;
